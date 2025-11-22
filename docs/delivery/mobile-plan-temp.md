# Fielder Mobile + Backend Plan (Temporary)

This is a working plan to implement the Fielder mobile UI and supporting backend APIs. It can be deleted once the work is complete.

## 1. Backend APIs

- **1.1 Auth support for mobile**
  - Reuse existing Sanctum login endpoint for issuing tokens.
  - Ensure `/api/user` (or `/api/me`) returns user + tenant info (including tenant uuid and seeded medical data visibility).
  - Ensure `/api/tenant/schemas` works for the logged-in user.

- **1.2 Projects endpoints**
  - `GET /api/projects`
    - Returns list of projects for the authenticated user’s tenant.
    - Include: `id`, `uuid`, `title`, `details`, `details_schema`, `external_id`, basic counts (activities, open/closed if available later).
  - `GET /api/projects/{project}`
    - Resolve by `uuid` (public) but keep `id` internal.
    - Include project plus related activities summary.

- **1.3 Activities endpoints**
  - `GET /api/projects/{project}/activities`
    - List activities for the project (filtered by tenant and project).
    - Include: `id`, `uuid`, `title`, `type` (core/supporting), `details`, `details_schema`, `external_id`.
  - `GET /api/activities/{activity}`
    - Resolve by `uuid`.
    - Include activity details + basic stats about entries (count, latest entry timestamp).

- **1.4 Activity entries (timeline) endpoints**
  - `GET /api/activities/{activity}/entries`
    - Paginated list of entries (most recent first).
    - Each entry: `uuid`, `body`, `data`, `user` (basic info), timestamps, and attachment metadata.
  - `POST /api/activities/{activity}/entries`
    - Create a new entry for an activity.
    - Request: `body` (text, optional), `data` (JSON, optional), optional file attachments.
    - Accept `multipart/form-data` for attachments.
  - Storage
    - Use Laravel filesystem to store attachment files under a tenant-specific path.

- **1.5 Authorization and multi-tenancy**
  - Every query is scoped to `auth()->user()->tenant_id`.
  - Route model binding by `uuid` but double-check tenant_id in queries.

## 2. Mobile app: Auth + data layer

- **2.1 Auth store & service**
  - Implement login call to backend (email + password) to obtain token.
  - Store token securely (AsyncStorage) + basic user + tenant info.
  - Implement `/me` fetch on app start to restore session.

- **2.2 API client**
  - Centralized HTTP client (fetch or axios) that attaches token.
  - Helpers for:
    - `getTenantSchemas()`
    - `getProjects()` / `getProject(projectUuid)`
    - `getProjectActivities(projectUuid)` / `getActivity(activityUuid)`
    - `getActivityEntries(activityUuid)` / `createActivityEntry(activityUuid, payload)`

## 3. Mobile app: Navigation & screens

- **3.1 Navigation structure**
  - Root stack in `AppNavigator`:
    - `Login`
    - `Dashboard`
    - `Projects`
    - `ProjectActivities`
    - `ActivityEntries`
  - `Dashboard` acts as a high-level overview + quick access to projects.

- **3.2 Screens**
  - `LoginScreen`
    - Wire up to login API and auth store.
  - `DashboardScreen`
    - Fetch and display:
      - Count of projects.
      - Highlight of a few medical projects and activity counts.
  - `ProjectsScreen`
    - List of projects for the tenant.
    - Tap -> `ProjectActivitiesScreen`.
  - `ProjectActivitiesScreen`
    - List activities (core/supporting) for a selected project.
    - Tap -> `ActivityEntriesScreen`.
  - `ActivityEntriesScreen`
    - Show timeline of entries (notes + attachments).
    - Form to add:
      - Text note.
      - Optional file attachment(s) (photo/document).

## 4. Implementation order (step-by-step)

1. **Backend**: Implement projects/activities/entries controllers + routes (read-only first, no attachments).
2. **Backend**: Add entry creation + attachments upload, scoped by tenant.
3. **Mobile**: Wire login to backend, store token, call `/me` and `/tenant/schemas`.
4. **Mobile**: Implement projects + activities lists (using seeded medical data).
5. **Mobile**: Implement activity entries list + basic "add note" (no attachment yet).
6. **Mobile**: Add attachments capture/upload to `createActivityEntry`.

This plan is temporary and can be refined as we discover more details while coding.
