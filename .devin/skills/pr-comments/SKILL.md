---
name: pr-comments
description: Invoke the fs-pr-comments plugin skill with givesource context.
---

# givesource: pr-comments (launcher)

Run the fs-pr-comments plugin skill for the shared procedure.
It resolves this repo (firespring/givesource), loads the facts from `harness/repo-config.yml`,
and echoes them before running.

- Follow `AGENTS.md` guidance; keep comments scoped and actionable
- Fallback if the plugin isn’t available: address comments manually with context from Harness
