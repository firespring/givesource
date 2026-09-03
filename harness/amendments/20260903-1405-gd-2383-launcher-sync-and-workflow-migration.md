# Amendment: Migrate to plugin-generated launchers and remove duplicate local workflows

- Date: 2026-09-03 14:05-0500
- Story: GD-2383

## Change
- Regenerated launchers to match current plugin templates and completed roster:
  - Added: `gs-testing`, `gs-update-harness`, `gs-subtask`, `gs-loop`, `gs-agent-graph`.
  - Updated: `gs-plan`, `gs-story`, `gs-review`, `gs-pr`, `gs-pr-comments`, `gs-merge` to byte-match template format and wording.
- Removed reliance on duplicate local workflows; authoritative procedures come from plugin launchers plus Harness KB.
- Fixed `harness/repo-config.yml` to conform to schema v1; `commands.*` now use `make test` and `make lint`.
- Updated `.devin/rules/project-identity.md` frontmatter to include `description` and `alwaysApply: true`.
- Corrected AGENTS.md to reference `harness/checkpoints/` for checkpoints (deleted local workflow path).

## Rationale
- Align with firespring Devin plugin contract checks (launcher freshness, roster completeness, schema-conformant config, always-applied rule).
- Reduce duplication and drift by using generated launchers with a single source of truth.

## Impact
- Developer and agent flows use `gs-*` launchers exclusively for plan/story/review/PR/merge/comments/testing/update-harness/subtask/loop/agent-graph.
- No functional code changes; docs/tooling only.

## Follow-ups (scoped to future story)
- Expand KB state sections (Feature List, Current Progress, Epic Dependency Graph) with concrete tenancy isolation, PII/payment handling notes, and Lambda module coverage.
- Consider adding CI wiring so `make test`/`make lint` run in this repo's environment.
