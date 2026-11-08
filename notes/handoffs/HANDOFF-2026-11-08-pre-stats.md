# Card Drop — status (read this first)

**Last updated:** 2026-11-08, end of session 2. LIVE **v1.8.2**. Older detail: `handoffs/` (grep, don't read whole).

## Basics
- Phone PWA to mark houses where detailing business cards were left. Owner (Trell, thedetailboyz916) uses iPhone,
  often away from Mac. LIVE https://broletrell.github.io/carddrop/ (repo broletrell/carddrop, Pages on main).
- Folder `/Users/rtb/untitled folder/carddrop`: one `index.html` (vanilla JS, MapLibre 5.6.1), `sw.js`, `version.json`.
  Data only in phone localStorage (`carddrop.v1` houses, `carddrop.settings.v1`). Houses: {id,lat,lng,status
  left|talked|booked|skip, addr,num,street,city,notes,amount,created,updated,history[{s,t}]}.
- Release: bump `APP_VERSION` (index.html) + `version.json` (same) + `CACHE` in sw.js (now carddrop-v13), commit,
  push (Mac's saved GitHub credential, never print it), poll `curl .../version.json?x=$RANDOM` until new. Phone shows
  green Update banner (or close app fully + reopen).

## Testing (important)
- Preview: `preview_start name "carddrop"` (port 8795). The preview pane is usually HIDDEN → requestAnimationFrame
  stalls → map never loads. Trick: temp `_test.html` in carddrop (git-excluded via .git/info/exclude) that fetches
  index.html, injects `<script>` overriding rAF with setTimeout (+ optional fake geolocation), replaces
  `location.protocol==="https:"` with `false` (no SW), then document.write. Delete it before committing.
- Use resize_window mobile; seed houses via localStorage. Test area with missing OSM buildings: 38.515,-121.48.

## What's built
- Tabs: Map, Houses (search/filter by street), Stats, Settings (biz name, nearby warning, backup/restore JSON, CSV).
- Map styles: Auto (day/night by sunset), Card Drop Day/Night (`brandStyle`, OpenFreeMap vectors), Satellite/Hybrid
  (`satStyle`: Esri photo + our own vector roads/labels, no rail), Classic. Overlay added to every style via
  `setStyle(...,{transformStyle:withOverlay})`.
- Houses: green "not hit" dots = building centroids (55–900 m²) from OpenFreeMap + **Overture buildings PMTiles**
  (fills neighborhoods OSM lacks; pmtiles@3.2.1 loaded in background, `ovReady`, release in `carddrop.ovrel`),
  de-duped 8 m grid, shown from zoom 14 (`AVAIL_Z`). Marked houses = `cd-done` circle layer colored by status
  (Card left blue, Talked amber, Booked purple #9333ea, Skip gray), min size city-wide. Tap → bottom sheet.
- Top bar on Map: stat cards (Cards / Talked / Clients+% / Revenue+avg), Today/7d/30d/All picker, collapse arrow,
  legend. Booked asks "$ amount" (`askAmount`, stored `h.amount`). Stats tab: counts, 7-day bars, Revenue,
  Expected clients (open cards × own booking rate, needs ≥10 cards + 1 booking). Math in `calc(range)`, `expected()`.
- Location dot + compass cone, street progress chip, nearby-done warning, undo, onboarding, offline SW.

## Problems hit + fixes (don't repeat)
- All-blue screen on launch = startup crash: `let` vars read before declared (Auto style read `me`). Declare
  shared state (`me`, `ovReady`, `ovRel`) near the top, before `setLayer(settings.layer)` runs.
- "No houses/dots in my neighborhood" = OSM has no buildings there → fixed with Overture (same as SafeRoute v116).
- Slow map: was loading Classic style first then swapping; tile cache was wiped every update (now fixed name
  `carddrop-tiles`); SW must not cache range requests (Overture).
- Location pulse glitch on iPhone: animate transform/opacity, never width/height.
- CARTO tiles need an API key now; don't use. Green dots at whole-city zoom not possible (no building data in
  low-zoom tiles + too many points) — owner accepted zoom 14 limit.

## NEXT (owner asked for this; still give effort line + wait for "go")
Build a new **Stats page** styled like owner's mockup `notes/mockups/stats-page-mockup.jpg` (dark navy cards,
blue icons, big white numbers, green ↑% vs previous period, sections "Your Performance", "Estimates & Insights",
"Business Overview", range dropdowns). Map page = map only (remove the top stats bar; keep a small legend).
Bottom tab bar keeps a Stats button. Features:
1. Range filter: 1 day, 7 days, 14 days, 30 days, All time — for cards, clients, revenue.
2. Cards passed out per range; change vs previous period (real data only, no fake %).
3. Streak: days in a row with ≥1 card left (current + best).
4. Card purchases log ("Add cards bought": quantity + $ paid + date). Show total cards ever BOUGHT and total
   money spent on cards, both with the same filters (1/7/14/30 days, All time). Also cards left in stock
   (bought − passed out).
5. Revenue from cards (booked houses' `h.amount`) vs total business revenue (needs "Add job" for non-card jobs:
   $ + date + source). Per range + all time. Clients count per range + all time. Avg ticket.
6. ROI: card revenue ÷ card spend.
7. Expected clients estimator: research real data first (door hanger / business card response rates for
   door-to-door home services: detailing, window washing, lawn care; how fast people call back — week 1/2/30 days).
   Cite sources in notes. Use industry baseline until owner has enough own data, then blend toward own rate.
   Show "from N cards, expect X–Y clients in next 7/14/30 days" as a range with the basis explained.
