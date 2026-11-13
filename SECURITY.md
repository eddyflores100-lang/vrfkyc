# Security policy

## Scope

VRFKYC is a free beta for counterparty evidence and source discovery. It is not a complete KYC service, identity-verification provider, legal opinion, or automatic compliance decision system. Live provider data and billing are not activated unless the current release documentation explicitly says otherwise.

## Reporting a vulnerability

Please report suspected vulnerabilities privately through GitHub's **Report a vulnerability** feature for this repository (Security → Advisories → Report a vulnerability), rather than publishing exploit details in an issue.

Include:
- affected release, commit, endpoint, or workflow;
- a concise impact description;
- minimal reproduction steps using fictional data;
- relevant logs with credentials, personal data, and identifiers removed.

Do not include real screening subjects, customer records, provider credentials, session tokens, or private reports in a disclosure.

## Response expectations

The maintainers will review reports as capacity allows. No response-time or remediation-time SLA is promised for this beta. Keep coordination in the private advisory until a fix or mitigation is available.

## Deployment safeguards

- Never commit provider credentials or production secrets.
- Keep trusted identity headers behind the hosting gateway described in `docs/DEPLOYMENT.md`.
- Do not enable live personal-data processing until provider licensing, data protection, retention, support and operational controls have been reviewed.
- Treat unavailable providers and unknown results as unresolved, not as a clean screening result.
