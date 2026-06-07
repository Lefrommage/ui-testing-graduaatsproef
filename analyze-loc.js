const fs = require("fs");
const path = require("path");

const files = [
  // Selenium testbestanden
  {
    tool: "Selenium",
    type: "test",
    scenario: "successful-login",
    file: "selenium-tests/tests/successful-login.test.ts",
  },
  {
    tool: "Selenium",
    type: "test",
    scenario: "invalid-login",
    file: "selenium-tests/tests/invalid-login.test.ts",
  },
  {
    tool: "Selenium",
    type: "test",
    scenario: "add-product-to-cart",
    file: "selenium-tests/tests/add-product-to-cart.test.ts",
  },
  {
    tool: "Selenium",
    type: "test",
    scenario: "logout",
    file: "selenium-tests/tests/logout.test.ts",
  },
  {
    tool: "Selenium",
    type: "test",
    scenario: "checkout-flow",
    file: "selenium-tests/tests/checkout-flow.test.ts",
  },

  // Selenium page classes
  {
    tool: "Selenium",
    type: "page",
    scenario: "pages",
    file: "selenium-tests/tests/pages/LoginPage.ts",
  },
  {
    tool: "Selenium",
    type: "page",
    scenario: "pages",
    file: "selenium-tests/tests/pages/ProductsPage.ts",
  },
  {
    tool: "Selenium",
    type: "page",
    scenario: "pages",
    file: "selenium-tests/tests/pages/CartPage.ts",
  },
  {
    tool: "Selenium",
    type: "page",
    scenario: "pages",
    file: "selenium-tests/tests/pages/CheckoutPage.ts",
  },

  // Playwright testbestanden
  {
    tool: "Playwright",
    type: "test",
    scenario: "successful-login",
    file: "playwright-tests/tests/successful-login.spec.ts",
  },
  {
    tool: "Playwright",
    type: "test",
    scenario: "invalid-login",
    file: "playwright-tests/tests/invalid-login.spec.ts",
  },
  {
    tool: "Playwright",
    type: "test",
    scenario: "add-product-to-cart",
    file: "playwright-tests/tests/add-product-to-cart.spec.ts",
  },
  {
    tool: "Playwright",
    type: "test",
    scenario: "logout",
    file: "playwright-tests/tests/logout.spec.ts",
  },
  {
    tool: "Playwright",
    type: "test",
    scenario: "checkout-flow",
    file: "playwright-tests/tests/checkout-flow.spec.ts",
  },

  // Playwright page classes
  {
    tool: "Playwright",
    type: "page",
    scenario: "pages",
    file: "playwright-tests/tests/pages/LoginPage.ts",
  },
  {
    tool: "Playwright",
    type: "page",
    scenario: "pages",
    file: "playwright-tests/tests/pages/ProductsPage.ts",
  },
  {
    tool: "Playwright",
    type: "page",
    scenario: "pages",
    file: "playwright-tests/tests/pages/CartPage.ts",
  },
  {
    tool: "Playwright",
    type: "page",
    scenario: "pages",
    file: "playwright-tests/tests/pages/CheckoutPage.ts",
  },
];

function countFunctionalLines(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  let inBlockComment = false;
  let count = 0;

  for (let line of lines) {
    let trimmed = line.trim();

    if (trimmed === "") continue;

    if (inBlockComment) {
      if (trimmed.includes("*/")) {
        inBlockComment = false;
      }
      continue;
    }

    if (trimmed.startsWith("/*")) {
      if (!trimmed.includes("*/")) {
        inBlockComment = true;
      }
      continue;
    }

    if (trimmed.startsWith("//")) continue;

    count++;
  }

  return count;
}

const results = [];

for (const item of files) {
  const loc = countFunctionalLines(item.file);

  if (loc === null) {
    console.log(`Bestand niet gevonden: ${item.file}`);
    continue;
  }

  results.push({
    tool: item.tool,
    type: item.type,
    scenario: item.scenario,
    file: item.file,
    loc,
  });
}

console.log("\n=== Regels code per bestand ===\n");
console.log("Tool         Type     Scenario              LOC");
console.log("------------------------------------------------");

for (const result of results) {
  console.log(
    `${result.tool.padEnd(12)} ${result.type.padEnd(8)} ${result.scenario.padEnd(21)} ${String(result.loc).padStart(4)}`,
  );
}

console.log("\n=== Regels code per scenario ===\n");

const scenarioTotals = {};

for (const result of results.filter((r) => r.type === "test")) {
  const key = `${result.tool}|${result.scenario}`;

  if (!scenarioTotals[key]) {
    scenarioTotals[key] = {
      tool: result.tool,
      scenario: result.scenario,
      loc: 0,
    };
  }

  scenarioTotals[key].loc += result.loc;
}

console.log("Tool         Scenario              LOC");
console.log("---------------------------------------");

for (const item of Object.values(scenarioTotals)) {
  console.log(
    `${item.tool.padEnd(12)} ${item.scenario.padEnd(21)} ${String(item.loc).padStart(4)}`,
  );
}

console.log("\n=== Page classes totaal ===\n");

const pageTotals = {};

for (const result of results.filter((r) => r.type === "page")) {
  if (!pageTotals[result.tool]) {
    pageTotals[result.tool] = 0;
  }

  pageTotals[result.tool] += result.loc;
}

for (const [tool, loc] of Object.entries(pageTotals)) {
  console.log(`${tool}: ${loc} LOC`);
}

console.log("\n=== Totaal testbestanden ===\n");

const testTotals = {};

for (const result of results.filter((r) => r.type === "test")) {
  if (!testTotals[result.tool]) {
    testTotals[result.tool] = 0;
  }

  testTotals[result.tool] += result.loc;
}

for (const [tool, loc] of Object.entries(testTotals)) {
  console.log(`${tool}: ${loc} LOC`);
}

console.log("\n=== Totaal alles ===\n");

for (const tool of ["Playwright", "Selenium"]) {
  const testLoc = testTotals[tool] ?? 0;
  const pageLoc = pageTotals[tool] ?? 0;
  console.log(`${tool}: ${testLoc + pageLoc} LOC`);
}

console.log("\n=== pgfplots-coördinaten per scenario ===\n");

for (const tool of ["Playwright", "Selenium"]) {
  const coordinates = Object.values(scenarioTotals)
    .filter((item) => item.tool === tool)
    .map((item) => `(${item.scenario}, ${item.loc})`)
    .join(" ");

  console.log(`% ${tool}`);
  console.log(`\\addplot coordinates {${coordinates}};`);
}
