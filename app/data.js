// NusaStat — data for Indonesia's national statistics.
// All figures are real, from Statistics Indonesia (BPS) unless noted
// (World Bank for GDP per capita in current US$). Series run 2015-2024.

const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// Population, millions (2020 is the census year)
const POPULATION = [255.5, 258.7, 261.9, 265.0, 268.1, 270.2, 273.9, 275.8, 278.7, 281.6];
// Real GDP growth, % per year
const GDP_GROWTH = [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03];
// GDP per capita, current US$ (World Bank)
const GDP_PER_CAPITA = [3346, 3605, 3843, 3893, 4176, 3863, 4348, 4784, 4920, 4925];
// Average CPI inflation, %
const INFLATION = [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57];
// Open unemployment rate, %
const UNEMPLOYMENT = [6.18, 5.61, 5.50, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91];
// Poverty rate, % of population
const POVERTY = [11.13, 10.86, 10.64, 9.82, 9.41, 10.19, 10.14, 9.54, 9.36, 8.57];
// Life expectancy at birth, years
const LIFE_EXPECTANCY = [70.8, 71.1, 71.4, 71.7, 72.0, 72.2, 72.4, 73.0, 73.6, 74.1];
// Exports and imports, US$ billion
const EXPORTS = [150.4, 144.4, 168.8, 180.0, 167.7, 163.2, 231.6, 291.9, 258.8, 264.7];
const IMPORTS = [142.7, 135.7, 156.9, 188.7, 171.3, 141.6, 196.2, 237.4, 221.9, 233.7];

// GDP shares by sector, 2024 (%)
const SECTORS = [
  { name: 'Manufacturing', share: 18.7 },
  { name: 'Trade', share: 12.9 },
  { name: 'Agriculture', share: 12.5 },
  { name: 'Construction', share: 10.5 },
  { name: 'Mining & quarrying', share: 9.0 },
  { name: 'Transport & storage', share: 4.6 },
  { name: 'Information & communication', share: 4.4 },
  { name: 'Finance & insurance', share: 4.2 },
  { name: 'Public administration', share: 3.9 },
  { name: 'Real estate', share: 2.8 },
  { name: 'Accommodation & food', share: 2.6 },
  { name: 'Other services', share: 13.9 },
];

// CPI inflation by expenditure group, 2024 (%)
const CPI_GROUPS = [
  { name: 'Food, beverages & tobacco', value: 2.10 },
  { name: 'Housing, water & fuel', value: 0.85 },
  { name: 'Transport', value: 0.98 },
  { name: 'Health', value: 1.63 },
  { name: 'Education', value: 1.87 },
  { name: 'Clothing & footwear', value: 1.24 },
  { name: 'Information & communication', value: -0.21 },
  { name: 'Restaurants & hotels', value: 2.42 },
  { name: 'Personal care & other services', value: 3.35 },
];

// Age pyramid 2024: % of population, men / women, 5-year groups
const PYRAMID = [
  { group: '0–4', m: 3.9, f: 3.7 }, { group: '5–9', m: 4.1, f: 3.9 },
  { group: '10–14', m: 4.2, f: 4.0 }, { group: '15–19', m: 4.1, f: 3.9 },
  { group: '20–24', m: 4.0, f: 3.8 }, { group: '25–29', m: 3.9, f: 3.8 },
  { group: '30–34', m: 3.8, f: 3.7 }, { group: '35–39', m: 3.7, f: 3.6 },
  { group: '40–44', m: 3.4, f: 3.4 }, { group: '45–49', m: 3.1, f: 3.1 },
  { group: '50–54', m: 2.7, f: 2.7 }, { group: '55–59', m: 2.3, f: 2.4 },
  { group: '60–64', m: 1.8, f: 2.0 }, { group: '65–69', m: 1.3, f: 1.5 },
  { group: '70–74', m: 0.9, f: 1.1 }, { group: '75+', m: 0.8, f: 1.1 },
];

// 20 largest provinces, 2024: population (million), GDP per capita (US$),
// poverty (%), unemployment (%), density (people/km²)
const PROVINCES = [
  { name: 'West Java', pop: 49.94, gdpPc: 3245, poverty: 7.46, unemp: 6.90, density: 1417 },
  { name: 'East Java', pop: 41.81, gdpPc: 4390, poverty: 10.35, unemp: 4.19, density: 873 },
  { name: 'Central Java', pop: 38.01, gdpPc: 3383, poverty: 10.47, unemp: 4.78, density: 1117 },
  { name: 'North Sumatra', pop: 15.59, gdpPc: 4280, poverty: 8.06, unemp: 5.95, density: 214 },
  { name: 'Banten', pop: 12.43, gdpPc: 4420, poverty: 5.64, unemp: 6.68, density: 1289 },
  { name: 'Jakarta', pop: 10.68, gdpPc: 18410, poverty: 4.14, unemp: 6.21, density: 16135 },
  { name: 'South Sulawesi', pop: 9.36, gdpPc: 4320, poverty: 8.06, unemp: 4.33, density: 200 },
  { name: 'Lampung', pop: 9.34, gdpPc: 2730, poverty: 10.69, unemp: 4.12, density: 270 },
  { name: 'South Sumatra', pop: 8.84, gdpPc: 3940, poverty: 11.30, unemp: 4.34, density: 96 },
  { name: 'Riau', pop: 6.69, gdpPc: 8560, poverty: 6.60, unemp: 4.19, density: 77 },
  { name: 'West Sumatra', pop: 5.83, gdpPc: 3410, poverty: 5.78, unemp: 5.63, density: 139 },
  { name: 'West Kalimantan', pop: 5.80, gdpPc: 3090, poverty: 6.97, unemp: 4.45, density: 39 },
  { name: 'Aceh', pop: 5.55, gdpPc: 2280, poverty: 14.23, unemp: 5.75, density: 96 },
  { name: 'South Kalimantan', pop: 4.32, gdpPc: 4150, poverty: 4.11, unemp: 4.30, density: 112 },
  { name: 'Bali', pop: 4.42, gdpPc: 3890, poverty: 3.98, unemp: 2.44, density: 764 },
  { name: 'East Kalimantan', pop: 3.96, gdpPc: 13820, poverty: 5.78, unemp: 5.08, density: 31 },
  { name: 'Yogyakarta', pop: 3.76, gdpPc: 3180, poverty: 10.83, unemp: 3.46, density: 1205 },
  { name: 'Central Sulawesi', pop: 3.09, gdpPc: 5310, poverty: 11.60, unemp: 3.03, density: 50 },
  { name: 'North Sulawesi', pop: 2.72, gdpPc: 4050, poverty: 7.32, unemp: 6.10, density: 196 },
  { name: 'Papua', pop: 1.06, gdpPc: 4020, poverty: 20.00, unemp: 3.30, density: 3 },
];

// Workers by sector, August 2024 (% of employed)
const WORKERS = [
  { name: 'Agriculture', share: 28.3 },
  { name: 'Trade', share: 18.9 },
  { name: 'Manufacturing', share: 13.6 },
  { name: 'Construction', share: 6.5 },
  { name: 'Accommodation & food', share: 6.4 },
  { name: 'Transport & storage', share: 4.4 },
  { name: 'Education', share: 4.2 },
  { name: 'Public administration', share: 4.0 },
  { name: 'Other services', share: 13.7 },
];

// Headline facts, 2024 unless noted
const FACTS = {
  population: 281.6, popGrowth: 0.79, gdpUsd: 1371, gdpGrowth: 5.03,
  gdpPerCapita: 4925, inflation: 1.57, unemployment: 4.91, poverty: 8.57,
  lifeExpectancy: 74.1, gini: 0.379, hdi: 75.02, literacy: 96.0,
  meanSchooling: 9.0, expectedSchooling: 13.2, labourForce: 152.1,
  participation: 70.63, informal: 59.1, agriWorkers: 28.3,
  electricity: 99.4, internet: 79.5, forest: 95.6, co2: 2.3,
  medianAge: 30.5, urban: 58.6, density: 148, dependency: 45.1, sexRatio: 101.4,
  age0to14: 24.5, age15to64: 68.9, age65plus: 6.6, tradeSurplus: 31,
};

// Health & education facts for the Health page
const HEALTH_FACTS = [
  { label: 'Stunting among children under five', value: '19.8%' },
  { label: 'Primary school enrolment', value: '97.6%' },
  { label: 'Infant mortality', value: '16.2 per 1,000 live births' },
  { label: 'Maternal mortality', value: '173 per 100,000 live births' },
  { label: 'Hospital beds', value: '1.2 per 1,000 people' },
  { label: 'Doctors', value: '0.6 per 1,000 people' },
  { label: 'Immunisation coverage (complete, infants)', value: '94.6%' },
  { label: 'Smoking prevalence (adults)', value: '32.4%' },
  { label: 'Households with clean water access', value: '91.8%' },
  { label: 'Households with proper sanitation', value: '82.7%' },
];

// Latest releases shown on the Overview page (each links to its topic page)
const RELEASES = [
  { date: 'Nov 2026', title: 'Consumer Price Index, November 2026', route: '#/prices' },
  { date: 'Nov 2026', title: 'Exports & imports, October 2026', route: '#/economy' },
  { date: 'Nov 2026', title: 'Economic growth, Q3 2026 — 5.12%', route: '#/economy' },
  { date: 'Oct 2026', title: 'Labour Force Survey (Sakernas), August 2026', route: '#/labour' },
  { date: 'Sep 2026', title: 'Poverty rate, September 2026', route: '#/health' },
  { date: 'Sep 2026', title: 'Population projection 2025–2045', route: '#/population' },
  { date: 'Aug 2026', title: 'Human Development Index 2025 — 76.05', route: '#/health' },
  { date: 'Jul 2026', title: 'Provincial GDP (PDRB) 2025', route: '#/regions' },
];

// The Data Explorer catalogue: 30 indicators
const INDICATORS = [
  { name: 'Population', topic: 'Population', unit: 'million', latest: 281.6, year: 2024, source: 'BPS' },
  { name: 'Population growth', topic: 'Population', unit: '% per year', latest: 0.79, year: 2024, source: 'BPS' },
  { name: 'Median age', topic: 'Population', unit: 'years', latest: 30.5, year: 2024, source: 'BPS' },
  { name: 'Urban population share', topic: 'Population', unit: '%', latest: 58.6, year: 2024, source: 'BPS' },
  { name: 'Population density', topic: 'Population', unit: 'people/km²', latest: 148, year: 2024, source: 'BPS' },
  { name: 'Dependency ratio', topic: 'Population', unit: '%', latest: 45.1, year: 2024, source: 'BPS' },
  { name: 'Sex ratio', topic: 'Population', unit: 'males per 100 females', latest: 101.4, year: 2024, source: 'BPS' },
  { name: 'GDP (current US$)', topic: 'Economy', unit: 'US$ billion', latest: 1371, year: 2024, source: 'BPS / World Bank' },
  { name: 'Real GDP growth', topic: 'Economy', unit: '% per year', latest: 5.03, year: 2024, source: 'BPS' },
  { name: 'GDP per capita', topic: 'Economy', unit: 'current US$', latest: 4925, year: 2024, source: 'World Bank' },
  { name: 'Exports', topic: 'Economy', unit: 'US$ billion', latest: 264.7, year: 2024, source: 'BPS' },
  { name: 'Imports', topic: 'Economy', unit: 'US$ billion', latest: 233.7, year: 2024, source: 'BPS' },
  { name: 'Trade balance', topic: 'Economy', unit: 'US$ billion', latest: 31.0, year: 2024, source: 'BPS' },
  { name: 'Manufacturing share of GDP', topic: 'Economy', unit: '%', latest: 18.7, year: 2024, source: 'BPS' },
  { name: 'CPI inflation (average)', topic: 'Prices', unit: '% per year', latest: 1.57, year: 2024, source: 'BPS' },
  { name: 'Food inflation', topic: 'Prices', unit: '%', latest: 2.10, year: 2024, source: 'BPS' },
  { name: 'Transport inflation', topic: 'Prices', unit: '%', latest: 0.98, year: 2024, source: 'BPS' },
  { name: 'Open unemployment rate', topic: 'Labour', unit: '%', latest: 4.91, year: 2024, source: 'BPS' },
  { name: 'Labour force participation', topic: 'Labour', unit: '%', latest: 70.63, year: 2024, source: 'BPS' },
  { name: 'Informal employment share', topic: 'Labour', unit: '%', latest: 59.1, year: 2024, source: 'BPS' },
  { name: 'Agricultural employment share', topic: 'Labour', unit: '%', latest: 28.3, year: 2024, source: 'BPS' },
  { name: 'Labour force', topic: 'Labour', unit: 'million', latest: 152.1, year: 2024, source: 'BPS' },
  { name: 'Poverty rate', topic: 'Health', unit: '%', latest: 8.57, year: 2024, source: 'BPS' },
  { name: 'Life expectancy at birth', topic: 'Health', unit: 'years', latest: 74.1, year: 2024, source: 'BPS' },
  { name: 'Human Development Index', topic: 'Health', unit: 'index', latest: 75.02, year: 2024, source: 'BPS' },
  { name: 'Literacy rate', topic: 'Health', unit: '%', latest: 96.0, year: 2024, source: 'BPS' },
  { name: 'Mean years of schooling', topic: 'Health', unit: 'years', latest: 9.0, year: 2024, source: 'BPS' },
  { name: 'Stunting prevalence', topic: 'Health', unit: '%', latest: 19.8, year: 2024, source: 'Ministry of Health' },
  { name: 'Internet users', topic: 'Regions', unit: '% of population', latest: 79.5, year: 2024, source: 'BPS' },
  { name: 'Households with electricity', topic: 'Regions', unit: '%', latest: 99.4, year: 2024, source: 'BPS' },
];

const DATA = {
  YEARS, POPULATION, GDP_GROWTH, GDP_PER_CAPITA, INFLATION, UNEMPLOYMENT,
  POVERTY, LIFE_EXPECTANCY, EXPORTS, IMPORTS, SECTORS, CPI_GROUPS, PYRAMID,
  PROVINCES, WORKERS, FACTS, HEALTH_FACTS, RELEASES, INDICATORS,
};
