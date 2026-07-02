# Privacy Policy — OpenCalc

**Last updated:** July 2, 2026

This privacy policy describes how OpenCalc ("we", "us", or "the app") handles your information. OpenCalc is an open-source calculator application distributed under the MIT License.

## TL;DR

**OpenCalc does not collect, transmit, or sell your personal data.** All your calculations, history, and settings are stored locally on your device. We do not have a backend server. We do not have analytics. We do not have trackers.

---

## 1. Information we collect

### 1.1 Information you provide

- **None.** OpenCalc does not require you to create an account, sign in, or provide any personal information in v1.0.0.

### 1.2 Information collected automatically

- **None.** OpenCalc does not include any analytics SDKs, crash reporters, or tracking libraries in v1.0.0.

### 1.3 Information stored on your device

The following data is stored **locally on your device** (in the browser's `localStorage` for the web/PWA version, or in the app's private storage on Android). **It never leaves your device:**

| Data | Purpose | Stored where |
|------|---------|-------------|
| Calculation history | Shows your past calculations for quick reuse | `localStorage` key `opencalc-v1` |
| Favorites | Lets you star frequently-used calculations | Same as above |
| Memory register | M+, M−, MR, MC functions | Same as above |
| Theme preference | Light/Dark mode choice | Same as above |
| Settings | Haptics, angle unit, decimal places, orientation | Same as above |

You can clear all of this at any time via **Settings → Data → Clear all history**, or by uninstalling the app.

---

## 2. Permissions requested

OpenCalc requests the minimum permissions necessary to function:

| Permission | Why we need it | Can you disable it? |
|-----------|----------------|---------------------|
| **`VIBRATE`** | Haptic feedback when you tap calculator keys. Disabled by default — you can turn it off in Settings → Haptic feedback. | ✅ Yes, in Settings |
| **`INTERNET`** | Required for the PWA / web build to load. The Android APK works fully offline. | ❌ Required by Android WebView |
| **`ACCESS_NETWORK_STATE`** | Lets the app detect offline state gracefully. | ❌ Required by Android WebView |

**Permissions OpenCalc does NOT request:**

- ❌ Camera
- ❌ Microphone
- ❌ Location
- ❌ Contacts
- ❌ Storage / Photos
- ❌ Phone state
- ❌ SMS

If a future version of OpenCalc adds a feature that requires a new permission (e.g. the planned equation scanner would need camera access), we will:
1. Update this privacy policy
2. Request the permission at runtime (not at install time)
3. Explain why we need it before asking

---

## 3. Third-party services

### 3.1 Currently used (v1.0.0)

**None.** OpenCalc v1.0.0 does not communicate with any third-party service.

### 3.2 Planned for future versions

The following services may be added in **v1.1 or later**. We will update this policy before adding them:

| Service | Purpose | When | Opt-in? |
|---------|---------|------|---------|
| **Supabase** (Auth) | Optional user accounts (Email / Google / Anonymous Guest) for cross-device history sync | v1.1+ | ✅ Yes — only if you sign in |
| **GitHub Releases CDN** | App update checks | v1.2+ | ✅ Yes — only if you enable "check for updates" |

When these are added:
- Your calculation history will only sync to the cloud **if you explicitly sign in**
- Anonymous Guest mode will keep all data local
- You can delete your cloud data at any time

---

## 4. Data sharing

**OpenCalc does not share your data with anyone**, because we don't collect it in the first place.

We will never:
- Sell your data
- Share your data with advertisers
- Share your data with law enforcement without a valid court order
- Use your data to train AI models

---

## 5. Data security

Since all data is stored locally on your device, the security of your data is equivalent to the security of your device itself. We recommend:
- Using a screen lock (PIN, pattern, fingerprint)
- Keeping your device's OS up to date
- Not rooting/jailbreaking your device

The OpenCalc source code is public at https://github.com/huzaifaa-dev-vibe/Open-Calc — you can audit it yourself to verify these claims.

---

## 6. Children's privacy

OpenCalc is a calculator app and is suitable for all ages. We do not knowingly collect any personal information from anyone, including children under 13. If you believe a child has provided us with personal information (which would only be possible in a future version with auth), please contact us so we can delete it.

---

## 7. Your rights

Since OpenCalc stores all data locally on your device, you have full control:

- **Right to access:** All your data is visible in the History panel
- **Right to delete:** Settings → Data → Clear all history, or uninstall the app
- **Right to export:** Your history is stored in `localStorage` under the key `opencalc-v1` (you can copy it via browser DevTools)
- **Right to object:** Simply stop using the app or uninstall it
- **Right to portability:** The data format is documented JSON — you can take it anywhere

---

## 8. Changes to this policy

If we update this privacy policy, we will:
1. Update the "Last updated" date at the top
2. Bump the app version number
3. Add a changelog entry in the release notes
4. For material changes, show a notification in the app on next launch

You can view the full history of changes to this policy at:
https://github.com/huzaifaa-dev-vibe/Open-Calc/commits/main/PRIVACY.md

---

## 9. Open source

OpenCalc is open-source software licensed under the MIT License. The complete source code is available at:
https://github.com/huzaifaa-dev-vibe/Open-Calc

You are free to audit, modify, and redistribute the code under the terms of the MIT License.

---

## 10. Contact

If you have questions about this privacy policy or about OpenCalc, please contact:

- **GitHub Issues:** https://github.com/huzaifaa-dev-vibe/Open-Calc/issues
- **Email:** [Contact email to be added]

---

## 11. Jurisdiction

OpenCalc is developed by [huzaifaa-dev-vibe](https://github.com/huzaifaa-dev-vibe) and has no corporate entity. This privacy policy is provided as-is without warranty.

---

*This document is part of OpenCalc and is licensed under the MIT License along with the source code.*
