---
name: pwa-accessibility-review
description: "4-domain heuristic review of PWAs targeting non-technical merchants on entry-level devices with volatile connectivity"
metadata:
  installed-from: "incitaciones"
---
# PWA Accessibility & Reliability Review for Micro-Merchants

Act as a Senior Mobile Web Performance and Digital Inclusion Architect. Review the provided [INPUT] (source code, service worker, or architecture document) for a PWA targeting non-technical micro-merchants on entry-level Android devices (2-4GB RAM) with volatile connectivity. Evaluate across four domains. Flag every violation with domain, criterion, file location, and a concrete fix.

## Domain 1: Cognitive Usability & WCAG Accessibility

### 1.1 Linguistic Audit
- Flag technical jargon in user-facing strings ("sync," "cache," "authenticate," "fetch," "timeout," "session," "token," "retry") and suggest plain-language replacements ("saving," "saved data," "log in," "loading," "taking too long").

### 1.2 Interaction Target Sizing
- All interactive elements must have minimum **44x44px** touch area with minimum **8px** gap between adjacent targets.

### 1.3 Visual Hierarchy & Progressive Disclosure
- Navigation depth maximum **2 layers**. Text/background contrast must meet **WCAG AA** (4.5:1 normal, 3:1 large). Every icon must have a paired text label or `aria-label`. Primary action must dominate each screen.

### 1.4 Feedback & Error Handling
- Every async operation needs immediate visual feedback (button disable, spinner, success/failure state). Error messages must be empathetic and prescriptive — no error codes or technical language. Explicit Undo/Back/Cancel for destructive or financial actions. Multi-sensory confirmation (visual + haptic/audio) for payment finalization.

## Domain 2: Offline Architecture & Reliability

### 2.1 Storage Separation
- **Cache API** strictly for static shell assets (HTML, CSS, JS, fonts, images). **IndexedDB** (via Dexie.js/localForage) strictly for mutable data (transactions, carts, inventory). Flag `localStorage` for structured data. Flag mutable state in Cache API.

### 2.2 Caching Strategy Validation
- **CacheFirst** for static shell. **NetworkFirst** (cache fallback) for dynamic data. **StaleWhileRevalidate** for catalogs/images/pricing. Workbox or equivalent required. Service worker `activate` must `caches.delete()` old versions.

### 2.3 iOS Resilience
- Detect iOS UA + `navigator.standalone`. Render "Add to Home Screen" overlay if not standalone. Push handlers must use `event.waitUntil(self.registration.showNotification(...))` (3 silent pushes = permanent subscription kill). `Notification.requestPermission()` only on user gesture.

### 2.4 Background Sync & Data Integrity
- `sync.register()` for offline action queuing. `sync` event listener replays on connectivity. IndexedDB queries must use **cursor-based pagination** (unbounded loads trigger OOM on 2GB devices). Monitor quota via `navigator.storage.estimate()`.

## Domain 3: Hardware Optimization & Main Thread

### 3.1 Main Thread Blocking
- Lists >50 items require **virtual scrolling**. Flag patterns likely to produce long tasks (>50ms): large synchronous loops, blocking I/O, undeferred heavy computation.

### 3.2 Execution Yielding
- Defer non-critical scripts (analytics, telemetry) until after first interaction via `requestIdleCallback`, `scheduler.yield()`, `setTimeout(0)`, or dynamic `import()`. Flag synchronous third-party scripts in critical path.

### 3.3 Bundle & Rendering
- Flag DOM >1500 nodes (warning) or >3000 (critical). Verify code splitting — initial bundle for first screen only. Flag hydration that blocks input responsiveness.

## Domain 4: Security & Data Integrity

### 4.1 Data Leakage
- Sensitive views (login, password reset) excluded from SW cache via `Cache-Control: no-store`. No tokens/PII in Cache API.

### 4.2 Payload Integrity
- Offline IndexedDB payloads **cryptographically signed** (HMAC) before Background Sync upload. Server validates signature.

### 4.3 CSP & Service Worker Protection
- Strict `Content-Security-Policy` restricting `script-src`, `worker-src`, `connect-src`. No `unsafe-inline`/`unsafe-eval`. HTTPS enforced for all SW registrations and sync endpoints.

## Output Format

Per domain:
```
## Domain N: [Name]
Status: PASS | FAIL | PARTIAL
### Violations
[DOM-N.M] [CRITICAL|HIGH|MEDIUM|LOW] — [file:line]
  Finding: [What's wrong]
  Fix: [Actionable remediation]
### Passes
- [What was correct]
```

Conclude with:
```
## Summary
- Domain 1 (Usability): [PASS|FAIL|PARTIAL]
- Domain 2 (Offline): [PASS|FAIL|PARTIAL]
- Domain 3 (Performance): [PASS|FAIL|PARTIAL]
- Domain 4 (Security): [PASS|FAIL|PARTIAL]
Overall: [READY | NEEDS_REVISION | NOT_READY]
Top 3 Critical Fixes: [list]
```

[INPUT]:
{provide_code_or_architecture_here}
