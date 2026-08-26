# Plan: GD-2383 — Add a Harness to Givesource

- Status: Active
- Opened: 2026-08-26
- Jira: https://firespringdev.atlassian.net/browse/GD-2383
- Links: AGENTS.md, harness/givesource.md, harness/repo-config.yml

## Background
Givesource needs a repository-grounded Harness to guide AI agents working on long-running tasks. The Harness provides a central knowledge base, structured workflows, and append-only tracking (plans, checkpoints, amendments, ADRs).

## Goals
- Stand up a complete, Givesource-specific Harness consistent with firespring-ai’s pattern.
- Ground agents via AGENTS.md, repo-config, and a repo-specific KB.
- Provide skills and workflows for planning, story work, reviews, PRs, and merges.

## Non-goals
- Change application logic in frontend/lambda/cloudformation beyond docs and tooling.
- Automate deployments in this effort.

## Milestones
1. Scaffold Harness structure (README, repo-config, KB, plans/checkpoints/amendments, ADR template)
2. Replace ai-search with givesource and update all references
3. Add AGENTS.md tailored to Givesource packages and invariants
4. Add .devin workflows (plan, checkpoint, amend, adr, kb-update)
5. Fix ADR workflow frontmatter and robust numbering
6. Add repo launcher skills (plan, story, review, pr, pr-comments, merge) with local fallbacks
7. Update root README with AI agents section
8. Update Jira story with work summary; open feature branch and bump version

## Risks
- Agents bypassing Harness conventions — Mitigate via AGENTS.md and skills preamble.
- Drift between repo reality and KB/runbooks — Mitigate via kb-update workflow.

## Acceptance
- Harness folder exists and is repo-specific.
- AGENTS.md published at repo root with clear directives.
- Skills and workflows present and wired to harness/repo-config.yml.
- README links users to AGENTS.md and KB.
- Jira story reflects work performed; feature branch created; version bumped.

## Next Actions
- Add initial checkpoint after merging this plan.
- Extend skills (testing, update-harness) if needed.
