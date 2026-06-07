import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";

const TOOL = "playwright";
const SCENARIO = "successful-login";
const RESULTS_FILE = path.join(__dirname, "..", "results", "timings.csv");

function logTiming(run: number, durationMs: number): void {
  fs.mkdirSync(path.dirname(RESULTS_FILE), { recursive: true });
  if (!fs.existsSync(RESULTS_FILE)) {
    fs.writeFileSync(RESULTS_FILE, "tool,scenario,run,duration_ms\n");
  }
  fs.appendFileSync(RESULTS_FILE, `${TOOL},${SCENARIO},${run},${durationMs}\n`);
}

// 11 runs: gooi run 1 weg als warm-up, gebruik run 2 t.e.m. 11.
for (let runNumber = 1; runNumber <= 11; runNumber++) {
  test(`run ${runNumber} - succesvolle login`, async ({ page }) => {
    const startTime = Date.now();

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");

    const productsPage = new ProductsPage(page);
    await expect(page).toHaveURL(/inventory.html/);
    await expect(productsPage.title).toHaveText("Products");

    const duration = Date.now() - startTime;
    console.log(`Run ${runNumber}: ${duration} ms`);
    logTiming(runNumber, duration);
  });
}