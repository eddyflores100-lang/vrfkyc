---
name: oss-bounty-hunter
version: 1.0.0
description: Open Source Bounty Hunter - finds, verifies, and claims paid bounties on GitHub issues. Supports Algora, IssueHunt, and direct bounty labels. Anti-ban aware.
license: MIT
metadata:
  emoji: "💰"
---

# OSS Bounty Hunter

Finds, verifies, and claims paid bounties on GitHub issues across multiple platforms.

## Platforms Supported

### 1. Algora (algora.io)
- Bounties posted on GitHub issues via `/bounty $X` comments
- Claim by commenting `/attempt` on the issue
- Payment via Algora on PR merge
- Typical: $50-$5,000

### 2. IssueHunt (issuehunt.io)
- Bounties funded by community
- Claim via IssueHunt UI
- Typical: $20-$3,000

### 3. Direct Bounty Labels
- GitHub issues with `Bounty` label + $ amount in title
- Payment terms vary by repo

## Workflow

### Phase 1: Discovery
```bash
# Search GitHub for bounty issues
# Filters: label:"Bounty" OR label:"bounty" + state:open + language filter
# Exclude: "star" "review" "blog" (spam bounties)
```

### Phase 2: Verification (CRITICAL — do this before attempting)
1. Check issue is OPEN (not closed)
2. Check bounty is FUNDED (not just promised)
3. Check NO active `/attempt` from another dev in last 48h
4. Check repo has CONTRIBUTING.md (signals active maintainer)
5. Check repo has recent commits (last 30 days)
6. Check issue has < 20 comments (high competition = low chance)
7. Verify bounty platform is real (Algora profile exists)

### Phase 3: Anti-Ban Checklist
- [ ] Account age > 30 days
- [ ] No more than 1 attempt per repo
- [ ] No more than 3 attempts per day total
- [ ] Read CONTRIBUTING.md before commenting
- [ ] Comment meaningfully on the issue first (not just /attempt)
- [ ] Follow the repo (signals genuine interest)
- [ ] Star the repo (signals genuine interest)

### Phase 4: Attempt Protocol
1. Read the full issue + all comments
2. Clone the repo
3. Reproduce the bug (if applicable)
4. Write the fix
5. Test locally
6. Comment on issue: explain your approach + `/attempt`
7. Create PR with proper description
8. Link PR to issue

### Phase 5: Post-Attempt
- Monitor for maintainer feedback
- Respond within 24h
- If maintainer requests changes, apply immediately
- If another dev's PR is merged first, withdraw gracefully

## Anti-Ban Rules (NON-NEGOTIABLE)

| Rule | Why |
|------|-----|
| Max 3 bounty attempts/day | Algora/GitHub detect burst activity |
| Max 1 attempt per repo | Multiple attempts = spam pattern |
| Read CONTRIBUTING.md first | Signals you respect project norms |
| Comment meaningfully before /attempt | Signals genuine interest |
| Check competition (other /attempt comments) | Don't waste time on contested bounties |
| Verify bounty is FUNDED | Some bounties are promises, not funded |
| Check repo activity (recent commits) | Dead repos = dead bounties |

## Quality Checklist Before PR

- [ ] Code compiles/passes lint
- [ ] Tests pass (if test suite exists)
- [ ] PR description references the issue
- [ ] Commit message follows repo convention
- [ ] No unnecessary changes (keep PR minimal)
- [ ] DCO signoff if required
- [ ] Branch name follows convention

## Bounty Verification Script

```bash
# Verify a bounty is real before attempting
python3 verify_bounty.py <repo> <issue_number>
```

Checks:
1. Issue is open
2. Bounty label exists
3. Bounty amount in body or title
4. Platform (Algora/IssueHunt/direct)
5. Active attempts by other devs
6. Repo activity (last commit date)
7. CONTRIBUTING.md exists
8. CI status of repo
