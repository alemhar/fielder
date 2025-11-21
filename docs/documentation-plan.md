# Documentation Flow Plan

**Version**: 1.0.0  
**Last Updated**: 2025-11-14  
**Stack**: Expo + React Native (TypeScript) + npm

## 1. Purpose
Create a self-documenting workflow that keeps feature work, architecture knowledge, and UI/UX rules in sync with the codebase. The initial stack reference assumes a mobile-first Expo + React Native app (TypeScript, npm), but the layout is intentionally swappable so another stack (web, backend, database) can drop in by replacing a few Markdown stubs.

## 2. Guiding Principles
1. **Index-First Navigation** – `docs/index.md` owns the curated table of contents so contributors and LLMs land on the right context in one hop.
2. **Pluggable Stack Profiles + Rulebooks** – Each technology (Expo, React Native, backend, data layer) keeps an overview file and a companion rulebook seeded with best practices so replacements are lightweight.
3. **Task-Coupled Updates** – A task is only "done" when the relevant Markdown (usually the index link + a stack/profile note) has been updated.
4. **Traceable Code Surfaces** – Complex screens/hooks/services carry inline headers describing dependencies, data contracts, and parent/child interactions that mirror the docs.
5. **Low Friction** – Updating documentation should be fast (copy/paste templates + checklists) so it does not get skipped.

## 3. Minimal Markdown Topology
```
docs/
  index.md                        # Single source of truth for navigation and project status
  stacks/
    mobile-expo-react-native.md   # App architecture, navigation, theming, shared hooks/components
    mobile-expo-react-native-rules.md # Guardrails and best practices for the mobile React Native layer
    backend-api.md                # (Optional) Backend/API profile when introduced
    backend-api-rules.md          # (Optional) Coding standards, integration/testing rules for backend
    data-layer.md                 # (Optional) Data/storage profile (REST, GraphQL, local storage, etc.)
    data-layer-rules.md           # (Optional) Data modeling, caching, sync policies
  domain/
    business-context.md       # Personas, domain rules, terminology
    data-contracts.md         # DTOs, API shapes, event payloads
  delivery/
    roadmap.md                # Milestones + sequencing
    task-log.md               # Append-only log referencing code + docs touched
  decisions/
    adr-template.md           # Copy-on-write Architecture Decision Records
  issues/
    00-known-issues.md        # Active bugs/limitations with workarounds
    resolved/                 # Archive of resolved issues for future reference
  troubleshooting/
    runbook-template.md       # Copy-on-write troubleshooting runbooks
  references.md               # Conventions, tooling, checklists
```
> **Swapping stacks**: replace the files under `docs/stacks/` with your technology-specific profiles and rulebooks, then update the index links. Everything else remains valid.

## 3.5. AI-Friendly Conventions
Optimize documentation structure for efficient LLM context loading and token usage.

**Context Loading Priority**:
1. **Always load `docs/index.md` first** — Keep under 500 tokens for fast orientation
2. **Load relevant stack profile(s) second** — 800-1000 tokens each maximum
3. **Load specific rulebook only if needed** — Stack-specific details when general rules insufficient
4. **Use file banners for file-level context** — Avoid reading entire files; extract purpose from banner comments

**Token Budget Guidelines**:
- `docs/index.md`: 400-500 tokens (strict)
- Each stack profile (`.md`): 800-1000 tokens
- Each rulebook (`*-rules.md`): 1200-1500 tokens
- Task log entries: 100-150 tokens per entry
- File banners: 15-25 lines maximum

**Best Practices for AI Context**:
- Use code search tools before requesting full file reads
- Reference documentation by section anchors (e.g., `docs/stacks/mobile-expo-react-native.md#navigation`)
- Keep cross-references explicit and linkable
- Front-load critical information in each document

**Dynamic Documentation Creation**:
- **Keep existing MD files focused and concise** — Each doc should cover a single concern/domain
- **Create new MD files when context grows** — If a topic exceeds token budget or becomes a distinct concern, spin off a new file
- **AI should generate context-specific docs on demand** — Rather than bloating `index.md` or stack profiles, create targeted files (e.g., `docs/stacks/backend-laravel-auth-patterns.md` for complex auth logic)
- **Link from index/profiles** — New files must be cross-referenced in `docs/index.md` or parent profiles for discoverability
- **Favor narrow, deep files over wide, shallow ones** — Better to have `docs/domain/user-permissions.md` + `docs/domain/user-profiles.md` than one giant `docs/domain/users.md`
- **Never dump all information into core files** — Core docs (`index.md`, stack profiles, rulebooks) are navigation hubs, not encyclopedias

## 3.6. Issue Resolution & Debugging Documentation
Structured approach to tracking bugs, debugging investigations, and building institutional knowledge around problem-solving.

### Known Issues Registry
Maintain active and resolved issues in a dedicated directory:

```
docs/
  issues/
    00-known-issues.md        # Active bugs/limitations with workarounds
    [YYYY-MM-DD]-[short-description].md  # Individual issue investigations
    resolved/                 # Archive of fixed issues for future reference
      2024-11-auth-race.md    # Example: detailed post-mortem
  troubleshooting/
    [topic]-runbook.md        # Recurring debugging scenarios
```

### Issue Documentation Template
When encountering a significant bug or complex debugging session, create:

**File**: `docs/issues/[YYYY-MM-DD]-[short-description].md`

```markdown
# Issue: [Brief Title]

**Status**: 🔴 Active | 🟡 Investigating | ✅ Resolved  
**Severity**: Critical | High | Medium | Low  
**Affected**: [FRONTEND] [BACKEND] [DB] [API]  
**Discovered**: YYYY-MM-DD  
**Reporter**: [Name]  
**Assignee**: [Name]

## Symptoms
- Observable behavior (error messages, stack traces, user impact)
- Reproduction steps (minimum viable steps to trigger)
- Frequency (always, intermittent, once)
- Environment details (browser, Node version, deployment env, data conditions)

## Investigation Timeline
### [YYYY-MM-DD HH:MM] - Initial Discovery
- [What was observed]
- [Initial hypothesis]

### [YYYY-MM-DD HH:MM] - Investigation Step 1
- Hypothesis: [what you thought]
- Test: [what you tried]
- Result: [what you found]
- Tools used: [debugger, logging, profiling, etc.]

### [YYYY-MM-DD HH:MM] - Key Finding
- [Breakthrough insight or root cause identified]

## Root Cause
[Technical explanation of why the issue occurs, including:
- Code path that triggers the bug
- Data or state conditions required
- Architectural factors contributing to the issue]

## Resolution
**Fix Implemented**:
- Code changes: [summary]
- PR link: #XXX
- Files modified: `path/to/file1.ts`, `path/to/file2.ts`

**Verification Steps**:
1. [How to manually test the fix]
2. [Automated tests added]
3. [Metrics to monitor]

**Deployment**:
- Deployed: YYYY-MM-DD
- Verified in production: YYYY-MM-DD

## Prevention Measures
- **Code changes**: [patterns introduced to prevent recurrence]
- **Tests added**: [unit, integration, e2e coverage]
- **Monitoring**: [alerts, dashboards, logging added]
- **Documentation updates**: 
  - Stack profile: `docs/stacks/[relevant].md` (if pattern changed)
  - ADR: `docs/decisions/adr-XXX.md` (if architectural decision made)
  - Runbook: `docs/troubleshooting/[topic].md` (if pattern could recur)

## Related Issues
- Similar past issues: [links to resolved/]
- Related ADRs: [links]
- External references: [Stack Overflow, GitHub issues, etc.]

## Lessons Learned
[What the team learned from this investigation that could help future debugging]
```

### Troubleshooting Runbooks
For recurring or complex debugging scenarios, create runbooks in `docs/troubleshooting/`:

**File**: `docs/troubleshooting/[topic]-runbook.md`

```markdown
# Troubleshooting: [Topic/Symptom]

**Common Scenarios**: [Brief list of when to use this runbook]

## Quick Diagnosis
1. Check [metric/dashboard]: `[link or command]`
2. Review [log/service]: `[where to look]`
3. Verify [condition]: `[how to check]`

## Diagnostic Commands
```bash
# Check database connection pool
docker exec -it mongodb mongo --eval "db.serverStatus().connections"

# Review recent errors in logs
kubectl logs -l app=backend --tail=100 | grep ERROR
```

## Common Causes & Solutions
| Symptom | Likely Cause | Fix | Verification |
|---------|--------------|-----|-------------|
| Timeouts during peak hours | Connection pool exhausted | Increase `maxPoolSize` in `config/db.ts` | Monitor pool metrics for 24h |
| Random connection drops | Network instability | Add retry logic in `db/connection.ts` | Check error rate drops |
| Slow queries | Missing index | Add index per `docs/stacks/database-mongodb.md#indexes` | Run `explain()` |

## Step-by-Step Resolution
### Scenario 1: [Specific Problem]
1. [Detailed step]
2. [Detailed step]
3. [Expected outcome]

### Scenario 2: [Another Problem]
1. [Detailed step]
2. [Detailed step]

## Escalation Path
- **After 15 minutes**: Notify team in Slack #engineering
- **After 30 minutes**: Page on-call engineer
- **Critical impact**: Immediately escalate to [person/team]

## Prevention
- [Monitoring to add]
- [Code patterns to adopt]
- [Configuration changes]

## Related Documentation
- Stack profile: `docs/stacks/[relevant].md`
- Known issues: `docs/issues/00-known-issues.md`
- Past incidents: `docs/issues/resolved/[similar].md`
```

### Active Known Issues List
Maintain `docs/issues/00-known-issues.md` as a quick reference:

```markdown
# Known Issues & Limitations

**Last Updated**: YYYY-MM-DD

## Active Issues

### 🔴 Critical
*None currently*

### 🟡 High Priority

#### [Issue Title] (Issue #42)
- **Impact**: [Brief user impact]
- **Workaround**: [Temporary fix or mitigation]
- **ETA**: [Expected resolution date]
- **Details**: `docs/issues/2024-11-auth-race.md`

### 🟢 Low Priority / Technical Debt

#### [Issue Title]
- **Impact**: [Brief description]
- **Workaround**: [If applicable]
- **Tracked in**: Issue #XXX

## Known Limitations
- **Feature X**: Currently only supports Y (not Z)
- **Performance**: Bulk operations over 10k items may timeout

## Recently Resolved
- [2024-11-10] Auth token race condition → `docs/issues/resolved/2024-11-auth-race.md`
- [2024-11-05] MongoDB index missing → Task log entry 2024-11-05
```

### Debugging Workflow Rules

**When debugging a non-trivial issue** (anything taking >1 hour or affecting users):

1. **Create an issue doc immediately** — Don't rely on memory; start `docs/issues/[date]-[topic].md`
2. **Capture context early**:
   - Full stack traces and error messages
   - Timestamps and affected user IDs
   - Environment state (versions, config, deployment timing)
   - Data snapshots if relevant
3. **Update the investigation timeline as you work** — Log hypotheses, tests, and findings
4. **Link from task log** when resolution is deployed
5. **Move to `resolved/` after production verification** — Keep for institutional knowledge
6. **Extract patterns into runbooks** if the issue category could recur
7. **Update `00-known-issues.md`** while issue is active, remove when resolved

### Integration with Task Log

Task log entries for bug fixes **must reference** the issue doc:

```markdown
## [2024-11-14] Fix Auth Token Race Condition (Issue #42)
**Status**: ✅ Complete  
**Impact**: [BACKEND] [API]  
**Issue Doc**: `docs/issues/resolved/2024-11-auth-race.md`  
**Changed**: `src/auth/token-service.ts`, `tests/auth/token.test.ts`  

**Summary**:  
Resolved race condition in token refresh flow causing intermittent 401 errors.

**Prevention**:
- Added mutex lock around token refresh
- Increased test coverage for concurrent scenarios
- Updated `docs/troubleshooting/auth-runbook.md` with diagnosis steps
```

### When to Create Issue Docs vs. Just Fix

**Create issue doc if**:
- Investigation takes >1 hour
- Issue affects production users
- Root cause is non-obvious or could recur
- Multiple team members need context
- Resolution requires architectural decisions

**Just fix and log in task-log if**:
- Obvious typo or simple bug
- Quick fix (<15 min investigation + implementation)
- Isolated to single function with clear cause
- No user impact

## 4. `index.md` Blueprint
Each category should be condensed to the essentials needed for prompting or onboarding:
1. **Project Snapshot** – Vision, current release, environment URLs.
- **Stack Reference Links** – Bullet list linking to the mobile and backend profiles (e.g., Expo/React Native + Laravel API) with one-line summaries and their rulebooks.
3. **Domain Knowledge** – Links to domain docs and vocab table.
4. **Delivery Signals** – Latest roadmap milestone and pointer to the most recent `task-log.md` entry.
5. **Automation Hooks** – Reminders/scripts (e.g., pre-commit) that enforce doc updates.

_Optional snippet for `index.md`_
```
# Context Index
- **Vision**: <50-word summary>
- **Current Release**: v0.1.0 (ETA ...)

|## Stack Profiles
|- [Mobile · Expo + React Native](stacks/mobile-expo-react-native.md) — App structure, navigation, theming, state strategy. ([rules](stacks/mobile-expo-react-native-rules.md))
|- [Backend · API] (stacks/backend-api.md) — (Optional) When backend exists: endpoints, integration patterns. ([rules](stacks/backend-api-rules.md))
|- [Data Layer] (stacks/data-layer.md) — (Optional) Data storage/sync (remote APIs, local storage, caching). ([rules](stacks/data-layer-rules.md))
```

## 5. Stack Rulebook Files
Each stack profile owns a companion `*-rules.md` file that captures the opinionated guardrails for that technology.

**Creation workflow when a new stack is added**
1. Copy the rulebook template (or reuse an existing one) into `docs/stacks/<tech>-rules.md`.
2. Seed it with published best practices for that technology (styling guidelines, patterns to prefer/avoid, testing expectations, security notes).
3. Add a "Team Overrides" section describing how this project adapts or relaxes those defaults.
4. Cross-link the rulebook from `index.md` and the owning profile file so prompts and humans discover it quickly.
5. Update the rulebook whenever a task introduces a new convention, restriction, or exception.

**Suggested rulebook outline**
- Purpose + scope
- Core patterns (state mgmt, module layout, schema strategy, etc.)
- Performance/security requirements
- Testing + review checklist
- Overrides/waivers log

## 6. Script-Level Traceability Standards
For every complex script/component:
1. **File Banner** – Comment block capturing purpose, inputs/outputs, parent invoker, and child dependencies.
2. **Function Context Comments** – Non-trivial functions/methods include a short comment summarizing intent, key inputs/outputs, invariants, and how they link back to parents/children so updates stay localized.
3. **Dependency Map** – Inline list (or table) of imported modules with reason for use.
4. **Data Interchange Notes** – Describe DTO fields, validation, and error contracts shared with parents/children.
5. **Cross-Link to Docs** – Reference the relevant Markdown section (e.g., `docs/stacks/frontend-react.md#forms`).
6. **Change Hooks** – When behavior changes, update both the banner comment and the corresponding stack/domain doc before closing the task.

## 7. Update Flow After Each Task
1. **Touch the Task Log** – Add an entry describing what changed, where, and why.
2. **Refresh the Index** – Ensure `index.md` points to any new/renamed docs and highlights noteworthy changes (e.g., new endpoint, updated theme rule).
3. **Update Relevant Stack, Rulebook, or Domain Files** – Keep technology-specific nuances close to their owning file.
4. **Align Code Comments** – Update file banners/data-contract annotations to mirror the documentation.
5. **Checklist Before Completion**
   - [ ] Task log entry added
   - [ ] `index.md` reviewed/updated
   - [ ] Stack + rulebook / domain doc updated
   - [ ] Code comments synced
   - [ ] Follow-ups captured

## 7.5. First-Time Setup Checklist
Before starting development with this workflow:
- [ ] Copy Section 9 (Main Programming Rules) into Windsurf's custom rules settings
- [ ] Run the directory scaffolding (see Section 8, step 1) to create the folder structure
- [ ] Draft initial `docs/index.md` with project vision, stack links, and current status
- [ ] Seed the mobile stack rulebook file (`mobile-expo-react-native-rules.md`) with community defaults for Expo + React Native (navigation, styling, state management)
- [ ] Optionally, create backend and data-layer rulebooks when those parts of the architecture are introduced
- [ ] Create a reusable file banner snippet for your IDE (VS Code, WebStorm, etc.)
- [ ] Commit the documentation structure to version control before writing application code

## 7.6. Documentation Health Metrics
Track documentation effectiveness quarterly to ensure the system stays valuable.

**Metrics to Monitor**:
- **File Banner Coverage**: % of `.ts`/`.tsx` files with valid banners (target: 90%+)
- **Doc Update Lag**: Average time between code change → corresponding doc update (target: < 24 hours)
- **Fallback References**: Number of times `docs/index.md` was consulted when Windsurf rules insufficient (indicates rule gaps)
- **Task Log Compliance**: % of PRs with task-log updates (target: 100%)
- **Stale Document Count**: Docs not updated in 90+ days while related code changed (target: 0)

**Review Cadence**:
- Monthly: Spot-check 5 random files for banner quality
- Quarterly: Full metric review and plan adjustment
- Per-release: Validate all stack profiles reflect current architecture

## 7.7. New Developer Onboarding Checklist
Accelerate new team member productivity with structured documentation immersion.

**Week 1 Goals**:
- [ ] Read `docs/index.md` + all 3 stack profiles (30-45 min investment)
- [ ] Review last 3 task-log entries to see pattern examples
- [ ] Install file banner snippet in IDE (VS Code, WebStorm, etc.)
- [ ] Shadow experienced developer through one full task cycle: code → test → doc → PR
- [ ] Identify one small documentation improvement and submit PR

**Week 2 Goals**:
- [ ] Complete first solo task with full documentation updates
- [ ] Participate in one ADR discussion or review
- [ ] Verify understanding by explaining the doc workflow to another new joiner

## 8. Next Steps
1. Create the directory structure shown in Section 3 (stubs are fine to start).
2. Draft the `index.md` blueprint using the snippet above, tailoring language to current goals.
3. Populate the Expo/React Native mobile profile file with the minimum viable context (navigation, screen structure, theming, state management).
4. Seed the corresponding mobile rulebook file with community best practices plus any immediate project-specific constraints.
5. Introduce a reusable comment banner snippet (e.g., VS Code snippet) for script-level traceability.
6. Revisit this plan after the first few features ship; adjust categories or granularity based on what provided the most value.

## 8.5. Tooling Recommendations (OPTIONAL)
> **Note**: This section is **optional** and provided as suggestions only. AI assistants and developers are **not required** to enforce or implement these tools. Adopt based on team preferences and project maturity.

**Required for Manual Workflow** (if not automating):
- Markdown linter (e.g., `markdownlint`) for consistency
- IDE snippet manager for file banners (built into VS Code, WebStorm)
- Manual PR review checklist for doc updates

**Recommended Enhancements** (adopt incrementally):
- **Git hooks**: Validate `task-log.md` touched in commits affecting code (husky + custom script)
- **Dependency visualization**: Auto-generate graphs from file banner `@parent/@children` tags (custom script or Madge)
- **Link validation**: CI job to verify internal doc links resolve (markdown-link-check)
- **Diagram tooling**: PlantUML or Mermaid for architecture diagrams in stack profiles
- **Dependabot**: Auto-PR when framework best practices change (requires manual review)

**Integration Ideas** (for mature projects):
- Notion/Confluence sync if team uses external wiki
- Slack bot that posts task-log updates to project channel
- PR template that includes doc-update checklist


## 9. Main Programming Rules (AI Assistant Baseline)

**⚠️ ACTION REQUIRED**: Copy this section into the AI assistant’s custom rules (or a dedicated `docs/stacks/mobile-expo-react-native-rules.md` section) before relying on generated code.

This reference captures the shared conventions for the **Fielder monorepo**:
- Mobile app: **Expo + React Native + TypeScript + Zustand + npm**
- Backend/API: **Laravel 12 starter kit (PHP, React + Inertia)** (web UI + REST-style JSON endpoints; framework-specific patterns live in `docs/stacks/backend-api*.md`)
- Shared docs: single `docs/` root at the repo level.

It serves as the baseline for all code generation and review. Stack-specific rulebooks in `docs/stacks/*.md` may override these.

### 9.1 Development Philosophy
- Write clean, maintainable, and scalable code.
- Favor **simple, composable modules** over clever abstractions.
- Prefer **functional/declarative patterns** (pure functions, predictable state flows) over imperative ones.
- Emphasize **type safety and static analysis** (TypeScript first).
- Practice **screen/component-driven development** for mobile; **endpoint/feature-driven** development for backend.
- **⚠️ CRITICAL: Always search for and reuse existing functions, components, screens, hooks, stores, and utilities before creating new ones. Stay aligned with established project patterns and conventions.**

### 9.2 Code Implementation Guidelines
**Planning Phase**
- Begin with a quick written plan (bullets or pseudocode) for any non-trivial task.
- **Search the repo** before writing new code:
  - Use code search tools to find similar screens/components/stores/services.
  - Check `docs/index.md` and stack profiles for established patterns.
  - Prefer extending or composing existing modules over inventing new patterns.
- Think through edge cases: offline state, slow network, API errors, loading and empty states, navigation flows.
- If a change spans many files or crosses mobile + backend boundaries, pause to confirm the approach (ADR or small design note).

**Code Style (General)**
- Use tabs for indentation.
- Use single quotes for strings unless escaping becomes awkward.
- Omit semicolons unless required for disambiguation.
- Eliminate unused variables and imports.
- Add a space after keywords and before function parentheses.
- Always use strict equality (`===`).
- Space infix operators and add space after commas.
- Keep `else` on the same line as the closing brace.
- Use braces for multi-line conditionals.
- Aim to keep lines at or under ~100 characters; wrap early for readability.
- Use trailing commas in multiline arrays/objects.

**Naming Conventions**
- **PascalCase** for React components, screen components, types, and interfaces.
- **kebab-case** or **feature-based folders** (e.g., `screens/auth`, `stores/session-store.ts`).
- **camelCase** for variables, functions, hooks, Zustand store keys/actions.
- **UPPERCASE** for environment variables, constants, global configs.
- Prefix event handlers with `handle`, booleans with verbs (`isLoading`, `hasError`), hooks with `use`.

### 9.3 Mobile (Expo + React Native) Practices
**Components & Screens**
- Use **functional components with TypeScript**.
- Keep screens focused: orchestrate navigation, wire stores/hooks, and delegate presentation to smaller components.
- Extract reusable logic into custom hooks (`useSomething`) and shared components.
- Avoid deeply nested JSX; break into smaller components when needed.

**Navigation**
- Use **React Navigation** (or the chosen navigation library) consistently.
- Keep navigation configuration (stacks, tabs) in dedicated files under a `navigation/` folder.
- Prefer passing IDs/keys through route params; read data via hooks/stores rather than stuffing big objects into params.

**State Management (Zustand)**
- Use React local state (`useState`, `useReducer`) for small, local concerns.
- Use **Zustand** for cross-screen/global concerns (auth session, user profile, feature flags, settings, etc.).
- Organize stores under a `stores/` folder with clear names (e.g., `auth-store.ts`, `ui-store.ts`).
- In Zustand stores:
  - Keep state minimal and serializable.
  - Keep actions simple and predictable; avoid side effects inside selectors.
  - Prefer one store per domain or feature over one giant store.

**Styling & Theming**
- Prefer **StyleSheet.create** or a consistent styling solution (e.g., styled components or a utility library) across the app.
- Define a central theme (colors, spacing, typography) and reuse tokens.
- Support dark mode and ensure accessible contrast for text and important UI.
- Avoid inline styles for anything non-trivial; extract styles or themed components.

**Performance**
- Use `FlatList`/`SectionList` for any scrollable list beyond a few items.
- Provide stable `keyExtractor` values; avoid using array indices.
- Avoid heavy work in render; memoize pure components when necessary (`React.memo`, `useCallback`, `useMemo`).
- Avoid unnecessary re-renders by:
  - Keeping global state small and focused.
  - Splitting Zustand stores if needed.
  - Passing minimal props to children.

**Platform & Device Considerations**
- Be explicit about platform differences using `Platform.OS` or platform-specific files (`.ios.tsx`, `.android.tsx`) only when required.
- Handle permissions (camera, location, notifications, etc.) via Expo APIs with clear user messaging.
- Plan for varying screen sizes; test on at least one small and one large device/emulator.

### 9.4 Backend/API Practices (When Present)
> These rules apply once a backend/API service exists in the `backend/` folder. Until then, treat them as a starting point.

**Architecture**
- Organize code by **feature/domain** (e.g., `users`, `auth`, `sessions`) rather than by generic layers only.
- Keep HTTP controllers/handlers thin; push business logic into services/use-cases.
- Define DTOs or schemas for all external inputs/outputs and share shapes in `docs/domain/data-contracts.md`.

**API Contracts**
- Keep endpoints predictable and RESTful (or clearly documented if using GraphQL).
- Document request/response shapes, status codes, and error formats.
- Maintain a single source of truth for contracts: `docs/domain/data-contracts.md` and/or OpenAPI.

**Resilience & Security**
- Validate all inputs at the boundary; never trust client data.
- Use proper authentication and authorization; never expose secrets.
- Add basic observability early: structured logs, minimal metrics, and simple health checks.

Implementation details for the backend framework (Laravel 12 in this project) should be refined in `docs/stacks/backend-api*.md`.

### 9.5 TypeScript Guidance
- Enable `strict` mode across mobile and backend.
- Define clear interfaces/types for props, screen params, store state, and actions.
- Use type guards, generics, and utility types (`Partial`, `Pick`, `Omit`, etc.) where they clarify intent.
- Prefer `interface` for extendable object shapes, but stay consistent within each module.

### 9.6 Error Handling, Validation, and UX
- Always handle loading, success, empty, and error states explicitly in UI.
- For API calls, centralize error handling where possible (e.g., custom hooks, API client utilities).
- Use user-friendly messages; avoid leaking backend details to the UI.
- Consider schema-based validation (e.g., Zod) for complex forms or cross-field validation when needed.

### 9.7 Testing
- Prioritize tests for:
  - Critical business logic (both mobile and backend).
  - State management (Zustand store behavior, reducers).
  - Key navigation flows and screens.
- Use Jest (and React Native Testing Library) for unit and component tests when test infrastructure is in place.

### 9.8 Documentation Standards
- Add file-level comments for complex screens, stores, and backend modules that reference relevant docs (e.g., `@docs docs/stacks/mobile-expo-react-native.md#state-management`).
- Keep documentation files focused and within token budgets—avoid turning a single MD file into an encyclopedia.
- Create new documentation files when:
  - A topic grows too large for its parent.
  - A new feature or pattern emerges that needs dedicated explanation.
- Always update `docs/index.md` when creating or renaming documentation files.

### 9.9 Rule Hierarchy (When Conflicts Arise)
If rules contradict or you’re unsure which guidance takes precedence:

1. **Project-specific rulebooks** in `docs/stacks/*-rules.md` > this baseline section.
2. **Approved ADRs** in `docs/decisions/` > general patterns or defaults.
3. **Explicit team overrides** documented in rulebook “Overrides” sections > community best practices.
4. When genuinely uncertain: consult `docs/index.md` for context and ask the project owner before deviating from established patterns.

### 9.10 Documentation Safety Net
If a task needs detail that this rule set doesn’t cover, consult:
- `docs/index.md` for overall context and links.
- `docs/stacks/mobile-expo-react-native*.md` for mobile-specific guidance.
- `docs/stacks/backend-api*.md` (once created) for backend specifics.
- `docs/domain/*` for business/domain rules.

If something still isn’t clear, prefer adding or updating documentation alongside the code change.

---

## 10. Template Snippets
Copy-paste templates to accelerate documentation updates.

### Task Log Entry Template
```markdown
## [YYYY-MM-DD] Task Title (Issue #XXX)
**Status**: ✅ Complete | 🚧 In Progress | ❌ Blocked  
**Owner**: [Name]  
**Impact**: [FRONTEND] [BACKEND] [DB] [API] [DOCS]  
**Changed**: `path/to/file1.ts`, `path/to/file2.tsx`  

**Summary**:  
[1-2 sentence description of what changed and why]
[Prefix with 🔴 BREAKING if introduces breaking changes]

**Technical Notes**:  
- Key decision or pattern introduced
- Any deviation from standard approach

**Testing**:  
- [ ] Unit tests added/updated
- [ ] Manual verification completed

**Follow-ups**:  
- [ ] TODO item 1
- [ ] TODO item 2

**Docs Updated**:  
- `docs/index.md` (added link to new feature)
- `docs/stacks/backend-api.md` (documented new service pattern)
```

### File Banner Comment Template (Frontend)
```typescript
/**
 * @file user-profile.tsx
 * @purpose Display and edit user profile information with avatar upload
 * 
 * @parent pages/dashboard.tsx (invoked via route)
 * @children 
 *   - components/avatar-uploader.tsx
 *   - hooks/use-profile-form.ts
 * 
 * @dependencies
 *   - react-hook-form: Form state + validation
 *   - zod: Schema definition
 *   - @/lib/api: API client for profile updates
 * 
 * @data-contracts
 *   - Input: UserProfile (from /api/users/:id)
 *   - Output: UpdateProfileDTO (to PATCH /api/users/:id)
 * 
 * @docs docs/stacks/frontend-react.md#forms
 * @updated 2025-11-14
 */
```

### File Banner Comment Template (Backend)
```typescript
/**
 * @file users.service.ts
 * @purpose Encapsulate user CRUD operations and business logic
 * 
 * @parent users.controller.ts (injected dependency)
 * @children 
 *   - repositories/user.repository.ts
 *   - services/email.service.ts (for notification)
 * 
 * @dependencies
 *   - Laravel Eloquent models: User queries and persistence
 *   - Hashing: Password hashing (e.g., Laravel Hash facade)
 * 
 * @data-contracts
 *   - CreateUserDto: validated at controller level
 *   - UserEntity: returned to controller
 * 
 * @docs docs/stacks/backend-api.md#services
 * @updated 2025-11-14
 */
```

### Architecture Decision Record (ADR) Template
```markdown
# ADR-NNN: [Decision Title]

**Status**: Proposed | Accepted | Deprecated | Superseded by ADR-XXX  
**Date**: YYYY-MM-DD  
**Deciders**: [Names]  

## Context
[Describe the problem, forces at play, and constraints]

## Decision
[State the decision clearly]

## Consequences
**Positive**:
- Benefit 1
- Benefit 2

**Negative**:
- Trade-off 1
- Trade-off 2

**Neutral**:
- Implementation detail

## Alternatives Considered
1. **Option A**: [brief description] — rejected because...
2. **Option B**: [brief description] — rejected because...

## Implementation Notes
- Key file: `path/to/implementation.ts`
- Migration plan: [if applicable]

## References
- [External doc or RFC]
- Related: ADR-XXX
```

### Function Context Comment Template
```typescript
/**
 * Validates and transforms user input before persisting to database.
 * 
 * @param rawInput - Unvalidated form data from request body
 * @returns Sanitized DTO ready for repository.save()
 * @throws ValidationException if required fields missing
 * 
 * Invariants:
 * - Email must be unique (checked via repository)
 * - Password min 8 chars, hashed before return
 * 
 * Links: Called by createUser handler, passes result to UserRepository
 */
function prepareUserData(rawInput: unknown): CreateUserDto {
  // ...
}
```

---

## 11. Automation & Validation (OPTIONAL)
> **Note**: This section is **optional** and provided as suggestions only. AI assistants and developers are **not required** to enforce or implement these automation steps. Manual workflows are valid; adopt automation based on team capacity and project scale.

### Pre-Commit Validation (Suggested)
If implementing git hooks, consider these checks:

**Documentation Consistency**:
```bash
# Sample pre-commit hook (bash)
# Validates task-log.md was touched if code files changed

changed_code=$(git diff --cached --name-only | grep -E '\.(ts|tsx|js|jsx)$')
changed_docs=$(git diff --cached --name-only | grep 'docs/delivery/task-log.md')

if [ -n "$changed_code" ] && [ -z "$changed_docs" ]; then
  echo "⚠️  Code changed but task-log.md not updated. Consider adding entry."
  echo "   (This is a reminder, not a blocker)"
fi
```

**File Banner Presence** (lint on new files):
```bash
# Check new .ts/.tsx files have @file tag in first 30 lines
new_files=$(git diff --cached --name-only --diff-filter=A | grep -E '\.(ts|tsx)$')
for file in $new_files; do
  if ! head -n 30 "$file" | grep -q '@file'; then
    echo "ℹ️  $file missing file banner. Consider adding one."
  fi
done
```

### CI/CD Integration Ideas
**Link Validation** (GitHub Actions example):
```yaml
# .github/workflows/docs-validation.yml
name: Validate Documentation
on: [pull_request]
jobs:
  check-links:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: gaurav-nelson/github-action-markdown-link-check@v1
        with:
          config-file: '.github/markdown-link-check.json'
          folder-path: 'docs/'
```

**Dependency Graph Generation** (optional visualization):
```bash
# Extract @parent/@children from banners and generate graph
# (Requires custom script; example with grep + graphviz)

grep -r "@parent\|@children" src/ | \
  # ... parse and format for dot ...
  dot -Tpng > docs/architecture-graph.png
```

### Documentation Update Reminders
**PR Template Snippet** (`.github/pull_request_template.md`):
```markdown
## Documentation Checklist
- [ ] Task log entry added (`docs/delivery/task-log.md`)
- [ ] Stack profile updated if architecture/patterns changed
- [ ] File banners updated on modified complex files
- [ ] `docs/index.md` reviewed for new cross-references
- [ ] ADR created if significant decision made

_Not all items required for every PR—use judgment._
```

### Monitoring & Alerts (Advanced)
- **Stale doc detection**: Cron job compares `git log` timestamps between code and related docs
- **Metric dashboard**: Visualize banner coverage, doc lag via custom script + Grafana/Datadog
- **Slack integration**: Bot posts task-log updates to team channel automatically

**Remember**: These are suggestions to reduce friction at scale. Manual discipline works fine for small teams or early projects.

---

**End of Documentation Plan**
