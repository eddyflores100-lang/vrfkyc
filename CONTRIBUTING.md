# Contributing to VRFKYC

Thanks for helping improve the beta. Keep changes small, testable, and consistent with the documented product boundaries.

## Requirements

- Node.js 24 (minimum 22.13.0 for the SQLite-based test suite).
- npm with the committed lockfile.

## Local verification

```sh
npm ci
npm test
npm run check
npm run validate
```

For interface work, also run `npm run dev:pages`. For backend work, use `npm run dev` as documented in the README.

Do not use real personal data or production provider credentials in local tests.

## Change requirements

1. Explain the user-visible behavior or defect being addressed.
2. Add or update tests for changed behavior.
3. Preserve append-only Drizzle migration history; do not rewrite migrations already applied.
4. Keep secrets server-side and avoid logging searched names, report notes, tokens, or personal data.
5. Keep the static GitHub Pages build isolated from authenticated backend operations.
6. Update documentation when API routes, quota behavior, deployment, provider scope, or legal boundaries change.

## Pull request checklist

- [ ] `npm ci` succeeds.
- [ ] `npm test` passes.
- [ ] `npm run check` passes.
- [ ] `npm run validate` passes.
- [ ] No secrets or real personal data are included.
- [ ] Docs and release notes match the implementation.
- [ ] The change does not imply identity verification or legal compliance certification unless that capability has actually been implemented and independently validated.
