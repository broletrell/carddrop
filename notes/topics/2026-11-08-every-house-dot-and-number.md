---
tags: [feature, decision]
---
#feature #decision

**Links:** [[../HANDOFF|Card Drop status]] · [[../../../Projects|Projects hub]] · [[../../index.html|index.html]] · [[2026-11-08-left-off-marker|Left-off marker]]

## What
v2.3.1: every house shows a green dot with its house number, from Sacramento County's official address points (Overture `addresses.pmtiles`, OpenAddresses source).

## Why / context
Dots used to come only from building outlines (some houses never traced → no dot) and numbers from OpenStreetMap (many missing). v2.2.3/v2.2.4 attempts (marked-house labels, OSM numbers) weren't enough. Checked first: county data covers Roman Oak Way / River Ranch Way completely.

## How
`addrPts()` dedupes number|street, title-cases street; OSM points fill gaps; building centroids only add a numberless dot where no address exists. Marked houses missing a number take the nearest address ≤15 m. Tapping a dot uses its number + street directly. Base map gray numbers hidden.

## Status
Done, live. Needs signal the first time an area loads.
