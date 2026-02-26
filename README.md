# expo-qa-testing

**A Senior SDET-level QA skill for React Native Expo apps.**
Use with [Antigravity](https://antigravity.dev), Claude Code, Gemini CLI, Cursor, Windsurf, and any AI coding assistant that supports agent skills.

---

## What This Skill Does

When you ask your AI assistant to *"test my Expo app like a senior QA team"*, this skill provides:

| Phase | Tool | What It Does |
|---|---|---|
| 1. Static Analysis | Custom Node script | Scans `app/` for missing `testID` props — blocks untestable UI before testing starts |
| 2. Flow Generation | TypeScript generator | Reads your Expo Router file structure and generates Maestro YAML flows |
| 3. Component Tests | React Native Testing Library | Tests isolated components (loading, error, empty, happy path) in milliseconds |
| 4. E2E Testing | **Maestro** | Runs declarative YAML flows on emulator/device — auto-retry, animation-safe, no ADB scripting |
| 5. CI/CD | GitHub Actions | Runs the full pipeline on every PR |

### 7 Pre-Built Maestro Flows (ready to use)
- `tab-navigation` — All 5 tabs smoke test (P0)
- `login-flow` — Authentication screen
- `profile-flow` — Edit profile → Save cycle
- `verification-flow` — KYC Document upload flow
- `session-flow` — Active session + SOS (safe path)
- `contacts-flow` — Add contact + confirm modal
- `navigation-crawl` — Monkey-test crawler across all screens

---

## Installation

### Antigravity (recommended)

```bash
# Clone into your project's skills directory
git clone https://github.com/Lucifer-iron/expo-qa-testing \
  antigravity-skills/skills/expo-qa-testing
```

Then prompt Antigravity:
> "Test my Expo app like a senior QA team"

### Claude Code / Gemini CLI / any CLAUDE.md / GEMINI.md aware assistant

Add to your `CLAUDE.md` or `GEMINI.md`:

```markdown
## Skills
- **expo-qa-testing** (`skills/expo-qa-testing/`): Senior QA testing for React Native Expo apps.
  When asked to test or QA the app, read `skills/expo-qa-testing/SKILL.md` and follow its pipeline.
```

Then clone the skill:
```bash
git clone https://github.com/Lucifer-iron/expo-qa-testing skills/expo-qa-testing
```

### Cursor / Windsurf / Copilot (`.cursorrules` / `.windsurfrules`)

Add to your `.cursorrules` or `.windsurfrules`:

```
When the user asks to test or QA the Expo app:
1. Read skills/expo-qa-testing/SKILL.md for the full 5-phase QA pipeline
2. Follow all phases in order — static analysis first, then E2E
3. Generate a QA report using skills/expo-qa-testing/references/report-template.md
```

Clone:
```bash
git clone https://github.com/Lucifer-iron/expo-qa-testing skills/expo-qa-testing
```

### As a git submodule (any project)

```bash
git submodule add https://github.com/Lucifer-iron/expo-qa-testing skills/expo-qa-testing
git submodule update --init
```

---

## Prerequisites

```bash
# 1. Maestro (E2E engine)
curl -Ls "https://get.maestro.mobile.dev" | bash
# Windows: iex (irm get.maestro.mobile.dev)

# 2. React Native Testing Library
npm install -D @testing-library/react-native jest-expo

# 3. Android emulator or physical device
adb devices   # must show at least one device
```

---

## Quick Start

### Step 1 — Check testID coverage
```bash
node skills/expo-qa-testing/scripts/enforce-testids.js --app-dir app/
```
Fix any violations using the naming standard in [`references/testid-convention.md`](references/testid-convention.md).

### Step 2 — Update `appId` in all flows
Replace `com.yourapp.dev` in `tests/e2e/*.yaml` with your app's bundle ID from `app.json`.

### Step 3 — Run a smoke test (emulator must be running)
```bash
maestro test skills/expo-qa-testing/tests/e2e/tab-navigation.yaml
```

### Step 4 — Generate skeleton flows for your screens
```bash
npx ts-node skills/expo-qa-testing/scripts/generate-flows.ts \
  --app-dir app/ \
  --output-dir tests/e2e/ \
  --app-id com.yourapp.dev
```

### Step 5 — Activate CI
```bash
cp skills/expo-qa-testing/ci/qa-pipeline.yml .github/workflows/qa-pipeline.yml
```

---

## Project Structure

```text
expo-qa-testing/
├── SKILL.md                           ← AI agent instructions (read this first)
├── README.md
├── references/
│   ├── testid-convention.md           ← Naming standard: screen.component.action
│   ├── testing-strategy.md            ← Shift-Left methodology & SDET rules
│   ├── testing-methodology.md         ← Full QA checklists + Maestro cheatsheet
│   └── report-template.md             ← QA report template
├── tests/
│   ├── e2e/                           ← Maestro YAML flows
│   │   ├── tab-navigation.yaml
│   │   ├── login-flow.yaml
│   │   ├── profile-flow.yaml
│   │   ├── verification-flow.yaml
│   │   ├── session-flow.yaml
│   │   ├── contacts-flow.yaml
│   │   └── navigation-crawl.yaml
│   └── component/
│       ├── example.test.tsx           ← RNTL template
│       └── jest.config.js
├── scripts/
│   ├── enforce-testids.js             ← Pre-commit/CI testID scanner
│   └── generate-flows.ts             ← Maestro YAML generator from routes
└── ci/
    └── qa-pipeline.yml               ← GitHub Actions (copy to .github/workflows/)
```

---

## TestID Convention

All interactive elements must follow: **`screen.component[-type]`**

```tsx
// ✅ Correct
<TouchableOpacity testID="auth.submit-btn" onPress={...}>
<TextInput testID="profile-edit.name-input" ... />
<Switch testID="security.privacy-toggle" ... />

// ❌ Wrong — invisible to Maestro
<TouchableOpacity onPress={...}>
```

Full map of all screen prefixes: [`references/testid-convention.md`](references/testid-convention.md)

---

## Writing Maestro Flows

```yaml
appId: com.yourapp.dev
---
- launchApp
- assertVisible:
    id: "auth.email-input"     # testID selector — never use coordinates
- tapOn:
    id: "auth.submit-btn"
    retryTapIfNoChange: 3      # built-in retry — no time.sleep() needed
- waitForAnimationToEnd
- assertNotVisible: "Error"
- takeScreenshot: "post-login"
```

---

## Why This Beats ADB Scripting

| | ADB Scripts | This Skill (Maestro) |
|---|---|---|
| **Selectors** | Coordinates / hierarchy dump | `testID` — layout-safe |
| **Waits** | `time.sleep(2)` | `waitForAnimationToEnd` |
| **Retries** | Manual loops | `retryTapIfNoChange: N` |
| **Speed** | ~2s per command | ~200ms per command |
| **AI writability** | Complex subprocess calls | Simple YAML key-values |
| **Maintenance** | Breaks on layout changes | Only breaks if testID deleted |

---

## Contributing

PRs welcome! Please:
1. Keep `SKILL.md` as the single source of truth for agent instructions
2. Test new Maestro flows against a real emulator before submitting
3. Follow the testID naming convention in `references/testid-convention.md`
4. Update `references/testing-methodology.md` checklists if adding new test patterns

---

## License

MIT — see [LICENSE](LICENSE)

---

## Related Tools

- [Maestro](https://maestro.mobile.dev) — Mobile UI testing framework
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) — Component testing
- [Expo Router](https://expo.github.io/router) — File-based routing for Expo
- [Antigravity](https://antigravity.dev) — AI coding assistant with skills support
