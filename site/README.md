# RAMO — QR-меню и админка

Современное кафе в центре Воронежа. MVP: QR-меню для заказа за столом, админ-панель, синхронизация с iiko, уведомления в Telegram.

> Мобильное приложение для гостей находится в директории [`mobile/`](../mobile).

## Стек

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- Prisma 6
- SQLite (для MVP) / PostgreSQL (для продакшена)
- Playwright (парсинг Яндекс Еды)

## Быстрый старт

```bash
cd site
npm install
npx prisma generate
npx prisma db push --accept-data-loss
npm run seed
npm run build
npm run start
```

После запуска:
- Сайт: http://localhost:3000
- Админка: http://localhost:3000/admin
- Логин: `admin`
- Пароль: `admin123`

## Наполнение меню из Яндекс Еды

```bash
npm run parse:yandex
npx tsx scripts/import-yandex-menu.ts
```

## Настройка Telegram

1. Создайте бота через @BotFather, получите токен.
2. Добавьте бота в чат администраторов.
3. Получите `chat_id` (можно через @userinfobot или запрос к API).
4. Введите данные в админке → «Настройки».

## Настройка iiko

1. Получите API логин в iikoOffice.
2. Введите его в админке → «Настройки» → iiko API Login.
3. Нажмите «Синхронизировать с iiko».
4. При первой синхронизации Organization ID сохранится автоматически.
5. Синхронизация меню и стоп-листа запускается автоматически каждую ночь в 03:00.

> **Примечание:** iiko не предоставляет webhook/push-уведомлений на изменение меню.
> Для актуальности стоп-листа используется периодический опрос (polling).

## Переход на PostgreSQL

1. Установите PostgreSQL и создайте базу `ramo`.
2. Измените `DATABASE_URL` в `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/ramo?schema=public"
   ```
3. Измените `provider` в `prisma/schema.prisma` на `postgresql`.
4. Выполните:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run seed
   ```

## Деплой на свой сервер

1. Скопируйте папку `site/` на сервер.
2. Установите Node.js 20+.
3. Установите зависимости: `npm install --production`.
4. Создайте `.env` с production-значениями.
5. Сгенерируйте клиента Prisma: `npx prisma generate`.
6. Примените миграции: `npx prisma migrate deploy`.
7. Запустите: `npm run start` (рекомендуется использовать pm2).

Рекомендуется настроить reverse proxy (nginx) и HTTPS.

## Программа лояльности

1. В админке → «Настройки» задайте:
   - **Начисление, %** — сколько баллов начисляется от суммы заказа.
   - **Оплата баллами, %** — какую часть заказа можно оплатить баллами.
2. Гость регистрируется по номеру телефона на странице `/auth-user`.
3. В личном кабинете `/profile` отображаются текущие баллы.
4. При оформлении заказа авторизованный пользователь может списать доступные баллы.

## Структура

- `app/` — страницы и API
- `components/` — React-компоненты
- `lib/` — Prisma, auth, iiko, Telegram
- `prisma/` — схема базы данных
- `scripts/` — парсеры и импортёры
- `public/images/` — фото интерьера и меню

## Безопасность

Перед продакшеном обязательно:
- Смените `JWT_SECRET`
- Смените пароль администратора
- Установите сложный пароль в `.env`
- Не коммитьте `.env` и `dev.db`
