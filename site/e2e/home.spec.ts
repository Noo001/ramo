import { test, expect } from "@playwright/test";

test("главная страница загружается и содержит ключевые элементы", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/RAMO/);
  await expect(page.locator("text=Воронеж").first()).toBeVisible();
  await expect(page.locator("text=RAMO").first()).toBeVisible();
});
