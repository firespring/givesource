# Checkpoint 2026-08-26 14:21 UTC: Initial Harness + Skills Scaffolded

- Plan: harness/plans/2026-08-gd-2383-harness-for-givesource.md
- Jira: https://firespringdev.atlassian.net/browse/GD-2383

## Changes
- Created repo-specific Harness structure and KB (`harness/givesource.md`), wired in `harness/repo-config.yml` (incl. `kb_update` workflow mapping)
- Added workflows: `.devin/workflows/harness-plan.md`, `harness-checkpoint.md`, `harness-amend.md`, `harness-adr.md`, `harness-kb-update.md`
- Fixed malformed YAML frontmatter in `harness-adr.md` and improved ADR numbering logic
- Created `AGENTS.md` with Givesource directives and context routing
- Updated root `README.md` with a "For AI agents" section
- Established repo-specific KB `harness/givesource.md` and pointed new references to it (no prior `ai-search.md` existed in this repo)
- Added Givesource-specific skills: `.devin/skills/{gs-plan,gs-story,gs-review,gs-pr,gs-pr-comments,gs-merge}/SKILL.md` (prefixed aliases with local fallbacks)
- Opened feature branch `feature/GD-2383-harness` based on `develop`
- Version remains aligned with `develop` (currently 4.2.22); this PR itself does not introduce product changes
- Updated Jira description with a summary of work performed

## Risks
- KB/repo-config drift as the codebase evolves

## Next
- Push feature branch to origin and open PR
- Incorporate review feedback; extend skills (testing, update-harness) if desired
