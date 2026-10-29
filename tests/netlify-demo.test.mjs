import assert from 'node:assert/strict';
import handler from '../netlify/functions/api.mjs';
const criteria={property:'atta',arrival:'2099-11-10',departure:'2099-11-12',rooms:2,adults:2,children:1};
const cases=[['content','GET',null,200],['identity','GET',null,200],['preview-status','GET',null,200],['hlh-search','POST',criteria,200],['hlh-search','POST',{...criteria,children:2},422],['hlh-search','POST',{...criteria,departure:criteria.arrival},422],['requests','POST',{},503],['subscribe','POST',{},503],['payment/init','POST',{},503],['admin/content','POST',{},403]];
for(const [path,method,body,status]of cases){const response=await handler(new Request('https://preview.invalid/api/'+path,{method,...(body?{body:JSON.stringify(body)}:{})}));assert.equal(response.status,status,path);console.log(method,path,status)}
console.log('10 controles Netlify reussis, sans stockage ni transmission de donnees.');
