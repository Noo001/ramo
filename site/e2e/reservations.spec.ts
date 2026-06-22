import { test, expect } from "@playwright/test";

test("бронирование через админку отображается на карте зала", async ({ page }) => {
  const today = new Date().toISOString().split("T")[0];
  const displayDate = today.split("-").reverse().join(".");

  // Логинимся в админку
  await page.goto("/admin");
  await page.fill('input[type="text"]', "admin");
  await page.fill('input[type="password"]', "admin123");
  await page.click('button:has-text("Войти")');
  await expect(page.locator("text=Меню").first()).toBeVisible({ timeout: 10000 });

  // Переходим на вкладку Бронирования
  await page.click('button:has-text("Бронирования")');
  await expect(page.locator("text=Новое бронирование").first()).toBeVisible();

  // Создаём бронирование стола 1
  await page.selectOption('select:has-text("Стол")', "1");
  await page.fill('input[placeholder="Имя гостя"]', "Иван");
  await page.fill('input[placeholder="Телефон"]', "+79999999999");
  await page.fill('input[placeholder="Гостей"]', "2");
  await page.fill('input[type="date"]', today);
  await page.fill('input[type="time"]', "19:00");
  await page.click('button:has-text("Забронировать")');

  // Проверяем, что бронирование появилось в таблице
  await expect(page.locator("text=Иван").first()).toBeVisible({ timeout: 10000 });
  await expect(page.locator(`text=${displayDate}`).first()).toBeVisible();

  // Открываем карту зала
  await page.goto("/map");
  await expect(page.locator("text=Карта зала").first()).toBeVisible({ timeout: 10000 });

  // Убеждаемся, что стол 1 отмечен как занятый (красный индикатор)
  const table1Button = page.locator('button:has-text("1")').first();
  await expect(table1Button).toBeVisible();
  await expect(table1Button).toBeDisabled();
});
