/*
 * Analyseert de snelheidsmetingen uit één of meer timings.csv-bestanden.
 *
 * Gebruik:
 *   node analyze.js pad/naar/selenium/timings.csv pad/naar/playwright/timings.csv
 *
 * Zonder argumenten zoekt het script standaard naar:
 *   ./selenium-tests/results/timings.csv
 *   ./playwright-tests/results/timings.csv
 *
 * Run 1 wordt als warm-up weggegooid (pas DROP_WARMUP aan indien gewenst).
 */

const fs = require("fs");

const DROP_WARMUP = true; // gooi run == 1 weg
const SCENARIO_ORDER = [
  "successful-login",
  "invalid-login",
  "add-product-to-cart",
  "logout",
  "checkout-flow",
];

const files =
  process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : [
        "./selenium-tests/results/timings.csv",
        "./playwright-tests/results/timings.csv",
      ];

// ---- inlezen ----
const rows = [];
for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error(`Bestand niet gevonden: ${file}`);
    continue;
  }
  const lines = fs.readFileSync(file, "utf-8").trim().split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {
    // header overslaan
    const [tool, scenario, run, duration] = lines[i].split(",");
    if (!tool) continue;
    rows.push({
      tool: tool.trim(),
      scenario: scenario.trim(),
      run: parseInt(run, 10),
      duration: parseFloat(duration),
    });
  }
}

if (rows.length === 0) {
  console.error("Geen data gevonden. Controleer de CSV-paden.");
  process.exit(1);
}

// ---- groeperen ----
const groups = {}; // key = tool|scenario
for (const r of rows) {
  if (DROP_WARMUP && r.run === 1) continue;
  const key = `${r.tool}|${r.scenario}`;
  (groups[key] = groups[key] || []).push(r.duration);
}

function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function stddev(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const variance = arr.reduce((a, b) => a + (b - m) ** 2, 0) / (arr.length - 1); // steekproef
  return Math.sqrt(variance);
}

// ---- statistiek per groep ----
const stats = {};
for (const key of Object.keys(groups)) {
  const [tool, scenario] = key.split("|");
  const values = groups[key];
  const m = mean(values);
  const sd = stddev(values);
  const cv = m === 0 ? 0 : (sd / m) * 100;
  (stats[tool] = stats[tool] || {})[scenario] = {
    n: values.length,
    mean: m,
    sd,
    cv,
  };
}

const tools = Object.keys(stats).sort();
const scenarios = [
  ...SCENARIO_ORDER.filter((s) => tools.some((t) => stats[t][s])),
  ...[...new Set(rows.map((r) => r.scenario))].filter(
    (s) => !SCENARIO_ORDER.includes(s),
  ),
];

// ---- tabel printen ----
console.log("\n=== Samenvatting per tool en scenario ===\n");
for (const tool of tools) {
  console.log(`# ${tool}`);
  console.log(
    "scenario".padEnd(24) +
      "n".padStart(4) +
      "gem (ms)".padStart(12) +
      "stdafw".padStart(10) +
      "CV %".padStart(8),
  );
  for (const scenario of scenarios) {
    const s = stats[tool][scenario];
    if (!s) continue;
    console.log(
      scenario.padEnd(24) +
        String(s.n).padStart(4) +
        s.mean.toFixed(1).padStart(12) +
        s.sd.toFixed(1).padStart(10) +
        s.cv.toFixed(1).padStart(8),
    );
  }
  console.log("");
}

// ---- pgfplots-coördinaten printen ----
console.log("=== pgfplots-coördinaten (plak in je grafiek) ===\n");
for (const tool of tools) {
  const coords = scenarios
    .filter((s) => stats[tool][s])
    .map((s) => {
      const st = stats[tool][s];
      return `(${s}, ${st.mean.toFixed(0)}) +- (0, ${st.sd.toFixed(0)})`;
    })
    .join(" ");
  console.log(`% ${tool}`);
  console.log(`\\addplot+[error bars/.cd, y dir=both, y explicit]`);
  console.log(`  coordinates {${coords}};\n`);
}

// ---- symbolic x coords regel ----
console.log("% symbolic x coords voor de as:");
console.log(
  `symbolic x coords={${scenarios.filter((s) => tools.some((t) => stats[t][s])).join(", ")}},`,
);
