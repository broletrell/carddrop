# Card Drop — status (read this first)

**Last updated:** 2026-11-08, session 3. LIVE **v1.9.0** (new Stats page; not phone-tested by owner yet). Older detail: `handoffs/` (grep, don't read whole).

## Basics
- Phone PWA to mark houses where detailing business cards were left. Owner (Trell, thedetailboyz916) uses iPhone,
  often away from Mac. LIVE https://broletrell.github.io/carddrop/ (repo broletrell/carddrop, Pages on main).
- Folder `/Users/rtb/untitled folder/carddrop`: one `index.html` (vanilla JS, MapLibre 5.6.1), `sw.js`, `version.json`.
  Data only in phone localStorage (`carddrop.v1` houses, `carddrop.settings.v1`). Houses: {id,lat,lng,status
  left|talked|booked|skip, addr,num,street,city,notes,amount,created,updated,history[{s,t}]}.
- Release: bump `APP_VERSION` (index.html) + `version.json` (same) + `CACHE` in sw.js (now carddrop-v14), commit,
  push (Mac's saved GitHub credential, never print it), poll `curl .../version.json?x=$RANDOM` until new. Phone shows
  green Update banner (or close app fully + reopen).

## Testing (important)
- Preview: `preview_start name "carddrop"` (port 8795). If another chat holds 8795, use `carddrop-test` (python on 8796 — open http://localhost:8796 even if the tool says another port). Click tabs via JS, not ref clicks (ref clicks scroll the body and leave a white strip). The preview pane is usually HIDDEN → requestAnimationFrame
  stalls → map never loads. Trick: temp `_test.html` in carddrop (git-excluded via .git/info/exclude) that fetches
  index.html, injects `<script>` overriding rAF with setTimeout (+ optional fake geolocation), replaces
  `location.protocol==="https:"` with `false` (no SW), then document.write. Delete it before committing.
- Use resize_window mobile; seed houses via localStorage (+ `carddrop.biz.v1` for purchases/jobs). Test area with missing OSM buildings: 38.515,-121.48.

## What's built
- Tabs: Map, Houses (search/filter by street), Stats, Settings (biz name, nearby warning, backup/restore JSON, CSV).
- Map styles: Auto (day/night by sunset), Card Drop Day/Night (`brandStyle`, OpenFreeMap vectors), Satellite/Hybrid
  (`satStyle`: Esri photo + our own vector roads/labels, no rail), Classic. Overlay added to every style via
  `setStyle(...,{transformStyle:withOverlay})`.
- Houses: green "not hit" dots = building centroids (55–900 m²) from OpenFreeMap + **Overture buildings PMTiles**
  (fills neighborhoods OSM lacks; pmtiles@3.2.1 loaded in background, `ovReady`, release in `carddrop.ovrel`),
  de-duped 8 m grid, shown from zoom 14 (`AVAIL_Z`). Marked houses = `cd-done` circle layer colored by status
  (Card left blue, Talked amber, Booked purple #9333ea, Skip gray), min size city-wide. Tap → bottom sheet.
- Map page = map only + small legend pill top-left (`#mLegend`). Old top stats bar removed (`--tbH` fixed 30px).
- Booked asks "$ amount" (`askAmount`, stored `h.amount`).
- **Stats tab (v1.9, dark, like mockup)** — code under `/* ---------- stats ---------- */`:
  - Data: `carddrop.biz.v1` = {buys:[{id,t,qty,cost}], jobs:[{id,t,amount,source,note}]} (`biz`, `persistBiz`). In backup
    (v:2) + merged on restore. "Delete all houses" leaves them alone.
  - 3 range dropdowns (1/7/14/30 days rolling, All time): Performance (`settings.sRange`), Cards & ROI (`cRange`),
    Business Overview (`oRange`). `win(r,prev)` = window / same-length previous window; `calc(w)`; `chg()` shows ±% only
    from real prev numbers ("↑ new" if prev 0).
  - Performance: cards passed out, talked, clients (booked + other jobs), revenue; streak (current + best, days with ≥1 card).
  - Cards & ROI: bought, spent, stock (bought − cards out since first logged purchase), ROI = card revenue ÷ card spend.
  - Business Overview: total revenue / clients / avg ticket, cards vs other-jobs bar, "Add job" (source chips). Tap a log row to delete (undo).
  - Expected clients (`expected(days)`, 7/14/30 toggle, "i" sheet explains): baseline 2% (BASE_RATE) worth 150 virtual cards
    (PRIOR_CARDS), blended with own bookings ÷ time-weighted cards; timing F(d)=1−e^(−d/10) (~50% wk1, 75% d14, 95% d30);
    80% range. Research (2026-11-08): home-service cards/door hangers ~1–4%, 2–3% typical; most calls week 1, long tail.
    Sources: 4over4.com/statistics/door-hanger-advertising-effectiveness-data, doorhangerswork.com/understanding-door-hanger-response-rates/,
    dma.org.uk door-drop article (~4% avg UK), community.windowcleaner.com thread 40700 (≈2 jobs per 75 hangers). Most
    figures come from printers → we use the middle, not the 6–12% claims.
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

## NEXT
- Owner to try v1.9.0 on iPhone (Update banner). Check: dropdowns open the iOS picker, Add cards/Add job sheets + date picker,
  numbers look right with real data. Nothing else requested yet.
- Ideas if asked: edit (not just delete) purchases/jobs; include buys/jobs in CSV export.
