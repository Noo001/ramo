import { test, expect } from "@playwright/test";

test("страница меню загружается и показывает блюда", async ({ page }) => {
  await page.goto("/menu");
  await expect(page.locator("text=Меню").first()).toBeVisible({ timeout: 10000 });
  await expect(page.locator("text=Завтраки").first()).toBeVisible({ timeout: 15000 });
  await expect(page.locator("text=₽").first()).toBeVisible();
});

test("QR-меню с tableId загружается, блюдо добавляется в корзину и заказ отправляется", async ({ page }) => {
  await page.goto("/menu?tableId=1");

  // Ждём загрузки меню
  await expect(page.locator("text=В корзину").first()).toBeVisible({ timeout: 15000 });

  // Проверяем, что стол отображается
  await expect(page.locator("text=Зал 1").first()).toBeVisible();

  // Добавляем первое блюдо в корзину
  await page.locator("text=В корзину").first().click();

  // Открываем корзину
  await page.locator("text=позиций").first().click();

  // Проверяем, что кнопка отправки активна
  await expect(page.locator("text=Отправить заказ").first()).toBeVisible();

  // Отправляем заказ
  await page.locator("text=Отправить заказ").first().click();

  // Ждём подтверждения
  await expect(page.locator("text=Заказ принят!").first()).toBeVisible({ timeout: 10000 });
});
