# Task Log · Fielder

> Append-only log of completed tasks. New entries go at the top.

## [2025-11-22] UUIDs for Tenants, Users, Projects, and Activities
**Status**: ✅ Complete  
**Owner**: (TBD)  
**Impact**: [BACKEND] [DB] [DOCS]  
**Changed**: 
- `backend/database/migrations/0000_01_01_000000_create_tenants_table.php`  
- `backend/database/migrations/0001_01_01_000000_create_users_table.php`  
- `backend/database/migrations/2025_11_21_010000_create_projects_table.php`  
- `backend/database/migrations/2025_11_21_020000_create_activities_table.php`  
- `backend/app/Models/Tenant.php`  
- `backend/app/Models/User.php`  
- `backend/app/Models/Project.php`  
- `backend/app/Models/Activity.php`  
- `docs/domain/projects.md`  

**Summary**:  
Added non-guessable `uuid` columns for tenants, users, projects, and activities, and wired up model hooks to auto-generate them using `Str::uuid()`. These UUIDs are safe to expose in URLs and APIs while keeping numeric `id` values internal for joins.

**Technical Notes**:  
- Tenants, users, projects, and activities now all have a unique `uuid` column alongside their numeric primary key.  
- `Tenant`, `User`, `Project`, and `Activity` models generate UUIDs on `creating` via `booted()` hooks.  
- `Tenant` route model binding uses `uuid` instead of `id`; other models can adopt the same pattern later if desired.  

**Testing**:  
- [ ] Unit tests added/updated  
- [ ] Manual verification completed (migrations + basic CRUD)

**Docs Updated**:  
- `docs/domain/projects.md`

## [2025-11-22] Projects & Activities Schema-Driven Design
**Status**: ✅ Complete  
**Owner**: (TBD)  
**Impact**: [BACKEND] [DB] [DOCS]  
**Changed**: 
- `backend/database/migrations/2025_11_21_010000_create_projects_table.php`  
- `backend/database/migrations/2025_11_21_020000_create_activities_table.php`  
- `backend/database/migrations/0000_01_01_000000_create_tenants_table.php`  
- `backend/config/schemas.php`  
- `backend/database/seeders/TenantSeeder.php`  
- `backend/app/Models/Tenant.php`  
- `docs/domain/projects.md`  

**Summary**:  
Introduced schema-driven `projects` and `activities` tables. Each row now has flexible `details` and `details_schema` JSON columns so both web and mobile can render forms from the same per-tenant schema. Defined default project/activity schemas in config and persisted them per tenant on dedicated JSON columns.

**Technical Notes**:  
- `projects` is a single multi-tenant table with `id`, `tenant_id`, `title`, `details`, `details_schema`, `external_id`, and timestamps.  
- `activities` is a multi-tenant table linked to `projects`, with `type`, `details`, `details_schema`, and `external_id`.  
- Default schemas live in `config/schemas.php` and are also stored on the `tenants` table as `project_default_details_schema` and `activity_default_details_schema` for use when creating new projects/activities.  
- R&D vs regular behaviour is modelled by alternative schemas over the same `projects` table rather than separate tables or a `type` discriminator column.

**Testing**:  
- [ ] Unit tests added/updated  
- [ ] Manual verification completed (migrations + basic CRUD)

**Docs Updated**:  
- `docs/domain/projects.md`

## [2025-11-21] Introduce Multi-Tenancy and Mobile Auth Flow
**Status**: ✅ Complete  
**Owner**: (TBD)  
**Impact**: [FRONTEND] [BACKEND] [DB] [API] [DOCS]  
**Changed**: 
- `backend/database/migrations/0000_01_01_000000_create_tenants_table.php`  
- `backend/database/migrations/0001_01_01_000000_create_users_table.php`  
- `backend/app/Models/Tenant.php`  
- `backend/app/Models/User.php`  
- `backend/app/Http/Controllers/Api/AuthController.php`  
- `backend/routes/api.php`  
- `backend/composer.json` (Sanctum)  
- `docs/stacks/backend-api.md`  
- `docs/stacks/backend-laravel-auth-patterns.md`  
- `docs/domain/data-contracts.md`  
- `FielderApp/src/services/auth-service.ts`  
- `FielderApp/src/stores/auth-store.ts`  
- `FielderApp/src/storage/auth-storage.ts`  
- `FielderApp/App.tsx`  

**Summary**:  
Added single-database multi-tenancy (`tenants` table + `tenant_id` on `users`), Laravel Sanctum-based API auth (`/api/auth/login`, `/api/me`), and a mobile auth/session flow that persists `{ user, company, token }` and restores sessions on app start.

**Technical Notes**:  
- Backend uses Sanctum personal access tokens; API responses include a `company` object representing the user's tenant.  
- Mobile consumes these contracts via typed `AuthUser`, `Company`, `LoginResponse`, and `MeResponse` DTOs.  
- Session bootstrap leverages AsyncStorage and `/api/me` to hydrate auth state before rendering the navigator.

**Testing**:  
- [ ] Unit tests added/updated  
- [x] Manual verification completed (local login + session restore)

**Docs Updated**:  
- `docs/stacks/backend-api.md`  
- `docs/stacks/backend-laravel-auth-patterns.md`  
- `docs/domain/data-contracts.md`  
- `docs/stacks/mobile-expo-react-native.md`

## [YYYY-MM-DD] Example Entry (Replace Me)
**Status**: ✅ Complete  
**Owner**: [Name]  
**Impact**: [FRONTEND] [BACKEND] [DB] [API] [DOCS]  
**Changed**: `path/to/file1.ts`, `path/to/file2.tsx`

**Summary**:  
Short description of what changed and why.

**Technical Notes**:  
- Key decisions or patterns.

**Testing**:  
- [ ] Unit tests added/updated  
- [ ] Manual verification completed

**Docs Updated**:  
- `docs/index.md`
