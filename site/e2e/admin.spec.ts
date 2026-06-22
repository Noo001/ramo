import { test, expect } from "@playwright/test";

test("вход в админку и проверка разделов", async ({ page }) => {
  await page.goto("/admin");

  // Редирект на логин
  await expect(page.locator("text=Вход").first()).toBeVisible({ timeout: 10000 });

  // Вводим логин и пароль
  await page.fill('input[type="text"], input[name="login"], input[placeholder*="огин"]', "admin");
  await page.fill('input[type="password"]', "admin123");
  await page.click('button:has-text("Войти")');

  // Проверяем, что мы в админке
  await expect(page.locator("text=Меню").first()).toBeVisible({ timeout: 10000 });
  await expect(page.locator("text=Столы").first()).toBeVisible();
  await expect(page.locator("text=Заказы").first()).toBeVisible();
  await expect(page.locator("text=Настройки").first()).toBeVisible();
});
