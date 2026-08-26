# Givesource Harness

Ground AI agents on long-running work through structured workflows, a central knowledge base, and append-only change tracking. This follows the firespring-ai Harness pattern and adapts it to the Givesource monorepo.

- Reference: https://github.com/firespring/firespring-ai/tree/develop/harness

## Structure
- **repo-config.yml**: Repo grounding for agents (packages, commands, deploy runbooks, invariants).
- **givesource.md**: Living knowledge base with targeted search aids and system invariants.
- **plans/**: Append-only initiative plans. One plan is "in progress" at a time.
- **checkpoints/**: Time-stamped progress snapshots; do not edit once written.
- **amendments/**: Append-only deltas to plans/scope; record rationale and impact.
- **adrs/**: Architecture Decision Records for durable technical choices.

## Operating rules
- **Append-only artifacts**: Files in `plans/`, `checkpoints/`, and `amendments/` are append-only. Never rewrite history; create a new file to update status.
- **Decision hygiene**: Record significant decisions as ADRs in `adrs/` and link them from plans.
- **Single active plan**: Keep one plan marked active; pause/close others via a new amendment.
- **Grounding first**: Agents must read `repo-config.yml` and `givesource.md` before taking action.

## Quick start
- **Start a plan**: Use `/harness-plan` workflow to scaffold an initiative file under `harness/plans/`.
- **Checkpoint work**: Use `/harness-checkpoint` to log progress in `harness/checkpoints/`.
- **Amend scope**: Use `/harness-amend` to append an amendment.
- **Record a decision**: Use `/harness-adr` to create a new ADR.

## Conventions
- Filenames are kebab-case. Checkpoints include a UTC timestamp prefix: `YYYYMMDD-HHMM-<topic>.md`.
- Link related artifacts at the top of each file (plan ↔ checkpoints ↔ amendments ↔ ADRs).
- Keep entries short and actionable; deep details go into `documentation/` or code comments.
