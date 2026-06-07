import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

test("foutieve login toont foutmelding", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("wrong_user", "wrong_password");

  await expect(loginPage.errorMessage).toBeVisible();
});
