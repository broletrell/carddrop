// Card Drop offline support: app files load even with no signal.
const CACHE = "carddrop-v7";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png",
  "https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.css", "https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.js"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("carddrop-") && k !== CACHE && k !== CACHE + "-tiles").map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Address lookups always go to the network.
  if (url.hostname.includes("nominatim") || url.pathname.endsWith("version.json")) return;
  // App page: network first so updates show up, cache when offline.
  if (req.mode === "navigate" || url.origin === location.origin) {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r; })
      .catch(() => caches.match(req).then(r => r || caches.match("index.html"))));
    return;
  }
  // Map tiles and Leaflet: cache first, keep recent tiles for offline use.
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(CACHE + "-tiles").then(c => c.put(req, copy).then(() => trim(c))); }
    return r;
  })));
});

// Keep the tile cache from growing forever.
async function trim(c) {
  const keys = await c.keys();
  if (keys.length > 3000) for (const k of keys.slice(0, keys.length - 2500)) await c.delete(k);
}
