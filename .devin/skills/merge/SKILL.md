---
name: merge
description: Invoke the fs-merge plugin skill with givesource context.
---

# givesource: merge (launcher)

Run the fs-merge plugin skill for the shared procedure.
It resolves this repo (firespring/givesource), loads the facts from `harness/repo-config.yml`,
and echoes them before running.

- Confirm CI status and reviews; respect `AGENTS.md` branch safety rules
- Update Harness checkpoints/ADRs if final decisions differ from plan
- Fallback if the plugin isn’t available: follow Harness runbooks to merge safely
