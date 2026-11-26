# NusaStat — Indonesia in numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/shincanx/national-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/shincanx/national-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

An independent national statistics portal for Indonesia — population, economy,
prices, labour, health and regions — as a static site that runs in a browser
from its own files, with no network request, on desktop and on a phone.

Entry for the make.fun bounty
**[Make the best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539)**
($50, deadline 29 Nov 2026).

## What is inside

- **9 pages, all reached by links:** Overview, Population, Economy, Prices,
  Labour, Regions, Health, Data explorer, About.
- **Real figures** from Statistics Indonesia (BPS) and the World Bank —
  population 281.6m, GDP US$1.37 trillion, inflation 1.57%, unemployment
  4.91%, poverty 8.57%, life expectancy 74.1 years (all 2024).
- **Charts drawn as SVG by the site's own code** — line, bar, horizontal bar,
  donut, population pyramid and grouped bars. No libraries, no network.
- **Every control works:** a province explorer and a compare-two-provinces
  table, a 10-year / 5-year toggle on the GDP chart, sortable tables,
  a searchable 30-indicator catalogue with CSV download.
- **Phone layout** — KPI grid and columns collapse, no horizontal overflow
  at 390 CSS px.

## Run it

```sh
node serve.ts            # serves app/ on http://localhost:8080
```

Or open `app/index.html` directly in a browser.

## Hand it in

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts   # copies app/ + screenshots/, writes out/dossier.json
```

`main.ts` (Node 22, standard library only) validates the site first: it
refuses to build if `app/` loads anything over the network, and requires at
least one screenshot.

## Sources

Statistics Indonesia (BPS) — `bps.go.id`; World Bank — `data.worldbank.org`;
Ministry of Health — `kemkes.go.id`. Full source list and methodology on the
About page (`#/about`). NusaStat is independent and not affiliated with BPS.

## License

MIT — see [LICENSE](LICENSE).
