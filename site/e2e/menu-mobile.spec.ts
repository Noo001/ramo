import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("мобильное меню: категории открываются через sheet, заказ работает", async ({ page }) => {
  await page.goto("/menu?tableId=1");

  // На мобильном видна кнопка выбора категории
  const categoryButton = page.locator('[data-testid="category-selector"]');
  await expect(categoryButton).toBeVisible({ timeout: 15000 });
  await expect(categoryButton).toContainText("Завтраки");

  // Открываем sheet категорий
  await categoryButton.click();
  const sheet = page.locator('[data-testid="category-sheet"]');
  await expect(sheet).toBeVisible();
  await expect(sheet.locator("text=Категории").first()).toBeVisible();

  // Выбираем категорию
  await sheet.locator('[data-testid="category-option-Салаты"]').click();

  // Sheet закрылся
  await expect(sheet).not.toBeVisible();

  // Блюда категории видны
  await expect(page.locator("text=В корзину").first()).toBeVisible();

  // Добавляем в корзину
  await page.locator("text=В корзину").first().click();

  // Открываем корзину
  await page.locator("text=позиций").first().click();

  // Отправляем заказ
  await page.locator("text=Отправить заказ").first().click();

  // Ждём подтверждения
  await expect(page.locator("text=Заказ принят!").first()).toBeVisible({ timeout: 10000 });
});
