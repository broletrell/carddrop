---
tags: [feature, infra]
---
#feature #infra

**Links:** [[../HANDOFF|Card Drop status]] · [[../../../Projects|Projects hub]] · [[../../index.html|index.html]] · [[2026-11-08-shared-map-sync|Shared map sync]]

## What
v2.2.4–v2.2.6: see your partner live on the map while passing out cards. Settings → Live location: Share switch, Your name, partner row (tap → show on map).

## How
- Rides on `/sync`: phone sends `dev` + `me{name,lat,lng,acc,hd,sp,cr}` (or `off:1`); server keeps the latest spot per phone in D1 `presence` (rows >12 h deleted) and returns `peers`.
- Orange dot + name + facing cone + accuracy circle; "rough spot" if acc >30 m. Extrapolates along walking course ≤6 s, redrawn every 1 s.
- No update for 45 s → gray dot stays at last spot "Mike · 2 min ago" (owner asked for this); kept in `sync.peers` so it survives no signal.
- Only fixes with raw accuracy ≤30 m are sent. Sync every 2–3 s while live.

## Status
Done, live, working in the field (owner saw partner). Gotcha: never set CSS `position` on a MapLibre marker element.
