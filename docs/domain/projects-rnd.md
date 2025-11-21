# Domain · R&D Projects

## Purpose

R&D (research and development) projects represent exploratory or experimental work for a tenant. Unlike regular projects, they are explicitly framed around **hypotheses**, **objectives**, and learning, not just delivery.

This doc captures how R&D projects differ from regular projects so we can choose a clean table design and API contract.

## Core Characteristics

- Belongs to a **tenant** (company).
- Has a clear **name** and optional **description** for human context.
- Adds explicit **hypothesis** and **objectives** fields.
- May track **success criteria** and **learning outcomes**.
- Still owns **activities** that implement the experimental work.

## Proposed Fields (Draft)

- `id: UUID | bigint` — primary key.
- `tenantId: string` — FK to `tenants.id`.
- `name: string`.
- `description?: string` — optional overview.
- `type: 'regular' | 'rnd'` — discriminator if we share a `projects` table.
- `status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'`.
- `startDate?: string (ISO)`.
- `dueDate?: string (ISO)`.
- `completedAt?: string (ISO)`.
-
- **R&D-specific fields** (these distinguish it from regular projects):
- `hypothesis: string` — statement of what we believe will happen.
- `objectives: string | JSON` — one or more objectives; may start as a single markdown string and later evolve to a structured list.
- `successCriteria?: string | JSON` — how we will know the hypothesis is supported or rejected.
- `notes?: string` — running notes, decisions, and findings (or link to a separate notes entity later).

## Relationships (Draft)

- `ProjectRnd` belongs to `Tenant`.
- `Tenant` has many R&D and regular projects.
- `ProjectRnd` has many `Activities` (work items, experiments, tasks).
- Future: link activities back to specific **objectives** or **success criteria** if we normalize them.

## Comparison with Regular Projects

- Regular projects: typically only need **name**, **description**, status, and dates.
- R&D projects: add **hypothesis**, **objectives**, and often **success criteria**.
- Both share common scheduling and status fields; the main difference is the **experimental framing**.

Your perception is roughly correct:
- Regular projects can usually get by with `description` + basic metadata.
- R&D projects benefit from first-class `hypothesis` and `objectives` fields (plus optional `successCriteria`).

## Design Options (DB-Level)

Current leaning:

- Use a **single `projects` table** with:
  - `type` column: `'regular' | 'rnd'`.
  - R&D-only columns (`hypothesis`, `objectives`, `successCriteria`) that are `NULL` for regular projects.
- Add database-level constraints later if we want to enforce that:
  - `hypothesis` is **required** when `type = 'rnd'`.
  - `objectives` is **required** when `type = 'rnd'`.

Alternative: separate tables for regular vs R&D, but that adds complexity for querying and is likely unnecessary for the first iteration.

## Open Questions

- Do R&D projects need **versioned hypotheses/objectives** over time, or is a single current version enough?
- Should objectives be **structured** (one row per objective) instead of a single text/JSON field?
- Do we need a dedicated concept for **experiments** separate from generic activities?

We can refine these answers here before committing to migrations and API contracts.
