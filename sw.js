const CACHE = "cmp-v5";
const CORE = [
  "./", "./index.html", "./styles.css", "./app.js", "./manifest.json",
  "./assets/cm-logo.jpg", "./assets/cm-banner.jpg", "./assets/fartravel-icon.png",
  "./assets/icon-192.png", "./assets/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(req).then((r) => {
      if (r && r.ok) { const cc = r.clone(); caches.open(CACHE).then((c) => c.put(req, cc)); }
      return r;
    }).catch(() => caches.match(req).then((c) => c || caches.match("./index.html")))
  );
});
