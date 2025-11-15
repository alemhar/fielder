# Fielder

Fielder is a mobile-first field data collection app. It helps users capture structured information, photos, file uploads, and time spent on assigned activities, with offline-first behavior and sync to a backend service.

## Repo Structure

- `docs/` — Documentation (index, stacks, domain, delivery, issues).
- `backend/` — Laravel 12 (PHP) backend API (auth/login now, activities/sync later).
- `FielderApp/` — Expo + React Native mobile app (TypeScript, Zustand).

See `docs/index.md` for a curated overview of architecture, domain, and conventions.

## Getting Started (Development)

### Prerequisites

- PHP and Composer (for the Laravel backend)
- Node.js + npm
- Expo CLI (or `npx expo`)

### 1. Backend

```bash
cd backend
composer install
php artisan migrate # when database is configured
php artisan serve
```

Backend runs on `http://127.0.0.1:8000` by default (reachable at `http://<your-pc-lan-ip>:8000` from devices on the same Wi‑Fi). If you mount the API under an `/api` prefix, remember to include it in the mobile app config.

### 2. Mobile App

From the mobile app directory:

```bash
cd FielderApp
npm install
npx expo start
```

Configure the API base URL in `src/config/api.ts`:

```ts
export const API_BASE_URL = 'http://<your-pc-lan-ip>:8000'
```

### 3. Login Flow (Dev)

- Test backend login: `POST /api/auth/login` with JSON body:
  - `{ "email": "demo@fielder.app", "password": "password123" }`
- Mobile app calls `/api/auth/login` using `API_BASE_URL` to authenticate and receive a token.

## Documentation

- Main index: `docs/index.md`
- Mobile stack: `docs/stacks/mobile-expo-react-native.md`
- Backend stack: `docs/stacks/backend-api.md`
- Domain & contracts: `docs/domain/`

For coding and documentation rules, see `WARP.md` and `docs/documentation-plan.md`.
