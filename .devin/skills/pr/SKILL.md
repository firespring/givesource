---
name: pr
description: Invoke the fs-pr plugin skill with givesource context.
---

# givesource: pr (launcher)

Run the fs-pr plugin skill for the shared procedure.
It resolves this repo (firespring/givesource), loads the facts from `harness/repo-config.yml`,
and echoes them before running.

- Ensure branch safety (see `AGENTS.md`); no history rewrites
- Link PRs to Harness plans/checkpoints when work spans days
- Fallback if the plugin isn’t available: open PRs manually following Harness runbooks
