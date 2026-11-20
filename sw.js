/* Wortkasten offline cache. 202611202200 changes with every release, so phones pick up updates. */
const V='wk-202611202200';
const CORE=['./','index.html','app.css','fonts.css','i18n.js','app.js','config.js','manifest.webmanifest','dict.json',
  'icons/wk2-192.png','icons/wk2-512.png','icons/wk2-maskable-512.png','icons/wk2-apple-touch-icon.png','icons/wk2-favicon-64.png',
  'fonts/inter-latin-wght-normal.woff2','fonts/inter-latin-ext-wght-normal.woff2','fonts/literata-latin-opsz-normal.woff2','fonts/literata-latin-ext-opsz-normal.woff2','fonts/vazirmatn-arabic-wght-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('wk-')&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(r.mode==='navigate'){e.respondWith(caches.match('index.html').then(m=>m||fetch(r)));return}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})))});
