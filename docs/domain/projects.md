# Domain · Projects

## Purpose

Projects represent planned or exploratory work for a tenant. With the schema-driven design, we no longer distinguish "regular" vs "R&D" projects at the table level. Instead, a project's structure is defined by a `details_schema` JSON that drives both web and mobile UIs.

This doc describes the unified projects model used by the backend and clients.

## Core Characteristics

- Belongs to a **tenant** (company).
- Has a human-friendly **title**.
- Uses JSON **details** for values (description, dates, status, etc.).
- Uses JSON **details_schema** to describe those fields (type/label/order/options).
- Owns a set of **activities** that implement the work.

## Fields (DB-Level)

- `id: bigint` — primary key.
- `uuid: string` — non-guessable external identifier safe to expose in URLs/UI.
- `tenantId: bigint` — FK to `tenants.id`.
- `title: string` — project title shown in lists and headers.
- `details: JSON` — stores project-specific values (description, status, dates, tags, R&D fields, etc.).
- `detailsSchema: JSON` — describes the fields inside `details` (type/label/order/options) for UI rendering.
- `externalId?: string` — optional external reference (e.g., job number, Jira key).

## Examples of Fields in `details` / `detailsSchema`

Typical regular project fields (stored in `details` and described in `detailsSchema`):

- `description` — freeform description (string, often multiline).
- `status` — enum such as `planned`, `in_progress`, `on_hold`, `completed`.
- `startDate` — project start date.
- `expectedCompletionDate` — target completion date.
- `tags` — array of strings for simple tagging.

R&D-style fields (optional, also represented via schema):

- `hypothesis` — statement of what we believe will happen.
- `objectives` — list of objectives, potentially structured.
- `successCriteria` — how we know the hypothesis is supported or rejected.
- `notes` — running notes or findings.

Regular vs R&D behaviour is modelled by **which fields** are present in the `details_schema` for a given project, not by a `type` column.

## DB Design (Implemented)

We use a **single `projects` table** for all project shapes.

- Columns:
  - `id`, `uuid`, `tenant_id`, `title`, `details` (JSON), `details_schema` (JSON), `external_id`, timestamps.
- There is **no** `type` discriminator column.
- Tenants hold default project schemas on the `tenants` table as `project_default_details_schema`, seeded from `config/schemas.php`.
- When a project is created, its `details_schema` can be initialized from the tenant default or from a custom schema for that use case.

This keeps querying simple and lets the structure evolve over time without new migrations.
