const C = "shokh-it-v4";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(["./", "index.html", "config.js", "manifest.json", "icon-192.png", "icon-512.png"]).catch(()=>{}))); });
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  // Янгиланишни текшириш сўровлари кешга тушмайди.
  if (e.request.method !== "GET" || u.origin !== location.origin || u.searchParams.has("_u")) return;
  // Аввал интернетдан (янги версия), интернет бўлмаса — кешдан.
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); } return r; })
    .catch(() => caches.match(e.request, {ignoreSearch: true}).then(m => m || caches.match("./"))));
});
