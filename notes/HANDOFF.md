# Card Drop — status (read this first)
**Updated:** 2026-11-08 end of session 3. LIVE **v2.1.0**. Full record: `HISTORY.md` (grep only). Old handoffs: `handoffs/`.

## Basics
- Phone PWA for Trell's detailing business: mark houses where cards were left. Owner on iPhone. LIVE
  https://broletrell.github.io/carddrop/ (repo broletrell/carddrop, Pages on main). Partner may install same link.
- One `index.html` (vanilla JS, MapLibre 5.6.1, pmtiles 3.2.1), `sw.js`, `version.json`. Data only on phone:
  `carddrop.v1` houses, `carddrop.biz.v1` {buys,jobs}, `carddrop.settings.v1`.
- Release: bump `APP_VERSION` + `version.json` + `CACHE` in sw.js (now carddrop-v19), commit, push, poll version.json.
- Look: dark navy theme = "app theme v2" block at END of <style>. Never use var(--ink) as a background.

## Testing
- Preview `carddrop` (8795); if busy use `carddrop-test` → open http://localhost:8796. Temp `_test.html` (git-excluded)
  fetches index.html, overrides rAF with setTimeout, swaps `location.protocol==="https:"`→false, document.write. Delete after.
- Click via JS (ref clicks scroll body). Screenshots lag when pane hidden → use `zoom` region [0,0,750,1624].
- Preview browser can't run service workers; test SW with a node mock.

## Recent (session 3)
- v1.9.0 Stats page · v1.9.1 navy tab bar + multi-select · v1.9.2 fast start + GPS smoothing · v2.0.0 redesign ·
  v2.0.1 date box fix · v2.1.0 expected revenue (talked-to houses count higher).

## Open / unverified
- Nothing phone-tested by owner yet except Stats sheet (owner screenshot → date bug, fixed v2.0.1).

## NEXT (owner asked; give effort line + wait for "go")
- **Shared map for owner + partner — HIGH effort.** Sync houses (status, amount, notes, history) + biz (buys, jobs).
  NOT synced: settings, map style. Owner has a Cloudflare account with apps (check `../saferoute-server`,
  `../ebike-ai-worker` for existing Worker setup). Plan: Worker + D1/KV, shared team code, per-record last-write-wins
  on `updated`, tombstones for deletes, offline queue, merge on open/visibility.

## This session's notes
- [[topics/2026-11-08-stats-page|Stats page]] · [[topics/2026-11-08-multi-select-houses|Multi-select]] ·
  [[topics/2026-11-08-fast-start-caching|Fast start]] · [[topics/2026-11-08-gps-smoothing|GPS smoothing]] ·
  [[topics/2026-11-08-dark-navy-redesign|Redesign]] · [[topics/2026-11-08-expected-revenue-estimate|Expected revenue]] ·
  [[topics/2026-11-08-date-box-overflow-fix|Date box fix]]
