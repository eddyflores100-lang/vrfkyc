# Security & Responsible Use

Version: 2026-10-23. Effective: 23 October 2026.

Current controls and known limits; no security certification claimed.

## Implemented controls

Hosted gateway identity; per-account server checks; explicit versioned terms acceptance; guarded atomic monthly D1 quota; rejection of client-supplied plans/limits; bounded JSON bodies and validated inputs; same-origin checks; provider timeouts; paid-source quota protection; no bundled secrets; no subject/report storage in the account database; HTML escaping and CSV formula neutralization in exports. Account APIs use no-store responses.

## Known boundaries

Native identity headers must be supplied by the Sites gateway; they must never be trusted on an ordinary public Node/Worker origin. Search calls on unsupported deployments fail closed. A verified account is not legal identity verification, and multiple verified accounts remain an abuse risk. Rate controls are not a bot-proof system. No independent penetration-test certification, SOC 2/ISO certificate, SLA, tamper-proof report archive or guaranteed matching recall is claimed.

## Incident reporting

A monitored private security contact and incident playbook must be configured before live launch. Do not send credentials or personal records to public GitHub issues. This beta does not promise a bug bounty or legal safe harbor beyond applicable law. We welcome proportionate, authorized testing that avoids accessing others’ data or disrupting the service.

## Previous exposed key

An OpenSanctions key was embedded in the prior repository history. Current code has no embedded fallback. The owner still must revoke/rotate that historical key with the provider and review its usage. Removing it from the current code does not revoke it or erase Git history.
