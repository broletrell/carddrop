# Card Drop — status (read this first)
**Updated:** 2026-11-08 session 4. LIVE **v2.3.0**. Full record: `HISTORY.md` (grep only). Old handoffs: `handoffs/`.

## Basics
- Phone PWA for Trell's detailing business: mark houses where cards were left. Owner on iPhone. LIVE
  https://broletrell.github.io/carddrop/ (repo broletrell/carddrop, Pages on main). Partner installs same link.
- One `index.html` (vanilla JS, MapLibre 5.6.1, pmtiles 3.2.1), `sw.js`, `version.json`. Data: `carddrop.v1` houses,
  `carddrop.biz.v1` {buys,jobs}, `carddrop.settings.v1` (per phone), `carddrop.sync.v1` (shared-map state).
- Sync server: `../carddrop-sync/` (Worker `carddrop-sync` + D1 `carddrop-sync`, local git only). README there.
- Release: bump `APP_VERSION` + `version.json` + `CACHE` in sw.js (now carddrop-v30), commit, push, poll version.json.
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

## Session 4c (v2.2.2) — two-tab sync test (8795 = phone A, 8796 = phone B, separate storage)
- Passed: start, join (both directions merge), new house reaches partner in <7 s, partner note edit, partner delete.
- Fixed: open house sheet overwrote partner edits on Done (now saves only fields changed in the sheet); partner-deleted
  open house → closes with toast; deleteHouse splice(-1) guard; setBiz not reset while typing.
- D1 now has the owner's real map (team 514fe5…, 301 houses) + an empty team 112acc… (probably a double Start). Test team deleted.
- Partner sim script: node POST /sync with {code,since,changes} (see HISTORY).

## Session 4d (v2.2.3)
- House numbers on map: symbol layer `cd-done-num` (z16.5+), `hNum()` = h.num or number parsed from addr. "Left off" pill raised (offset -27).
- Location: Kalman predicts along GPS course when moving (no trailing), ignores late fixes; dot glides between fixes (`glideMe`).
- Facing cone: compass wins over GPS course (GPS only if no compass for 3 s), smoothed with wrap-around, redrawn on map rotate,
  landscape correction, skips bad iOS compass accuracy (>45). iPhone compass permission now asked on first tap anywhere (was only locate button).
- Compass/GPS not phone-tested (math tested in node).

## Session 4e (v2.2.4)
- Partner live location: Settings → Live location (Share switch, Your name, partner row → show on map). Sent with each
  /sync (dev id + me spot, throttled: moved >2 m / 15 s / turned >20°). Server table `presence` (latest spot only, 12 h).
  Partner = orange dot + name + facing cone; >45 s without update → gray, stays at last spot "Mike · 2 min ago"
  (kept in sync.peers so it survives no signal/reload). Turning off or leaving deletes it right away.
- Green (not-hit) dots now show house numbers: OSM `housenumber` points from openfreemap (invisible layer `cd-hnum-src`),
  matched to building outline (inside, else ≤12 m). Only where OSM has addresses.
- Gotcha: never set `position` on a MapLibre marker element (overrides its absolute positioning → marker drifts).
- Tested in two tabs + node partner script. Own location sending not testable in browser (no GPS).

## Session 4f (v2.2.5)
- Field test: owner saw partner ~150 m away while side by side. D1 presence: only partner sharing, acc 3 m → owner's own GPS likely the rough one
  (owner's dot had big accuracy glow; owner not sharing). Added partner accuracy circle + "rough spot" label (acc>30 m).
  Precise-Location toast only fires at >500 m.

## Session 4g (v2.2.6)
- Only GPS fixes with raw accuracy ≤30 m are shared (GOOD_ACC). Orange "Finding GPS… off by X ft" pill (#gpsWarn) after 4 s of rough fixes.
- Presence now carries sp (speed) + cr (GPS course); partner dot extrapolates along cr up to 6 s, redrawn every 1 s (smooth glide).
- Sync every 2–3 s while sharing or partner live (1 s ticker: tick%5 in {0,2}), else 5 s. Presence resend: moved >2 m / 10 s / turned.
- Test gotcha: navigating away from the app saves its old sync state on hide — set localStorage from another page (e.g. /version.json).

## Session 4h (v2.2.7)
- Map rotation on: two-finger twist (MapLibre inertia), no tilt (touchPitch off, maxPitch 0). Compass button (#btnCompass) under map
  buttons shows when bearing ≠ 0; tap → north. Locate: 1st tap = go to me, 2nd tap (me centered, z≥16) = "map turns with you"
  (headUp: map bearing follows headSm, throttled 250 ms/3°), 3rd tap = off + north. User drag/rotate ends headUp.
- Two-finger twist not testable in browser pane; compass + rotateTo verified.

## Session 4i (v2.2.8) — owner: facing direction still not showing
- Beam now 150 px, strong gradient, width = compass accuracy (18–55° half-angle, #meBeam path). Compass readings no longer
  dropped when webkitCompassAccuracy is poor (was >45 → ignored = likely cause); -1 = uncalibrated → wide beam + one figure-8 toast.
- Permission: first-tap listener retries until granted/denied; denied → toast with Settings › Apps › Safari › Motion & Orientation Access.
- Still needs phone test.

## Session 4j (v2.2.9) — owner's dot ~70 m behind while walking under trees
- Cause: Kalman trusted poor-accuracy fixes too little (R=acc², q=1 with no iOS speed) → huge lag. v2.2.3 made it worse (q 1.5→1).
- Now R=(0.35·acc)², q=max(3, 2·speed), and 2 fixes in a row outside their error circle → snap (k≥.85, reset v).
  Node sim (acc 50, no speed): lag 28–38 m → ~7 m; standing jitter ~2 m; 150 m outlier → 0.5 m; 70 m stale → 5 m in 3 fixes.
- Facing beam confirmed working on owner's phone (screenshot).

## Session 4k (v2.3.0) — owner's dot stopped updating (partner's fine)
- Filter now uses arrival time (Date.now), not p.timestamp; removed `t<kf.t` reject (one odd timestamp froze the dot forever).
  Readings the phone stamps >20 s old are skipped. Quick getCurrentPosition fix only used if no fix yet.
- restartGPS() on every return to the app + watchdog: no fix for 15 s while open → restart watch.
- Tested with fake GPS in _test.html (override navigator.geolocation before document.write): future timestamp → keeps moving;
  GPS silent → restarted after ~16 s, fixes resume.

## Open / unverified
- Nothing phone-tested by owner yet (multi-select, fast start, shared map, marker). Test teams deleted from D1 (0 teams).
- Anyone with a team code can read/edit that map (by design; 80-bit code). No way to rotate a code yet.

## NEXT ideas
- Owner + partner try the shared map on two phones. Possible: show who changed a house; rotate team code.

## This session's notes
- [[topics/2026-11-08-shared-map-sync|Shared map sync]] · [[topics/2026-11-08-left-off-marker|You left off here]] ·
  [[topics/2026-11-08-toast-above-select-bar|Toast above select bar]]
