# Card Drop — HISTORY (permanent record, newest first)
Never read at session start. grep it. Older full handoffs: `handoffs/`.

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
- Open: none known. Not yet phone-verified: v1.9.2 SW caching, v2.0.1 date box.
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
- 2026-11-08 v2.2.2: two-tab test passed; fixed stale-sheet overwrite of partner edits, delete-wrong-house on partner delete, biz field reset. Owner real team created (301 houses) + one empty team.
- 2026-11-08 v2.2.3: house numbers on map, GPS prediction + glide, compass-first smoothed facing cone, compass asks on first tap.
- 2026-11-08 v2.2.4: partner live location (presence table, faded last spot), house numbers on green dots from OSM.
- 2026-11-08 v2.2.5: partner accuracy circle + rough-spot label; field report of 150 m offset (owner GPS likely rough).
- 2026-11-08 v2.2.6: share only good GPS fixes, Finding-GPS pill, partner dot prediction (sp/cr), 2–3 s live sync.
- 2026-11-08 v2.2.7: map rotation (two-finger twist), compass button, locate 2nd tap = map turns with you.
- 2026-11-08 v2.2.8: bolder accuracy-sized facing beam, keep low-accuracy compass readings, permission retry + denied help.
- 2026-11-08 v2.2.9: fixed own-dot lag under trees (Kalman retune + catch-up snap).
