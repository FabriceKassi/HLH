import content from '../generated/content.mjs';
import {validateHLHSearch} from '../generated/search.mjs';
import {quote,requestSchema} from '../generated/quote.mjs';
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'};
const json=(data,status=200)=>Response.json(data,{status,headers});
export default async function handler(request){
 const path=new URL(request.url).pathname.replace(/^\/api\//,'');
 if(request.method==='GET'){
  if(path==='content')return json({content,revision:0});
  if(path==='identity')return json({user:null,admin:false});
  if(path==='payment/config')return json({provider:'CinetPay',ready:false,demo:true});
  if(path==='preview-status')return json({version:17,demo:true,storage:'editorial snapshot',realReservations:false,realPayments:false});
 }
 if(request.method==='POST'&&['hlh-search','quote'].includes(path)){
  if(Number(request.headers.get('content-length')||0)>100000)return json({error:'Requête trop volumineuse.'},413);
  let data;try{const raw=await request.text();if(raw.length>100000)return json({error:'Requête trop volumineuse.'},413);data=JSON.parse(raw)}catch{return json({ok:false,field:'property',code:'invalid_request'},400)}
  if(path==='hlh-search'){const result=validateHLHSearch(data);return json(result,result.ok?200:422)}
  try{const parsed=requestSchema.omit({id:true,name:true,email:true,phone:true,consent:true}).parse(data);return json(quote(content,parsed))}catch{return json({error:'Critères de devis invalides.'},400)}
 }
 if(path.startsWith('admin/')||path==='media')return json({error:'Administration désactivée sur cette prévisualisation.'},403);
 return json({error:'Cette prévisualisation ne transmet ni demande, ni réservation, ni paiement. Contactez directement l’établissement.',demo:true},503);
}
export const config={path:'/api/*'};
