---
tags: [feature]
---
#feature

**Links:** [[../HANDOFF|Card Drop status]] · [[../../../Projects|Projects hub]] · [[../../index.html|index.html]]

## What
Steadier, more accurate location dot (v1.9.2).

## Details
- Quick rough fix first, then high-accuracy watch. `smoothFix` Kalman weights each fix by accuracy (faster when moving), so outliers can't yank the dot.
- First zoom-in waits ≤4 s for a ≤60 m fix. Faint accuracy ring when rough. One-time "turn on Precise Location" toast if fixes stay >500 m.

## Status
Done, live. Fake-GPS test: settles within 0–2 m, 220 m outlier ignored.
