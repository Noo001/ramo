import { test, expect } from "@playwright/test";

test("регистрация, заказ и начисление баллов лояльности", async ({ page }) => {
  const phone = `7900${Date.now().toString().slice(-8)}`;

  // Register
  await page.goto("/auth-user");
  await page.getByText("Регистрация").click();
  await page.getByPlaceholder("Иван").fill("Тестовый пользователь");
  await page.getByPlaceholder("+7 (900) 000-00-00").fill(phone);
  await page.getByPlaceholder("••••••••").fill("password123");
  await page.getByRole("button", { name: "Зарегистрироваться" }).click();

  // Profile should show 0 points
  await page.waitForURL("/profile");
  await expect(page.locator("text=Баллы лояльности")).toBeVisible();
  await expect(page.locator("text=0").first()).toBeVisible();

  // Make an order
  await page.goto("/menu?tableId=1");
  await expect(page.locator("text=В корзину").first()).toBeVisible({ timeout: 15000 });
  await page.locator("text=В корзину").first().click();
  await page.locator("text=позиций").first().click();
  await expect(page.locator("text=Отправить заказ").first()).toBeVisible();
  await page.locator("text=Отправить заказ").first().click();
  await expect(page.locator("text=Заказ принят!").first()).toBeVisible({ timeout: 10000 });

  // Refresh profile and check points increased
  await page.goto("/profile");
  await expect(page.locator("text=Баллы лояльности")).toBeVisible();
  const pointsText = await page.locator(".font-serif.text-4xl").textContent();
  const points = Number(pointsText?.replace(/\s/g, ""));
  expect(points).toBeGreaterThan(0);
});
