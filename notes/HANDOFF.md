# Card Drop — status

**Last updated:** 2026-11-07

## Status
- v1.0 built and tested in a phone-size preview: map, GPS dot, "Card Left Here", tap-a-house sheet
  (Card left / Talked / Booked / Skip), auto address, duplicate warning, nearby-house banner,
  Houses list (search, filters, grouped by street), Stats, Settings (business name, warning
  distance, follow me, backup/restore JSON, CSV export, delete all), undo, onboarding, app icon, offline.
- Map style picker (6 styles: Street, Colorful, Clean light, Dark, Satellite, Hybrid) added 2026-11-07.
- Update banner + Settings > Check for updates (v1.2, compares version.json).
- v1.3: fixed gap at bottom on iPhone home-screen app (sizes to screen.height in standalone; fixed elements now absolute in body). Not yet confirmed on phone.
- v1.4: switched Leaflet -> MapLibre + OpenFreeMap vector maps (sharp, like SafeRoute). Styles: Street(liberty), Bright, Clean light(positron), Dark, Satellite, Hybrid.
- v1.5: removed Card Left Here button; restyled side buttons (frosted group) + status buttons (icon cards); satellite sharper (Esri z20, tileSize 128 = retina); green dots on unhit houses = building centroids 55-900 m2 from OpenFreeMap building layer, injected into every style via setStyle transformStyle; hidden if a marked house within 14 m. OSM address points too sparse in Sacramento, so buildings used.
- LIVE at https://broletrell.github.io/carddrop/ (public repo broletrell/carddrop, Pages on main).

## Older context
- An earlier list-only version lives as a Claude artifact (claude.ai/artifact/S28T8u1Z3tvpHZUrh5nK67); doesn't sync with this.

## Next
- Owner installs on iPhone and tests real GPS.
- Not phone-tested yet: real GPS, iOS share sheet for backup, home-screen install.
