// NusaStat — small SVG chart helpers. No libraries, no network.
// Every helper takes plain data and returns an SVG string.

const NS = 'http://www.w3.org/2000/svg';
const COLORS = ['#0e7c6b', '#3b6ea5', '#c98a1b', '#12314e', '#7a9bb8', '#d98c5f', '#5b8c5a', '#8a6fb8'];
const fmt = (n, d = 1) => Number(n).toFixed(d);

function svgOpen(w, h, label) {
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="${label}" xmlns="${NS}">`;
}

// Nice axis ticks: round min/max to a step that yields ~4 gridlines.
function axisRange(values) {
  let lo = Math.min(...values), hi = Math.max(...values);
  if (lo === hi) { lo -= 1; hi += 1; }
  const span = hi - lo, step = Math.pow(10, Math.floor(Math.log10(span / 3)));
  const nice = [1, 2, 2.5, 5, 10].map(m => m * step).find(s => span / s <= 4) || step * 10;
  lo = Math.floor(lo / nice) * nice; hi = Math.ceil(hi / nice) * nice;
  return { lo, hi, step: nice };
}

function gridlines(lo, hi, step, x0, x1, yOf) {
  let s = '';
  for (let v = lo; v <= hi + 1e-9; v += step) {
    const y = yOf(v);
    s += `<line x1="${x0}" y1="${fmt(y)}" x2="${x1}" y2="${fmt(y)}" stroke="#dfe6ea" stroke-width="1"/>` +
      `<text x="${x0 - 6}" y="${fmt(y + 4)}" text-anchor="end" font-size="11" fill="#5a6b78">${fmt(v, step < 1 ? 1 : 0)}</text>`;
  }
  return s;
}

// Line chart over years. values: number[], years: number[].
function lineChart(values, years, opts = {}) {
  const w = 720, h = 300, padL = 52, padR = 16, padT = 14, padB = 34;
  const { lo, hi, step } = axisRange(values);
  const x = i => padL + (i * (w - padL - padR)) / (years.length - 1);
  const y = v => padT + (1 - (v - lo) / (hi - lo)) * (h - padT - padB);
  const color = opts.color || '#0e7c6b';
  const pts = values.map((v, i) => `${fmt(x(i))},${fmt(y(v))}`).join(' ');
  const area = `${padL},${fmt(y(lo))} ${pts} ${fmt(x(values.length - 1))},${fmt(y(lo))}`;
  let s = svgOpen(w, h, opts.label || 'Line chart');
  s += gridlines(lo, hi, step, padL, w - padR, y);
  s += `<polygon points="${area}" fill="${color}" fill-opacity="0.10"/>`;
  s += `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  values.forEach((v, i) => {
    s += `<circle cx="${fmt(x(i))}" cy="${fmt(y(v))}" r="3.5" fill="#fff" stroke="${color}" stroke-width="2"/>`;
    if (i % 2 === 0 || i === values.length - 1) {
      s += `<text x="${fmt(x(i))}" y="${h - 10}" text-anchor="middle" font-size="11" fill="#5a6b78">${years[i]}</text>`;
    }
    if (i === values.length - 1) {
      s += `<text x="${fmt(x(i) - 4)}" y="${fmt(y(v) - 10)}" text-anchor="end" font-size="12" font-weight="700" fill="#12314e">${fmt(v, opts.decimals ?? 1)}${opts.suffix || ''}</text>`;
    }
  });
  return s + '</svg>';
}

// Vertical bar chart over years.
function barChart(values, years, opts = {}) {
  const w = 720, h = 300, padL = 52, padR = 16, padT = 14, padB = 34;
  const lo = Math.min(0, ...values), hi = Math.max(...values);
  const { lo: alo, hi: ahi, step } = axisRange([...values, 0]);
  const bw = (w - padL - padR) / values.length;
  const y = v => padT + (1 - (v - alo) / (ahi - alo)) * (h - padT - padB);
  const color = opts.color || '#3b6ea5';
  let s = svgOpen(w, h, opts.label || 'Bar chart');
  s += gridlines(alo, ahi, step, padL, w - padR, y);
  s += `<line x1="${padL}" y1="${fmt(y(0))}" x2="${w - padR}" y2="${fmt(y(0))}" stroke="#8fa3b0" stroke-width="1.5"/>`;
  values.forEach((v, i) => {
    const bx = padL + i * bw + bw * 0.18, bwdt = bw * 0.64;
    const top = y(Math.max(v, 0)), bot = y(Math.min(v, 0));
    const fill = v < 0 ? '#c0392b' : color;
    s += `<rect x="${fmt(bx)}" y="${fmt(top)}" width="${fmt(bwdt)}" height="${fmt(Math.max(bot - top, 1))}" rx="3" fill="${fill}"/>`;
    s += `<text x="${fmt(padL + i * bw + bw / 2)}" y="${h - 10}" text-anchor="middle" font-size="11" fill="#5a6b78">${years[i]}</text>`;
  });
  return s + '</svg>';
}

// Horizontal bars: items [{name, value}], sorted desc by caller.
function hbarChart(items, opts = {}) {
  const rowH = 34, padL = 190, padR = 64, padT = 8;
  const h = padT + items.length * rowH + 8;
  const w = 720, max = Math.max(...items.map(i => i.value));
  const color = opts.color || '#0e7c6b';
  let s = svgOpen(w, h, opts.label || 'Horizontal bar chart');
  items.forEach((it, i) => {
    const y = padT + i * rowH;
    const bw = Math.max(2, (it.value / max) * (w - padL - padR));
    s += `<text x="${padL - 10}" y="${y + 19}" text-anchor="end" font-size="12.5" fill="#243b4d">${esc(it.name)}</text>`;
    s += `<rect x="${padL}" y="${y + 6}" width="${fmt(bw)}" height="18" rx="4" fill="${it.color || color}"/>`;
    s += `<text x="${padL + bw + 8}" y="${y + 20}" font-size="12.5" font-weight="700" fill="#12314e">${fmt(it.value, opts.decimals ?? 1)}${opts.suffix || ''}</text>`;
  });
  return s + '</svg>';
}

// Donut chart: items [{name, share}], with a legend list.
function donutChart(items, opts = {}) {
  const size = 260, cx = 130, cy = 130, r = 95, ir = 58;
  const total = items.reduce((a, b) => a + b.share, 0);
  let s = svgOpen(size, size, opts.label || 'Donut chart');
  let a0 = -Math.PI / 2;
  items.forEach((it, i) => {
    const a1 = a0 + (it.share / total) * Math.PI * 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + ir * Math.cos(a1), yi1 = cy + ir * Math.sin(a1);
    const xi0 = cx + ir * Math.cos(a0), yi0 = cy + ir * Math.sin(a0);
    s += `<path d="M ${fmt(x0)} ${fmt(y0)} A ${r} ${r} 0 ${large} 1 ${fmt(x1)} ${fmt(y1)} L ${fmt(xi1)} ${fmt(yi1)} A ${ir} ${ir} 0 ${large} 0 ${fmt(xi0)} ${fmt(yi0)} Z" fill="${COLORS[i % COLORS.length]}"/>`;
    a0 = a1;
  });
  s += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="22" font-weight="700" fill="#12314e">${fmt(total, 1)}%</text>` +
    `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="11.5" fill="#5a6b78">of GDP, 2024</text></svg>`;
  let legend = '<ul class="legend">';
  items.forEach((it, i) => {
    legend += `<li><span class="swatch" style="background:${COLORS[i % COLORS.length]}"></span>${esc(it.name)}<b>${fmt(it.share, 1)}%</b></li>`;
  });
  return `<div class="donut-wrap">${s}${legend}</div>`;
}

// Population pyramid: rows [{group, m, f}] as % of population.
function pyramidChart(rows) {
  const rowH = 24, padT = 30, padB = 8, mid = 340, half = 300;
  const w = 720, h = padT + rows.length * rowH + padB;
  let s = svgOpen(w, h, 'Population pyramid 2024');
  s += `<text x="${mid - half - 4}" y="18" text-anchor="end" font-size="12" font-weight="700" fill="#3b6ea5">Men</text>` +
    `<text x="${mid + half + 4}" y="18" font-size="12" font-weight="700" fill="#c98a1b">Women</text>`;
  rows.forEach((r, i) => {
    const y = padT + i * rowH;
    const mw = (r.m / 5) * half, fw = (r.f / 5) * half;
    s += `<text x="${mid}" y="${y + 16}" text-anchor="middle" font-size="11" fill="#5a6b78">${esc(r.group)}</text>`;
    s += `<rect x="${fmt(mid - mw - 14)}" y="${y + 3}" width="${fmt(mw)}" height="16" rx="2" fill="#3b6ea5"><title>Men ${esc(r.group)}: ${fmt(r.m, 1)}%</title></rect>`;
    s += `<rect x="${fmt(mid + 14)}" y="${y + 3}" width="${fmt(fw)}" height="16" rx="2" fill="#c98a1b"><title>Women ${esc(r.group)}: ${fmt(r.f, 1)}%</title></rect>`;
    s += `<text x="${fmt(mid - mw - 20)}" y="${y + 16}" text-anchor="end" font-size="10.5" fill="#5a6b78">${fmt(r.m, 1)}</text>`;
    s += `<text x="${fmt(mid + fw + 20)}" y="${y + 16}" font-size="10.5" fill="#5a6b78">${fmt(r.f, 1)}</text>`;
  });
  return s + '</svg>';
}

// Grouped bars: two series over years.
function groupedBarChart(a, b, years, labelA, labelB) {
  const w = 720, h = 300, padL = 52, padR = 16, padT = 26, padB = 34;
  const { lo, hi, step } = axisRange([...a, ...b, 0]);
  const gw = (w - padL - padR) / years.length;
  const y = v => padT + (1 - (v - lo) / (hi - lo)) * (h - padT - padB);
  let s = svgOpen(w, h, 'Grouped bar chart');
  s += gridlines(lo, hi, step, padL, w - padR, y);
  s += `<g font-size="12" fill="#243b4d"><rect x="${padL}" y="4" width="12" height="12" rx="2" fill="#0e7c6b"/><text x="${padL + 18}" y="14">${esc(labelA)}</text>` +
    `<rect x="${padL + 120}" y="4" width="12" height="12" rx="2" fill="#c98a1b"/><text x="${padL + 138}" y="14">${esc(labelB)}</text></g>`;
  a.forEach((v, i) => {
    const gx = padL + i * gw;
    s += `<rect x="${fmt(gx + gw * 0.14)}" y="${fmt(y(v))}" width="${fmt(gw * 0.32)}" height="${fmt(Math.max(y(lo) - y(v), 1))}" rx="2" fill="#0e7c6b"/>`;
    s += `<rect x="${fmt(gx + gw * 0.52)}" y="${fmt(y(b[i]))}" width="${fmt(gw * 0.32)}" height="${fmt(Math.max(y(lo) - y(b[i]), 1))}" rx="2" fill="#c98a1b"/>`;
    s += `<text x="${fmt(gx + gw / 2)}" y="${h - 10}" text-anchor="middle" font-size="11" fill="#5a6b78">${years[i]}</text>`;
  });
  return s + '</svg>';
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const CHARTS = { lineChart, barChart, hbarChart, donutChart, pyramidChart, groupedBarChart, esc, COLORS };
