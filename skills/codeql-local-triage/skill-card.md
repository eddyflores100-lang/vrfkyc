## Description:

Helps developers investigate one Python CodeQL alert by tracing SARIF data flow, testing controlled source variants, and checking whether a proposed fix clears the finding.

This skill is ready for commercial/non-commercial use.

## Publisher:

[elisabeth15501](https://clawhub.ai/user/elisabeth15501)

### License/Terms of Use:

MIT-0

## Use Case:

Developers and security engineers use this skill to explain a single Python CodeQL alert, locate a candidate taint source, and verify a proposed fix against a reproducible baseline. It does not perform whole-repository audits or dismiss alerts.

### Deployment Geography for Use:

Global

## Known Risks and Mitigations:

Risk: An optional setup path suggests running CodeQL downloaded from a third-party mirror without strong authenticity checks.

Mitigation: Use the official GitHub release or independently verify the archive's hash or signature before running it; avoid unauthenticated mirror downloads.

Risk: Triage reads local source trees and writes generated variants into a work directory.

Mitigation: Run only on source trees you intend to share with the skill and keep outputs within the advertised _bisect or explicitly chosen work directory.

## Reference(s):

- [ClawHub skill listing](https://clawhub.ai/elisabeth15501/skills/codeql-local-triage)
- [Running the CodeQL CLI](references/running-codeql-cli.md)
- [Sensitive-data heuristics](references/sensitive-data-heuristics.md)
- [CI integration](references/ci-integration.md)

## Skill Output:

**Output Type(s):** [Text, Markdown, Shell commands, Guidance]

**Output Format:** [Markdown with commands and variant result counts]

**Output Parameters:** [1D]

**Other Properties Related to Output:** [Reports the candidate source and minimal change; labels conclusions unverified when a baseline or CodeQL run is unavailable.]

## Skill Version(s):

1.0.7 (source: skill frontmatter and server release metadata)

## Ethical Considerations:

Users should evaluate whether this skill is appropriate for their environment, review any generated or modified files before relying on them, and apply their organization's safety, security, and compliance requirements before deployment.
