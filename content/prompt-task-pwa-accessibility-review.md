---
title: PWA Accessibility & Reliability Review for Micro-Merchants
type: prompt
subtype: task
tags: [pwa, accessibility, wcag, offline-first, mobile-performance, security, review, low-literacy]
tools: [claude-code, cursor, gemini, aider]
status: draft
created: 2026-03-19
updated: 2026-03-19
version: 1.0.0
related: [research-paper-pwa-accessibility-micro-merchants.md, prompt-task-iterative-code-review.md]
source: research-paper-pwa-accessibility-micro-merchants.md
---

# PWA Accessibility & Reliability Review for Micro-Merchants

## When to Use

Use this prompt when reviewing a Progressive Web App intended for non-technical users on budget hardware in low-connectivity environments. It is specifically designed for:

- **Merchant-facing POS applications:** PWAs used by small shop owners, street vendors, or independent retailers — especially in Latin America.
- **Accessibility audits for low digital literacy:** Evaluating whether interfaces are usable by people who fear "breaking" the system.
- **Offline-first architecture validation:** Confirming that service workers, caching strategies, and local storage are correctly implemented.
- **Entry-level device optimization:** Ensuring the app performs on 2-4GB RAM Android Go devices (Moto E13, Galaxy A04 class).
- **Cross-platform PWA deployment:** Catching iOS-specific pitfalls (silent push penalty, 7-day cache eviction, installation barriers).

**Do NOT use this prompt for:**
- Native mobile app reviews (iOS/Android).
- PWAs targeting desktop-first or high-bandwidth enterprise users.
- Backend API reviews that don't involve client-side offline logic.

## The Prompt

````markdown
# PWA Accessibility & Reliability Review for Micro-Merchants

Act as a Senior Mobile Web Performance and Digital Inclusion Architect. You specialize in Progressive Web Apps deployed to non-technical micro-merchants (small shop owners, butchers, hardware store operators) operating on entry-level Android devices (2-4GB RAM, Unisoc/MediaTek SoCs) in environments with volatile network connectivity.

Your objective is to perform a rigorous heuristic review of the provided [INPUT] — which may be source code, component files, service worker configurations, or an application architecture document — across four domains. **Do not pass the code unless all domains meet their criteria.** Flag every violation with its domain, specific criterion, file location, and a concrete fix.

## Domain 1: Cognitive Usability & WCAG Accessibility

Evaluate the interface for barriers that block non-technical, low digital literacy users.

### 1.1 Linguistic Audit
- Flag ALL technical jargon in user-facing strings: "sync," "syncing," "cache," "authenticate," "fetch," "download," "API," "timeout," "session," "token," "retry."
- For each flagged term, suggest a plain-language replacement derived from the user's physical environment (e.g., "authenticate" → "log in," "syncing" → "saving," "cache" → "saved data," "timeout" → "taking too long").

### 1.2 Interaction Target Sizing
- Verify every interactive element (`<button>`, `<a>`, `<input>`, custom touch targets) has a minimum touch area of **44x44 CSS pixels**.
- Check for adequate whitespace/padding between adjacent interactive elements to prevent accidental taps (minimum 8px gap).
- Flag any touch target that lacks explicit sizing (relying on content-only dimensions).

### 1.3 Visual Hierarchy & Progressive Disclosure
- Confirm navigation depth does not exceed **2 layers** from any entry point.
- Verify high-contrast color compliance: all text/background combinations must meet **WCAG AA** (4.5:1 for normal text, 3:1 for large text). Flag any reliance on color alone to convey meaning.
- Confirm every `<svg>` icon and icon button is paired with either a visible `<span>` text label or a descriptive `aria-label`.
- Check that the primary action dominates the visual hierarchy on each screen — secondary actions must be visually subordinate.

### 1.4 Feedback & Error Handling
- Verify every asynchronous operation (network requests, database writes, payment processing) provides **immediate visual feedback**: button disabling, loading spinner or skeleton, and a success/failure state.
- Flag any error message that uses technical language, error codes, or system terminology. Error messages must be empathetic, contextual, and prescriptive (tell the user exactly what to do).
- Confirm explicit **Undo/Back/Cancel** paths exist for any destructive or financial action.
- Check for multi-sensory confirmation on high-stakes actions (payment finalization): visual indicator (checkmark), haptic feedback (vibration API), and/or audio feedback.

## Domain 2: Offline Architecture & Reliability

Perform a deep review of the Service Worker, caching configuration, and local data storage.

### 2.1 Storage Separation
- **Cache API** must be used exclusively for static shell assets (HTML, CSS, JS bundles, fonts, logos, images).
- **IndexedDB** (via a wrapper library like Dexie.js or localForage) must be used exclusively for mutable, structured application data (transactions, carts, customer records, inventory).
- Flag any use of `localStorage` for structured data (5MB limit, synchronous, blocks main thread).
- Flag any attempt to store mutable application state in the Cache API.

### 2.2 Caching Strategy Validation
- Verify **CacheFirst** routing for static shell assets.
- Verify **NetworkFirst** (with cache fallback) routing for dynamic data endpoints (transaction histories, balances, inventory counts).
- Verify **StaleWhileRevalidate** for content where speed matters but eventual consistency is acceptable (product catalogs, category images, pricing).
- Confirm Workbox (or equivalent) is used rather than hand-rolled service worker caching logic.
- Verify the service worker `activate` event contains explicit `caches.keys()` enumeration and `caches.delete()` of old cache versions.

### 2.3 iOS Resilience
- Confirm the application detects the iOS user agent (`/iPad|iPhone|iPod/`) and checks `navigator.standalone`.
- If the PWA is not running in standalone mode on iOS, confirm a visual "Add to Home Screen" instructional overlay is rendered with step-by-step Safari Share menu guidance.
- Verify push notification handlers wrap the notification display in `event.waitUntil(self.registration.showNotification(...))` to prevent Safari's "silent push" penalty (3 silent pushes = permanent subscription termination).
- Confirm `Notification.requestPermission()` is only called in response to a direct user gesture, never on page load.

### 2.4 Background Sync & Data Integrity
- Confirm `ServiceWorkerRegistration.sync.register()` is used to queue offline actions.
- Verify the `sync` event listener in the service worker replays queued actions when connectivity is restored.
- Confirm IndexedDB queries use **cursor-based pagination** — flag any query that loads an unbounded dataset into memory (will trigger Android OOM killer on 2GB RAM devices).
- Verify quota monitoring via `navigator.storage.estimate()` with graceful degradation when storage is near capacity.

## Domain 3: Hardware Optimization & Main Thread Management

Evaluate against the severe constraints of entry-level Android Go devices (2GB RAM, budget SoCs).

### 3.1 Main Thread Blocking
- Flag any synchronous render of a list exceeding ~50 items without **list virtualization** (windowing). Transaction histories, product catalogs, and customer lists must use virtual scrolling.
- Flag JavaScript patterns likely to produce long tasks (>50ms): large synchronous loops, blocking I/O, undeferred heavy computation without yielding.

### 3.2 Execution Yielding
- Confirm non-critical scripts (analytics, crash reporting, telemetry, background sync registration) are deferred until after the first user interaction using `requestIdleCallback`, `scheduler.yield()`, `setTimeout(0)`, or dynamic `import()`.
- Flag any third-party script loaded synchronously in the critical rendering path.

### 3.3 Bundle & Rendering Efficiency
- Flag excessive DOM node counts (>1500 nodes on a single view is a warning; >3000 is critical).
- Verify code splitting is implemented — the initial bundle must contain only what's needed for the first screen.
- Flag any framework hydration that blocks input responsiveness (check INP-affecting patterns).

## Domain 4: Security & Data Integrity

Audit offline data handling for vulnerabilities specific to client-side financial applications.

### 4.1 Data Leakage Prevention
- Confirm sensitive views (login, password reset, account recovery) are excluded from service worker cache routing via `Cache-Control: no-store` or explicit route exclusion.
- Flag any session tokens, authentication credentials, or PII stored in the Cache API.
- Verify that financial data is encrypted before being written to IndexedDB (e.g., via the Web Crypto API or a library like crypto-js).

### 4.2 Payload Integrity
- Confirm offline IndexedDB payloads are **cryptographically signed** (HMAC or equivalent) before Background Sync upload.
- Verify the server validates the signature to detect tampering during the offline queue period.

### 4.3 CSP & Service Worker Protection
- Confirm the server sends a strict `Content-Security-Policy` header that restricts `script-src`, `worker-src`, and `connect-src` to known origins.
- Flag any use of `unsafe-inline` or `unsafe-eval` in CSP directives.
- Verify HTTPS is enforced for all service worker registrations and background sync endpoints.

## Output Format

For each domain, produce:

```
## Domain N: [Name]
Status: PASS | FAIL | PARTIAL

### Violations
[DOM-N.M] [CRITICAL|HIGH|MEDIUM|LOW] — [file:line or component]
  Finding: [What's wrong]
  Fix: [Specific, actionable remediation]

### Passes
- [Brief note on what was correctly implemented]
```

Conclude with:

```
## Summary
- Domain 1 (Usability/Accessibility): [PASS|FAIL|PARTIAL]
- Domain 2 (Offline/Reliability): [PASS|FAIL|PARTIAL]
- Domain 3 (Hardware/Performance): [PASS|FAIL|PARTIAL]
- Domain 4 (Security/Integrity): [PASS|FAIL|PARTIAL]

Overall: [READY | NEEDS_REVISION | NOT_READY]
Top 3 Critical Fixes: [list]
```

[INPUT]:
{provide_code_or_architecture_here}
````

## Example

**Context:**
Reviewing a Svelte-based POS PWA for a chain of hardware stores (*ferreterías*) in suburban Buenos Aires.

**Input:**
```
/pwa-accessibility-review [paste service worker file, main component, and manifest.json]
```

**Expected Output:**
A structured 4-domain report identifying issues such as:
- **DOM-1.1** HIGH — `src/components/SyncStatus.svelte:12`: User-facing string "Syncing transactions..." uses jargon. Fix: Replace with "Saving your sales..."
- **DOM-2.2** CRITICAL — `sw.js:45`: API routes use CacheFirst instead of NetworkFirst. Merchants will see stale transaction data. Fix: Switch to `NetworkFirst` with a 3-second timeout fallback.
- **DOM-3.1** HIGH — `src/routes/history.svelte:8`: Transaction list renders all 2,000+ records without virtualization. Fix: Implement `svelte-virtual-list` or equivalent windowing.
- **DOM-4.3** MEDIUM — Missing `Content-Security-Policy` header. Fix: Add CSP with `script-src 'self'; worker-src 'self'; connect-src 'self' https://api.example.com`.

## Expected Results

- **4-domain structured report** with PASS/FAIL/PARTIAL per domain.
- **Specific violations** with file locations, severity, and actionable fixes.
- **Linguistic replacements** for every jargon term found in user-facing strings.
- **Caching strategy corrections** for misconfigured service worker routes.
- **Performance flags** for main thread blocking, missing virtualization, and excessive DOM nodes.
- **Security audit** covering CSP, cache exclusions, and payload signing.

## Variations

To use a variation, prepend the domain restriction to your input: "Review the following using only Domain 1: [code]".

**Usability-Only Review:**
Use only Domain 1 when reviewing UI mockups, Figma exports, or HTML/CSS without backend logic.

**Offline Architecture Audit:**
Use Domains 2 and 3 when reviewing service worker and storage code in isolation, without UI components.

**Security-Focused Review:**
Use Domain 4 combined with Domain 2.4 (Background Sync) when auditing the data pipeline between IndexedDB and the server.

## References

- [research-paper-pwa-accessibility-micro-merchants.md](research-paper-pwa-accessibility-micro-merchants.md) — Full research synthesis with 40 cited sources.
- WCAG 2.1 — Web Content Accessibility Guidelines (Perceivable, Operable, Understandable, Robust).
- Google Workbox — Service worker toolbox for caching strategies.
- Dexie.js — Promise-based IndexedDB wrapper.

## Notes

- **Test on real hardware.** Lighthouse scores on a developer MacBook are meaningless. This prompt assumes the reviewer has access to or knowledge of entry-level Android devices (Moto E13, Galaxy A04 class).
- **iOS is the fragile platform.** Android/Chrome has excellent PWA support. iOS/Safari is where offline-first PWAs break — prioritize Domain 2.3 (iOS Resilience) findings.
- **The 7-day eviction trap.** If a merchant doesn't open the PWA for 7 days on iOS, all local data is erased. There is no workaround — only graceful recovery. Flag any architecture that assumes persistent local state on iOS.
- **"Greasy fingers" test.** The target user operates the device with one hand, quickly, possibly with dirty or wet fingers. Every touch target and spacing decision should pass this mental model.

## Version History

- 1.0.0 (2026-03-19): Initial version derived from PWA accessibility research heuristic framework.
