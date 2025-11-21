# Backend Auth Patterns · Laravel 12 (PHP)

## 1. Purpose

Document how the Fielder backend authenticates mobile clients using Laravel 12.

This profile covers:
- Login and logout flows.
- Personal access token handling.
- Recommended guards/middleware.
- Error shapes that the mobile app should expect.

Treat this file as **authoritative** for auth decisions; keep it in sync with `routes/api.php`, controllers, and `docs/domain/data-contracts.md`.

---

## 2. Auth Stack Overview

- **Framework**: Laravel 12 (PHP).
- **Recommended token mechanism**: Laravel Sanctum personal access tokens.
- **Guard**:
  - API routes use an `auth` guard suitable for token auth (e.g., `auth:sanctum`).
- **Audience**: Fielder mobile app (Expo + React Native) as the primary API consumer.
- **Multi-tenancy**: Each user belongs to a tenant (`tenants` table). Auth responses expose this as a `company` object in the JSON payload.

> If the project adopts a different auth package (e.g., Passport or a custom JWT implementation), update this doc to reflect the actual stack and flows.

---

## 3. Core Endpoints (Recommended Set)

These are the typical endpoints for a token-based mobile API. Align `routes/api.php` to this list and update the doc when it changes.

- `POST /api/auth/login`
  - **Purpose**: Exchange email + password for a personal access token.
  - **Auth**: Public (no token required).
- `POST /api/auth/logout`
  - **Purpose**: Revoke the current token.
  - **Auth**: Requires valid token.
- `GET /api/me`
  - **Purpose**: Fetch the authenticated user profile for the current token.
  - **Auth**: Requires valid token.

Additional auth-related endpoints (e.g., password reset, refresh, device registration) should be documented here as they are introduced.

---

## 4. Login Flow (`POST /api/auth/login`)

### Request

- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Body (JSON)**:
  - `email: string`
  - `password: string`
- **Validation**:
  - Use a form request or inline validation for required fields and email format.

### Response (Success)

- **Status**: `200 OK`
- **Body** (example shape, keep in sync with `docs/domain/data-contracts.md`):

```json
{
  "user": {
    "id": "string",
    "email": "demo@fielder.app"
  },
  "company": {
    "id": "string",
    "name": "string",
    "slug": "string"
  },
  "token": "<personal-access-token>"
}
```

- `token` is a bearer token that the mobile app stores securely and sends on subsequent requests.

### Response (Failure)

- **Invalid credentials**:
  - Status: `401 Unauthorized` or `422 Unprocessable Entity` (pick one convention and keep it consistent).
  - Body:

    ```json
    {
      "message": "Invalid credentials."
    }
    ```

- **Validation errors** (missing fields, bad format):
  - Status: `422 Unprocessable Entity`.
  - Body (Laravel-style validation errors):

    ```json
    {
      "message": "The given data was invalid.",
      "errors": {
        "email": ["The email field is required."],
        "password": ["The password field is required."]
      }
    }
    ```

Mobile clients should map these messages into friendly UI errors rather than showing raw text.

---

## 5. Token Handling & Guards

### Token Creation (Login)

- After successful credential check, create a personal access token for the user.
- Give the token a descriptive name (e.g., `"fielder-mobile"`).
- Optionally scope tokens if different roles or clients are introduced.

### Token Usage (Requests)

- Mobile sends the token on every authenticated request via the `Authorization` header:

  ```http
  Authorization: Bearer <token>
  ```

- Protected routes in `routes/api.php` use middleware such as `auth:sanctum` so that:
  - `Auth::user()` or `request()->user()` returns the authenticated user.

### Token Revocation (Logout)

- `POST /auth/logout` should:
  - Identify the current token for the authenticated user.
  - Delete or revoke that token only (not all tokens for the user, unless that is the desired behavior).

- Consider additional endpoints for:
  - Revoking all tokens for a user (`/auth/logout-all`).
  - Listing active tokens for debugging/admin tools.

### Token Lifetime

- Define policy in this doc:
  - Are tokens long-lived and explicitly revoked?
  - Do they have an expiry time?
- Whatever policy is chosen, keep it documented here and in any security-related ADRs.

---

## 6. Securing Routes

- Public endpoints (e.g., `POST /api/auth/login`, health checks) live in `routes/api.php` **without** auth middleware.
- Authenticated endpoints should:
  - Be grouped and protected by `auth:sanctum` (or equivalent guard):
    - Ex: `Route::middleware('auth:sanctum')->group(function () { ... });`
  - Avoid mixing public and protected routes in the same group.

- When adding new feature modules (e.g., `activities`):
  - Decide whether each route is public or requires auth.
  - Document any role/permission assumptions here and in `docs/domain/business-context.md`.

---

## 7. Error Handling Patterns

- Use a **consistent error shape** across auth and non-auth endpoints, for example:

```json
{
  "message": "Invalid credentials.",
  "errors": null
}
```

or (for validation):

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

- Mapping guidance:
  - `401 Unauthorized`: missing or invalid token, invalid credentials.
  - `403 Forbidden`: token valid but user not allowed to perform the action.
  - `422 Unprocessable Entity`: validation failures.

Mobile error handling should rely on status codes + stable fields (`message`, `errors`) rather than parsing arbitrary strings.

---

## 8. Multi-Device & Environment Notes

- **Multi-device usage**:
  - Prefer **one token per device** so you can revoke a single device without affecting others.
  - Document how many concurrent devices are supported per user (if limited).

- **Environments**:
  - Dev/staging tokens should not be re-used in production.
  - Avoid hardcoding tokens; use environment variables or secure storage during local testing.

- **Mobile storage**:
  - Tokens should be stored using secure storage mechanisms on the device, not in plain AsyncStorage.

---

## 9. Keeping This Doc in Sync

Whenever auth logic changes, update this file as part of the task:

- New auth-related endpoints added or removed.
- Token lifetime/expiry policy changed.
- Error shapes updated.
- Guards or middleware strategy changed.

Also update:
- `docs/stacks/backend-api.md` (high-level backend overview).
- `docs/domain/data-contracts.md` (request/response DTOs).
- Relevant ADRs in `docs/decisions/` if the change is architectural.
