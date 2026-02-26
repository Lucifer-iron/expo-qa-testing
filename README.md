# expo-qa-testing

> **A Senior SDET-level QA testing skill for React Native Expo apps.**
> Drop it into any AI coding assistant and say _"Test my Expo app like a senior QA team."_

Works with [Antigravity](https://antigravity.dev) · Claude Code · Gemini CLI · Cursor · Windsurf · any AI IDE that supports agent skills.

---

## Table of Contents

- [What Is This?](#what-is-this)
- [What's Inside](#whats-inside)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [IDE Integration](#ide-integration)
- [Usage](#usage)
  - [Phase 1 — Enforce TestIDs](#phase-1--enforce-testids)
  - [Phase 2 — Generate Maestro Flows](#phase-2--generate-maestro-flows)
  - [Phase 3 — Run Component Tests](#phase-3--run-component-tests-rntl)
  - [Phase 4 — Run E2E Tests](#phase-4--run-e2e-tests-maestro)
  - [Phase 5 — Generate QA Report](#phase-5--generate-qa-report)
- [Customisation](#customisation)
  - [Setting Your App ID](#setting-your-app-id)
  - [Adding Your Own Flows](#adding-your-own-flows)
  - [TestID Naming Convention](#testid-naming-convention)
  - [CI/CD Setup](#cicd-setup)
- [File Reference](#file-reference)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)

---

## What Is This?

This is an **AI agent skill** — a set of instructions, templates, and scripts that teach your AI coding assistant how to perform professional QA testing on any React Native Expo app.

Instead of writing brittle ADB scripts or coordinate-based taps, this skill uses:

| Tool | Purpose |
|---|---|
| **Maestro** | Declarative E2E testing via YAML — auto-retry, animation-safe, testID selectors |
| **React Native Testing Library** | Fast component-level unit/integration tests (runs in ms, no device needed) |
| **enforce-testids.js** | Static analysis — blocks builds when interactive elements are missing `testID` |
| **generate-flows.ts** | Reads your Expo Router `app/` structure and generates skeleton Maestro flows |

### Why not ADB / Appium / Detox?

| | ADB Scripts | Appium | **This Skill (Maestro)** |
|---|---|---|---|
| Selectors | Coordinates / hierarchy | XPath / ID | `testID` — layout-safe |
| Waits | `time.sleep(2)` | Implicit waits | `waitForAnimationToEnd` |
| AI writability | Complex subprocess calls | Verbose config | Simple YAML key-values |
| Setup | ADB + Python | Server + driver | One binary install |
| Speed | ~2s/command | ~1s/command | ~200ms/command |

---

## What's Inside

```text
expo-qa-testing/
│
├── SKILL.md                     ← The AI reads this. Full 5-phase pipeline instructions.
├── README.md                    ← You're reading this. Human setup guide.
├── LICENSE                      ← MIT
├── .gitignore
│
├── references/                  ← Knowledge base for the AI agent
│   ├── testid-convention.md     ← Naming standard: screen.component.action
│   ├── testing-strategy.md      ← Shift-Left methodology, SDET best practices
│   ├── testing-methodology.md   ← Full QA checklists (visual, functional, edge cases)
│   └── report-template.md       ← QA report template the agent fills in
│
├── tests/
│   ├── e2e/                     ← Maestro YAML flow templates (customize for your app)
│   │   ├── tab-navigation.yaml
│   │   ├── login-flow.yaml
│   │   ├── profile-flow.yaml
│   │   ├── verification-flow.yaml
│   │   ├── session-flow.yaml
│   │   ├── contacts-flow.yaml
│   │   └── navigation-crawl.yaml   ← Monkey-test crawler
│   └── component/               ← RNTL templates
│       ├── example.test.tsx     ← Copy + adapt for your components
│       └── jest.config.js
│
├── scripts/
│   ├── enforce-testids.js       ← Pre-commit scanner (exits 1 if violations)
│   └── generate-flows.ts        ← Generates Maestro YAML from your route structure
│
└── ci/
    └── qa-pipeline.yml          ← GitHub Actions workflow (copy to .github/workflows/)
```

---

## Setup

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org) |
| **Maestro** | Latest | `curl -Ls "https://get.maestro.mobile.dev" \| bash` |
| **Android SDK** | API 30+ | Android Studio → SDK Manager |
| **ADB** | Latest | Comes with Android SDK |

**Windows users:** Install Maestro via `iex (irm get.maestro.mobile.dev)` in PowerShell.

### Installation

#### Option A: Clone into your project (recommended)

```bash
# Clone alongside your app code
git clone https://github.com/Lucifer-iron/expo-qa-testing skills/expo-qa-testing

# Install testing dependencies in your project
npm install -D @testing-library/react-native jest-expo
```

#### Option B: Git submodule

```bash
git submodule add https://github.com/Lucifer-iron/expo-qa-testing skills/expo-qa-testing
git submodule update --init
npm install -D @testing-library/react-native jest-expo
```

#### Option C: Copy manually

Download the ZIP from GitHub and extract into `skills/expo-qa-testing/` in your project.

### IDE Integration

Once the skill is in your project, tell your AI assistant where to find it:

<details>
<summary><b>Antigravity</b></summary>

Clone into `antigravity-skills/skills/expo-qa-testing/`. Antigravity discovers it automatically.

Then prompt: **"Test my Expo app like a senior QA team"**
</details>

<details>
<summary><b>Claude Code (CLAUDE.md)</b></summary>

Add to your `CLAUDE.md`:
```markdown
## Skills
- **expo-qa-testing** (`skills/expo-qa-testing/`): QA testing for React Native Expo apps.
  When asked to test or QA the app, read `skills/expo-qa-testing/SKILL.md` and follow its pipeline.
```
</details>

<details>
<summary><b>Gemini CLI (GEMINI.md)</b></summary>

Add to your `GEMINI.md`:
```markdown
## Skills
- **expo-qa-testing** (`skills/expo-qa-testing/`): QA testing for React Native Expo apps.
  When asked to test or QA the app, read `skills/expo-qa-testing/SKILL.md` and follow its pipeline.
```
</details>

<details>
<summary><b>Cursor (.cursorrules)</b></summary>

Add to `.cursorrules`:
```
When the user asks to test or QA the Expo app:
1. Read skills/expo-qa-testing/SKILL.md for the full 5-phase QA pipeline
2. Follow all phases in order
3. Generate a QA report using skills/expo-qa-testing/references/report-template.md
```
</details>

<details>
<summary><b>Windsurf (.windsurfrules)</b></summary>

Same as Cursor — add the rules to `.windsurfrules`.
</details>

---

## Usage

### Phase 1 — Enforce TestIDs

Before any test can run, every interactive element (`TouchableOpacity`, `Pressable`, `TextInput`, `Switch`, etc.) must have a `testID` prop.

```bash
node skills/expo-qa-testing/scripts/enforce-testids.js --app-dir app/
```

**Output if clean:**
```
✅ All interactive elements have testIDs. 28 files scanned.
```

**Output if violations found:**
```
❌ VIOLATION: app/(tabs)/me.tsx:47 — TouchableOpacity missing testID
   → Add testID following convention: "<screen>.<component>-<type>"

⛔ Found 1 testID violation(s) across 28 files.
```

**Fix violations** by adding `testID` to every flagged element:
```tsx
// Before (❌)
<TouchableOpacity onPress={handleEdit}>

// After (✅)
<TouchableOpacity testID="me.edit-btn" onPress={handleEdit}>
```

See [`references/testid-convention.md`](references/testid-convention.md) for full naming rules.

### Phase 2 — Generate Maestro Flows

Generate skeleton YAML flows from your Expo Router file structure:

```bash
npx ts-node skills/expo-qa-testing/scripts/generate-flows.ts \
  --app-dir app/ \
  --output-dir tests/e2e/generated/ \
  --app-id com.yourapp.dev
```

This scans your `app/` directory and creates one `.yaml` file per route. You then customise each flow with the correct `testID` selectors and assertions.

**Dry run** (preview without writing files):
```bash
npx ts-node skills/expo-qa-testing/scripts/generate-flows.ts --app-dir app/ --dry-run
```

### Phase 3 — Run Component Tests (RNTL)

```bash
npx jest --config skills/expo-qa-testing/tests/component/jest.config.js
```

To write tests for your own components, copy `tests/component/example.test.tsx` and adapt:

```tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MyButton } from '../../app/components/MyButton';

it('calls onPress when tapped', () => {
  const onPress = jest.fn();
  render(<MyButton testID="home.action-btn" onPress={onPress} />);
  fireEvent.press(screen.getByTestId('home.action-btn'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
```

### Phase 4 — Run E2E Tests (Maestro)

**Ensure your app is running on an emulator first:**
```bash
npx expo start --android
```

**Run all flows:**
```bash
maestro test skills/expo-qa-testing/tests/e2e/
```

**Run a single flow:**
```bash
maestro test skills/expo-qa-testing/tests/e2e/tab-navigation.yaml
```

**Run with JUnit output:**
```bash
maestro test --format junit skills/expo-qa-testing/tests/e2e/ --output results/
```

### Phase 5 — Generate QA Report

After all phases, the AI agent generates a structured report using [`references/report-template.md`](references/report-template.md). The report includes:
- TestID violation count
- RNTL test results
- Per-flow Maestro pass/fail + screenshots
- Issues sorted by severity (P0–P3)

---

## Customisation

### Setting Your App ID

Every Maestro YAML flow starts with `appId: com.yourapp.dev`. **You must change this** to your app's actual bundle ID.

Find your bundle ID in `app.json`:
```json
{
  "expo": {
    "android": {
      "package": "com.mycompany.myapp"  ← this is your appId
    }
  }
}
```

Then find-and-replace across all YAML files:
```bash
# PowerShell
Get-ChildItem skills/expo-qa-testing/tests/e2e/*.yaml | ForEach-Object {
  (Get-Content $_) -replace 'com.yourapp.dev','com.mycompany.myapp' | Set-Content $_
}

# macOS/Linux
sed -i 's/com.yourapp.dev/com.mycompany.myapp/g' skills/expo-qa-testing/tests/e2e/*.yaml
```

### Adding Your Own Flows

Create a new `.yaml` file in `tests/e2e/`:

```yaml
appId: com.mycompany.myapp
---
# My Custom Flow: Checkout process
# tags: [checkout, P1]

- launchApp
- tapOn:
    id: "cart.checkout-btn"
    retryTapIfNoChange: 3
- waitForAnimationToEnd
- assertVisible:
    id: "payment.total-text"
- takeScreenshot: "checkout-screen"
```

**Key Maestro commands:**

| Command | Example |
|---|---|
| Launch app | `- launchApp` |
| Tap by testID | `- tapOn:` `    id: "screen.btn"` |
| Assert visible | `- assertVisible:` `    id: "screen.element"` |
| Type text | `- inputText: "hello"` |
| Wait for animation | `- waitForAnimationToEnd` |
| Screenshot | `- takeScreenshot: "name"` |
| Press back | `- pressBack` |
| Scroll | `- scroll` |
| Hide keyboard | `- hideKeyboard` |

Full cheatsheet in [`references/testing-methodology.md`](references/testing-methodology.md).

### TestID Naming Convention

Format: **`screen.component[-type]`**

| Suffix | Use for | Example |
|---|---|---|
| `-btn` | Buttons, Pressables | `auth.submit-btn` |
| `-input` | TextInput | `profile.name-input` |
| `-toggle` | Switch, Checkbox | `settings.dark-mode-toggle` |
| `-card` | Tappable cards | `home.listing-card` |
| `-modal` | Modal containers | `confirm.delete-modal` |
| `-list` | FlatList/ScrollView | `chat.messages-list` |
| `-loader` | Loading spinners | `home.data-loader` |

Full guide: [`references/testid-convention.md`](references/testid-convention.md)

### CI/CD Setup

Copy the pipeline into your project:

```bash
# Create the directory if needed
mkdir -p .github/workflows

# Copy the pipeline
cp skills/expo-qa-testing/ci/qa-pipeline.yml .github/workflows/qa-pipeline.yml
```

The pipeline runs 4 sequential jobs:
1. **enforce-testids** — fails fast if testIDs are missing
2. **rntl-tests** — runs RNTL component tests
3. **maestro-e2e** — runs Maestro flows on emulator (PR only)
4. **report** — generates summary in GitHub Actions UI

For **Maestro Cloud** (no local emulator needed), uncomment the `maestro-cloud` job in the YAML and add a `MAESTRO_CLOUD_KEY` secret in your repo settings.

---

## Troubleshooting

### `enforce-testids.js` is flagging components I don't want to test
Add the element to the skip patterns in the script, or mark it with a spread prop:
```tsx
<TouchableOpacity {...props}>  {/* Skipped automatically — spread props assumed to include testID */}
```

### Maestro can't find my app
- Verify the `appId` in your YAML matches `app.json → expo.android.package`
- Ensure the app is running: `adb shell dumpsys window | findstr mCurrentFocus`
- Try reinstalling: `npx expo start --android --clear`

### Maestro flow fails with "Element not found"
- Confirm the `testID` exists in your component code
- Check if the element is behind a scroll — add `- scroll` before the `tapOn`
- Use `- extendedWaitFor:` with a timeout for async-loaded elements:
  ```yaml
  - extendedWaitFor:
      visible:
        id: "home.data-card"
      timeout: 10000
  ```

### RNTL tests fail with "Cannot find module"
- Ensure you installed dependencies: `npm install -D @testing-library/react-native jest-expo`
- Check `jest.config.js` has the correct `transformIgnorePatterns` for your project

### `generate-flows.ts` doesn't find my routes
- The script scans for `.tsx` files in the `--app-dir`. Verify the path is correct.
- Files starting with `_` (like `_layout.tsx`) are intentionally skipped (they're not screens).

### Git push fails / "repository not found"
- Ensure the repo exists at `https://github.com/YOUR_USERNAME/expo-qa-testing`
- Check git remote: `git remote -v`
- Re-add remote: `git remote set-url origin https://github.com/YOUR_USERNAME/expo-qa-testing.git`

---

## FAQ

**Q: Does this skill modify my app code?**
No. The skill lives entirely in its own directory. It never writes to your `app/` or `src/` folders. The only code change it recommends is adding `testID` props to your existing components.

**Q: Does my AI assistant need to understand the entire skill?**
No. The AI only reads `SKILL.md` — the other files are referenced from there. You don't need to paste anything into context manually.

**Q: Can I use this without an AI assistant?**
Yes! The scripts (`enforce-testids.js`, `generate-flows.ts`) and Maestro flows work standalone. Run them from the terminal.

**Q: Which Expo Router versions are supported?**
The `generate-flows.ts` script works with any file-based router that uses `app/` directory conventions (Expo Router v2+).

**Q: Can I use this for bare React Native (not Expo)?**
Maestro and RNTL work with any React Native app. The `generate-flows.ts` script assumes Expo Router conventions but the generated YAML is framework-agnostic.

**Q: How do I add this to an existing CI pipeline?**
Copy individual jobs from `ci/qa-pipeline.yml` into your existing workflow. Each job is independent and can be extracted.

---

## Contributing

PRs welcome! Please:
1. Keep `SKILL.md` as the single source of truth for agent instructions
2. Test new Maestro flows against a real emulator before submitting
3. Follow the testID naming convention
4. Update checklists in `references/` if adding new test patterns

---

## License

MIT — see [LICENSE](LICENSE)

---

## Credits & Related Tools

- [Maestro](https://maestro.mobile.dev) — Mobile UI testing framework
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) — Component testing
- [Expo Router](https://expo.github.io/router) — File-based routing for Expo
- [Antigravity](https://antigravity.dev) — AI coding assistant with skills support
