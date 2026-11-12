# Card Drop — status (read this first)
**Updated:** 2026-11-08 end of session 4. LIVE **v2.3.5**. Full record: `HISTORY.md` (grep only). Old handoffs: `handoffs/`.

## Basics
- Phone PWA for Trell's detailing business: mark houses where cards were left. Owner + partner on iPhone. LIVE
  https://broletrell.github.io/carddrop/ (repo broletrell/carddrop, Pages on main).
- One `index.html` (vanilla JS, MapLibre 5.6.1, pmtiles 3.2.1), `sw.js`, `version.json`. Data: `carddrop.v1` houses,
  `carddrop.biz.v1` {buys,jobs}, `carddrop.settings.v1` (per phone), `carddrop.sync.v1` (shared map + `peers`).
- Sync server `../carddrop-sync/` (Worker + D1 `carddrop-sync`: teams, records, presence; local git; `npx wrangler deploy`). README there.
- Release: bump `APP_VERSION` + `version.json` + `CACHE` in sw.js (now carddrop-v31), commit, push, poll version.json.
- Look: dark navy "app theme v2" block at END of <style>. Never use var(--ink) as a background.

## Testing
- `_test.html` (git-excluded, delete after): fetch index.html, rAF→setTimeout, swap `location.protocol==="https:"`→false, document.write.
  Fake GPS: override `navigator.geolocation` in _test.html before document.write.
- Set localStorage from another page (e.g. /version.json) — the app re-saves its old sync state when you navigate away.
- `window.cdMap` is reachable from javascript_tool; page `let` globals are not. Screenshots lag → use `zoom`.
- Two phones = tabs on 8795 + 8796 (separate storage). Partner sim = node POST `/sync` with {code,since,changes,dev,me}.
- Delete test teams by hash only (`sha256("carddrop:"+code)`); mass deletes get blocked.

## Recent (session 4, v2.2.0 → v2.3.1) — details in HISTORY
- Shared map (v2.2.0) → near-live 5 s sync + partner-edit collision fixes (v2.2.2).
- Partner live location: orange dot, faded last spot if signal lost, good fixes only, smooth glide (v2.2.4–v2.2.6). Working in field.
- Facing beam bold + accuracy-sized, confirmed on owner's phone (v2.2.8). Map rotation + compass + direction-up (v2.2.7).
- Own dot lag (~70 m under trees) fixed v2.2.9; own dot freeze fixed v2.3.0 (arrival time, GPS restart + 15 s watchdog).
- Every house gets dot + number from county address points (Overture addresses) v2.3.1.

- v2.3.2: "Not sure of the date" button on Add job (saved as t=0 → counts only in All Time, shows "Date unknown").
- v2.3.3: Houses filter buttons wrap to 2 rows instead of being cut off.
- v2.3.4: work day = drops before 5 AM count for the day before (streak + cards-per-day chart only; data untouched). Sat 299 / Sun 109, streak 2.
- v2.3.5: purchases can be marked "used up" (tap a purchase) → still in spending, not in stock. One-time fix marks the
  250 cards of Sep 16 on each phone at first load (flag `carddrop.fix.sep16`). Stock now 500 − 408 = 92.

## Open / unverified
- Not phone-tested yet: v2.2.9 lag fix, v2.3.0 freeze fix, two-finger twist, v2.3.1 address dots.
- Empty extra team 112acc… in D1 (probably a double Start) — ask owner before deleting.
- Anyone with a team code can read/edit that map (by design). No code rotation yet.
- Partner's name shows "Partner" until they type one in Settings.

## Next ideas
- Owner field-test: walk a street, check own dot keeps up, numbers/dots on every house.
- Maybe: show who changed a house; rotate team code; keep screen awake while walking.

## This session's notes
- [[topics/2026-11-08-near-live-sync-conflict-fixes|Near-live sync + conflict fixes]] · [[topics/2026-11-08-partner-live-location|Partner live location]]
- [[topics/2026-11-08-every-house-dot-and-number|Every house dot + number]] · [[topics/2026-11-08-facing-direction-beam|Facing beam]]
- [[topics/2026-11-08-gps-lag-and-freeze-fix|GPS lag + freeze fix]] · [[topics/2026-11-08-map-rotation|Map rotation]]
- Earlier session 4: [[topics/2026-11-08-shared-map-sync|Shared map sync]] · [[topics/2026-11-08-left-off-marker|Left-off marker]] · [[topics/2026-11-08-toast-above-select-bar|Toast above select bar]]
