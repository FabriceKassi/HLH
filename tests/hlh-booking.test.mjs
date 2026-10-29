import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { validateHLHSearch } from '../lib/hlh-search.ts';
const require = createRequire(process.env.HLH_TEST_RUNTIME ? process.env.HLH_TEST_RUNTIME + '/package.json' : import.meta.url);
const { JSDOM, VirtualConsole } = require('jsdom');
const source = readFileSync(new URL('../public/hlh-booking.js', import.meta.url), 'utf8');
const group = readFileSync(new URL('../public/group-pages.js', import.meta.url), 'utf8');
const registrySource = group.match(/window\.HLH_SITE_LINKS = Object\.freeze\([\s\S]*?\n\}\);/)[0];
const clock = new Date().toISOString().slice(0,10);
const plusDays = (key, n) => new Date(Date.parse(key+'T00:00:00Z')+n*86400000).toISOString().slice(0,10);
const allowed = [[1,0],[1,1],[1,2],[2,0],[2,1],[3,0]];
const results = [];
const check = (name, fn) => { fn(); results.push({ name, passed:true }); };
const base = {property:'wia',arrival:plusDays(clock,1),departure:plusDays(clock,4),rooms:1,adults:2,children:0};
for(const property of ['wia','atta','astral']) for(const rooms of [1,3]) for(const [adults,children] of allowed) check(`server ${property}, ${rooms} room(s), ${adults}+${children}`,()=>assert.equal(validateHLHSearch({...base,property,rooms,adults,children}).ok,true));
const invalid = [null,[],{},...['unknown','',null].map(property=>({...base,property})),...['',plusDays(clock,-1),'2027-02-30','2027-13-01'].map(arrival=>({...base,arrival})),...['',base.arrival,clock,'2027-02-30'].map(departure=>({...base,departure})),...[0,-1,1.5,'2',Infinity,Number.MAX_SAFE_INTEGER+1].map(rooms=>({...base,rooms})),...[[0,0],[-1,1],[4,0],[3,1],[2,2],[1,3],[1,-1],[1.5,0],[1,0.5],['2',0],[1,'1']].map(([adults,children])=>({...base,adults,children}))];
invalid.forEach((input,i)=>check(`server rejects invalid #${i+1}`,()=>assert.equal(validateHLHSearch(input).ok,false)));
check('server strips unknown properties',()=>assert.deepEqual(validateHLHSearch({...base,ignored:'x'}).criteria,base));
function fixture(english=false) {
 const console = new VirtualConsole(); let navigations=0;
 console.on('jsdomError', e=>{if(e.message.includes('navigation'))navigations++;else throw e;});
 const dom = new JSDOM('<main></main>',{url:'https://hlh-test.invalid/',runScripts:'outside-only',virtualConsole:console});
 const w=dom.window; w.matchMedia=()=>({matches:false}); w.AbortSignal.timeout=AbortSignal.timeout;
 w.eval(registrySource);w.eval(source);
 const api=w.HLHBookingPremium;w.document.querySelector('main').innerHTML=api.markup(english);api.mount(w.document,english);
 const q=selector=>w.document.querySelector(selector),click=selector=>{const el=q(selector);assert.ok(el,selector);el.click();};
 let posted=null;w.fetch=async(url,init)=>{assert.equal(url,'/api/hlh-search');posted=JSON.parse(init.body);const result=validateHLHSearch(posted);return {ok:result.ok,json:async()=>result};};
 return {dom,w,api,q,click,get posted(){return posted;},get navigations(){return navigations;}};
}
const f=fixture();
check('missing property blocks submission',()=>{f.q('form').dispatchEvent(new f.w.Event('submit',{cancelable:true}));assert.match(f.q('[data-hlh-feedback]').textContent,/établissement/);assert.equal(f.posted,null);});
for (const property of ['wia','atta','astral']) {
 for (const [adults,children] of allowed) {
  if(f.q('[data-hlh-panel="property"]').hidden) f.click('[data-hlh-open="property"]');
  f.click(`[data-hlh-property="${property}"]`);
  f.click('[data-hlh-open="guests"]');
  for(let i=0;i<4;i++){f.click('[data-hlh-count="children"][data-delta="-1"]');f.click('[data-hlh-count="adults"][data-delta="-1"]');}
  for(let i=1;i<adults;i++)f.click('[data-hlh-count="adults"][data-delta="1"]');
  for(let i=0;i<children;i++)f.click('[data-hlh-count="children"][data-delta="1"]');
  check(`UI ${property} accepts ${adults}+${children}`,()=>{assert.equal(f.q('[data-hlh-number="adults"]').textContent,String(adults));assert.equal(f.q('[data-hlh-number="children"]').textContent,String(children));assert.equal(f.q('[data-hlh-value="guests"]').textContent,`${adults+children} voyageur${adults+children>1?'s':''}`);});
  if(adults+children===3) check(`UI ${property} locks both + at ${adults}+${children}`,()=>{for(const name of ['adults','children'])assert.equal(f.q(`[data-hlh-count="${name}"][data-delta="1"]`).disabled,true);});
  f.click('[data-hlh-close]');
 }
}
check('rooms minimum stays at 1',()=>{f.click('[data-hlh-open="rooms"]');f.click('[data-hlh-count="rooms"][data-delta="-1"]');assert.equal(f.q('[data-hlh-number="rooms"]').textContent,'1');assert.equal(f.q('[data-hlh-count="rooms"][data-delta="-1"]').disabled,true);});
check('multiple rooms never reset traveller cap',()=>{f.click('[data-hlh-count="rooms"][data-delta="1"]');f.click('[data-hlh-count="rooms"][data-delta="1"]');f.click('[data-hlh-close]');f.click('[data-hlh-open="guests"]');assert.equal(f.q('[data-hlh-count="adults"][data-delta="1"]').disabled,true);assert.equal(f.q('[data-hlh-count="children"][data-delta="1"]').disabled,true);});
check('Escape closes and restores focus',()=>{f.q('[data-hlh-panel="guests"]').dispatchEvent(new f.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(f.q('[data-hlh-panel="guests"]').hidden,true);assert.equal(f.w.document.activeElement,f.q('[data-hlh-open="guests"]'));});
check('outside pointer closes panel',()=>{f.click('[data-hlh-open="rooms"]');f.w.document.body.dispatchEvent(new f.w.Event('pointerdown',{bubbles:true}));assert.equal(f.q('[data-hlh-panel="rooms"]').hidden,true);});
check('minimum adults 1 and children 0',()=>{f.click('[data-hlh-open="guests"]');for(let i=0;i<5;i++) {f.click('[data-hlh-count="adults"][data-delta="-1"]');f.click('[data-hlh-count="children"][data-delta="-1"]');}assert.equal(f.q('[data-hlh-number="adults"]').textContent,'1');assert.equal(f.q('[data-hlh-number="children"]').textContent,'0');});
check('missing dates cannot send search',()=>{f.q('form').dispatchEvent(new f.w.Event('submit',{cancelable:true}));assert.equal(f.posted,null);assert.match(f.q('[data-hlh-feedback]').textContent,/arrivée/);});
check('past dates disabled and today marked',()=>{f.click('[data-hlh-open="arrival"]');f.click('[data-hlh-open="arrival"]');assert.ok(f.q(`[data-hlh-day="${clock}"][aria-current="date"]`));for(const el of f.w.document.querySelectorAll('[data-hlh-day]'))if(el.dataset.hlhDay<clock)assert.equal(el.disabled,true);assert.equal(f.q('[data-hlh-month="-1"]').disabled,true);});
check('next/previous month controls work',()=>{const old=f.q('.hlh-calendar-month h4').textContent;f.click('[data-hlh-month="1"]');assert.notEqual(f.q('.hlh-calendar-month h4').textContent,old);f.click('[data-hlh-month="-1"]');assert.equal(f.q('.hlh-calendar-month h4').textContent,old);});
check('date range auto-advances and closes; nights correct',()=>{f.click(`[data-hlh-day="${clock}"]`);assert.equal(f.q('[data-hlh-panel="departure"]').hidden,false);assert.equal(f.q(`[data-hlh-panel="departure"] [data-hlh-day="${clock}"]`).disabled,true);const target=plusDays(clock,2);f.click(`[data-hlh-panel="departure"] [data-hlh-day="${target}"]`);assert.equal(f.q('[data-hlh-panel="departure"]').hidden,true);assert.match(f.q('[data-hlh-stay]').textContent,/2 nuits/);});
check('selected period shown in calendar',()=>{f.click('[data-hlh-open="arrival"]');assert.equal(f.q(`[data-hlh-panel="arrival"] [data-hlh-day="${clock}"]`).getAttribute('aria-pressed'),'true');assert.ok(f.q(`[data-hlh-panel="arrival"] [data-hlh-day="${plusDays(clock,1)}"]`).classList.contains('in-range'));f.click('[data-hlh-close]');});
f.q('form').dispatchEvent(new f.w.Event('submit',{cancelable:true}));
await new Promise(resolve=>setTimeout(resolve,10));
check('valid UI submission sends criteria to real validation contract',()=>{assert.deepEqual({...f.posted},{property:'astral',arrival:clock,departure:plusDays(clock,2),rooms:3,adults:1,children:0});assert.equal(f.navigations,1);assert.equal(f.q('form').hasAttribute('aria-busy'),false);});
for(const property of ['wia','atta','astral'])check(`preserved redirect parameters ${property}`,()=>{const state={...base,property,rooms:3,adults:1,children:2};const url=new URL(f.api.destinationURL(state,f.w.HLH_SITE_LINKS));const dest=f.w.HLH_SITE_LINKS[property];assert.equal(url.origin+url.pathname,dest.reservation);for(const key of ['arrival','departure','rooms','adults','children'])assert.equal(url.searchParams.get(dest.bookingParams[key]),String(state[key]));if(property==='astral')assert.equal(url.searchParams.get('phase'),'dates');});
check('client validation also rejects manipulated count > 3',()=>assert.equal(f.api.validate({...base,adults:3,children:1}).code,'invalid_guests'));
let release;
f.w.fetch=()=>new Promise(resolve=>{release=resolve;});
f.q('form').dispatchEvent(new f.w.Event('submit',{cancelable:true}));
check('loading prevents duplicate submissions',()=>{assert.equal(f.q('form').getAttribute('aria-busy'),'true');assert.equal(f.q('[type="submit"]').disabled,true);f.q('form').dispatchEvent(new f.w.Event('submit',{cancelable:true}));});
release({ok:false,json:async()=>({ok:false,field:'guests',code:'invalid_guests'})});
await new Promise(resolve=>setTimeout(resolve,5));
check('server rejection is surfaced without navigation',()=>{assert.match(f.q('[data-hlh-feedback]').textContent,/1 à 3 voyageurs/);assert.equal(f.navigations,1);assert.equal(f.q('[data-hlh-panel="guests"]').hidden,false);});
f.w.fetch=async()=>{throw new Error('offline');};
f.q('form').dispatchEvent(new f.w.Event('submit',{cancelable:true}));
await new Promise(resolve=>setTimeout(resolve,5));
check('network errors recover the search control',()=>{assert.match(f.q('[data-hlh-feedback]').textContent,/Réessayez/);assert.equal(f.q('[type="submit"]').disabled,false);assert.equal(f.q('form').hasAttribute('aria-busy'),false);assert.equal(f.navigations,1);});
check('English interface is usable',()=>{const en=fixture(true);assert.match(en.q('[data-hlh-value="rooms"]').textContent,/1 room/);en.click('[data-hlh-open="guests"]');assert.match(en.q('[data-hlh-limit]').textContent,/Maximum 3 guests/);en.dom.window.close();});
const report={testedAt:new Date().toISOString(),passed:results.length,failed:0,tests:results};
writeFileSync('.impeccable/review/functional-tests.json',JSON.stringify(report,null,2));
console.log(`${results.length} checks passed (validation, all allowed traveller pairs / properties, counters, calendars, panels and redirect parameters).`);
f.dom.window.close();
