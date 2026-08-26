# Checkpoint 2026-08-26 14:21 UTC: Initial Harness + Skills Scaffolded

- Plan: harness/plans/2026-08-gd-2383-harness-for-givesource.md
- Jira: https://firespringdev.atlassian.net/browse/GD-2383

## Changes
- Created repo-specific Harness structure and KB (`harness/givesource.md`), wired in `harness/repo-config.yml` (incl. `kb_update` workflow mapping)
- Added workflows: `.devin/workflows/harness-plan.md`, `harness-checkpoint.md`, `harness-amend.md`, `harness-adr.md`, `harness-kb-update.md`
- Fixed malformed YAML frontmatter in `harness-adr.md` and improved ADR numbering logic
- Created `AGENTS.md` with Givesource directives and context routing
- Updated root `README.md` with a "For AI agents" section
- Replaced `ai-search` with `givesource`; removed `harness/ai-search.md`
- Added Givesource-specific skills: `.devin/skills/{plan,story,review,pr,pr-comments,merge}/SKILL.md` with local fallbacks
- Opened feature branch `feature/GD-2383-harness` based on `develop`
- Bumped root `package.json` version from 4.2.21 to 4.2.22
- Updated Jira description with a summary of work performed

## Risks
- KB/repo-config drift as the codebase evolves

## Next
- Push feature branch to origin and open PR
- Incorporate review feedback; extend skills (testing, update-harness) if desired
