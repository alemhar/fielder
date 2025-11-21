# Stack Profile · Mobile (Expo + React Native)

## Overview

Fielder’s mobile app is built with **Expo + React Native + TypeScript**, using **Zustand** for global state and **npm** as the package manager. The app targets Android first, with iOS support planned.

This document captures the high-level structure, navigation approach, theming, and state management patterns for the mobile layer.

## Project Layout (Mobile Target)

_Target/future layout; current app lives under `FielderApp/` and will converge toward this structure._

```text
mobile/
  app/ or src/              # Application entry and screens
  navigation/               # Navigation stacks, tab navigators, route types
  screens/                  # Screen components (feature- or domain-based)
  components/               # Shared UI components
  stores/                   # Zustand stores (auth, session, UI, domain-specific)
  services/                 # API clients, platform services (e.g., notifications)
  theme/                    # Colors, typography, spacing, theming helpers
  hooks/                    # Reusable hooks (API hooks, UX patterns)
  assets/                   # Images, fonts, icons
  docs/                     # (Optional) Local notes; canonical docs live in repo root `docs/`
```

## Navigation

- **Library**: React Navigation (stack/tab navigators).
- **Guidelines**:
  - Keep navigation setup in `navigation/` (e.g., `RootNavigator`, `AuthNavigator`).
  - Use typed route params with TypeScript.
  - Pass IDs/keys through params; screens load data using hooks/stores instead of large objects in params.
  - Avoid deeply nested navigators unless justified; document any complex flows here.

## State Management

- **Local state**: `useState`, `useReducer` for view-local concerns.
- **Global state**: Zustand stores under `stores/`.
  - Examples: `auth-store.ts`, `session-store.ts`, `ui-store.ts`.
  - Stores should expose:
    - A minimal, serializable state shape.
    - Simple, synchronous actions for updating state.
    - Selectors to avoid over-subscribing components.

Link to rules: see [Mobile State Rules](./mobile-expo-react-native-rules.md#state-management-zustand).

## Styling & Theming

- **Baseline**:
  - Use `StyleSheet.create` for styles in simple components.
  - Centralize colors, spacing, and typography in `theme/`.
  - Support dark mode and ensure accessible contrast.
- **Components**:
  - Prefer small, reusable components for buttons, inputs, lists, and layout primitives.
  - Avoid inlining non-trivial style objects directly in JSX.

## API Integration

- The mobile app talks to the backend API over HTTPS.
- Use a small set of API client utilities under `services/` (e.g., `api-client.ts`, `auth-api.ts`).
- Centralize base URL and common headers/interceptors.
- Document request/response shapes in `docs/domain/data-contracts.md` and reference them from here.

### Auth & Session (Current Prototype)

- `services/auth-service.ts`:
  - `login(email, password)` → `POST /api/auth/login` → `{ user, company, token }`.
  - `fetchMe(token)` → `GET /api/me` with `Authorization: Bearer <token>` → `{ user, company }`.
- `stores/auth-store.ts`:
  - Holds `user`, `company`, `token`, plus `login`, `logout`, and `setSession` helpers.
  - Drives navigation between `LoginScreen` and `DashboardScreen` via `AppNavigator`.
- `storage/auth-storage.ts` + `App.tsx`:
  - Persist `{ user, company, token }` to AsyncStorage on login.
  - On app start, load any stored token and call `/api/me` to restore the session before rendering the navigator.

## Error Handling & UX

- Always handle loading, success, empty, and error states explicitly.
- Show user-friendly messages; avoid exposing raw backend messages.
- Consider a global error boundary or error surface for critical failures.

## Testing Strategy (Mobile)

- Use Jest + React Native Testing Library for:
  - Critical screens (navigation + state interactions).
  - Zustand stores (action behavior and derived values).
- Use manual exploratory testing on at least one Android device/emulator per feature.

## Open Questions / To-Do

- Finalize the `mobile/` folder structure and migrate from `FielderApp/`.
- Decide on the navigation structure (auth flow, main app tabs, deep links).
- Define initial set of Zustand stores (auth, session, UI, domain-specific).
- Wire mobile error-handling patterns to backend error formats as the API is defined.