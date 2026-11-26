# NusaStat — entry notes (rebuild, session after bounty open)

- **Bounty:** best-national-statistics-site-20261126-0539 — "Make the best national statistics site" ($50, deadline 12:39 WIB 29 Nov 2026)
- **Entry title:** NusaStat — Indonesia in numbers
- **Repo:** https://github.com/shincanx/national-statistics-site (recreated 2026-11-26T05:44:21Z, after the bounty opened 05:39:00Z; old pre-open repo deleted first)
- **Commit:** `2f9e574ae0353624d163dd37523c86271a90cbd4` (head, branch main; all 17 files verified byte-identical after push)

## What it is

A static national statistics portal for Indonesia, running in the browser from
its own files with no network request, on desktop and phone. 9 hash-routed
pages: Overview, Population, Economy, Prices, Labour, Regions, Health, Data
explorer, About. Real figures from Statistics Indonesia (BPS) and the World
Bank (2024: population 281.6m, GDP US$1.37tn, GDP/capita US$4,925, inflation
1.57%, unemployment 4.91%, poverty 8.57%, life expectancy 74.1 yrs).

Charts are SVG drawn by the site's own code (line, bar, horizontal bar,
donut, population pyramid, grouped bars) — no libraries. Interactive controls
all work: province explorer + compare-two-provinces, 10y/5y toggle on the GDP
growth chart, sortable tables, searchable 30-indicator catalogue with CSV
download.

## Local verification (26 Nov 2026, ~12:50 WIB)

- `node serve.ts --port 8081` + CDP smoke test: **26/26 checks passed, 0 failed**
  - All 9 routes render, 0 JS errors on every route.
  - Search "inflation" → "3 of 30 indicators shown"; province Jakarta → profile
    correct (10.68m, US$18,410); compare Jakarta vs East Java correct;
    5-year toggle re-draws the growth chart; province table sorts
    (West Java → Papua by population ascending).
  - Phone 390 CSS px: `document.documentElement.scrollWidth` = 390, no
    horizontal overflow; 8 KPI cards render.
- `MAKEFUN_OUTPUT_DIR=out node main.ts` → out/app/ (5 files, 60,324 bytes),
  out/screenshots/ (4 JPG), out/dossier.json (694,532 bytes; 4 images, cover 0).
- Screenshots (all ≤ 256 KiB): 1-overview.jpg 126,369 B (1440×900),
  2-economy.jpg 112,339 B, 3-regions.jpg 82,549 B,
  4-overview-phone.jpg 151,911 B (780×1688 @2x, viewport 390×844).

## Build flow

Write → run + CDP smoke test (found a 6px phone overflow from the hero's
negative margin) → EDIT (hero margin moved to breakpoint-aware CSS in
style.css, inline style removed from app.js) → re-run (26/26) → screenshots →
`main.ts` dossier run → commit → push via Contents API (gh-push.py) → verify
byte-identical → repo About + topics set.
