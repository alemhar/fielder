# Task Log · Fielder

> Append-only log of completed tasks. New entries go at the top.

## [2025-11-22] Mobile Activity Entry Composer: Speech-to-Text (Attempted) & Safe Areas
**Status**: ⚠️ Partial (Speech-to-text blocked by native module linking; safe areas applied)  
**Owner**: (TBD)  
**Impact**: [MOBILE] [DOCS]  
**Changed**: 
- `FielderApp/package.json` (added @react-native-voice/voice, expo-document-picker, expo-speech)  
- `FielderApp/src/services/speech-service.ts`  
- `FielderApp/src/screens/activities/ActivityEntriesScreen.tsx`  
- `FielderApp/src/screens/auth/LoginScreen.tsx`  
- `FielderApp/src/screens/dashboard/DashboardScreen.tsx`  
- `FielderApp/src/screens/projects/ProjectsScreen.tsx`  
- `FielderApp/src/screens/projects/ProjectActivitiesScreen.tsx`  

**Summary**:  
Added a microphone icon to the activity entry composer for speech-to-text, plus placeholder attachment/image icons. Applied SafeAreaView and bottom padding to all mobile screens to avoid system UI overlap (status bar, home indicator). Speech-to-text fails in Expo Go and development builds due to native module linking issues with @react-native-voice/voice; will be replaced by a paid cloud service later.

**Technical Notes**:  
- Speech-to-text implementation uses @react-native-voice/voice, which requires a development build and proper native linking. In Expo Go, the module is null, causing runtime errors.  
- Fallback error handling shows an alert when speech-to-text is unavailable.  
- SafeAreaView from react-native-safe-area-context is now used on all screens; bottom padding added to ensure buttons (e.g., “Add entry”) are above the home indicator.  
- Attachment/image icons are placeholders that show alerts; future work will integrate expo-document-picker or a paid file service.

**Follow-up**:  
- Replace @react-native-voice/voice with a paid speech-to-text service (e.g., Azure Speech, Google Cloud Speech, AWS Transcribe) for reliable cross-platform support.  
- Implement actual file/image upload via expo-document-picker and backend attachment endpoints.

**Testing**:  
- [ ] Unit tests added/updated  
- [x] Manual verification: SafeAreaView and bottom padding work on device; speech-to-text fails with clear error in Expo Go and dev build.

**Docs Updated**:  
- `docs/delivery/task-log.md`

## [2025-11-22] Activity Entries, Tenant Branding & Mobile UI
**Status**: ✅ Complete  
**Owner**: (TBD)  
**Impact**: [BACKEND] [DB] [API] [FRONTEND] [MOBILE] [DOCS]  
**Changed**: 
- `backend/database/migrations/2025_11_22_030000_create_activity_entries_table.php`  
- `backend/database/migrations/2025_11_22_040000_create_activity_entry_attachments_table.php`  
- `backend/app/Models/ActivityEntry.php`  
- `backend/app/Models/ActivityEntryAttachment.php`  
- `backend/app/Http/Controllers/Api/ActivityEntryController.php`  
- `backend/app/Http/Controllers/Api/ActivityController.php`  
- `backend/app/Http/Controllers/Api/ProjectController.php`  
- `backend/app/Http/Controllers/Api/AuthController.php`  
- `backend/routes/api.php`  
- `backend/config/branding.php`  
- `backend/app/Models/Tenant.php`  
- `backend/database/seeders/TenantSeeder.php`  
- `FielderApp/src/services/auth-service.ts`  
- `FielderApp/src/services/fielder-service.ts`  
- `FielderApp/src/stores/auth-store.ts`  
- `FielderApp/src/stores/theme-store.ts`  
- `FielderApp/src/theme/branding.ts`  
- `FielderApp/src/navigation/AppNavigator.tsx`  
- `FielderApp/src/screens/auth/LoginScreen.tsx`  
- `FielderApp/src/screens/dashboard/DashboardScreen.tsx`  
- `FielderApp/src/screens/projects/ProjectsScreen.tsx`  
- `FielderApp/src/screens/projects/ProjectActivitiesScreen.tsx`  
- `FielderApp/src/screens/activities/ActivityEntriesScreen.tsx`  

**Summary**:  
Introduced a multi-tenant activity timeline (`activity_entries` + `activity_entry_attachments`) for recording notes and file attachments per activity, exposed read/create APIs for mobile, and wired a first-pass mobile UI (login, dashboard, projects, activities, entries) that consumes the seeded medical example. Added tenant-level branding (primary/secondary colors + light/dark logos) and applied it to the mobile app with a manual light/dark theme toggle.

**Technical Notes**:  
- `activity_entries` stores free-text notes and optional structured `data` per activity/user/tenant; `activity_entry_attachments` stores file metadata and paths, with files saved on the `public` disk under a tenant- and activity-scoped path.  
- New Sanctum-protected APIs: project listing/detail, project activities, activity entries list, and create-entry (with optional attachments). Attachments include a public `url` field in API responses for easy consumption by clients.  
- Tenant branding defaults (primary/secondary colors, light/dark logo paths) live in `config/branding.php` and are also seeded via `Tenant` model boot hooks into the `settings->branding` JSON. Auth responses (`/api/auth/login`, `/api/me`) now include a `company.branding` payload to drive UI.  
- The Expo/React Native app now has a minimal but end-to-end flow: login via Sanctum, session restore via `/api/me`, dashboard showing tenant projects, per-project activities, and per-activity entries (notes + attachment counts), with a simple entry composer.  
- Mobile theming is centralized in `useBranding`, which merges tenant branding with a global `theme-store` to produce light/dark-aware background, text, border, and card colors. A small menu on the dashboard header allows switching between light and dark themes and signing out.

**Testing**:  
- [ ] Unit tests added/updated  
- [x] Manual verification completed (migrations, seeding, API responses, and mobile flow: login → dashboard → projects → activities → entries → add entry)

**Docs Updated**:  
- `docs/delivery/task-log.md`

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
