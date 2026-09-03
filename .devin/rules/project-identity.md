---
title: Project Identity (Always Applied)
---

- This repository is firespring/givesource — a monorepo with:
  - Frontend (Vue 3 + Vite): packages/frontend
  - Lambda (Node.js, webpack): packages/lambda
  - CloudFormation infra: packages/cloudformation
- Read AGENTS.md before making changes; follow Project Conventions, Naming Conventions, and Testing.
- Authoritative facts (repo prefix, base branch, Make targets, Harness paths) live in harness/repo-config.yml.
- Primary entry points:
  - Plugin-backed: `gs-*` launchers (e.g., gs-plan, gs-pr, gs-merge) or `/firespring:fs-*` slash commands
  - Knowledge base: harness/givesource.md
  - Plans/Checkpoints: harness/plans/, harness/checkpoints/
- Test commands:
  - make test (delegates to repo npm scripts)
  - npm --prefix packages/lambda run test
- Do not force-push or amend reviewed commits; follow branch safety in AGENTS.md.
