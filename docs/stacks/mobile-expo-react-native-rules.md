# Rulebook · Mobile (Expo + React Native)

This rulebook refines the baseline in `documentation-plan.md` (Section 9) for the **mobile app**. It is the authoritative guide for patterns, dos/don'ts, and overrides related to the Expo + React Native stack.

## 1. Scope & Priorities

- Platform: Expo + React Native + TypeScript.
- State: Zustand for global state, React hooks for local state.
- Targets: Android first; iOS to follow.
- Goals:
  - Predictable navigation and state flows.
  - Consistent styling and theming.
  - Good performance on mid-range Android devices.

## 2. Folder & Module Conventions

- Use a **feature-first** layout where possible:
  - `screens/auth/*`, `screens/tasks/*`, `screens/settings/*`.
  - `stores/auth-store.ts`, `stores/tasks-store.ts`, etc.
- Keep shared UI in `components/` and avoid duplicating common patterns.
- Keep navigation configuration in `navigation/` and avoid scattering navigator definitions across screens.

## 3. Components & Screens

- Use **function components** with `function ComponentName(props: Props) { ... }` syntax.
- Keep screens small:
  - Orchestrate navigation and state.
  - Delegate visual complexity to child components in `components/`.
- Extract complex logic to custom hooks rather than overloading components.

## 4. State Management (Zustand)

- Use Zustand for:
  - Auth/session state.
  - User profile/settings.
  - Domain-level data that must survive navigation (e.g., active task, filters).
- Store guidelines:
  - One store per domain/feature is preferred over one mega-store.
  - Keep state serializable and minimal.
  - Expose simple actions that update state synchronously.
  - Use selectors to subscribe components to only the data they need.
- Avoid:
  - Storing large, easily re-fetchable collections when a query pattern is enough.
  - Triggering complex side effects directly inside Zustand store creators.

## 5. Styling & Theming

- Define a theme module (e.g., `theme/colors.ts`, `theme/spacing.ts`, `theme/typography.ts`).
- Use `StyleSheet.create` in components for performance.
- Prefer flexbox layouts and consistent spacing increments from the theme.
- Ensure primary text and key UI elements meet contrast requirements on both light and dark backgrounds.

## 6. Navigation Rules

- Keep all navigators (stack/tab/root) defined in `navigation/`.
- Type all route params; no `any` in navigation types.
- Screen components should:
  - Use navigation hooks (`useNavigation`, `useRoute`) rather than receiving navigation as props.
  - Avoid side effects in top-level render; use `useEffect` for navigation side effects.

## 7. API & Data Access

- All HTTP calls go through shared utilities in `services/`.
- Do not call `fetch` directly from screens; use a service or hook.
- Map backend errors to user-friendly messages; never surface raw error strings from the server.
- Keep data contracts documented in `docs/domain/data-contracts.md` and keep mobile code aligned.

## 8. Testing & Quality

- Critical flows (login, main task flows, key settings) should have tests.
- Test Zustand stores where logic is non-trivial.
- Avoid snapshot tests that cover huge trees; prefer behavior-focused tests.

## 9. Overrides & Exceptions

Use this section to capture any deliberate deviations from the baseline rules.

- _None yet; add entries here as the project evolves._

## 10. When in Doubt

- Check `docs/index.md` and this file first.
- If still unclear, update this rulebook alongside your code change so the next contributor has a clear path.