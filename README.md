# VRFKYC — evidence for people and agents

Counterparty identity-candidate screening by AliceLabs LLC. A responsive original interface, six focused data adapters and stateless MCP. This release **does not** offer automated clearance, calibrated criminal-risk scoring, complete KYC, verified PEP identity, persistent customer audit records or active billing.

## Run

```sh
npm ci
cp .env.example .env.local
# Set a strong VRFKYC_API_TOKEN and your selected provider keys in .env.local.
npm run dev
npm test
npm run typecheck
npm run build
npm start
```

Next.js rewrites `/` to the HTML workspace route `/site`. The landing is also available as `index.html` for GitHub Pages: static hosting runs fictional demos locally and **cannot host MCP or live API endpoints**. No API key belongs in that file or a browser bundle.

## Sources and actual startup costs

| Adapter | Purpose | Data-access cost basis |
|---|---|---|
| CSL | U.S. consolidated export restrictions | Free subscription key; quotas apply |
| OpenSanctions | Hosted default matching collection | 2,000 initial business-email trial credits; paid prepaid bundles afterward |
| GLEIF | LEI/company reference candidates | Public LEI data access |
| Wikidata | Public entity candidates | Structured data CC0, API policy applies |
| Federal Register | Regulatory document context | Public API without key; verify official publication |
| GDELT | News link discovery | Public endpoint, fair use; article copyright remains |

Infrastructure/design/development are supplied at $0 cash cost by the owner. **There is no $12,500 required launch budget.** Initial data API spend can be $0 with CSL and provider trials. Tax depends on LLC/state/ownership/income facts not established here; no invented tax amount. Payment processing is separate and checkout is not activated. See [selection review](docs/API-SELECTION.md).

## MCP and HTTP

- `POST /mcp` and `/api/mcp`: initialize, discovery, tools, resources and prompts.
- Protocols: 2025-11-25, 2025-03-26 and Sites discovery 2026-07-28. Stateless JSON response, no SSE GET (405). Notifications receive 202.
- Public tools: `get_capabilities`, `list_sources`, `get_report_schema`, `screen_demo`.
- Authorized live tools: `screen_person`, `screen_company`, `search_legal_entities`, `search_public_entities`, `search_regulatory_notices`, `search_news_context`.
- `GET /openapi.json`, `/api/manifest`, `/.well-known/mcp.json`, `/api/status`, `/api/sources`, `/llms.txt`, `/llms-full.txt`.
- `POST /api/screen`: `{name,type,country?,birthDate?,provider?,mode?}`. Types person/company; provider csl/opensanctions; mode demo/live.
- `POST /api/context`: `{query,source}` where source is gleif/wikidata/federal_register/gdelt.

Live calls require `Authorization: Bearer <VRFKYC_API_TOKEN>`. This is a **pilot shared-token model**, not self-service multi-tenant customer accounts. Protect and rotate tokens. Public demos have per-instance limits. For distributed deployments add perimeter limits; in-memory limits cannot provide global quotas. OpenSanctions credit-consuming requests are blocked unless durable Upstash quota counters are configured; the quota store fails closed. `DAILY_QUERY_LIMIT` defaults to 100 authorized calls, shared across the token's live tools.

Sites platform may additionally mediate authentication for `/mcp`. The public `/api/mcp` alias has the same application policy. Each external agent client needs compatibility verification; do not claim all clients certified. No OAuth authorization server is implemented in this app.

## Report behavior

Fictional fixtures: Alex Morgan / Harbor Example LLC. Other demo subjects are `not_screened`, never fabricated no-match clearances. Live empty results are `no_candidates_in_scope`. Provider errors stay not screened. CSL returns at most 100 candidates and explicitly reports truncation. Country/type are review inputs; CSL is not filtered by them to avoid hiding records with missing identifiers. Similarity is provider supplied and can be null.

Local exports: JSON, CSV with formula neutralization, escaped HTML and browser print-to-PDF. Reviewer notes remain in the tab. Reports are user-exported evidence, **not signed or tamper-proof certificates**.

## Before customer launch

Configure keys legitimately; rotate the previously exposed OpenSanctions key. Confirm commercial source terms, usage policies and trial conditions. Verify AliceLabs business details and finalize privacy/DPA/terms. Add multi-tenant authorization and durable audit storage before promising them. Configure global abuse protection before a large public campaign. The repository history contains old embedded credentials and imported workspace data: deleting current files does not erase history. See [security review](docs/SECURITY-REVIEW.md).

The original imported memory/notes APIs are removed from the deployed route tree. A local excluded `legacy/` copy preserves unrelated source during development. Their historical versions remain in Git history; VRFKYC does not expose those endpoints.

## Optional Cloudflare Worker deployment

`worker/entry.mjs` uses the same tested core and HTML. Deploy with Wrangler (`npx wrangler deploy`); the HTML Text rule is in wrangler.jsonc. Add secrets with the hosting CLI/dashboard; no secrets in vars or Git. This deployment target is provided, not deployed to your Cloudflare account in this change.
