# Playwright QA Engineering Demo

A **real, executable** TypeScript + Playwright test suite against a **fictional, local booking sandbox**. It demonstrates test design, independent scenarios, accessible locators, Page Object Model, assertions, and CI readiness. It is **not** a test suite against Kronoly, the live portfolio, or any production booking system.

## Run locally

Requires Node.js 22+, Python 3 and a Playwright-supported OS.

```bash
cd playwright-qa-demo
npm ci
npx playwright install chromium
npm run typecheck
npm test
npm run report
```

For an interactive runner: `npm run test:ui`.

## Scenarios

| ID | Risk | Assertion |
| --- | --- | --- |
| QA-001 | Valid appointment | Confirmation for an available slot |
| QA-002 | Double booking | Occupied slot is rejected |
| QA-003 | Required fields | Missing customer name is rejected |
| QA-004 | Date validation | Past appointment is rejected |
| QA-005 | Duplicate submission | Repeated booking is rejected in one session |
| QA-006 | Input normalization | Whitespace-only customer name is rejected |
| QA-007 | Required date | Missing appointment date is rejected |
| QA-008 | Validation order | Missing name takes precedence over occupied slot |

## Engineering decisions

- **Accessibility-first locators**: `getByRole` / `getByLabel`; no brittle CSS or positional selectors.
- **POM with boundaries**: `BookingPage` centralizes locators and user actions. Business assertions remain visible in spec files.
- **Isolated tests**: each test starts with a fresh browser page; the sandbox has no external persistence.
- **Auto-waiting assertions**: `await expect(locator).toHaveText(...)`, no arbitrary sleeps.
- **Deterministic inputs**: fictional sample dates/slots, with actual date validation against the current time; a known occupied slot is seeded on page load.
- **CI diagnostics**: HTML report and traces/screenshots/video retained on failures, artifacts uploaded even if tests fail.
- **Fail-fast hygiene**: `forbidOnly` in CI, TypeScript strict checks, pinned dependency versions via `package-lock.json`.

## Limitations and next steps

The sandbox is intentionally simple and browser-local. It does not test APIs, real databases, multi-user concurrency, authentication, accessibility compliance or production reliability. Future extensions could add API contract checks, a real backend with isolated test data, browser matrix coverage, and visual/a11y audits. These should be added only when meaningful, not as superficial badges.

The intentionally failing **QA-002** scenario in the portfolio's *interactive educational QA Lab* is separate from this executable test suite. Here, the sandbox correctly rejects the occupied slot and all four tests are expected to pass.
