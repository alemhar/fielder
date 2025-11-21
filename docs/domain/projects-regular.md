# Domain · Regular Projects

## Purpose

Regular (standard) projects represent structured, ongoing work for a tenant that has a clear scope and deliverable, but not necessarily an experimental hypothesis. They are the backbone of day-to-day operations in Fielder.

Use this doc to agree on the fields and relationships before finalizing database migrations.

## Core Characteristics

- Belongs to a **tenant** (company).
- Has a clear **name** and short **description**.
- Has optional **time bounds** (start / due / completed).
- Tracks **status** (e.g., planned, active, paused, completed, cancelled).
- Owns a set of **activities** that field users execute.

## Proposed Fields (Draft)

- `id: UUID | bigint` — primary key.
- `tenantId: string` — FK to `tenants.id`.
- `name: string` — human-friendly project name.
- `description?: string` — optional, short freeform description.
- `type: 'regular' | 'rnd'` — discriminator if we share a table with R&D projects.
- `status: 'planned' | 'active' | 'paused' | 'completed' | 'cancelled'`.
- `startDate?: string (ISO)` — when work is intended to start.
- `dueDate?: string (ISO)` — target completion date.
- `completedAt?: string (ISO)` — actual completion timestamp.
- `archivedAt?: string (ISO)` — soft-archive marker.
- `meta?: JSON` — optional bag for tenant-specific fields (only if needed).

> Open question: Do we want a dedicated `code`/`reference` field for integration with external systems (e.g., a job number)? Decide before migrations.

## Relationships (Draft)

- `ProjectRegular` belongs to `Tenant`.
- `Tenant` has many regular and R&D projects.
- `ProjectRegular` has many `Activities`.
- Activities may also link to an **assignee user** and **time entries** (future design).

## Notes vs R&D Projects

- Regular projects do **not** carry experimental **hypotheses** or detailed **objectives** by default.
- A single `description` plus status / dates is usually enough.
- If a tenant wants more structure (e.g., objectives), we can:
  - Use `meta` JSON for tenant-specific extensions, or
  - Promote a new first-class field once it becomes common.

## Design Options (DB-Level)

1. **Single `projects` table with `type` column** (recommended starting point)
   - `type` distinguishes `regular` vs `rnd`.
   - R&D-only fields (hypothesis, objectives) live on the same row but may be `NULL` for regular projects.
   - Simpler querying and indexing.

2. **Separate tables**: `projects_regular`, `projects_rnd`
   - More normalized, but higher complexity for code and reporting.
   - Probably premature for initial scope.

Decision is pending; use this doc to refine fields and constraints before we lock migrations.
