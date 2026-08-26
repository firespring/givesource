---
name: plan
description: Invoke the fs-plan plugin skill with givesource context.
---

# givesource: plan (launcher)

Run the fs-plan plugin skill for the shared procedure.
It resolves this repo (firespring/givesource), loads the facts from `harness/repo-config.yml`,
and echoes them before running.

- Read `AGENTS.md` first (Critical Directives and Forbidden Actions)
- For orientation, see `harness/givesource.md`
 - Fallback if the plugin isn’t available: follow `.devin/workflows/harness-plan.md`
