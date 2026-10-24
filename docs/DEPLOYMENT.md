# Deployment: vrfkyc.alicelabs.site

The public website is built into `pages/` and published by `.github/workflows/vrfkyc.yml`. Only that directory is uploaded, excluding source code, migrations and unrelated historical repository files.

1. Repository Settings → Pages → Source: **GitHub Actions**.
2. Custom domain: **vrfkyc.alicelabs.site**.
3. At the authoritative DNS provider, add **CNAME** `vrfkyc` → `eddyflores100-lang.github.io` (no protocol or repository path). Replace only a conflicting record at this exact host. Leave the apex, mail records and nameservers unchanged.
4. After GitHub validates DNS and issues its certificate, enable **Enforce HTTPS**.

The `CNAME` file in the built artifact documents the intended host. With Actions, the custom domain must also be set in Pages settings; the file alone does not configure the domain.

## Application backend

The application remains at https://asterscreen.toastyrice32.chatgpt.site. GitHub Pages cannot run a Worker, D1, authenticated sessions or MCP handlers. The public example runs locally with fixed fictional fixtures. Sign-in opens the hosted application through top-level navigation. No account cookies or provider credentials are sent to GitHub Pages, and no third-party-cookie dependency is introduced.

The source `.openai/hosting.json` retains the existing Sites project and D1 `DB` binding. Publish the tested Worker through the Sites source workflow; pending Drizzle migrations are applied by Sites. Migration history is append-only. Runtime variables use the hosting secret controls, not this repository.

`VRFKYC_AUTH_MODE=sites` is safe only behind the Sites gateway that supplies and controls identity headers. Do not set it on an independently deployed Worker or Node server. The local development server strips these headers. Standalone deployment intentionally does not enable user searches until a trusted identity layer is implemented.

## Live activation

Live data and billing remain disabled. A legitimate provider credential and confirmation of the provider's commercial terms are prerequisites for CSL/OpenSanctions screening. OpenSanctions also needs a durable quota store and authorized pilot token. Finish verified private support/company details and operational arrangements before enabling live personal-data processing. Discovery never treats an unavailable source as a clean result.

## Verification and rollback

CI runs the service, account and UI regression suite, syntax checks and Worker validation before uploading the Pages artifact. The previous deployment remains available if verification fails. Roll back by reverting the deployment commit normally and letting CI rebuild; do not force-push repository history. The published Sites backend is versioned separately.
