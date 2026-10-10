# API selection — 9 October 2026, Ecuador

Reviewed the README of https://github.com/public-apis/public-apis, focusing on government, business, open data, finance, validation and security entries. It is a discovery catalog, not a license grant, pricing guarantee or proof a service still operates. In particular its OpenSanctions row marked auth "No" conflicts with current provider instructions requiring an API key.

## Integrated

| Source | Catalog relation | Role and boundary | Verification source |
|---|---|---|---|
| CSL | Supplementary official source | U.S. export-list screening aid; original-source verification required | https://www.trade.gov/consolidated-screening-list and https://developer.trade.gov/ |
| OpenSanctions | Listed | Licensed default collection; initial 2,000 credits, not monthly free allowance | https://www.opensanctions.org/api/ and https://www.opensanctions.org/docs/api/ |
| GLEIF | Supplementary | LEI entity reference, not complete UBO or sanctions | https://www.gleif.org/en/lei-data/gleif-api/ |
| Wikidata | Listed | Candidate public entity search; structured CC0 data, no identity/PEP assertion | https://www.wikidata.org/wiki/Wikidata:Licensing |
| Federal Register | Listed | Document context; official legal editions must be checked | https://www.federalregister.gov/developers/documentation/api/v1 |
| GDELT | Supplementary | Quoted-name news-link discovery, not validated adverse media | https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/ |

Implemented Fetch adapters are mock-tested. Provider success is not claimed until keys/configuration and live checks are completed. Public context endpoints are token protected to control upstream use. Metadata, schema and fictional demos are public.

## Deferred deliberately

- OpenCorporates: useful for companies, but a catalog entry does not establish commercial redistribution rights. Obtain confirmed license before embedding.
- UK Companies House: useful UK expansion; needs key, upstream usage-policy and business-scope validation. Not necessary for the first U.S. workflow.
- VAT/VIES validators: relevant to EU VAT checks, not U.S. sanctions or determining AliceLabs taxes.
- REST Countries: reference enrichment only, not identity evidence; no additional third-party call needed for a two-letter input.
- Age/gender/nationality prediction APIs: unreliable for identity and may introduce discriminatory assumptions. Excluded.
- IP reputation/crypto/wanted-list/news vendors: add only with explicit use case and confirmed commercial data terms, never through a generic reseller marketplace by default.

## Commercial comparison and design direction

Reviewed sanctions.io, dilisense, ComplyCube, ComplyAdvantage and SEON content. Inspiration: task-first search (dilisense); separate API/manual pathways (sanctions.io); enterprise product hierarchy (ComplyCube); transparent plan framing (ComplyAdvantage); controlled agent access (SEON). Original green/slate interface, evidence cards, real demo workspace and interactive tool console. No competitor assets, testimonials, certifications or coverage promises copied. This review used retrieved content, not a browser screenshot audit.

SEON already offers MCP and ComplyAdvantage already sells Agentic; no exclusivity claim is justified. The initial differentiation hypothesis is simpler setup, openly inspectable source scope and portable evidence for small U.S. teams/integrators. Superiority in accuracy, coverage, speed, uptime and customer retention remains unproven.

Sources: https://www.sanctions.io/ ; https://dilisense.com/en ; https://www.complycube.com/ ; https://complyadvantage.com/starter-plan/ ; https://docs.seon.io/knowledge-base/machine-learning/seon-mcp .

## Distribution for agents

Ship stable contracts, public demo tools, full discovery, useful prompts, clear errors and copyable examples. Publish the deployed MCP in relevant registries only after domain verification, public reachability and actual client tests. llms.txt and permissive robots are supporting documentation, not guaranteed traffic or revenue. Measure tool discovery → successful demo → authorized pilot → retained paying customer.

Validation update: GLEIF, Wikidata and Federal Register returned live results in this environment for public test queries. All six adapters have mocked contract/failure checks; primary screening needs fresh CSL/OpenSanctions credentials before live validation. Official MCP SDK lifecycle and tool/resource/prompt calls passed.
