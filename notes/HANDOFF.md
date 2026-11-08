# Card Drop — status

**Last updated:** 2026-11-07 (session 2, v1.8.1 live)

## Status
- LIVE v1.8.1 at https://broletrell.github.io/carddrop/ (public repo broletrell/carddrop, GitHub Pages on main).
  Owner installed it on iPhone via Add to Home Screen; it works.
- Local folder: `/Users/rtb/untitled folder/carddrop` (git, remote origin set). Push uses the Mac's saved
  GitHub credential (`git credential fill`, scope repo) — never print it.
- Release steps: bump `APP_VERSION` in index.html + `version.json` (same value) + `CACHE` in sw.js, commit, push,
  wait ~50s, confirm `curl https://broletrell.github.io/carddrop/version.json`. App shows a green Update banner.
- Preview: `preview_start name "carddrop"` (vault .claude/launch.json, port 8795). Hidden preview pane loads
  map tiles VERY slowly (30–60s); use long awaits. Geolocation must be stubbed in preview.

## What's built (v1.0 → v1.6)
- Single index.html, vanilla JS, MapLibre GL 5.6.1. Tabs: Map, Houses (search/filter/grouped by street), Stats, Settings.
- Map styles: Auto (Day/Night by sunset, `isNight`), Card Drop Day/Night (`brandStyle()` custom OpenFreeMap vector
  style), Satellite + Hybrid (Esri raster; imagery tileSize 128 + maxzoom 20 = sharp), Classic (OFM liberty).
  Overlay injected into every style via `setStyle(...,{transformStyle: withOverlay})`.
- Green dots = unhit houses: building centroids (55–900 m²) from OFM `building` layer (`refreshAvail`), hidden if a
  marked house within 14 m. OSM address points too sparse in Sacramento.
- Tap house → bottom sheet (status cards Card left/Talked/Booked/Skip, address auto via Nominatim, notes, dup warning),
  house outline highlight (`highlightAt`), map slides house above sheet.
- Marked houses: see Session 2 (now status-colored dots, no pins).
- Pulsing location dot + compass cone (`startCompass`, iOS permission on Get Started / locate tap). Untested on phone.
- Street progress chip under top bar (`updateStreet`: nearest named road, houses within 32 m of it and 230 m of you).
- Nearby warning banner, undo toasts, backup/restore JSON, CSV export, onboarding, update banner, full-screen fix
  for iPhone standalone (`--H` = screen.height), offline service worker.
- "Card Left Here" GPS button was REMOVED at owner's request (code kept as unused `dropHere`).

## Session 2 (v1.7, done + live, NOT phone-tested yet)
- Satellite/Hybrid = Esri photo + our own vector roads/labels (`satStyle(full)`), no Esri transportation overlay → no rail.
- Marked houses = geojson circle layer `cd-done` (same size as green dots, status color). DOM pins removed;
  map click checks `cd-done` first → openHouse. Booked color changed to purple #9333ea.
- Top bar: stat cards (Cards / Talked / Clients+% / Revenue+avg), range picker Today/7d/30d/All
  (`settings.range`), collapse arrow (`settings.statsMin`), legend row. `calc(r)` does the math;
  `--tbH` CSS var pushes street chip/near banner below the bar.
- Booked → `askAmount(h)` sheet with $ box; booked houses show "Job amount" field. Stored as `h.amount`
  (kept in backup restore + CSV). Stats tab: Revenue card + Expected clients (open cards × real booking rate,
  needs ≥10 cards and ≥1 booking, else shows what's missing).
- Slow Auto map fix (owner report): map starts with an empty style (no more loading Classic then swapping),
  preconnect to tiles, SW tile cache now a fixed `carddrop-tiles` name (was wiped every update), trim
  throttled, `/planet` + styles network-first; night side streets brighter/wider at mid zoom, buildings from z13.
- Preview gotcha: when the preview pane is hidden, requestAnimationFrame stalls and the map never loads.
  For testing, override rAF with setTimeout in the page.

- v1.7.1: fixed startup crash (old bug from v1.6) when saved map style = Auto: `resolveLayer` read `me`
  before its `let` line. `me` is now declared above the map section. Showed as an all-blue screen on phone.
- v1.7.2: owner saw no dots + glitchy blue ring on phone (could NOT reproduce in preview; dots fine there).
  Ring pulse now animates transform/opacity instead of width/height. Green dots: `idle` re-runs refreshAvail
  up to 3x per move if none showing at z16+. If dots still missing on phone, ask for a screenshot + zoom level.
- Phone-like test trick: temp `_test.html` (git-excluded) that fetches index.html, injects rAF→setTimeout +
  fake GPS + disables SW, then document.write — lets the map load in the hidden preview pane.
- v1.8: ROOT CAUSE of "no dots/houses" = OpenStreetMap simply has no buildings in owner's area (south Sac
  ~38.515,-121.48 had 2 OSM buildings vs 5467 Overture). Added Overture buildings PMTiles (copied from SafeRoute
  v116): pmtiles@3.2.1 loaded in background, then `ovReady` → setStyle re-applies `withOverlay` which adds
  `ov` source + `ov-bld`/`ov-bld-line` (under `bld`) + invisible `ov-hn` for querying. `buildingPolys` merges both;
  dots de-duped on an 8 m grid. Release in localStorage `carddrop.ovrel`, auto-updated from stac catalog.
  SW skips overturemaps/range requests. Needs signal (not cached offline).

## NEXT
- Owner to test v1.8 on phone (load speed on Auto, $ box, stats bar fit, compass still untested).

## Owner rules (also in ~/.claude/CLAUDE.md)
- Before each task: one line effort level (lowest that works), then wait for "go".
- Short, plain-language replies, few bullets, no file names/tech detail unless asked.
- Owner is on iPhone, often away from the Mac.
- v1.8.1: dots now from zoom 15 (`AVAIL_Z`), smaller at z15.
