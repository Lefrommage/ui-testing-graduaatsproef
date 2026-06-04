import { By, WebDriver } from "selenium-webdriver";

export async function login(driver: WebDriver): Promise<void> {
  await driver
    .findElement(By.css('[data-test="username"]'))
    .sendKeys("standard_user");
  await driver
    .findElement(By.css('[data-test="password"]'))
    .sendKeys("secret_sauce");
  await driver.findElement(By.css('[data-test="login-button"]')).click();
}
