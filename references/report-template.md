# QA Report Template (v2)

Copy this template and fill in for each QA run. Save the filled report as `qa-report-<date>.md`.

> **v2 Pipeline**: testID Enforcement → RNTL Tests → Maestro E2E → Visual Review

---

```markdown
# QA Report — [App Name]

**Date**: [YYYY-MM-DD]
**Tester**: QA Agent
**App Version**: [version from app.json]
**Platform**: Web (Expo web mode)
**Base URL**: http://localhost:8081

---

## Executive Summary

| Metric | Count |
|---|---|
| Total Screens Tested | |
| Screens Passed | |
| Screens Failed | |
| **Total Issues Found** | |
| P0 — Blocker/Crash | |
| P1 — Major Functional | |
| P2 — Minor Functional | |
| P3 — Cosmetic/Polish | |

### Overall Verdict: [PASS / FAIL / CONDITIONAL PASS]

[1-2 sentence summary of the app's overall health]

---

## Screen-by-Screen Results

### [Screen Name] — [Route Path]

**Status**: ✅ PASS / ❌ FAIL
**Screenshot**: ![Screen Name](/tmp/qa-screenshots/screen-name.png)

#### Console Output
- Errors: [count]
- Warnings: [count]

#### Issues Found

| ID | Sev | Description | Steps to Reproduce | Expected | Actual |
|---|---|---|---|---|---|
| QA-001 | P1 | [Brief description] | 1. Navigate to X 2. Click Y | [Expected behavior] | [Actual behavior] |

#### What's Working
- [List of features/elements confirmed working]

---

[Repeat for each screen]

---

## Phase 1: testID Violations

_Output from `node scripts/enforce-testids.js --app-dir app/`_

| File | Line | Element | Missing testID |
|---|---|---|---|
| `app/file.tsx` | 42 | `TouchableOpacity` | should be `screen.action-btn` |

**Total violations**: X (must be 0 before proceeding)

---

## Phase 3: RNTL Component Test Results

```
npx jest --config tests/component/jest.config.js
```

| Test Suite | Tests | Passed | Failed | Duration |
|---|---|---|---|---|
| example.test.tsx | 5 | 5 | 0 | 0.3s |

**Overall**: X passed, X failed

---

## Phase 4: Maestro Flow Results

```
maestro test tests/e2e/
```

| Flow | Status | Duration | Screenshot |
|---|---|---|---|
| `tab-navigation.yaml` | ✅/❌ | Xs | ![tab-nav](../tests/e2e/screenshots/home-tab.png) |
| `login-flow.yaml` | ✅/❌ | Xs | |
| `profile-flow.yaml` | ✅/❌ | Xs | |
| `verification-flow.yaml` | ✅/❌ | Xs | |
| `session-flow.yaml` | ✅/❌ | Xs | |
| `contacts-flow.yaml` | ✅/❌ | Xs | |
| `navigation-crawl.yaml` | ✅/❌ | Xs | |

### Failed Flow Details

| Flow | Failed Step | Error Message | Screenshot |
|---|---|---|---|
| `profile-flow.yaml` | `tapOn: profile-edit.save-btn` | Element not found | |

---

## Navigation Flow Results (Manual / ADB supplement)

| Flow | Status | Notes |
|---|---|---|
| Tab Navigation (all tabs) | ✅/❌ | |
| Home → Profile Detail | ✅/❌ | |
| Me → Edit Profile → Save | ✅/❌ | |
| Me → Verification Flow | ✅/❌ | |
| Me → Payout Flow | ✅/❌ | |
| Session → SOS | ✅/❌ | |
| Session → Rate | ✅/❌ | |

---

## Issues Master List

All issues sorted by severity:

### P0 — Blockers
| ID | Screen | Description | File Path |
|---|---|---|---|

### P1 — Major Functional
| ID | Screen | Description | File Path |
|---|---|---|---|

### P2 — Minor Functional
| ID | Screen | Description | File Path |
|---|---|---|---|

### P3 — Cosmetic
| ID | Screen | Description | File Path |
|---|---|---|---|

---

## What's Working Well
- [Feature 1 that works great]
- [Feature 2 that works great]

## What's Missing
- [Expected feature that doesn't exist yet]

---

## Retest Results

_Fill in after developer fixes are applied_

| Issue ID | Fix Applied | Retest Date | Status | Notes |
|---|---|---|---|---|
| QA-001 | [Brief fix description] | [Date] | ✅ VERIFIED / ❌ STILL FAILING / ⚠️ REGRESSED | |

### Retest Summary
- Issues Fixed: X/Y
- Still Failing: X
- Regressions Found: X
```
