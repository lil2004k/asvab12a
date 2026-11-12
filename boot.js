// iPhone app boot: load the private book pack (if imported) from IndexedDB on THIS phone, then start the app.
// No sync, no accounts: progress lives in this app's localStorage; book questions in this app's IndexedDB.
window.STANDALONE=true;window.PWA=true;window.PHONE=true;window.APP_VERSION='c0f563b3c7';
window.PHONE_IDB=(function(){const NAME='asvab12a-phone',STORE='kv';let p=null;
  const open=()=>p||(p=new Promise((res,rej)=>{if(!window.indexedDB)return rej(new Error('IndexedDB not available'));const r=indexedDB.open(NAME,1);
    r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);r.onblocked=()=>rej(new Error('IndexedDB blocked'));}));
  const tx=(mode,f)=>open().then(db=>new Promise((res,rej)=>{const t=db.transaction(STORE,mode);const s=t.objectStore(STORE);const q=f(s);let v;if(q)q.onsuccess=()=>{v=q.result;};t.oncomplete=()=>res(v);t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error||new Error('aborted'));}));
  return {get:k=>tx('readonly',s=>s.get(k)),set:(k,v)=>tx('readwrite',s=>s.put(v,k)),del:k=>tx('readwrite',s=>s.delete(k))};})();
(async()=>{const timeout=ms=>new Promise(r=>setTimeout(()=>r(undefined),ms));
  try{const [b,m]=await Promise.race([Promise.all([PHONE_IDB.get('bookBank'),PHONE_IDB.get('bookMeta')]),timeout(4000).then(()=>[])]);window.BOOK_BANK=Array.isArray(b)?b:[];window.BOOK_META=m||null;}
  catch(e){window.BOOK_BANK=[];window.BOOK_META=null;window.BOOK_LOAD_ERROR=String(e&&e.message||e);}
  try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{});}catch(e){}
  const s=document.createElement('script');s.src='app.js?v=c0f563b3c7';document.body.appendChild(s);
  if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
    const had=!!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js').catch(()=>{});
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(had&&typeof banner==='function')banner('App updated. <a href="#" onclick="location.reload();return false">Tap to reload</a> for the new version (your progress is kept).');});}})();
