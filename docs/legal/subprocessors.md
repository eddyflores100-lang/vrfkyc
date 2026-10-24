# Provider & Data-Flow Inventory

Version: 2026-10-23. Effective: 23 October 2026.

Inventory describes current and conditional providers; contracts and locations still require review.

## Current hosting and identity

ChatGPT Sites: hosting dispatch, native identity and access metadata. Cloudflare Worker/D1: application execution and the pseudonymous account/terms/monthly-counter database provisioned by Sites. Their contractual roles, data locations, access logs, backups and transfer arrangements are to be confirmed from the hosting agreement; we do not claim a privately negotiated DPA or fixed region.

## Conditional screening sources

CSL / U.S. International Trade Administration: a future activated name query to the official-list API. OpenSanctions: an optional licensed matching call with selected identifiers. Neither live screening source is activated in this beta. OpenSanctions standard hosted API terms can cover embedded screening results and client reports, while bulk-dataset redistribution requires different terms. No provider API key is exposed to users.

## Conditional context sources

GLEIF supplies legal-entity reference candidates; Wikidata supplies public-entity candidates; Federal Register supplies regulatory documents; GDELT supplies news discovery links. These are separate opt-in calls and currently gated with other live data. A provider can act independently under its terms rather than as AliceLabs’ processor in every situation. News copyright remains with the original publisher.

## Planned payments

Stripe is a planned payment provider only. It receives no payment or card data from this release. Before activation, payment data categories, provider terms, retention, country transfers and customer notices must be updated.

## Changes and customer review

A live business agreement must identify approved subprocessors, processing tasks, applicable locations, notice of material changes, objection handling and required safeguards. This inventory is not a blanket representation that every listed source has signed AliceLabs’ DPA.
