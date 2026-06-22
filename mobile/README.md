# RAMO Mobile

Мобильное приложение для гостей ресторана RAMO на React Native + Expo.

## Возможности

- 📋 Просмотр меню с категориями
- 🛒 Корзина и оформление заказа со стола
- 📷 Сканер QR-кодов на столах (`/menu?tableId=N`)
- 🗺 Карта зала с занятостью столов
- 📅 Бронирование столов
- 👤 Личный кабинет с баллами лояльности

## Запуск

1. Убедитесь, что backend запущен (`site` на порту 3000).
2. Для реального устройства укажите LAN IP компьютера в `.env`:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
```

3. Установите зависимости и запустите:

```bash
cd mobile
npm install
npx expo start
```

4. Отсканируйте QR-код в терминале приложением Expo Go (iOS/Android).

## Сборка

```bash
npx expo prebuild
npx expo run:android
npx expo run:ios
```

## Структура

- `App.tsx` — корневая навигация (табы + стеки)
- `src/api.ts` — клиент backend API
- `src/components/` — переиспользуемые компоненты
- `src/screens/` — экраны приложения
- `src/context/CartContext.tsx` — состояние корзины
