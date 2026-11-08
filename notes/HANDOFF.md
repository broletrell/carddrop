# Card Drop — status (read this first)
**Updated:** 2026-11-08 session 4. LIVE **v2.2.1**. Full record: `HISTORY.md` (grep only). Old handoffs: `handoffs/`.

## Basics
- Phone PWA for Trell's detailing business: mark houses where cards were left. Owner on iPhone. LIVE
  https://broletrell.github.io/carddrop/ (repo broletrell/carddrop, Pages on main). Partner installs same link.
- One `index.html` (vanilla JS, MapLibre 5.6.1, pmtiles 3.2.1), `sw.js`, `version.json`. Data: `carddrop.v1` houses,
  `carddrop.biz.v1` {buys,jobs}, `carddrop.settings.v1` (per phone), `carddrop.sync.v1` (shared-map state).
- Sync server: `../carddrop-sync/` (Worker `carddrop-sync` + D1 `carddrop-sync`, local git only). README there.
- Release: bump `APP_VERSION` + `version.json` + `CACHE` in sw.js (now carddrop-v21), commit, push, poll version.json.
- Look: dark navy theme = "app theme v2" block at END of <style>. Never use var(--ink) as a background.

## Testing
- Ports 8795/8796 often already served by old python servers → just navigate to http://localhost:8796/_test.html.
  Temp `_test.html` (git-excluded): fetch index.html, rAF→setTimeout, swap `location.protocol==="https:"`→false, document.write. Delete after.
- javascript_tool can't see page `let` globals → drive via DOM clicks + localStorage. Screenshots lag → `zoom` [0,0,750,1624].
- Sync server allows origins github.io + localhost:8795/8796. Partner simulation: node script POSTing /sync.

## Session 4 (v2.2.0)
- Shared map: Settings → Start a shared map (code) / Join with a code / Sync now / Leave. Newest edit wins per record,
  deletes sync, offline queue, sync on open/return/online/45 s. Change detection = fingerprint on every save (persist/persistBiz).
- "You left off here" pill over the last house changed on THIS phone (status/notes/amount/history only; partner edits don't move it).
- Toast sits above the multi-select bar instead of covering Card left/Talked/Skip.
- Atlas section for Card Drop done (`../atlas/carddrop/`).

## Session 4b (v2.2.1)
- Partner asked why friend couldn't see houses: D1 had 0 teams (never started a shared map). Told owner the start/join steps.
- Near-live sync: poll every 5 s while app open (was 45 s); skips if busy/offline. Not phone-tested.

## Open / unverified
- Nothing phone-tested by owner yet (multi-select, fast start, shared map, marker). Test teams deleted from D1 (0 teams).
- Anyone with a team code can read/edit that map (by design; 80-bit code). No way to rotate a code yet.

## NEXT ideas
- Owner + partner try the shared map on two phones. Possible: show who changed a house; rotate team code.

## This session's notes
- [[topics/2026-11-08-shared-map-sync|Shared map sync]] · [[topics/2026-11-08-left-off-marker|You left off here]] ·
  [[topics/2026-11-08-toast-above-select-bar|Toast above select bar]]
