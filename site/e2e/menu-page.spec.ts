import { test, expect } from "@playwright/test";

test("страница меню загружается и показывает блюда", async ({ page }) => {
  await page.goto("/menu");
  await expect(page.locator("text=Меню").first()).toBeVisible({ timeout: 10000 });
  await expect(page.locator("text=Завтраки").first()).toBeVisible({ timeout: 15000 });
  await expect(page.locator("text=₽").first()).toBeVisible();
});
