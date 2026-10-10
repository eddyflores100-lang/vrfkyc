# Security corrections and remaining boundaries

Fixed in this release:
- Removed embedded OpenSanctions fallback from both REST and MCP paths. **Owner must revoke/rotate the previously public provider key**; do not reuse it. No provider account-management access was used.
- Removed tracked .env and application database from current tree. No history rewrite was attempted; inspect historical database exposure independently and revoke any other historical secrets.
- Removed imported notes, diary, messages, docs and memory APIs from the deployed Next route tree.
- Provider failure no longer yields CLEAR, Low risk or a 490-dataset claim. Removed uncalibrated 0–100 risk arithmetic and first-Wikidata-hit identity assumption.
- No automatic provider fallback that silently changes scope; caller selects CSL or OpenSanctions.
- Bounded request bodies, input validation, timeouts, origin checks, safe source URLs and escaped local report exports.
- Live tools require a token. Credit-consuming provider calls require durable quota store; quota failures block the call.
- CSP, no-store, referrer and content-type protection headers for the workspace and API.

Remaining boundaries:
- Shared-token pilot access, not multi-tenant user authorization. No OAuth server, user provisioning or key dashboard.
- Demo and free-provider memory counters are per isolate; global perimeter limits needed at scale. The shared daily durable counter includes context queries.
- No persistent audit trail, signed export, independent pentest certification, enterprise SLA or active Stripe subscription handling.
- Site/host, upstream provider and agent-client logs may retain metadata; privacy/DPA details need verified business information before production customer personal data.
- Source text may contain prompt injection. Tool outputs preserve warnings; client must treat source data as untrusted and cannot automatically infer compliance.
- GDELT matches are contextual links, not adverse-media adjudication. Retrieved articles remain under publisher rights.

Tests cover mock provider failures, scopes, quota boundaries, MCP lifecycle and export source checks. They do not certify matching recall, latest provider schema compatibility, external agent compatibility or visual browser behavior.

Additional validation: official MCP JavaScript SDK connected through the Fetch transport, initialized, listed 10 tools, called screen_demo, read a source resource and retrieved the review prompt. GLEIF, Wikidata and Federal Register adapters each returned five live contextual results for public test queries. This does not certify every external client or provider schema. CSL/OpenSanctions live screening remains unverified without fresh configured credentials.
