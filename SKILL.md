---
name: expo-qa-testing
description: Senior QA testing skill for React Native Expo mobile apps. Uses Maestro for E2E flows, React Native Testing Library for component tests, and static analysis for testID enforcement. Generates structured defect reports and supports CI/CD integration. Use when asked to test, QA, audit, find bugs, verify, or debug a React Native Expo app.
---

# Expo QA Testing — v2 (Senior SDET Level)

Declarative, self-healing QA orchestration for React Native Expo apps. Uses **Maestro** for E2E flows, **RNTL** for component tests, and **static analysis** to prevent untestable UI before any test runs. Replaces brittle ADB scripting with industry-standard tooling.

## Architecture Philosophy

| Dimension | Old (v1) | New (v2) |
|---|---|---|
| Engine | Python + ADB | **Maestro** YAML flows |
| Selectors | Coordinates / UI hierarchy | **`testID`** (stable, layout-safe) |
| Discovery | Filesystem crawl | Static route analysis + AI YAML gen |
| Component tests | ADB taps | **React Native Testing Library** |
| CI/CD | Local-only | GitHub Actions + Maestro Cloud |

---

## Prerequisites

```bash
# 1. Maestro CLI (E2E engine)
curl -Ls "https://get.maestro.mobile.dev" | bash
# Windows: iex (irm get.maestro.mobile.dev)

# 2. RNTL + Jest (Component testing)
npm install -D @testing-library/react-native jest-expo

# 3. Android emulator OR physical device connected via USB
adb devices   # must show at least one device
```

---

## Pipeline Overview

```
Phase 1: TestID Enforcement   (Shift-Left — block broken before testing)
      → Scan app/ for missing testIDs on interactive elements
      → Fail fast if violations found

Phase 2: AI-Generated Maestro Flows
      → Read expo-router file structure
      → Generate / update .yaml flows for every critical user path

Phase 3: Component Testing (RNTL)
      → Run Jest unit/integration tests in milliseconds
      → Cover loading, error, empty, and happy-path states

Phase 4: Smart E2E Execution (Maestro)
      → maestro test tests/e2e/
      → Built-in retries, flakiness handling, animation waits

Phase 5: Visual Regression & Reporting
      → Screenshots captured per flow
      → Structured QA report generated as artifact
```

---

## Phase 1: Static Analysis & TestID Enforcement

**Goal:** Prevent untestable UI from reaching QA or CI.

### Run the enforcer script
```bash
node antigravity-skills/skills/expo-qa-testing/scripts/enforce-testids.js --app-dir app/
```
- Exits `0` if all interactive elements have `testID`
- Exits `1` (blocks CI) and prints violations if any are missing

### TestID Convention
See `references/testid-convention.md` for the full naming standard.

Quick rule: **`screen.component.action`**
```tsx
// ❌ Bad — invisible to Maestro
<Button title="Submit" onPress={...} />

// ✅ Good — stable, self-documenting
<Button testID="auth.submit-btn" title="Submit" onPress={...} />
```

### ESLint integration (optional)
Install `eslint-plugin-testing-library` and add:
```json
{
  "rules": {
    "testing-library/consistent-data-testid": ["error", { "testIdPattern": "^[a-z]+\\.[a-z-]+(\\.[a-z-]+)?$" }]
  }
}
```

---

## Phase 2: AI-Generated Maestro Flows

**Goal:** Write Maestro YAML, not Python ADB scripts.

### Generate skeleton flows from route structure
```bash
npx ts-node antigravity-skills/skills/expo-qa-testing/scripts/generate-flows.ts \
  --app-dir app/ \
  --output-dir tests/e2e/ \
  --app-id com.yourapp.dev
```

### Pre-built flow templates
All critical flows are provided in `tests/e2e/`:

| Flow | File | Coverage |
|---|---|---|
| Tab Navigation | `tab-navigation.yaml` | All 5 tabs |
| Profile Flow | `profile-flow.yaml` | Edit → Save cycle |
| Verification | `verification-flow.yaml` | KYC document upload |
| Session | `session-flow.yaml` | SOS + Rate sub-flows |
| Contacts | `contacts-flow.yaml` | Add + confirm modal |
| Crawler | `navigation-crawl.yaml` | Monkey-test all screens |

### Key Maestro syntax
```yaml
appId: com.yourapp.dev
---
- launchApp
- assertVisible: "Welcome"          # Text assertion
- tapOn:
    id: "auth.submit-btn"           # testID selector (stable)
    retryTapIfNoChange: 3           # Built-in retry
- waitForAnimationToEnd            # No more time.sleep()
- assertNotVisible: "Error"
- takeScreenshot: "login-success"
```

### Writing flows as the AI agent
1. Read the screen's `testID` map from `references/testid-convention.md`
2. Write YAML assertions that match the critical happy path
3. Tag destructive flows (delete account, SOS) with a comment `# DESTRUCTIVE — mock API`
4. Run with `maestro test <flow>.yaml` to verify

---

## Phase 3: Component Testing (RNTL)

**Goal:** Test component logic in milliseconds without a device.

### Run all component tests
```bash
npx jest --preset jest-expo tests/component/
```

### What to cover per component
- **Happy path**: renders with valid props
- **Loading state**: shows spinner/skeleton
- **Error state**: shows error message + retry
- **Empty state**: shows empty placeholder
- **Accessibility**: `testID`, `accessibilityLabel`, `accessibilityRole`

### Example test pattern
```tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MyComponent } from '../../app/components/MyComponent';

it('shows loading state', () => {
  render(<MyComponent isLoading={true} />);
  expect(screen.getByTestId('my-component.loading')).toBeTruthy();
});

it('calls onPress with correct args', () => {
  const onPress = jest.fn();
  render(<MyComponent onPress={onPress} label="Submit" />);
  fireEvent.press(screen.getByTestId('my-component.submit-btn'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
```

See `tests/component/example.test.tsx` for a runnable template.

---

## Phase 4: Smart E2E Execution (Maestro)

**Goal:** Run full user flows on emulator/device with maximum stability.

### Prerequisites for E2E
```bash
# Ensure app is running on emulator
npx expo start --android

# Verify device is connected
adb devices
```

### Run all E2E flows
```bash
# Run all flows
maestro test tests/e2e/

# Run a single flow
maestro test tests/e2e/tab-navigation.yaml

# Run with video recording
maestro test --format junit tests/e2e/ --output tests/e2e/results/
```

### Flakiness control
Maestro handles these automatically — **do not add `sleep` calls**:
- Animation waits: `waitForAnimationToEnd`
- Network delays: `extendedWaitFor` with `assertVisible`
- Retry: `retryTapIfNoChange: <n>`

### Safety tagging
Mark destructive flows so they're skipped or mocked in CI:
```yaml
# SAFETY: DESTRUCTIVE — requires mocked API for CI
# tags: [destructive, requires-mock]
appId: com.yourapp.dev
---
- launchApp
# ... delete account flow
```

### Capture screenshots per step
```yaml
- takeScreenshot: "before-delete"
- tapOn:
    id: "account.delete-btn"
- takeScreenshot: "after-delete-confirm"
```

---

## Phase 5: Visual Regression & Reporting

### Screenshots
All Maestro screenshots land in `tests/e2e/screenshots/` by default.

### Percy integration (optional)
```bash
npm install -D @percy/cli
npx percy exec -- maestro test tests/e2e/
```

### Generate the QA report
After all phases complete, create a QA report artifact using `references/report-template.md`.

The report must include:
1. **Executive Summary**: phases run, pass/fail counts
2. **TestID Violations**: from Phase 1 (if any)
3. **RNTL Results**: test counts, failures
4. **Maestro Flow Results**: per-flow pass/fail + screenshots embedded
5. **Issues Master List**: P0–P3 with file paths
6. **Retest Section**: for post-fix validation

---

## Phase 6: Developer Handoff & Retest

### Handoff
1. Save report as `qa-report-<date>.md` artifact
2. Lead with P0/P1 issues at the top section
3. For each issue, include: screen name, testID, steps to reproduce, screenshot path
4. Provide the exact file path and (where possible) the line number of the broken component

### Retest Cycle
1. Developer applies fixes and adds missing `testID`s
2. Re-run Phase 1 (enforce-testids) — must pass first
3. Re-run only affected Maestro flows
4. Update "Retest Results" table in the report
5. Repeat until all P0 and P1 issues are `✅ VERIFIED`

---

## Script Reference

| Script | Purpose | Replaces |
|---|---|---|
| `scripts/generate-flows.ts` | Generate Maestro YAML from route structure | `screen-crawler.py` |
| `scripts/enforce-testids.js` | Scan for missing testIDs, block CI | `component-tester.py` |

## Reference Files

| File | Purpose |
|---|---|
| `references/testid-convention.md` | Naming standard + full app testID map |
| `references/testing-strategy.md` | Shift-Left methodology, test pyramid |
| `references/testing-methodology.md` | Complete QA checklists |
| `references/report-template.md` | QA report template |
| `tests/e2e/` | Pre-built Maestro YAML flows |
| `tests/component/` | RNTL component test templates |
| `.github/workflows/qa-pipeline.yml` | CI/CD pipeline |
