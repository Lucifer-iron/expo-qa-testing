# Testing Strategy — Shift-Left Methodology

## The Test Pyramid

Run tests in order from fastest/cheapest to slowest/most expensive. Fail fast.

```
         △
        /E\       Phase 4: E2E (Maestro)
       /2E2\      — Full flows on emulator
      /─────\     — Slowest, most realistic
     /RNTL   \    Phase 3: Integration
    /component \  — Component trees, hooks
   /─────────── \ — No device needed
  / Static Anal. \ Phase 1: Static (enforce-testids)
 /_______________\ — Instant, blocks build
```

| Tier | Tool | Speed | Scope | Run on |
|---|---|---|---|---|
| Static | `enforce-testids.js` | < 1s | testID presence | Every commit |
| Unit | RNTL + Jest | < 30s | Single components | Every commit |
| Integration | RNTL + mocked APIs | ~1 min | Screens + state | Every PR |
| E2E | Maestro | ~5 min | Full flows | Every PR (CI) |
| Visual | Percy / screenshots | ~2 min | Layout diffs | On main branch |

---

## Shift-Left Principles

**Shift Left** = catch bugs earlier, when they are cheapest to fix.

1. **Block before it runs**: `enforce-testids.js` exits with code 1 if any interactive element lacks a `testID`. No testID = no test = code doesn't merge.

2. **Static before dynamic**: Phase 1 (static) always runs before Phase 4 (E2E). Never start a Maestro run against a partially-testable codebase.

3. **Mock destructive paths**: Any flow tagged `DESTRUCTIVE` (delete account, SOS alert) must mock the API endpoint in CI. Use environment variables:
   ```yaml
   env:
     EXPO_PUBLIC_API_MOCK: "true"
   ```

4. **Fix flakiness at the source**: If a Maestro flow flakes, the fix is **not** to add `waitForAnimationToEnd` everywhere — it is to identify the missing `testID` or broken UI state that causes non-determinism.

---

## Test Prioritization (Risk-Based)

### P0 — Must Pass Before Any Merge
- [ ] App launches without crash
- [ ] Tab navigation works (all 5 tabs)
- [ ] Session SOS flow reachable
- [ ] No red error overlays on launch

### P1 — Run on Every PR
- [ ] Login / auth flow
- [ ] Profile edit → save cycle
- [ ] Booking interactions
- [ ] Back navigation from every screen

### P2 — Run on Main Branch
- [ ] Full verification (KYC) flow
- [ ] Payout preferences flow
- [ ] Contacts add + confirm

### P3 — Run Weekly or on Feature Branches
- [ ] Visual regression (Percy diffs)
- [ ] Edge cases (long text, empty states)
- [ ] Accessibility audit

---

## SDET Best Practices

### What the AI agent should do
- **Always read `testid-convention.md` before writing any Maestro YAML** — never use raw text selectors like `tapOn: "Submit"` when a testID exists.
- **Generate flows from routes, not imagination** — use `generate-flows.ts` to scaffold, then refine.
- **Write one concern per flow** — `tab-navigation.yaml` only tests navigation, not profile editing.
- **Mark destructive flows** — comment `# SAFETY: DESTRUCTIVE` at the top of the flow.
- **Capture screenshots at assertion points** — not randomly.

### What the AI agent should NOT do
- ❌ Use `time.sleep()` or `- wait: 3000` without a specific reason
- ❌ Use coordinate-based taps (`adb shell input tap 540 900`)
- ❌ Write Python ADB scripts for UI interaction
- ❌ Run destructive flows against a real backend without mocking
- ❌ Mark an issue as `PASS` without a screenshot as evidence

---

## CI/CD Integration

### Gate strategy
```
[Push] → enforce-testids → [FAIL: block merge]
                         ↓ [PASS]
               rntl-tests → [FAIL: block merge]
                          ↓ [PASS]
             maestro-e2e → [FAIL: notify + block]
                        ↓ [PASS]
                 percy-visual → [notify only]
```

See `.github/workflows/qa-pipeline.yml` for the full workflow definition.
