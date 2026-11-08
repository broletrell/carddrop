---
tags: [bug-fix]
---
#bug-fix

**Links:** [[../HANDOFF|Card Drop status]] · [[../../../Projects|Projects hub]] · [[../../index.html|index.html]]

## What
Date field in "Add cards bought" / "Add job" ran off the right edge on iPhone (owner screenshot). Fixed v2.0.1.

## Why / context
iOS date inputs have a built-in minimum width that ignores width:100%. Fix: `.dinput` display:block, min-width:0, appearance:none, left-aligned.

## Status
Done, live; owner to confirm on phone.
