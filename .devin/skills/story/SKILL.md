---
name: story
description: Invoke the fs-story plugin skill with givesource context.
---

# givesource: story (launcher)

Run the fs-story plugin skill for the shared procedure.
It resolves this repo (firespring/givesource), loads the facts from `harness/repo-config.yml`,
and echoes them before running.

- Register Jira session if applicable; follow `AGENTS.md` hygiene
- Use checkpoints: `harness/checkpoints/`
- Fallback if the plugin isn’t available: follow `.devin/workflows/harness-plan.md` + record checkpoints
