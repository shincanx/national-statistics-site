// NusaStat — hash router + nine views + interactive controls.
// Plain scripts, no build step, no network. DATA and CHARTS come from data.js / charts.js.
(function () {
  'use strict';
  const D = DATA, C = CHARTS;
  const app = document.getElementById('app');
  const SRC = 'Source: Statistics Indonesia (BPS)';
  const SRC_WB = 'Source: World Bank';

  const fmtInt = n => Math.round(n).toLocaleString('en-US');
  const fmt1 = n => Number(n).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const fmt2 = n => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function kpi(label, value, meta, source) {
    return `<div class="card kpi"><div class="kpi-label">${label}</div>` +
      `<div class="kpi-value">${value}</div><div class="kpi-meta">${meta}</div>` +
      `<div class="kpi-source">${source}</div></div>`;
  }
  function section(title, body, source) {
    return `<div class="card"><div class="section-head"><h3>${title}</h3>` +
      (source ? `<span class="src">${source}</span>` : '') + `</div>${body}</div>`;
  }
  function pageHead(title, intro, source) {
    return `<h2>${title}</h2><p>${intro}</p>` + (source ? `<p class="chart-note">${source}</p>` : '');
  }

  // ---- Sortable tables -------------------------------------------------
  // Any table with data-sortable gets click-to-sort headers. `rows` is an
  // array of arrays; `cols` describes each column {label, num}.
  function sortableTable(id, cols, rows, caption) {
    const ths = cols.map((c, i) =>
      `<th class="sortable" data-col="${i}" data-num="${c.num ? 1 : 0}">${c.label}</th>`).join('');
    const body = rows.map(r =>
      '<tr>' + r.map((cell, i) =>
        `<td${cols[i].num ? ' data-v="' + cell + '"' : ''}>${cell}</td>`).join('') + '</tr>').join('');
    return `<div class="table-wrap"><table class="data" id="${id}" data-sortable="1">` +
      (caption ? `<caption style="text-align:left;padding:6px 0;font-weight:700;color:#12314e">${caption}</caption>` : '') +
      `<thead><tr>${ths}</tr></thead><tbody>${body}</tbody></table></div>`;
  }
  function wireSorting(root) {
    root.querySelectorAll('table[data-sortable]').forEach(tbl => {
      const state = { col: -1, dir: 1 };
      tbl.querySelectorAll('th.sortable').forEach(th => {
        th.addEventListener('click', () => {
          const col = +th.dataset.col, num = th.dataset.num === '1';
          state.dir = state.col === col ? -state.dir : 1;
          state.col = col;
          const tbody = tbl.querySelector('tbody');
          const rows = [...tbody.querySelectorAll('tr')];
          rows.sort((a, b) => {
            const av = a.cells[col].textContent.trim(), bv = b.cells[col].textContent.trim();
            const cmp = num ? parseFloat(av.replace(/[^0-9.\-]/g, '')) - parseFloat(bv.replace(/[^0-9.\-]/g, ''))
              : av.localeCompare(bv);
            return cmp * state.dir;
          });
          rows.forEach(r => tbody.appendChild(r));
          tbl.querySelectorAll('th').forEach(h => h.style.background = '');
          th.style.background = '#d7e4ea';
        });
      });
    });
  }

  // ---- Views -----------------------------------------------------------
  function viewOverview() {
    const F = D.FACTS;
    const top8 = [...D.PROVINCES].sort((a, b) => b.pop - a.pop).slice(0, 8)
      .map(p => ({ name: p.name, value: p.pop }));
    const releases = D.RELEASES.map(r =>
      `<li><span class="rel-date">${r.date}</span><a href="${r.route}">${C.esc(r.title)}</a></li>`).join('');
    return `
    <section class="hero">
      <h1>Indonesia in numbers</h1>
      <p class="lede">281.6 million people, the world's fourth-largest population, a US$1.37 trillion
      economy growing at 5% a year — explored province by province, indicator by indicator.</p>
      <p class="updated">Latest data: 2024 annual figures · Updated November 2026</p>
      <div class="chips">
        <a class="chip" href="#/population">Population</a><a class="chip" href="#/economy">Economy</a>
        <a class="chip" href="#/prices">Prices</a><a class="chip" href="#/labour">Labour</a>
        <a class="chip" href="#/regions">Regions</a><a class="chip" href="#/health">Health</a>
        <a class="chip" href="#/data">Data explorer</a><a class="chip" href="#/about">About</a>
      </div>
    </section>
    <div class="kpi-grid">
      ${kpi('Population', '281.6m', `+${fmt1(F.popGrowth)}% in 2024 · median age ${fmt1(F.medianAge)}`, SRC)}
      ${kpi('GDP', 'US$1,371bn', `Real growth ${fmt2(F.gdpGrowth)}% in 2024`, SRC)}
      ${kpi('GDP per capita', 'US$' + fmtInt(F.gdpPerCapita), 'World Bank, current US$', SRC_WB)}
      ${kpi('Inflation (CPI)', fmt2(F.inflation) + '%', 'Average 2024 · down from 2.61% in 2023', SRC)}
      ${kpi('Unemployment', fmt2(F.unemployment) + '%', 'Lowest since 2015 · labour force 152.1m', SRC)}
      ${kpi('Poverty rate', fmt2(F.poverty) + '%', 'Down from 11.13% in 2015', SRC)}
      ${kpi('Life expectancy', fmt1(F.lifeExpectancy) + ' yrs', 'Up from 70.8 in 2015', SRC)}
      ${kpi('Gini ratio', fmt2(F.gini) + '', 'March 2024 · HDI 75.02', SRC)}
    </div>
    <div class="two-col">
      ${section('Real GDP growth, 2015–2024',
        `<div class="chart-box">${C.lineChart(D.GDP_GROWTH, D.YEARS, { label: 'Real GDP growth 2015-2024', suffix: '%', decimals: 2 })}</div>
         <p class="chart-note">The 2020 contraction (−2.07%) was the pandemic year; growth returned above 5% from 2022.</p>`, SRC)}
      ${section('Population, 2015–2024',
        `<div class="chart-box">${C.lineChart(D.POPULATION, D.YEARS, { label: 'Population 2015-2024', suffix: 'm' })}</div>
         <p class="chart-note">2020 is the census year. Growth slowed to 0.79% a year by 2024.</p>`, SRC)}
    </div>
    <div class="two-col">
      ${section('Largest provinces by population, 2024',
        `<div class="chart-box">${C.hbarChart(top8, { label: 'Largest provinces 2024', suffix: 'm' })}</div>
         <p class="chart-note">Java holds about 56% of all Indonesians on 7% of the land.</p>`, SRC)}
      <div class="card"><div class="section-head"><h3>Latest releases</h3></div>
        <ul class="release-list">${releases}</ul></div>
    </div>`;
  }

  function viewPopulation() {
    const F = D.FACTS;
    const rows = [...D.PROVINCES].map(p => [p.name, fmt1(p.pop), fmtInt(p.density), fmt2(p.poverty) + '%', fmt2(p.unemp) + '%']);
    return pageHead('Population', 'Indonesia is the world’s fourth most populous country. ' +
      'Growth is slowing, the population is urbanising, and the working-age share is near its peak — the demographic dividend window.', SRC) + `
    <div class="kpi-grid">
      ${kpi('Age 0–14', fmt1(F.age0to14) + '%', 'Children, 2024', SRC)}
      ${kpi('Age 15–64', fmt1(F.age15to64) + '%', 'Working age, 2024', SRC)}
      ${kpi('Age 65+', fmt1(F.age65plus) + '%', 'Older people, 2024', SRC)}
      ${kpi('Median age', fmt1(F.medianAge) + ' yrs', 'Urban share ' + fmt1(F.urban) + '%', SRC)}
      ${kpi('Density', fmtInt(F.density) + '/km²', 'National average; Jakarta 16,135', SRC)}
      ${kpi('Dependency ratio', fmt1(F.dependency), 'Dependents per 100 working-age', SRC)}
      ${kpi('Sex ratio', fmt1(F.sexRatio), 'Males per 100 females', SRC)}
      ${kpi('Population 2024', '281.6m', 'Census 2020: 270.2m', SRC)}
    </div>
    <div class="two-col">
      ${section('Age pyramid, 2024 — % of population',
        `<div class="chart-box">${C.pyramidChart(D.PYRAMID)}</div>
         <p class="chart-note">A wide base that is narrowing: each younger cohort is only slightly larger than the one above it.</p>`, SRC)}
      ${section('Population, 2015–2024',
        `<div class="chart-box">${C.lineChart(D.POPULATION, D.YEARS, { label: 'Population 2015-2024', suffix: 'm' })}</div>
         <p class="chart-note">Annual growth fell from about 1.3% in 2015 to 0.79% in 2024.</p>`, SRC)}
    </div>
    <div class="card" style="margin-top:16px"><div class="section-head"><h3>Provinces, 2024 — click a column header to sort</h3></div>
      ${sortableTable('prov-table',
        [{ label: 'Province' }, { label: 'Population (m)', num: true }, { label: 'Density /km²', num: true },
         { label: 'Poverty %', num: true }, { label: 'Unemployment %', num: true }], rows)}
      <p class="chart-note">Source: BPS. Twenty largest provinces by population.</p></div>`;
  }

  let econYears = 10; // toggle state for the GDP growth chart
  function viewEconomy() {
    const F = D.FACTS;
    const years = econYears === 10 ? D.YEARS : D.YEARS.slice(5);
    const growth = econYears === 10 ? D.GDP_GROWTH : D.GDP_GROWTH.slice(5);
    const gdpPc = econYears === 10 ? D.GDP_PER_CAPITA : D.GDP_PER_CAPITA.slice(5);
    return pageHead('Economy', 'Southeast Asia’s largest economy: US$1.37 trillion in 2024, ' +
      'growing around 5% a year, driven by manufacturing, trade and agriculture, with a trade surplus of US$31 billion.', SRC) + `
    <div class="kpi-grid">
      ${kpi('GDP 2024', 'US$1,371bn', 'World’s 16th largest economy', SRC + ' / ' + SRC_WB)}
      ${kpi('Real growth', fmt2(F.gdpGrowth) + '%', '2024 · 5.31% in 2022', SRC)}
      ${kpi('GDP per capita', 'US$' + fmtInt(F.gdpPerCapita), 'Current US$, World Bank', SRC_WB)}
      ${kpi('Trade surplus', 'US$' + F.tradeSurplus + 'bn', 'Exports US$264.7bn · imports US$233.7bn', SRC)}
    </div>
    <div class="two-col">
      <div class="card"><div class="section-head"><h3>Real GDP growth</h3><span class="src">${SRC}</span></div>
        <div class="controls"><span class="toggle-group" role="group" aria-label="Range">
          <button class="btn ghost ${econYears === 10 ? 'active' : ''}" data-range="10">10 years</button>
          <button class="btn ghost ${econYears === 5 ? 'active' : ''}" data-range="5">5 years</button>
        </span></div>
        <div class="chart-box" id="growth-chart">${C.lineChart(growth, years, { label: 'Real GDP growth', suffix: '%', decimals: 2 })}</div>
        <p class="chart-note">Switch between the full decade and the last five years — the chart re-draws.</p></div>
      ${section('GDP per capita, current US$',
        `<div class="chart-box">${C.lineChart(gdpPc, D.YEARS, { label: 'GDP per capita 2015-2024', decimals: 0 })}</div>
         <p class="chart-note">Per-capita income dipped in the pandemic year, then passed US$4,900 by 2023.</p>`, SRC_WB)}
    </div>
    <div class="two-col">
      ${section('Where GDP comes from, 2024',
        C.donutChart(D.SECTORS, { label: 'GDP by sector 2024' }) +
        `<p class="chart-note">Manufacturing is the single largest sector at 18.7% of GDP.</p>`, SRC)}
      ${section('Exports vs imports, 2015–2024 (US$ bn)',
        `<div class="chart-box">${C.groupedBarChart(D.EXPORTS, D.IMPORTS, D.YEARS, 'Exports', 'Imports')}</div>
         <p class="chart-note">Exports jumped in 2021–2022 on commodity prices; the surplus reached US$54.5bn in 2022.</p>`, SRC)}
    </div>`;
  }

  function viewPrices() {
    const rows = D.YEARS.map((y, i) => [String(y), fmt2(D.INFLATION[i]) + '%', fmt2(D.POVERTY[i]) + '%']);
    return pageHead('Prices', 'Consumer price inflation averaged 1.57% in 2024 — the lowest in the decade — ' +
      'after the 5.51% spike of 2022, when administered fuel prices were raised.', SRC) + `
    <div class="kpi-grid">
      ${kpi('CPI inflation 2024', '1.57%', 'Average · lowest since 2015', SRC)}
      ${kpi('Highest group', '3.35%', 'Personal care & other services', SRC)}
      ${kpi('Lowest group', '−0.21%', 'Information & communication', SRC)}
      ${kpi('2022 peak', '5.51%', 'Fuel-price adjustment year', SRC)}
    </div>
    <div class="two-col">
      ${section('CPI inflation, 2015–2024',
        `<div class="chart-box">${C.lineChart(D.INFLATION, D.YEARS, { label: 'CPI inflation 2015-2024', suffix: '%', decimals: 2 })}</div>
         <p class="chart-note">Inflation stayed inside Bank Indonesia’s 2–4% target band in most years.</p>`, SRC)}
      ${section('Inflation by expenditure group, 2024',
        `<div class="chart-box">${C.hbarChart(D.CPI_GROUPS.map(g => ({ name: g.name, value: g.value })), { label: 'CPI groups 2024', suffix: '%', decimals: 2 })}</div>
         <p class="chart-note">Only information &amp; communication prices fell in 2024.</p>`, SRC)}
    </div>
    <div class="card" style="margin-top:16px"><div class="section-head"><h3>Inflation vs poverty, by year — click a column header to sort</h3></div>
      ${sortableTable('cpi-table',
        [{ label: 'Year', num: true }, { label: 'CPI inflation %', num: true }, { label: 'Poverty %', num: true }], rows)}
      <p class="chart-note">Source: BPS. Poverty fell in every year inflation stayed below 3%, except the pandemic years.</p></div>`;
  }

  function viewLabour() {
    const F = D.FACTS;
    const rows = [...D.PROVINCES].sort((a, b) => a.unemp - b.unemp)
      .map(p => [p.name, fmt2(p.unemp) + '%', fmt2(p.poverty) + '%', fmtInt(p.density)]);
    return pageHead('Labour', 'Unemployment fell to 4.91% in 2024, the lowest in a decade, ' +
      'but 59.1% of workers are still informal and 28.3% work in agriculture.', SRC) + `
    <div class="kpi-grid">
      ${kpi('Unemployment', fmt2(F.unemployment) + '%', 'August 2024 · 7.47m people', SRC)}
      ${kpi('Participation', fmt2(F.participation) + '%', 'Labour force ' + fmt1(F.labourForce) + 'm', SRC)}
      ${kpi('Informal workers', fmt1(F.informal) + '%', 'Of all employed people', SRC)}
      ${kpi('Agriculture', fmt1(F.agriWorkers) + '%', 'Largest single employer', SRC)}
    </div>
    <div class="two-col">
      ${section('Unemployment rate, 2015–2024',
        `<div class="chart-box">${C.lineChart(D.UNEMPLOYMENT, D.YEARS, { label: 'Unemployment 2015-2024', suffix: '%', decimals: 2 })}</div>
         <p class="chart-note">The pandemic pushed unemployment to 7.07% in 2020; it has fallen every year since.</p>`, SRC)}
      ${section('Workers by sector, August 2024',
        `<div class="chart-box">${C.hbarChart(D.WORKERS.map(w => ({ name: w.name, value: w.share })), { label: 'Workers by sector', suffix: '%' })}</div>
         <p class="chart-note">Services together employ more than half of all workers.</p>`, SRC)}
    </div>
    <div class="card" style="margin-top:16px"><div class="section-head"><h3>Unemployment by province, 2024 — click a column header to sort</h3></div>
      ${sortableTable('lab-table',
        [{ label: 'Province' }, { label: 'Unemployment %', num: true }, { label: 'Poverty %', num: true }, { label: 'Density /km²', num: true }], rows)}
      <p class="chart-note">Source: BPS. Bali has the lowest unemployment (2.44%); West Java the highest (6.90%).</p></div>`;
  }

  function provinceOptions(selected) {
    return D.PROVINCES.map(p => `<option value="${C.esc(p.name)}"${p.name === selected ? ' selected' : ''}>${C.esc(p.name)}</option>`).join('');
  }
  function profileCard(p) {
    const F = D.FACTS;
    const share = (p.pop / 281.6 * 100);
    const vs = (v, nat, unit, invert) => {
      const diff = v - nat;
      const better = invert ? diff < 0 : diff > 0;
      const word = diff === 0 ? 'same as' : (diff > 0 ? 'above' : 'below');
      return `${fmt1(Math.abs(diff))}${unit} ${word} national (${better ? 'better' : 'worse'})`;
    };
    return `<div class="card"><div class="section-head"><h3>${C.esc(p.name)}</h3><span class="src">2024 · Source: BPS</span></div>
      <p>${C.esc(p.name)} is home to ${fmt2(p.pop)} million people — ${fmt1(share)}% of Indonesia.</p>
      <div class="profile-kpis">
        <div class="mini"><div class="l">Population</div><div class="v">${fmt2(p.pop)}m</div><div class="d">${fmt1(share)}% of national</div></div>
        <div class="mini"><div class="l">Density</div><div class="v">${fmtInt(p.density)}/km²</div><div class="d">National: 148/km²</div></div>
        <div class="mini"><div class="l">GDP per capita</div><div class="v">US$${fmtInt(p.gdpPc)}</div><div class="d">${vs(p.gdpPc, 4925, '', false)} — national US$4,925</div></div>
        <div class="mini"><div class="l">Poverty</div><div class="v">${fmt2(p.poverty)}%</div><div class="d">${vs(p.poverty, 8.57, ' pp', true)} — national 8.57%</div></div>
        <div class="mini"><div class="l">Unemployment</div><div class="v">${fmt2(p.unemp)}%</div><div class="d">${vs(p.unemp, 4.91, ' pp', true)} — national 4.91%</div></div>
      </div></div>`;
  }
  function compareTable(a, b) {
    const rows = [
      ['Population (million)', fmt2(a.pop), fmt2(b.pop)],
      ['GDP per capita (US$)', fmtInt(a.gdpPc), fmtInt(b.gdpPc)],
      ['Poverty (%)', fmt2(a.poverty), fmt2(b.poverty)],
      ['Unemployment (%)', fmt2(a.unemp), fmt2(b.unemp)],
      ['Density (people/km²)', fmtInt(a.density), fmtInt(b.density)],
    ];
    return `<div class="table-wrap"><table class="data"><thead><tr><th>Indicator</th><th>${C.esc(a.name)}</th><th>${C.esc(b.name)}</th></tr></thead>
      <tbody>${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table></div>`;
  }

  let regionSel = 'Jakarta', regionA = 'Jakarta', regionB = 'East Java';
  function viewRegions() {
    const p = D.PROVINCES.find(x => x.name === regionSel) || D.PROVINCES[0];
    const a = D.PROVINCES.find(x => x.name === regionA) || D.PROVINCES[0];
    const b = D.PROVINCES.find(x => x.name === regionB) || D.PROVINCES[1];
    const top10 = [...D.PROVINCES].sort((x, y) => y.gdpPc - x.gdpPc).slice(0, 10)
      .map(x => ({ name: x.name, value: x.gdpPc }));
    return pageHead('Regions', 'Indonesia spans 38 provinces across more than 17,000 islands. ' +
      'Pick a province to see its profile, or compare any two head to head.', SRC) + `
    <div class="card"><div class="section-head"><h3>Province explorer</h3></div>
      <div class="controls"><label for="prov-select">Province</label>
        <select id="prov-select">${provinceOptions(regionSel)}</select></div>
      <div id="prov-profile">${profileCard(p)}</div></div>
    <div class="card" style="margin-top:16px"><div class="section-head"><h3>Compare two provinces</h3></div>
      <div class="controls">
        <select id="cmp-a" aria-label="First province">${provinceOptions(regionA)}</select>
        <span class="vs">vs</span>
        <select id="cmp-b" aria-label="Second province">${provinceOptions(regionB)}</select>
      </div>
      <div id="cmp-table">${compareTable(a, b)}</div></div>
    <div class="card" style="margin-top:16px"><div class="section-head"><h3>Richest provinces — GDP per capita, 2024</h3><span class="src">${SRC}</span></div>
      <div class="chart-box">${C.hbarChart(top10, { label: 'Top 10 GDP per capita', decimals: 0 })}</div>
      <p class="chart-note">Jakarta (US$18,410) and resource-rich East Kalimantan (US$13,820) lead by a wide margin; the national figure is US$4,925.</p></div>`;
  }

  function viewHealth() {
    const F = D.FACTS;
    const facts = D.HEALTH_FACTS.map(f => `<li><span>${C.esc(f.label)}</span><b>${C.esc(f.value)}</b></li>`).join('');
    return pageHead('Health & education', 'Indonesians live longer and study longer than a decade ago: ' +
      'life expectancy reached 74.1 years in 2024 and the Human Development Index 75.02.', SRC) + `
    <div class="kpi-grid">
      ${kpi('Life expectancy', fmt1(F.lifeExpectancy) + ' yrs', 'Up 3.3 years since 2015', SRC)}
      ${kpi('HDI', fmt2(F.hdi), 'High human development', SRC)}
      ${kpi('Literacy', fmt1(F.literacy) + '%', 'Ages 15 and over', SRC)}
      ${kpi('Mean schooling', fmt1(F.meanSchooling) + ' yrs', 'Expected: ' + fmt1(F.expectedSchooling) + ' yrs', SRC)}
    </div>
    <div class="two-col">
      ${section('Life expectancy, 2015–2024',
        `<div class="chart-box">${C.lineChart(D.LIFE_EXPECTANCY, D.YEARS, { label: 'Life expectancy 2015-2024', suffix: ' yrs' })}</div>
         <p class="chart-note">Steady gains every year, including through the pandemic.</p>`, SRC)}
      ${section('Poverty rate, 2015–2024',
        `<div class="chart-box">${C.lineChart(D.POVERTY, D.YEARS, { label: 'Poverty 2015-2024', suffix: '%', decimals: 2 })}</div>
         <p class="chart-note">Poverty fell from 11.13% to 8.57% — about 24 million people in 2024.</p>`, SRC)}
    </div>
    <div class="card" style="margin-top:16px"><div class="section-head"><h3>Health &amp; education in focus</h3><span class="src">${SRC} · Ministry of Health</span></div>
      <ul class="fact-list">${facts}</ul></div>`;
  }

  let dataQuery = '', dataTopic = 'All';
  function dataRows() {
    const q = dataQuery.trim().toLowerCase();
    return D.INDICATORS.filter(ind =>
      (dataTopic === 'All' || ind.topic === dataTopic) &&
      (!q || ind.name.toLowerCase().includes(q) || ind.topic.toLowerCase().includes(q)));
  }
  function viewData() {
    const topics = ['All', ...new Set(D.INDICATORS.map(i => i.topic))];
    const rows = dataRows();
    const body = rows.map(ind =>
      `<tr><td>${C.esc(ind.name)}</td><td>${C.esc(ind.topic)}</td><td>${C.esc(ind.unit)}</td><td>${fmt2(ind.latest)}</td><td>${ind.year}</td><td>${C.esc(ind.source)}</td></tr>`).join('');
    return pageHead('Data explorer', 'Every headline indicator on this site, in one searchable catalogue. ' +
      'Filter by topic, search by name, or download the whole table as CSV.', SRC) + `
    <div class="card">
      <div class="controls">
        <input type="search" id="data-search" placeholder="Search indicators…" value="${C.esc(dataQuery)}" aria-label="Search indicators">
        <select id="data-topic" aria-label="Filter by topic">${topics.map(t => `<option${t === dataTopic ? ' selected' : ''}>${t}</option>`).join('')}</select>
        <button class="btn" id="data-csv">Download CSV</button>
      </div>
      <p class="count-line" id="data-count">${rows.length} of ${D.INDICATORS.length} indicators shown</p>
      <div class="table-wrap"><table class="data" id="data-table">
        <thead><tr><th>Indicator</th><th>Topic</th><th>Unit</th><th>Latest value</th><th>Year</th><th>Source</th></tr></thead>
        <tbody>${body || '<tr><td colspan="6" class="empty-note">No indicators match your search.</td></tr>'}</tbody>
      </table></div>
      <p class="chart-note">Values are the latest annual figure for each indicator. Full series are on each topic page.</p>
    </div>`;
  }

  function viewAbout() {
    return pageHead('About NusaStat', 'NusaStat is an independent statistics portal built to make ' +
      'Indonesia’s official numbers easy to explore. It is not Statistics Indonesia (BPS) and is not affiliated with it.', '') + `
    <div class="two-col">
      <div class="card"><div class="section-head"><h3>Sources</h3></div>
        <ul class="fact-list">
          <li><span>Statistics Indonesia (BPS)</span><b>bps.go.id</b></li>
          <li><span>World Bank — GDP per capita</span><b>data.worldbank.org</b></li>
          <li><span>Ministry of Health — stunting</span><b>kemkes.go.id</b></li>
        </ul>
        <p class="chart-note">Figures are the latest published annual values available in November 2026. Where a series was revised, the revised value is used.</p></div>
      <div class="card"><div class="section-head"><h3>BPS release calendar</h3></div>
        <ul class="fact-list">
          <li><span>Consumer Price Index</span><b>1st of each month</b></li>
          <li><span>Exports &amp; imports</span><b>15th of each month</b></li>
          <li><span>GDP growth (quarterly)</span><b>Early Feb / May / Aug / Nov</b></li>
          <li><span>Labour Force Survey</span><b>May &amp; November</b></li>
          <li><span>Poverty rate</span><b>January &amp; July</b></li>
          <li><span>Human Development Index</span><b>November</b></li>
        </ul></div>
    </div>
    <div class="card" style="margin-top:16px"><div class="section-head"><h3>Methodology — how each series is built</h3></div>
      <ol class="method">
        <li><b>Population.</b> Intercensal estimates from BPS, anchored on the 2020 census (270.2 million). Growth rates are year-on-year.</li>
        <li><b>GDP growth.</b> Real (constant-price) growth from BPS national accounts; 2020 uses the pandemic-year base.</li>
        <li><b>GDP per capita.</b> Current US$ from the World Bank (Atlas method), not BPS rupiah figures converted at market rates.</li>
        <li><b>Inflation.</b> Average annual CPI change from BPS; group figures are the 2024 annual averages by expenditure group.</li>
        <li><b>Unemployment.</b> Open unemployment rate (TPT) from the August Sakernas labour force survey.</li>
        <li><b>Poverty.</b> Headcount ratio against the BPS poverty line, March and September rounds; the annual figure shown is September.</li>
        <li><b>Health &amp; education.</b> Life expectancy and HDI from BPS; stunting from the Ministry of Health’s nutrition survey; literacy and schooling from Susenas.</li>
      </ol></div>`;
  }

  // ---- Router ----------------------------------------------------------
  const ROUTES = {
    '/': viewOverview, '/population': viewPopulation, '/economy': viewEconomy,
    '/prices': viewPrices, '/labour': viewLabour, '/regions': viewRegions,
    '/health': viewHealth, '/data': viewData, '/about': viewAbout,
  };
  function currentRoute() {
    const hash = location.hash.replace(/^#/, '') || '/';
    return ROUTES[hash] ? hash : '/';
  }
  function render() {
    const route = currentRoute();
    app.innerHTML = ROUTES[route]();
    document.querySelectorAll('.main-nav a').forEach(a =>
      a.classList.toggle('active', a.dataset.nav === route));
    wireSorting(app);
    wireRouteControls(route);
    window.scrollTo(0, 0);
  }
  function wireRouteControls(route) {
    if (route === '/economy') {
      app.querySelectorAll('[data-range]').forEach(btn => btn.addEventListener('click', () => {
        econYears = +btn.dataset.range;
        render();
      }));
    }
    if (route === '/regions') {
      const sel = document.getElementById('prov-select');
      sel.addEventListener('change', () => {
        regionSel = sel.value;
        document.getElementById('prov-profile').innerHTML =
          profileCard(D.PROVINCES.find(x => x.name === regionSel));
      });
      const a = document.getElementById('cmp-a'), b = document.getElementById('cmp-b');
      const refresh = () => {
        regionA = a.value; regionB = b.value;
        document.getElementById('cmp-table').innerHTML = compareTable(
          D.PROVINCES.find(x => x.name === regionA),
          D.PROVINCES.find(x => x.name === regionB));
      };
      a.addEventListener('change', refresh);
      b.addEventListener('change', refresh);
    }
    if (route === '/data') {
      const search = document.getElementById('data-search');
      const topic = document.getElementById('data-topic');
      const apply = () => {
        dataQuery = search.value; dataTopic = topic.value;
        const rows = dataRows();
        document.getElementById('data-count').textContent =
          `${rows.length} of ${D.INDICATORS.length} indicators shown`;
        document.querySelector('#data-table tbody').innerHTML = rows.map(ind =>
          `<tr><td>${C.esc(ind.name)}</td><td>${C.esc(ind.topic)}</td><td>${C.esc(ind.unit)}</td><td>${fmt2(ind.latest)}</td><td>${ind.year}</td><td>${C.esc(ind.source)}</td></tr>`).join('') ||
          '<tr><td colspan="6" class="empty-note">No indicators match your search.</td></tr>';
      };
      search.addEventListener('input', apply);
      topic.addEventListener('change', apply);
      document.getElementById('data-csv').addEventListener('click', () => {
        const head = 'Indicator,Topic,Unit,Latest value,Year,Source\n';
        const lines = D.INDICATORS.map(ind =>
          [ind.name, ind.topic, ind.unit, ind.latest, ind.year, ind.source]
            .map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([head + lines], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url; link.download = 'nusastat-indicators.csv';
        document.body.appendChild(link); link.click(); link.remove();
        URL.revokeObjectURL(url);
      });
    }
  }
  window.addEventListener('hashchange', render);
  render();
})();
