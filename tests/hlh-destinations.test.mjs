import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync,readdirSync} from 'node:fs';
const group=readFileSync(new URL('../public/group-pages.js',import.meta.url),'utf8');
const registry=group.match(/window\.HLH_SITE_LINKS = Object\.freeze\([\s\S]*?\n\}\);/)[0];
const context=vm.createContext({window:{},URL,URLSearchParams,Intl,Date});
vm.runInContext(registry,context);
vm.runInContext(readFileSync(new URL('../public/hlh-booking.js',import.meta.url),'utf8'),context);
const links=context.window.HLH_SITE_LINKS;
assert.equal(links.portal,'https://hlh-portail-v17-preview.netlify.app/');
const expected={wia:['https://palais-wia-preview.netlify.app/','/reservation/','rooms'],atta:['https://residences-atta-preview.netlify.app/atta','/atta/reserver','rooms'],astral:['https://hotel-astral-preview.netlify.app/hotel-astral','/hotel-astral/reserver','quantity']};
const day=offset=>new Date(Date.now()+offset*86400000).toISOString().slice(0,10);
for(const [property,[site,path,roomKey]] of Object.entries(expected)){
 assert.equal(links[property].site,site);
 const criteria={property,arrival:day(1),departure:day(4),rooms:2,adults:2,children:1};
 const destination=new URL(context.window.HLHBookingPremium.destinationURL(criteria,links));
 assert.equal(destination.origin,new URL(site).origin);
 assert.equal(destination.pathname,path);
 for(const key of ['arrival','departure','adults','children'])assert.equal(destination.searchParams.get(key),String(criteria[key]));
 assert.equal(destination.searchParams.get(roomKey),'2');
 if(property==='astral')assert.equal(destination.searchParams.get('phase'),'dates');
 assert.ok(!destination.href.includes('concept-b'));
}
for(const file of readdirSync(new URL('../public/',import.meta.url)).filter(n=>/\.(js|html)$/.test(n))){
 assert.ok(!/https:\/\/[^\s"'<>]+\.chatgpt\.site/.test(readFileSync(new URL('../public/'+file,import.meta.url),'utf8')),file+' contient encore une destination Sites');
}
console.log('Destinations Netlify : trois établissements, paramètres conservés, Concept B indépendant, aucune ancienne URL Sites dans les JS/HTML publics.');
