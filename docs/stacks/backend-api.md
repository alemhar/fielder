# Backend Stack · Laravel 12 starter kit (PHP, React + Inertia)

## Purpose
This document describes the backend API for Fielder: the JSON API surface of the Laravel 12 starter kit (PHP, React + Inertia) that provides authentication and, later, activity/sync endpoints for the mobile app. The same Laravel application also serves the Inertia-powered React web UI, so keep web (Inertia) routes and JSON API routes clearly separated.

## High-Level Architecture
- **Runtime**: PHP + Laravel 12
- **API Style**: REST over HTTP (JSON responses)
- **Layers / Modules** (planned):
  - `Auth` — login and token issuance.
  - `Users` — user management (future).
  - `Activities` — activity lifecycle, captures, sync (future).

## Folder Structure (Backend)
- `backend/` — Laravel application root.
- `backend/app/Http/Controllers/Api/` — API controllers (e.g., `AuthController`, `ActivityController`).
- `backend/routes/api.php` — API routes (e.g., `POST /api/auth/login`).
- `backend/app/Models/` — Eloquent models (e.g., `User`, `Activity`).

## Auth / Login (Current)
- Endpoint: `POST /api/auth/login`
- Request body: `{ email: string; password: string }`
- Response: `{ user: { id: string; email: string }, company: { id: string; name: string; slug: string }, token: string }`.
- Implementation: Laravel auth (e.g., Sanctum) issues a personal access token for mobile clients.

Additional auth endpoint:

- `GET /api/me` — Returns the authenticated `user` and their `company` (tenant) for session restore when provided with a valid Sanctum token.

## Environment & Networking
- Default dev host: typically `http://localhost:8000` from `php artisan serve` (or your local web server).
- Mobile base URL in dev: `http://<dev-machine-ip>:8000` (or whatever host/port your Laravel app uses) plus any `/api` prefix.
- Configuration: `.env` controls DB connection, APP_URL, and Sanctum or session settings.

## Routing & Controllers
- All API routes live in `backend/routes/api.php`.
- Group routes by feature (e.g., `auth`, `activities`) and apply middleware such as `auth:sanctum` at the group level.
- Controllers under `App\Http\Controllers\Api` stay thin:
  - Validate input via form requests or inline validation.
  - Delegate to services/use-cases for business logic.
  - Return JSON responses with consistent shapes.

## Authentication & Tokens
- Fielder uses Laravel’s authentication stack (e.g., Sanctum) to issue **personal access tokens** for the mobile app.
- Typical flow:
  - Mobile calls `POST /api/auth/login` with email/password.
  - Backend validates credentials and issues a token tied to the user.
  - Mobile includes `Authorization: Bearer <token>` on subsequent API calls.
- Logout / token revocation is handled via a dedicated endpoint (e.g., `POST /api/auth/logout`) that deletes the current token.
- See `docs/stacks/backend-laravel-auth-patterns.md` for detailed auth flows and edge cases.

## Error Format & Contracts
- Successful responses return JSON payloads that match `docs/domain/data-contracts.md`.
- Error responses:
  - Use appropriate HTTP status codes (401/403/422/500).
  - Return a stable shape (e.g., `{ message: string, errors?: Record<string, string[]> }`).
  - Map validation errors from Laravel to field-level errors mobile can display.

## Activities & Sync (Planned)
- Activities endpoints will be exposed under a dedicated prefix (e.g., `/activities` or `/sync`).
- Mobile clients may queue work offline and sync when online; backend must handle:
  - Idempotent operations where possible.
  - Basic conflict detection/resolution rules.
- Detailed payloads and flows will be documented in `docs/domain/data-contracts.md` and any future sync-specific docs.

> See `backend-api-rules.md` for coding standards, validation, and auth policies.
