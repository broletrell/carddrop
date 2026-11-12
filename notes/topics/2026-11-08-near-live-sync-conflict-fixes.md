---
tags: [feature, bug-fix]
---
#feature #bug-fix

**Links:** [[../HANDOFF|Card Drop status]] · [[../../../Projects|Projects hub]] · [[../../index.html|index.html]] · [[2026-11-08-shared-map-sync|Shared map sync]]

## What
v2.2.1–v2.2.2: shared map checks for partner changes every 5 s while open (was 45 s), plus fixes for edits colliding with live updates.

## Why / context
Owner's friend "couldn't see houses" — no shared map had been started at all (D1 had 0 teams). Faster polling made collisions likely, so a two-tab test (8795 = phone A, 8796 = phone B) was run.

## Fixes
- Open house sheet saved stale notes/address/amount over a partner's newer edit on Done → snapshot `o0`, only save fields changed in the sheet.
- Partner deleted the open house → sheet closes with a toast; `deleteHouse` never splices -1 (used to delete the last house).
- Business name field not reset while typing.

## Status
Done, live. Two-tab test passed (start, join, add, edit, delete). Owner's real team 514fe5… (301 houses); an empty team 112acc… is probably a double Start.
