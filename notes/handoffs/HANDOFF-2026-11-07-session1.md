# Card Drop — status

**Last updated:** 2026-11-07 (end of session 1)

## Status
- LIVE v1.6 at https://broletrell.github.io/carddrop/ (public repo broletrell/carddrop, GitHub Pages on main).
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
- Marked houses = DOM pins (`pinHtml`, show house number pill at z17+), pop animation, shadow.
- Pulsing location dot + compass cone (`startCompass`, iOS permission on Get Started / locate tap). Untested on phone.
- Street progress chip under top bar (`updateStreet`: nearest named road, houses within 32 m of it and 230 m of you).
- Nearby warning banner, undo toasts, backup/restore JSON, CSV export, onboarding, update banner, full-screen fix
  for iPhone standalone (`--H` = screen.height), offline service worker.
- "Card Left Here" GPS button was REMOVED at owner's request (code kept as unused `dropHere`).

## NEXT — owner approved ("go"), not started (medium effort)
1. Satellite/Hybrid: remove railroad markings → drop Esri `Reference/World_Transportation` raster overlay and instead
   add our own vector roads + street-name labels from `cdomt` (transportation / transportation_name, no rail class).
2. Marked houses: replace number-pill pins with plain dots the same size as green dots, colored by status
   (Card left blue #2563eb, Talked amber, Booked green, Skip gray). Simplest: a geojson circle layer `cd-done`
   in withOverlay (data from houses), keep tap → openHouse via queryRenderedFeatures. Green "not hit" dots
   should then probably be a distinct green from Booked (consider making Booked a darker green or purple).
3. Top stats bar, inspired by owner's two AI mockups (dark UI, logo + "thedetailboyz916 / Mobile Detailing",
   row of stat cards): Cards placed, Talked to, Clients booked (+ % conversion), Revenue; range picker
   Today / 7d / 30d / All time; small map legend (Not hit / Card left / Talked / Booked).
   Revenue needs a "$ amount" field on the sheet when Booked (store `h.amount`); show avg ticket.
   Add "Expected clients" estimate (cards × real conversion rate) on Stats tab. No fake numbers.
   Keep it fitting on phone above the map (collapsible or compact horizontal scroll cards).

## Owner rules (also in ~/.claude/CLAUDE.md)
- Before each task: one line effort level (lowest that works), then wait for "go".
- Short, plain-language replies, few bullets, no file names/tech detail unless asked.
- Owner is on iPhone, often away from the Mac.
