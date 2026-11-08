# Card Drop

Phone web app (PWA) for Trell's mobile detailing business: mark houses where a
business card was left so he never hits the same house twice. iPhone, installed
via Safari > Share > Add to Home Screen.

Stack: one `index.html` (vanilla JS + MapLibre GL 5.6.1 from unpkg, same as SafeRoute), OpenFreeMap
vector tiles with our own brandStyle(day/night) built in JS (plus liberty as Classic), Esri raster satellite, Nominatim reverse geocoding for addresses.
Data lives on the phone (localStorage `carddrop.v1`, `carddrop.biz.v1`, `carddrop.settings.v1`); optional Shared map syncs houses+biz
through `../carddrop-sync/` (Cloudflare Worker + D1, https://carddrop-sync.saferoute.workers.dev, `wrangler deploy` there). Sync state: `carddrop.sync.v1`.
`sw.js` = offline cache, `manifest.webmanifest` + `icons/` = home screen install.

Run locally: preview server "carddrop" in the vault's `.claude/launch.json` (port 8795).
Deploy: GitHub Pages from `broletrell/carddrop` main branch -> https://broletrell.github.io/carddrop/
Each release: bump `APP_VERSION` in index.html AND `version.json` (same value) so the in-app Update banner shows; also bump `CACHE` in `sw.js`.

Note: CARTO basemaps now return "API KEY REQUIRED" tiles; don't switch back.

Read `notes/HANDOFF.md` first; update it after meaningful changes (archive old one to `notes/handoffs/`).
