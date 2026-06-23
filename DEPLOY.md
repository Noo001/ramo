# Локальный деплой RAMO

Проект настроен для запуска на локальном сервере через Docker Compose с PostgreSQL и nginx reverse proxy.

## Требования

- Docker + Docker Compose
- Git

## Структура

- `site/` — Next.js приложение (фронт + API).
- `site/Dockerfile` — сборка приложения в standalone-режиме.
- `docker-compose.yml` — поднимает PostgreSQL + RAMO + nginx.
- `nginx/` — конфиги nginx для reverse proxy.
- `nginx/conf.d/second-site.conf.example` — пример добавления второго сайта.

## Быстрый старт

1. Склонируй репозиторий на сервер:
   ```bash
   git clone https://github.com/Noo001/ramo.git
   cd ramo
   ```

2. Создай `.env` из примера:
   ```bash
   cp .env.example .env
   # Отредактируй JWT_SECRET, POSTGRES_USER, POSTGRES_PASSWORD
   ```

3. Запусти:
   ```bash
   docker compose up -d --build
   ```

4. Открой в браузере:
   ```
   http://ramo.local
   ```
   или
   ```
   http://localhost
   ```
   или IP сервера в локальной сети.

5. Админка доступна по `/admin`:
   - Логин: `admin`
   - Пароль: `admin123`

## Добавление второго сайта

1. Скопируй пример:
   ```bash
   cp nginx/conf.d/second-site.conf.example nginx/conf.d/second-site.conf
   ```

2. Отредактируй `nginx/conf.d/second-site.conf`:
   - замени `server_name` на домен второго сайта;
   - замени `proxy_pass` на адрес второго сайта (порт или имя контейнера).

3. Перезапусти nginx:
   ```bash
   docker compose restart nginx
   ```

## Переменные окружения

| Переменная          | Описание                              | Значение по умолчанию       |
|---------------------|---------------------------------------|-----------------------------|
| `JWT_SECRET`        | Секретный ключ для JWT                | `change-me-in-production`   |
| `POSTGRES_USER`     | Пользователь PostgreSQL               | `ramo`                      |
| `POSTGRES_PASSWORD` | Пароль PostgreSQL                     | `ramo_password`             |
| `POSTGRES_DB`       | Имя базы данных                       | `ramo`                      |

## Важно про базу данных

Данные хранятся в Docker volume `postgres-data`. Они сохраняются между перезапусками контейнера, но **теряются**, если удалить volume.

При первом запуске автоматически применяются миграции и запускается seed, который создаёт:
- администратора;
- столы;
- настройки;
- всё меню из `prisma/seed-data.json`.

## Обновление после изменений в коде

```bash
git pull
docker compose up -d --build
```
