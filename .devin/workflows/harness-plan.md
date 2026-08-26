---
description: Start a new long-running plan with append-only tracking
---

1. Create a new plan file under `harness/plans/` using kebab-case.

   Example structure:
   ```
   harness/plans/2026-08-agent-hardening.md
   ```

2. Add the standard sections:
   - Background
   - Goals / Non-goals
   - Milestones (2-5)
   - Risks
   - Acceptance
   - Links (ADRs, PRs, Checkpoints)

3. Commit the plan:
   ```bash
   git add harness/plans && git commit -m "harness: add new plan <slug>"
   ```
