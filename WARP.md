PROJECT: Fielder (Expo + React Native + Zustand + Backend API)

STACK
- Mobile: Expo + React Native + TypeScript + Zustand + npm
- Backend/API: Laravel 12 (PHP) REST API service
- Docs: single `docs/` root at repo level

REPO LAYOUT
- Mobile app: `FielderApp/`
- Backend: `backend/`
- Docs: `docs/`

PHILOSOPHY
- Write clean, maintainable, predictable code.
- Prefer simple, composable modules over clever abstractions.
- Favor functional/declarative patterns and strong typing.
- Screen/component-driven development for mobile; feature/endpoint-driven for backend.
- ALWAYS search for and reuse existing code (screens, components, hooks, stores, services) before creating new ones.

PLANNING & IMPLEMENTATION
- For any non-trivial task, write a short plan (bullets or pseudocode) first.
- Before coding:
  - Search the repo for similar patterns.
  - Check `docs/index.md` and stack profiles for conventions.
  - Extend or compose existing modules instead of inventing new patterns.
- Always think through: loading, empty, error, and success states; slow/failed network; navigation flow.

CODE STYLE (GENERAL)
- Tabs for indentation; single quotes for strings.
- No semicolons unless truly needed.
- Remove unused variables and imports.
- Always use `===`.
- Keep lines reasonably short (~100 chars); wrap for readability.
- Use trailing commas in multiline arrays/objects.

NAMING
- PascalCase: React components, screen components, types, interfaces.
- camelCase: variables, functions, hooks, Zustand store keys/actions.
- Feature-oriented folders: e.g. `screens/auth`, `stores/auth-store.ts`.
- UPPERCASE: env vars and global constants.
- Prefix: `handle` for event handlers, `is`/`has` for booleans, `use` for hooks.

MOBILE (EXPO + REACT NATIVE)
- Use function components with TypeScript.
- Keep screens small: orchestrate navigation and state, delegate UI to child components.
- Extract complex logic into custom hooks instead of large components.

NAVIGATION
- Use React Navigation; keep navigators in `navigation/`.
- Use typed route params; no `any` in navigation types.
- Pass IDs/keys via params; screens load data using hooks/stores, not huge param objects.
- Use navigation hooks (`useNavigation`, `useRoute`); avoid passing navigation as a prop.
- Navigation side effects go in `useEffect`, not in render.

STATE: ZUSTAND
- Local state: `useState` / `useReducer` for small, local concerns.
- Global state (Zustand) for:
  - Auth/session, user profile/settings.
  - Domain data that must persist across screens (e.g. active task, filters).
- Stores:
  - Prefer one store per domain/feature over one giant store.
  - Keep state minimal and serializable.
  - Expose simple, synchronous actions.
  - Use selectors so components subscribe only to what they need.
- Avoid:
  - Storing large re-fetchable collections when queries would suffice.
  - Complex side effects inside store creators/selectors.

STYLING & THEMING
- Centralize theme in `theme/` (colors, spacing, typography).
- Use `StyleSheet.create` for component styles.
- Prefer flexbox layouts and consistent spacing tokens.
- Ensure sufficient contrast for text and important UI, including dark mode.

PERFORMANCE
- Use `FlatList` / `SectionList` for non-trivial lists; stable `keyExtractor`.
- Avoid heavy work in render; use `React.memo`, `useCallback`, and `useMemo` judiciously.
- Keep global state small; split stores if re-renders become an issue.
- Pass minimal props into child components.

BACKEND/API (WHEN PRESENT)
- Organize by feature/domain (e.g. `users`, `auth`, `tasks`), not just generic layers.
- Keep HTTP controllers/handlers thin; business logic lives in services/use-cases.
- Define DTOs/schemas for all external inputs/outputs.
- Keep API contracts documented in `docs/domain/data-contracts.md` (and/or OpenAPI).
- Validate all inputs at the boundary; never trust client data.
- Use proper auth; never expose secrets.
- Add basic observability early (structured logs, simple metrics, health checks).

ERROR HANDLING & UX
- Always handle loading, empty, error, and success states explicitly in the UI.
- Centralize HTTP error handling where possible (API client / hooks).
- Map backend errors to friendly messages; don’t show raw server errors to users.
- Use schema-based validation (e.g. Zod) for complex forms when needed.

TESTING
- Prioritize tests for:
  - Critical business logic (mobile + backend).
  - Zustand stores with non-trivial logic.
  - Key navigation and auth flows.
- Use Jest + React Native Testing Library when test infra is in place.
- Prefer behavior-focused tests over huge snapshot tests.

DOCS
- For complex screens/stores/modules, add a brief file header with `@docs` pointing to the relevant markdown section.
- Keep markdown files focused; create new files when topics grow too large.
- Update `docs/index.md` when adding/renaming docs.
- For any non-trivial task, update:
  - `docs/delivery/task-log.md`
  - Relevant stack/rulebook docs
  - ADRs when architecture decisions are made

RULE HIERARCHY
- Project stack rulebooks in `docs/stacks/*-rules.md` override these baseline rules.
- ADRs in `docs/decisions/` override general patterns.
- If unsure: consult `docs/index.md` and ask before introducing new patterns.