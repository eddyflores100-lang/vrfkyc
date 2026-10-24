# 0.4.1 — account flow and isolated Pages publication

- Complete explicit, versioned beta-terms acceptance before the first hosted search; acceptance itself consumes no credit.
- Add account export, preference controls and profile deletion with current-month quota retention.
- Isolate test client addresses so public request limits do not interfere across account tests.
- Remove expired usage counters during normal account access.
- Build server and Pages from the same interface; detect the static runtime through build metadata, including custom domains.
- Keep the public fixed-fixture demo usable without pretending it can screen real names. Open the hosted application for authenticated operations.
- Link all legal documents; expose useful retry messages and print-window feedback.
- Add CI that publishes only the generated `pages/` directory after checks pass.

Validation: 29 automated tests, JavaScript syntax and generated Worker validation pass. Browser validation and actual deployment status are recorded separately; unit tests do not establish provider or customer-launch readiness.
