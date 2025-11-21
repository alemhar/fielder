# Data Contracts · Fielder

> This file defines the key DTOs and API shapes shared between mobile and backend.
> For now, this is a placeholder; update as endpoints and models are implemented.

## Activity (Draft)
- `id: string`
- `title: string`
- `description?: string`
- `assignedToUserId: string`
- `status: 'pending' | 'in_progress' | 'completed' | 'synced' | 'failed'`
- `startedAt?: string` (ISO timestamp)
- `completedAt?: string` (ISO timestamp)
- `durationSeconds?: number`

## Capture (Draft)
- `id: string`
- `activityId: string`
- `type: 'photo' | 'file' | 'note' | 'speech_note'`
- `uri?: string` (local or remote path for photo/file)
- `text?: string` (for notes / speech-to-text output)
- `createdAt: string`

## Sync Metadata (Draft)
- `syncId: string`
- `entityType: 'activity' | 'capture'`
- `entityId: string`
- `operation: 'create' | 'update' | 'delete'`
- `status: 'pending' | 'in_flight' | 'synced' | 'error'`
- `lastError?: string`

## Auth · Login (Draft)
- **LoginRequest**
  - `email: string`
  - `password: string`

- **Company**
  - `id: string` (tenant ID)
  - `name: string` (tenant display name, e.g., "Synnch AU")
  - `slug: string` (URL-safe identifier, e.g., `synnch-au`)

- **LoginResponse**
  - `user: { id: string; email: string }`
  - `company: Company`
  - `token: string` (Sanctum personal access token; sent as `Authorization: Bearer <token>`)

- **MeResponse**
  - `user: { id: string; email: string }`
  - `company: Company`

> Keep these contracts in sync with `routes/api.php`, `AuthController`, and the mobile `auth-service.ts` types.
