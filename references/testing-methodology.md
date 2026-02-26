# QA Testing Methodology — Complete Checklists

> **v2 Note**: Always run Phase 1 (testID enforcement) before any of the checklists below.
> All Maestro selectors should use `testID` ids, not text labels or coordinates.

## Table of Contents
1. [Visual Inspection Checklist](#visual-inspection-checklist)
2. [Functional Testing Checklist](#functional-testing-checklist)
3. [Interaction Testing Checklist](#interaction-testing-checklist)
4. [Edge Case & Stress Testing](#edge-case--stress-testing)
5. [Navigation & Routing Checklist](#navigation--routing-checklist)
6. [Data & State Checklist](#data--state-checklist)
7. [Accessibility Checklist](#accessibility-checklist)

---

## Visual Inspection Checklist

### Layout & Structure
- [ ] All screens render without white-screen crashes
- [ ] No overlapping elements or z-index conflicts
- [ ] Content is not cut off or clipped unexpectedly
- [ ] Proper spacing between all elements (padding/margin consistency)
- [ ] Headers/footers are properly positioned (not covered by safe area)
- [ ] Tab bar is visible and properly aligned on all tab screens
- [ ] ScrollView/FlatList scrolls to show all content
- [ ] No horizontal scrolling unless intentional

### Typography
- [ ] All text renders (no missing or empty text containers)
- [ ] Font families load correctly (no fallback to system font)
- [ ] Font sizes are appropriate and readable
- [ ] Text does not overflow its container
- [ ] Long text truncates with ellipsis where expected
- [ ] Text color has sufficient contrast with background

### Images & Media
- [ ] All images load (no broken image placeholders)
- [ ] Images have correct aspect ratio (not stretched/squished)
- [ ] Avatar/profile images are properly circular/rounded
- [ ] Icons render correctly (no missing icon squares)
- [ ] Gradient backgrounds render smoothly

### Colors & Theming
- [ ] Background colors match design (check hex values)
- [ ] Text colors are consistent across similar elements
- [ ] Button colors match their state (primary, secondary, disabled)
- [ ] Status indicators use correct semantic colors (green=success, red=error)
- [ ] No jarring color transitions between screens

---

## Functional Testing Checklist

### Navigation
- [ ] All tab bar items navigate to correct screens
- [ ] Back button/gesture returns to previous screen
- [ ] Deep links to all routes work (e.g., `/profile/edit`)
- [ ] Stack navigation push/pop works correctly
- [ ] Modal screens present and dismiss properly
- [ ] No dead-end screens (user can always navigate away)
- [ ] Active tab is highlighted correctly

### Buttons & Actions
- [ ] All buttons are tappable (not blocked by overlapping elements)
- [ ] Buttons trigger their intended action (navigation, modal, API call)
- [ ] Disabled buttons look visually disabled and don't respond to taps
- [ ] Button loading states show spinner/indicator during async operations
- [ ] Submit buttons validate form before submitting
- [ ] Cancel/close buttons dismiss modals and sheets

### Forms & Inputs
- [ ] Text inputs accept keyboard input
- [ ] Input focus states are visible (border highlight, etc.)
- [ ] Placeholder text is descriptive and visible
- [ ] Input validation shows error messages for invalid data
- [ ] Required field indicators are present
- [ ] Keyboard type matches input (numeric for phone, email for email)
- [ ] Keyboard dismiss works when tapping outside inputs

### Data Display
- [ ] Lists populate with data (not permanently empty)
- [ ] Empty states show appropriate messaging
- [ ] Loading states show spinner/skeleton during data fetch
- [ ] Error states show retry option when data fails to load
- [ ] Numbers format correctly (currency, dates, counts)
- [ ] Relative time displays correctly ("2 hours ago", etc.)

### Modals & Overlays
- [ ] Modal backdrop is visible and semi-transparent
- [ ] Modal content is centered and properly sized
- [ ] Modal can be dismissed (close button, backdrop tap, or swipe)
- [ ] Modal doesn't persist after navigation
- [ ] Filter modals apply and clear filters correctly
- [ ] Confirmation modals have clear accept/cancel actions

---

## Interaction Testing Checklist

### Touch & Gesture
- [ ] Touch targets are minimum 44x44 points
- [ ] Press feedback is visible (opacity change, highlight)
- [ ] Long press actions work where expected
- [ ] Swipe gestures work (swipe to delete, dismiss, etc.)
- [ ] Pull-to-refresh works on list screens
- [ ] Scroll momentum feels natural

### Animations
- [ ] Screen transitions animate smoothly (no jank)
- [ ] Micro-animations play correctly (loading, success, etc.)
- [ ] Animations don't block user interaction
- [ ] Animated elements return to correct position after animation

### Toggle & Selection
- [ ] Toggle switches change state on tap
- [ ] Toggle visual state matches data state
- [ ] Radio buttons allow single selection
- [ ] Checkboxes toggle correctly
- [ ] Segmented controls/tabs switch content
- [ ] Selected state is visually distinct

---

## Edge Case & Stress Testing

### Text Overflow
- [ ] Very long names (50+ characters) — truncates gracefully
- [ ] Special characters in text fields (emoji, unicode, RTL)
- [ ] Empty string values — doesn't crash, shows fallback
- [ ] Numeric overflow (very large numbers) — formatted correctly

### Rapid Interaction
- [ ] Double-tapping a button — doesn't trigger action twice
- [ ] Rapid tab switching — no crashes or stale screens
- [ ] Quick back-forward navigation — screens render correctly
- [ ] Scrolling during data load — no errors

### Error Handling
- [ ] Network error — shows error message, not crash
- [ ] Invalid data from API — graceful degradation
- [ ] Missing required props — component renders fallback
- [ ] Async operation timeout — shows error state

---

## Navigation & Routing Checklist

### Route Coverage
For each route in the app, verify:

```
Route                          | Loads | No Errors | Interactive
-------------------------------|-------|-----------|------------
/                              |       |           |
/(tabs)/chats                  |       |           |
/(tabs)/earnings               |       |           |
/(tabs)/me                     |       |           |
/(tabs)/schedule               |       |           |
/profile/[id]                  |       |           |
/profile/edit                  |       |           |
/profile/public                |       |           |
/profile/account-settings      |       |           |
/profile/security-privacy      |       |           |
/profile/help-support          |       |           |
/profile/verify                |       |           |
/profile/verify-status         |       |           |
/profile/verify-success        |       |           |
/profile/upload-id             |       |           |
/profile/face-scan             |       |           |
/profile/payout-preferences    |       |           |
/profile/payout-confirm        |       |           |
/profile/payout-success        |       |           |
/session/active                |       |           |
/session/rate                  |       |           |
/session/sos                   |       |           |
/booking-success               |       |           |
/no-results                    |       |           |
/contacts/*                    |       |           |
```

### Navigation Flow Tests
- [ ] Tab bar → each tab loads correct screen
- [ ] Home → Profile card → Profile detail
- [ ] Me → Edit Profile → Save → Back to Me
- [ ] Me → Verify → Upload ID → Face Scan → Verify Success
- [ ] Me → Payout Preferences → Confirm → Success
- [ ] Me → Account Settings → each sub-option
- [ ] Session → Active → SOS → confirm
- [ ] Session → Active → Rate → submit

---

## Data & State Checklist

### State Persistence
- [ ] Form data persists during screen rotation (web: resize)
- [ ] Selected tab persists when returning from a sub-screen
- [ ] Filter selections persist when returning to filtered list
- [ ] User preferences persist across navigation

### State Transitions
- [ ] Loading → Loaded (data appears)
- [ ] Loading → Error (error state appears)
- [ ] Empty → Populated (adding first item)
- [ ] Populated → Empty (removing last item)

---

## Accessibility Checklist

- [ ] All interactive elements have accessible labels
- [ ] Images have alt text or are marked as decorative
- [ ] Color is not the only indicator of state
- [ ] Focus order is logical (tab through the page)
- [ ] Text scales appropriately with system font size

---

## TestID Coverage Checklist (v2 — Shift Left)

Run `node scripts/enforce-testids.js --app-dir app/` and verify:

- [ ] Script exits with code `0` (no violations)
- [ ] Every `TouchableOpacity` / `Pressable` has `testID`
- [ ] Every `TextInput` has `testID`
- [ ] Every `Switch` has `testID`
- [ ] testID format matches `screen.component[-type]` convention
- [ ] testID map in `references/testid-convention.md` is up-to-date

---

## Maestro Flow Assertions Cheatsheet

| Goal | Maestro Command |
|---|---|
| App launches | `- launchApp` |
| Assert text visible | `- assertVisible: "Some Text"` |
| Assert by testID | `- assertVisible:` `    id: "screen.element"` |
| Assert not visible | `- assertNotVisible: "Error"` |
| Tap by testID | `- tapOn:` `    id: "screen.btn"` `    retryTapIfNoChange: 3` |
| Type text | `- inputText: "hello"` |
| Clear field | `- clearText` |
| Scroll | `- scroll` |
| Wait for animation | `- waitForAnimationToEnd` |
| Hide keyboard | `- hideKeyboard` |
| Press back | `- pressBack` |
| Screenshot | `- takeScreenshot: "name"` |
| Swipe | `- swipe:` `    direction: UP` |
| Extended wait | `- extendedWaitFor:` `    visibilityOf: "id"` `    timeout: 5000` |
