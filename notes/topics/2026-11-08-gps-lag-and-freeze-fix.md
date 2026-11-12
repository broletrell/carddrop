---
tags: [bug-fix]
---
#bug-fix

**Links:** [[../HANDOFF|Card Drop status]] · [[../../../Projects|Projects hub]] · [[../../index.html|index.html]] · [[2026-11-08-gps-smoothing|GPS smoothing (v1.9.2, superseded)]]

## What
v2.2.9 + v2.3.0: own dot no longer trails ~70 m behind or freezes while the partner's keeps moving.

## Cause
- Lag: Kalman trusted rough fixes far too little (R=acc², q=1) when iOS reports no speed — worst under trees.
- Freeze: filter rejected any fix with a timestamp older than the last; one odd timestamp froze it for good. iOS also pauses location after screen lock/app switch.

## Fix
R=(0.35·acc)², q=max(3, 2·speed), two fixes outside their error circle → snap. Arrival time instead of phone timestamps; GPS restarted on return to the app and after 15 s with no fix.

## Status
Done, live. Tested with node sim + fake GPS (lag 28–38 m → ~7 m; restart after ~16 s). Needs a real walk.
