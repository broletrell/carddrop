---
tags: [feature]
---
#feature

**Links:** [[../HANDOFF|Card Drop status]] · [[../../../Projects|Projects hub]] · [[../../index.html|index.html]] · [[2026-11-08-shared-map-sync|Shared map]]

## What
v2.2.0 white "You left off here" pill above the last house added/changed on this phone; tap opens the house.

## Details
- `trackLast()` in persist compares status/notes/amount/history length/position, so background address fills don't move it. >60 changes at once (restore) ignored.
- Saved as `settings.lastHouse` (per phone); synced partner edits don't count. First run falls back to the most recently updated house.

## Status
Done, live; not phone-tested.
