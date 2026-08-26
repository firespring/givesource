---
name: review
description: Invoke the fs-review plugin skill with givesource context.
---

# givesource: review (launcher)

Run the fs-review plugin skill for the shared procedure.
It resolves this repo (firespring/givesource), loads the facts from `harness/repo-config.yml`,
and echoes them before running.

- Enforce `AGENTS.md` Forbidden Actions (no force-push, no amend)
- Ground on `harness/givesource.md` for invariants before suggesting changes
- Fallback if the plugin isn’t available: review against Harness invariants manually
