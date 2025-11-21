# Backend API Rulebook · Laravel 12 starter kit (PHP, React + Inertia)

> Specialization of the baseline rules in `WARP.md` and `docs/documentation-plan.md` for the Fielder backend.

## 1. Architecture & Modules
- Organize code by **feature/domain**: `Auth`, `Users`, `Activities`, `Sync`.
- Use Laravel controllers (e.g., `App\Http\Controllers\Api\AuthController`) as thin HTTP layer.
- Keep business logic in services or dedicated classes (e.g., actions, service classes), not in controllers.

## 2. DTOs & Validation
- Use Laravel form requests or inline validation for all API inputs.
- Map validated input to clear data structures (DTOs) internally where helpful.
- Keep request/response shapes in sync with `docs/domain/data-contracts.md`.

## 3. Auth & Security
- Use Laravel's auth system (e.g., Sanctum personal access tokens) for issuing tokens to the mobile app.
- Never log plaintext passwords or tokens.
- Add basic rate limiting to auth endpoints when exposed beyond local dev.
- Ensure CORS is configured correctly for the mobile client.

## 4. Error Handling
- Return consistent JSON error shapes (status code + `message` + optional `errors`).
- Map backend errors to stable error shapes so mobile can show friendly messages.

## 5. Logging & Health
- Prefer structured logs for key events (logins, sync operations, failures).
- Implement a basic health endpoint (e.g., `GET /health`) or reuse Laravel's health checks once infra grows.

## 6. Testing
- Start with feature tests for auth and key API flows.
- Prioritize tests for login, activity sync, and conflict resolution.

## 7. Overrides
- Any deviation from these rules must be documented in an ADR in `docs/decisions/` and linked here.
