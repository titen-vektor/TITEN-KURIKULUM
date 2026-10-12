// TITEN KURIKULUM - service worker
// Naikkan VERSI ini bersamaan dengan versi.txt dan VERSI_APP di index.html
const VERSI = "2026-10-12-1";
const CACHE = "titen-kurikulum-" + VERSI;
const CANGKANG = ["./", "./index.html", "./manifest.webmanifest", "./ikon-192.png", "./ikon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CANGKANG)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith("titen-kurikulum-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;          // data harga TITEN: langsung ke jaringan
  if (url.pathname.endsWith("versi.txt")) return;       // selalu dari jaringan
  if (req.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("index.html")){
    // halaman: jaringan dulu, cadangan dari cache saat offline
    e.respondWith(fetch(req).then(r => { const k = r.clone(); caches.open(CACHE).then(c => c.put("./index.html", k)); return r; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});