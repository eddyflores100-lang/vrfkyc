# VRFKYC · AliceLabs LLC

Counterparty evidence for people, businesses and agents. Version 0.4.1 is a **free beta** with fictional examples, account-linked monthly limits and structured API/MCP discovery. It does not verify identity or give an automatic compliance verdict.

## Website and application

- Public website: `https://vrfkyc.alicelabs.site` (GitHub Pages; requires the custom-domain DNS configuration).
- Hosted workspace: https://asterscreen.toastyrice32.chatgpt.site/#workspace
- Native sign-in uses ChatGPT and its account email. This is not an independent email/password login service.
- GitHub Pages runs only the fixed fictional example locally. Account actions open the hosted workspace, with no shared cookies or API keys in static files.

## Run and verify

Use Node 24 (minimum 22.13 for the SQLite-based tests).

```sh
npm ci
npm test
npm run check
npm run validate
npm run dev          # public backend preview; no fabricated signed-in identity
npm run dev:pages    # static website preview
```

`npm run build` generates `dist/server/index.js` for Sites and the isolated `pages/` publication. `worker/core.mjs`, `worker/landing.html`, `worker/legal.mjs` and `worker/entry.mjs` are the runtime sources. The generated bundle is not edited by hand. Drizzle schemas and migrations are in `db/` and `drizzle/`; generate new schema-only migrations with `npm run db:generate` and never rewrite applied history.

## Accounts and limits

The hosted application requires a trusted Sites identity and explicit acceptance of the current beta terms before a search. Every free account receives five successful queries per UTC calendar month, shared across person/company/context and REST/MCP routes. The atomic database counter enforces parallel requests and restarts. Provider errors and `not_screened` results release their reserved credit. Deleting a profile, switching audiences or signing out does not reset this month's allowance.

My account supports audience preferences, JSON account export and profile deletion. It stores a pseudonymous identifier, audience, acceptance version/time and usage counts, without searched names or report notes. Previous-month counters are removed during normal account access. Downloads and notes remain under the user's control.

## API / MCP

- `POST /api/mcp` and `/mcp`: stateless MCP with ten tools, resources and a review prompt.
- Public discovery: `GET /api/status`, `/api/sources`, `/api/manifest`, `/openapi.json`, `/llms.txt`.
- Account: `GET`, `POST`, `DELETE /api/account`; plans: `GET /api/plans`.
- Search: `POST /api/screen`; context: `POST /api/context`.
- Public MCP tools: `get_capabilities`, `list_sources`, `get_report_schema`.
- All hosted search tools, including `screen_demo`, require a signed-in account, current acceptance and available quota.

Original source records and scope travel with results. Unknown demo names return `not_screened`, never a fabricated clearance. Live empty results are limited to the provider scope. Exports support JSON, formula-neutralized CSV, escaped HTML and browser print-to-PDF.

## Current boundaries

CSL, OpenSanctions, GLEIF, Wikidata, Federal Register and GDELT adapters are implemented. **Live data and billing are not activated.** A provider name in the interface does not mean its source is configured. Check `/api/status`; failed or unavailable queries never become clean reports. Provider access, licensing, private support contacts and verified company contracting details must be completed before live commercial use. Proposed paid plans cannot be purchased or activated through the browser.

No server report archive, document verification, automatic clearance, continuous monitoring or complete KYC is promised. Existing historical files from earlier imported work are not part of this build or the Pages artifact. Do not restore the legacy Next.js workflow as the application entry point.

See [deployment and DNS](docs/DEPLOYMENT.md), [release notes](docs/RELEASE-0.4.1.md), and [legal notices](docs/legal/legal.md). The public policy pages describe the implemented beta and do not constitute legal certification.
