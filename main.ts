// NusaStat — entrypoint (Node 22, standard library only).
// Copies app/ and screenshots/ beside this file to $MAKEFUN_OUTPUT_DIR
// (default /output) and writes /output/dossier.json with the vendored
// make.fun library. The site itself makes no network request: every file
// it loads lives under app/.
//
//   MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// --- Validation ----------------------------------------------------------
// The site must not load anything over the network. Any src=/href= pointing
// at http(s), a CSS url(http...), or a dynamic import of http(s) is refused.
// The SVG namespace string "http://www.w3.org/2000/svg" is NOT a request:
// it is stripped before the check so it cannot false-positive.
const EXTERNAL = [/src\s*=\s*["']https?:/i, /href\s*=\s*["']https?:/i, /url\(\s*["']?https?:/i, /from\s+["']https?:/i, /import\(\s*["']https?:/i];
function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}
const appDir = join(here, 'app');
if (!existsSync(join(appDir, 'index.html'))) {
  console.error('refusing: app/index.html is missing');
  process.exit(1);
}
const bad = [];
for (const file of walk(appDir)) {
  const text = readFileSync(file, 'utf8');
  const scrubbed = text.replaceAll('http://www.w3.org/2000/svg', '');
  for (const pattern of EXTERNAL) {
    if (pattern.test(scrubbed)) bad.push(`${file}: ${pattern}`);
  }
}
if (bad.length > 0) {
  console.error('refusing: app/ loads external URLs:');
  for (const b of bad) console.error('  ' + b);
  process.exit(1);
}
const shotsDir = join(here, 'screenshots');
const shots = existsSync(shotsDir)
  ? readdirSync(shotsDir).filter(f => /\.(png|jpe?g|webp)$/i.test(f))
  : [];
if (shots.length === 0) {
  console.error('refusing: no screenshots in screenshots/');
  process.exit(1);
}

// --- Copy + dossier ------------------------------------------------------
mkdirSync(out, { recursive: true });
cpSync(appDir, join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

const appFiles = [...walk(join(out, 'app'))];
const appBytes = appFiles.reduce((sum, f) => sum + statSync(f).size, 0);
console.log(`NusaStat build OK: ${appFiles.length} app files (${appBytes} bytes), ${shots.length} screenshots:`);
for (const s of shots.sort()) console.log(`  screenshots/${s} (${statSync(join(shotsDir, s)).size} bytes)`);
console.log(`dossier written to ${join(out, 'dossier.json')}`);
