---
tags: [feature, infra]
---
#feature #infra

**Links:** [[../HANDOFF|Card Drop status]] · [[../../../Projects|Projects hub]] · [[../../index.html|index.html]] · [[2026-11-08-left-off-marker|Left-off marker]]

## What
v2.2.0 Shared map: owner + partner see the same houses (status, amount, notes, history), card buys and jobs. Settings/map style stay per phone.

## Details
- Server `../carddrop-sync/` (Worker + D1). Team code 16 chars; only its SHA-256 stored. `/sync` pushes + pulls in one D1 batch (transaction) with a per-team seq cursor.
- Client: every save fingerprints records vs last known (`snap`), queues changes/tombstones in `out`, sends after 1.5 s. Remote applies only if remote `mt` is newer than local record and pending edit.
- Remote records cleaned (`syncClean`): unknown history statuses dropped (history label renders unescaped).
- Join merges local data into the shared map; Delete-all warns it hits the partner too.

## Status
Done, live. Tested: two-way sync, conflict (older loses), delete, job, join, leave, offline queue, XSS text. Not phone-tested.
