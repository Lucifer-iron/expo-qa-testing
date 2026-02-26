# TestID Naming Convention

Every interactive element in a React Native Expo app must have a `testID` following this standard so Maestro flows and RNTL tests remain stable when layouts change.

## Format

```
screen.component[.action]
```

| Part | Required | Description | Example |
|---|---|---|---|
| `screen` | ✅ | Short screen prefix (see map below) | `auth`, `home`, `profile` |
| `component` | ✅ | Element type + role | `submit-btn`, `name-input`, `avatar-img` |
| `.action` | Optional | Clarifying suffix for multiple similar elements | `.edit`, `.delete`, `.confirm` |

### Component suffixes
| Suffix | Use for |
|---|---|
| `-btn` | Buttons, Pressables, TouchableOpacity |
| `-input` | TextInput |
| `-toggle` | Switch, Checkbox |
| `-tab` | Tab bar items |
| `-card` | Tappable cards / list items |
| `-modal` | Modal containers |
| `-link` | Tappable text links |
| `-img` | Images (if tappable) |
| `-list` | FlatList / ScrollView container |
| `-loader` | Loading spinners / skeletons |
| `-empty` | Empty state container |
| `-error` | Error state container |

---

## Full App TestID Map

Generated from `app/` route structure. Use these prefixes for every element on each screen.

### Authentication
| Screen | Prefix | Example testIDs |
|---|---|---|
| `/` (root) | `auth` | `auth.submit-btn`, `auth.email-input`, `auth.password-input` |

### Tab Bar
| Screen | Prefix | Example testIDs |
|---|---|---|
| `/(tabs)/index` | `home` | `home.profile-card`, `home.search-input`, `home.filter-btn` |
| `/(tabs)/chats` | `chats` | `chats.conversation-card`, `chats.new-chat-btn` |
| `/(tabs)/earnings` | `earnings` | `earnings.total-text`, `earnings.period-toggle` |
| `/(tabs)/schedule` | `schedule` | `schedule.booking-card`, `schedule.date-picker` |
| `/(tabs)/me` | `me` | `me.edit-btn`, `me.verify-btn`, `me.settings-btn`, `me.logout-btn` |

### Profile
| Screen | Prefix | Example testIDs |
|---|---|---|
| `/profile/[id]` | `profile` | `profile.avatar-img`, `profile.book-btn`, `profile.rate-text` |
| `/profile/edit` | `profile-edit` | `profile-edit.name-input`, `profile-edit.save-btn`, `profile-edit.cancel-btn` |
| `/profile/public` | `profile-public` | `profile-public.share-btn` |
| `/profile/account-settings` | `account` | `account.delete-btn`, `account.email-text` |
| `/profile/security-privacy` | `security` | `security.change-password-btn`, `security.privacy-toggle` |
| `/profile/help-support` | `help` | `help.faq-card`, `help.contact-btn` |
| `/profile/payout-preferences` | `payout` | `payout.bank-input`, `payout.save-btn` |
| `/profile/payout-confirm` | `payout-confirm` | `payout-confirm.confirm-btn`, `payout-confirm.cancel-btn` |
| `/profile/payout-success` | `payout-success` | `payout-success.done-btn` |

### KYC / Verification
| Screen | Prefix | Example testIDs |
|---|---|---|
| `/profile/verify` | `verify` | `verify.start-btn`, `verify.instructions-text` |
| `/profile/verify-status` | `verify-status` | `verify-status.status-text`, `verify-status.retry-btn` |
| `/profile/verify-success` | `verify-success` | `verify-success.done-btn` |
| `/profile/upload-id` | `upload-id` | `upload-id.upload-btn`, `upload-id.preview-img` |
| `/profile/face-scan` | `face-scan` | `face-scan.capture-btn`, `face-scan.retake-btn` |

### Session
| Screen | Prefix | Example testIDs |
|---|---|---|
| `/session/active` | `session` | `session.sos-btn`, `session.end-btn`, `session.timer-text` |
| `/session/rate` | `rate` | `rate.star-1`, `rate.star-2`, `rate.star-3`, `rate.star-4`, `rate.star-5`, `rate.submit-btn` |
| `/session/sos` | `sos` | `sos.confirm-btn`, `sos.cancel-btn`, `sos.status-text` |

### Contacts
| Screen | Prefix | Example testIDs |
|---|---|---|
| `/contacts/add` | `contacts-add` | `contacts-add.name-input`, `contacts-add.phone-input`, `contacts-add.add-btn` |
| `/contacts/trusted` | `contacts-trusted` | `contacts-trusted.contact-card`, `contacts-trusted.remove-btn` |

### Misc
| Screen | Prefix | Example testIDs |
|---|---|---|
| `/booking-success` | `booking-success` | `booking-success.done-btn`, `booking-success.view-btn` |
| `/no-results` | `no-results` | `no-results.retry-btn`, `no-results.home-btn` |

---

## Implementation in Code

```tsx
// ✅ Correct — testID on the outer touchable
<TouchableOpacity testID="me.edit-btn" onPress={handleEdit}>
  <Text>Edit Profile</Text>
</TouchableOpacity>

// ✅ Correct — testID on TextInput directly
<TextInput
  testID="profile-edit.name-input"
  value={name}
  onChangeText={setName}
  placeholder="Full Name"
/>

// ✅ Correct — testID on Switch
<Switch
  testID="security.privacy-toggle"
  value={isPrivate}
  onValueChange={setIsPrivate}
/>

// ❌ Wrong — no testID
<TouchableOpacity onPress={handleEdit}>
  <Text>Edit Profile</Text>
</TouchableOpacity>
```

---

## Pre-commit Enforcement

Run the enforcer before any commit or in CI Phase 1:

```bash
node antigravity-skills/skills/expo-qa-testing/scripts/enforce-testids.js --app-dir app/
```

Output example:
```
🔍 Scanning app/ for testID violations...
❌ VIOLATION: app/(tabs)/me.tsx:47 — TouchableOpacity missing testID
❌ VIOLATION: app/profile/edit.tsx:83 — TextInput missing testID
Found 2 violations. Fix before committing.
```
