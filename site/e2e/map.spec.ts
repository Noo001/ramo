import { test, expect } from "@playwright/test";

test("карта зала загружается и показывает зоны", async ({ page }) => {
  await page.goto("/map");
  await expect(page.locator("text=Карта зала").first()).toBeVisible({ timeout: 10000 });
  await expect(page.locator("text=Зал 1").first()).toBeVisible();
  await expect(page.locator("text=Зал 2").first()).toBeVisible();
  await expect(page.locator("text=Летняя веранда").first()).toBeVisible();
});
