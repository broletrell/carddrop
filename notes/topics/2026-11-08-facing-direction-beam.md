---
tags: [bug-fix, feature]
---
#bug-fix #feature

**Links:** [[../HANDOFF|Card Drop status]] · [[../../../Projects|Projects hub]] · [[../../index.html|index.html]] · [[2026-11-08-gps-smoothing|GPS smoothing]]

## What
v2.2.3 + v2.2.8: the blue beam from your dot shows which way you're facing, like Apple Maps.

## Why / context
Owner: "not showing what direction I'm facing". Causes: faint 90 px cone, compass readings thrown away when iOS said accuracy >45°, compass permission failing silently.

## Fix
150 px bold beam; width follows compass accuracy (18–55°); never drops readings; figure-8 tip when uncalibrated; permission retried on taps, denied → toast with the Settings path. Compass beats GPS course; smoothed with wrap-around; redrawn on map rotate.

## Status
Done, confirmed working on owner's phone.
