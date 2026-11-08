---
tags: [feature, infra]
---
#feature #infra

**Links:** [[../HANDOFF|Card Drop status]] · [[../../../Projects|Projects hub]] · [[../../sw.js|sw.js]] · [[../../index.html|index.html]]

## What
Faster launch (v1.9.2): app page + map index load from phone cache instantly and refresh in background; Overture house outline pieces cached; map style built once.

## Why / context
Owner: dots, outlines and location slow on launch. Causes: network-first app page, second full `setStyle` after pmtiles loaded, Overture range downloads never cached.

## Status
Done, live. Overture pieces stored as 200 under `url?bytes=…`, replayed as 206 with saved ETag. Only tested in a node mock — watch for blank outlines on iPhone.
