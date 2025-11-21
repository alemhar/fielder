# Fielder Documentation Index

- **Vision**: Fielder is a mobile-first app built with Expo + React Native to manage and streamline field operations (tasks, assignments, status, and communication) for on-the-go users.
- **Current Release**: v0.1.0 (prototype)
- **Repo Layout**:
  - `FielderApp/` – Expo + React Native app (TypeScript, Zustand)
  - `backend/` – Laravel 12 starter kit (PHP) with React + Inertia (web UI + API endpoints)
  - `docs/` – Shared documentation hub (this folder)

## Stack Profiles

- [Mobile · Expo + React Native](stacks/mobile-expo-react-native.md) — App structure, navigation, theming, state strategy. ([rules](stacks/mobile-expo-react-native-rules.md))
- [Backend · API](stacks/backend-api.md) — Laravel 12 starter kit (PHP, React + Inertia) backend/web app and JSON endpoints for the mobile client. ([rules](stacks/backend-api-rules.md))
- [Data Layer](stacks/data-layer.md) — (Planned) Remote APIs, local storage, caching, synchronization. ([rules](stacks/data-layer-rules.md))

## Domain Knowledge

- `docs/domain/business-context.md` — Personas, domain rules, terminology.
- `docs/domain/data-contracts.md` — DTOs, API shapes, event payloads.

## Delivery & Flow

- `docs/delivery/roadmap.md` — Milestones, sequencing, and major bets.
- `docs/delivery/task-log.md` — Append-only log referencing code and docs touched per task.

## Architecture & Decisions

- `docs/stacks/` — Stack-specific overviews and rulebooks.
- `docs/decisions/` — Architecture Decision Records (ADRs) for significant technical choices.

## Issues & Troubleshooting

- `docs/issues/00-known-issues.md` — Active issues and limitations with workarounds.
- `docs/issues/resolved/` — Archive of past issues and post-mortems.
- `docs/troubleshooting/` — Runbooks for recurring debugging scenarios.

## How to Work With These Docs

1. **Start here** for any new feature or investigation.
2. Follow links to the relevant **stack profile** and **domain docs**.
3. When you finish a task:
   - Update `docs/delivery/task-log.md`.
   - Update the relevant stack/profile doc.
   - Add or update ADRs if you made a significant architectural choice.
4. Keep this index short and current; link out for details instead of inlining them here.