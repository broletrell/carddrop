---
tags: [bug-fix]
---
#bug-fix

**Links:** [[../HANDOFF|Card Drop status]] · [[../../../Projects|Projects hub]] · [[../../index.html|index.html]] · [[2026-11-08-multi-select-houses|Multi-select]]

## What
Owner screenshot: "Marked 1 house Card left / Undo" banner covered the multi-select Card left/Talked/Skip buttons. Fixed v2.2.0.

## Why / context
`placeToast()` lifts the toast above `#selAct` when select mode is on; re-run on each toast, tab switch and select toggle.

## Status
Done, live; owner to confirm.
