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

- **LoginResponse**
  - `user: { id: string; email: string }`
  - `token: string` (session token; JWT or similar in future)

> Refine these contracts once the backend/API is designed, and keep this file in sync.
