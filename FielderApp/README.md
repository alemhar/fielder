# Fielder Mobile App

Expo + React Native mobile client for Fielder. It lets field users capture activities, notes, photos, file uploads, and time spent, with offline-first behavior and sync to the Fielder backend.

## Project Setup

```bash
cd FielderApp
npm install
```

## Running the App (Development)

```bash
cd FielderApp
npx expo start
```

Use the Expo CLI output to open the app on:
- A physical device (via Expo Go on the same Wi‑Fi), or
- An emulator/simulator.

## Backend Configuration

The app talks to the Laravel 12 starter kit (PHP, React + Inertia) backend running from `../backend`.

Set the API base URL in `src/config/api.ts`:

```ts
export const API_BASE_URL = 'http://<your-pc-lan-ip>:8000'
```

- Backend dev server is typically started with:
  - `cd backend`
  - `php artisan serve`
- By default, the backend listens on `127.0.0.1:8000`, so devices on the same Wi‑Fi can reach it at `http://<your-pc-lan-ip>:8000` (or whatever host/port you configure for Laravel).

## Auth (Dev)

- Login endpoint: `POST /api/auth/login`
- Dev credentials (backend demo user):
  - `email`: `demo@fielder.app`
  - `password`: `password123`

The mobile app uses this endpoint to obtain a user object and token, managed via a Zustand auth store.

## Documentation

- Global project docs: `../docs/index.md`
- Mobile stack details: `../docs/stacks/mobile-expo-react-native.md`
- Programming rules: `../WARP.md`, `../docs/documentation-plan.md`
