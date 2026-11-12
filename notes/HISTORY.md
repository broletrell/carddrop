# Card Drop — HISTORY (permanent record, newest first)
Never read at session start. grep it. Older full handoffs: `handoffs/`.

## 2026-11-08 session 4 (cont.) — v2.2.1 → v2.3.1
- v2.3.1 Every house gets a dot + number: green dots from Overture `addresses.pmtiles` (same release as buildings; OpenAddresses = Sacramento County, verified full on Roman Oak Way / River Ranch Way). Source `ova`, invisible layer `ova-pts`; `addrPts()` dedupes number|street, title-cases street (`tc`), adds OSM housenumber points not within 15 m of a same-number county point; `bucket()` 40 m grid lookup. Building centroids add a numberless dot only where no address point is inside/≤12 m. Base "housenum" layer removed (gray duplicates). Marked houses with no number take nearest address ≤15 m (saved + synced). Tap/multi-select pass n+s (`openNew(lat,lng,hint)`, pickAt props).
- v2.3.0 Bug: own dot froze while partner's moved. Cause: `smoothFix` rejected `t<kf.t` using p.timestamp → one odd timestamp froze all later fixes; iOS also pauses watchPosition after lock/app switch. Fix: arrival time (Date.now) for filter, skip fixes stamped >20 s old, quick getCurrentPosition only if no fix yet, `restartGPS()` on visibilitychange + 15 s no-fix watchdog. Fake-GPS test in _test.html (override navigator.geolocation before document.write).
- v2.2.9 Bug: own dot ~70 m behind walking under trees. Cause: Kalman R=acc², q=1 (v2.2.3 lowered from 1.5) with no iOS speed → tiny gain. Fix: R=(0.35·acc)², q=max(3, 2·speed), 2 fixes in a row outside error circle → snap k≥.85 + reset v. Node sim (acc 50, no speed): lag 28–38 m → ~7 m; jitter ~2 m; 150 m outlier 0.5 m.
- v2.2.8 Bug: facing cone not showing. Causes: faint 90 px cone; readings dropped when webkitCompassAccuracy >45; permission failure silent. Fix: 150 px beam `#meBeam`, half-angle = compass accuracy (18–55°), -1 → wide + figure-8 toast; first-tap listener retries until granted/denied; denied → toast (Settings › Apps › Safari › Motion & Orientation Access). Confirmed working on owner's phone.
- v2.2.7 Map rotation: two-finger twist (MapLibre inertia), touchPitch off, maxPitch 0; compass button `#btnCompass` (shows when bearing ≠ 0, tap → north); locate 1st tap = go to me, 2nd (centered, z≥16) = `headUp` (bearing follows `headSm`, 250 ms/3° throttle), 3rd = off + north; user drag/rotate ends it. Twist not testable in preview.
- v2.2.6 Live location accuracy: share only fixes with raw acc ≤30 m (`GOOD_ACC`); `#gpsWarn` "Finding GPS… off by X ft" after 4 s rough; presence adds `sp`/`cr` (D1 ALTER TABLE presence ADD sp, cr); partner dot extrapolates along cr ≤6 s, redrawn 1 s; sync every 2–3 s when sharing/partner live (tick%5 ∈ {0,2}), else 5 s; resend moved >2 m / 10 s / turned >20°.
- v2.2.5 Partner accuracy circle `.pacc` + "rough spot" label (acc >30 m). Field report: partner ~150 m off while side by side; D1 showed partner acc 3 m, owner not sharing → owner GPS rough (Precise toast only at >500 m).
- v2.2.4 Partner live location: Settings → Live location (`#setShare`, `#setName`, `#peerRow`). `/sync` optional `dev` + `me{name,lat,lng,acc,hd}` / `off:1`; D1 table `presence` (team,dev PK, latest only, rows >12 h deleted); response `peers[{…,age}]`. Orange marker + name + cone; >45 s (`STALE`) → gray at last spot "Name · 2 min ago" (`peerAgo`), kept in `sync.peers` (survives no signal/reload); off/leave deletes at once. Green dots got OSM house numbers (`houseNumPts`, `numFor`). Gotcha: never set CSS `position` on a MapLibre marker element (marker drifts).
- v2.2.3 House numbers on marked houses (`cd-done-num`, `hNum()`); left-off pill offset -27; Kalman predicts along GPS course; dot glide `glideMe`; compass-first smoothed cone, landscape correction, compass asked on first tap.
- v2.2.2 Two-tab sync test (8795 = phone A, 8796 = phone B). Fixed: open house sheet overwrote partner edits on Done (`o0` snapshot → save only changed fields); partner-deleted open house → close + toast; `deleteHouse` splice(-1) guard; `#setBiz` not reset while focused.
- v2.2.1 Near-live sync: poll 5 s while open (was 45 s). Friend-can't-see report: D1 had 0 teams (never started). Owner's real team 514fe5… (301 houses) + empty 112acc… (probably double Start; not deleted).

## 2026-11-08 (session 3) — v1.9.0 → v2.1.0
- v2.1.0 Expected revenue: Estimates box shows $ range for next 7/14/30 d + total potential of all open cards. Two groups in `expected()`: cards-only (BASE_RATE 2%, PRIOR_CARDS 150) and talked-to (TALK_RATE 10%, TALK_PRIOR 30), each blended with own results via `grp()`. $ = clients × `avgTicket()` (own booked `h.amount` + `biz.jobs` amounts, else `settings.avgJob` default $150, "change" link).
- v2.0.1 Bug: iPhone date input ran off screen in Add cards / Add job sheets → `.dinput` display:block, min-width:0, appearance:none, left-aligned. Not phone-verified.
- v2.0.0 Redesign: whole app dark navy. One "app theme v2" block at END of <style> redefines tokens (--bg #0a0f1c, --panel #121829, --raise #1a2135, --ink #f1f5f9, --brandg) + frosted large-title headers, frosted tab bar with blue pill, grouped lists, dark inputs/sheets/dialogs, navy-glass map overlays, timeline history in house sheet, page fade-in. Houses list shows booked $; onboarding tip for multi-select. Decision: var(--ink) is now light — never use as background.
- v1.9.2 Fast start: sw.js `fastThenRefresh` (cache first + background refresh) for app page and OpenFreeMap /planet; Overture range pieces cached as 200 under `url?bytes=<range>` and replayed as 206 with saved Content-Range/ETag (pmtiles 3.2.1 accepts); pmtiles.js loaded as normal <script> so `ovReady` true before first `setLayer` (map built once). Tested with node mock only (preview browser blocks SW).
- v1.9.2 GPS: quick low-accuracy `getCurrentPosition` then `watchPosition(maximumAge 1000)`; `smoothFix` Kalman (q=max(1.5, speed×1.5)); first zoom waits ≤4 s for ≤60 m fix; accuracy ring `#meAcc`; toast once if fixes >500 m (Precise Location off). Fake-GPS test: settles 0–2 m, 220 m outlier ignored.
- v1.9.1 Tab bar deep navy on every page (owner request).
- v1.9.1 Multi-select: map side button → `startSelect`; "Tap to pick"/"Swipe to pick" (swipe disables dragPan, start on picked = un-pick); picks = `cd-pick` layer (white dot, blue ring); bar buttons Card left/Talked/Skip (no Booked: needs $); `applyPicks` one undo; addresses via 1/s queue `fillAddresses`/`runAddr`, retried 5 s after launch, `h.noAddr` if none. `selecting`/`picks` declared near top (withOverlay reads at startup — TDZ crash risk).
- v1.9.0 Stats page (dark, from owner mockup `mockups/stats-page-mockup.jpg`): ranges 1/7/14/30/All (rolling, `win(r,prev)`), ±% vs previous period only from real data (`chg`), streak current+best, card purchases log (`carddrop.biz.v1` buys {id,t,qty,cost}), stock = bought − cards since first purchase, ROI = card revenue ÷ card spend, other jobs log (jobs {id,t,amount,source,note}), Business Overview, expected clients (F(d)=1−e^(−d/10), 80% range). Backup v2 includes buys/jobs; restore merges. Map top stats bar removed → small legend `#mLegend`.
- Research (2026-11-08) for estimator: home-service cards/door hangers ~1–4%, 2–3% typical; most calls week 1, long tail. Sources: 4over4 door hanger stats, doorhangerswork.com response-rate guide, UK DMA door-drop article (~4%), windowcleaner.com forum thread 40700 (~2 jobs / 75 hangers). Printers inflate numbers → use middle.
- Tooling: vault `.claude/launch.json` got `carddrop-test` (python on 8796; open http://localhost:8796 even if tool reports another port) for when another chat holds 8795.

## Before 2026-11-08 session 3 (v1.0 → v1.8.2) — see handoffs/ for detail
- PWA built: map (MapLibre 5.6.1, OpenFreeMap brandStyle day/night, Esri satellite/hybrid, Classic), houses list, stats, settings, backup/restore JSON, CSV, onboarding, offline SW, update banner.
- v1.8: Overture buildings PMTiles fill neighborhoods missing from OSM; green dots from zoom 14 (`AVAIL_Z`), 55–900 m² centroids, 8 m de-dup.
- v1.7.x: location pulse animates transform/opacity only; startup crash fixed (let vars read before declared — keep shared state near top).
- Booked asks $ amount (`askAmount`). CARTO tiles need API key — don't use.

## Bug log
- Open: none known. Not phone-tested: v2.2.9 lag fix, v2.3.0 freeze fix, v2.2.7 two-finger twist, v2.3.1 address dots.
- Fixed (session 4): stale sheet overwrote partner edits v2.2.2; wrong-house delete v2.2.2; facing cone missing v2.2.8; own dot lag v2.2.9; own dot freeze v2.3.0; houses without dot/number v2.3.1.
- Ruled out (session 4): partner 150 m off = partner bug (partner acc 3 m; owner GPS was rough).
- Ruled out (session 4): "all houses gone" (only 3 shown, all 20 hr old) = owner looking at his SECOND phone; each phone has its own storage until both join the Shared map. Main phone had all houses.
- Earlier: none known. Not yet phone-verified: v1.9.2 SW caching, v2.0.1 date box.
- Fixed: all-blue launch screen (TDZ) v1.7.1; date box overflow v2.0.1; slow start (network-first app page, double style load, uncached Overture) v1.9.2; jumpy/off GPS dot v1.9.2.
- Ruled out: green dots at city zoom (no low-zoom building data; owner accepted zoom 14).

## 2026-11-08 session 4 — v2.2.0
- Atlas section for Card Drop (slug `carddrop` in atlas-build.py + update.md; 7 backfilled atoms + 3 new).
- Shared map: new Worker `carddrop-sync` + D1 `carddrop-sync` (folder ../carddrop-sync, local git). Team code (16 chars, SHA-256 stored),
  `/team/new`, `/sync` push+pull in one D1 batch with per-team seq cursor; newest mt wins; tombstones; MAX_TEAMS 50.
  Client: fingerprint-on-save outbox, syncClean for remote records, Settings start/join/share/sync now/leave, delete-all warning.
  Tested live: conflict, delete, job, join merge, leave, offline queue, XSS-in-notes stays text. Test teams deleted.
- "You left off here" marker (per phone, trackLast in persist).
- Toast lifted above multi-select bar (owner screenshot).

## 2026-11-08 v2.2.1
- Shared map polls every 5 s while open (was 45 s) for near-live partner updates. Friend-can't-see-houses report: no team existed in D1.
