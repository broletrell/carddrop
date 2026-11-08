// Card Drop offline support + fast start: app files and map data load from the phone first.
const CACHE = "carddrop-v19";
const TILES = "carddrop-tiles"; // kept across app updates
const SHELL = ["./", "index.html", "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png",
  "https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.css", "https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.js",
  "https://unpkg.com/pmtiles@3.2.1/dist/pmtiles.js"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("carddrop-") && k !== CACHE && k !== TILES).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Serve the saved copy right away and refresh it in the background (next launch gets the fresh one).
function fastThenRefresh(e, cacheName, key) {
  const refresh = fetch(e.request).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(cacheName).then(c => c.put(key, copy)); }
    return r;
  });
  e.waitUntil(refresh.then(() => {}, () => {}));
  return caches.match(key).then(hit => hit || refresh);
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Address lookups and the update check always go to the network.
  if (url.hostname.includes("nominatim") || url.pathname.endsWith("version.json") || url.hostname.includes("stac.overturemaps")) return;
  // Overture house outlines come in pieces (range downloads). Save each piece under its own key so
  // outlines show instantly next time instead of downloading again on every launch.
  if (url.hostname.includes("overturemaps")) {
    const range = req.headers.get("range");
    if (!range) return;
    const key = url.origin + url.pathname + "?bytes=" + encodeURIComponent(range);
    e.respondWith(caches.open(TILES).then(c => c.match(key).then(hit => {
      if (hit) return hit.arrayBuffer().then(buf => new Response(buf, { status: 206, headers: {
        "Content-Type": "application/octet-stream", "Content-Length": String(buf.byteLength),
        "Content-Range": hit.headers.get("X-Range") || "", "ETag": hit.headers.get("X-ETag") || "" } }));
      return fetch(req).then(r => {
        if (r.status === 206) {
          r.clone().arrayBuffer().then(buf => c.put(key, new Response(buf, { headers: {
            "X-Range": r.headers.get("Content-Range") || "", "X-ETag": r.headers.get("ETag") || "" } })))
            .then(() => { if (++puts % 200 === 0) trim(c); }).catch(() => {});
        }
        return r;
      });
    })));
    return;
  }
  // App page + files: saved copy first (instant start), refreshed in the background.
  // The in-app Update banner (version.json) still clears this and reloads fresh.
  if (req.mode === "navigate" || url.origin === location.origin) {
    const key = url.origin + url.pathname;
    e.respondWith(fastThenRefresh(e, CACHE, key).catch(() => caches.match("index.html")));
    return;
  }
  // Map index files (they point at the newest tiles): saved copy first, refreshed in the background.
  if (url.pathname === "/planet" || url.pathname.startsWith("/styles/")) {
    e.respondWith(fastThenRefresh(e, TILES, req.url));
    return;
  }
  // Map tiles, fonts and MapLibre: cache first, keep recent tiles for offline use.
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok || r.type === "opaque") { const copy = r.clone(); caches.open(TILES).then(c => c.put(req, copy).then(() => { if (++puts % 200 === 0) trim(c); })); }
    return r;
  })));
});

let puts = 0;
// Keep the tile cache from growing forever.
async function trim(c) {
  const keys = await c.keys();
  if (keys.length > 4000) for (const k of keys.slice(0, keys.length - 3200)) await c.delete(k);
}
