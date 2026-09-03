# AGENTS.md — AI Coding Agent Rules for Givesource

> Strict guidance for AI coding agents contributing to this repository. Read this before making changes. Use the context routing table to fetch details on demand.

---

## 1) Project Identity

- **Repo:** `firespring/givesource` — Monorepo
- **Purpose:** Givesource® donation platform (public site assets, admin UI, AWS Lambda APIs, CloudFormation infra)
- **Packages:**
  - `packages/frontend` — Vue 3 + Vite builds for Admin and Public sites
  - `packages/lambda` — Node.js AWS Lambda functions (webpack bundling)
  - `packages/cloudformation` — AWS CloudFormation stack and helpers
- **Harness:** Central knowledge base and workflows in `harness/` (see routing below)
- **Base Branch:** `develop`

---

## Project Conventions

- **Security**
  - Never commit secrets — No API keys, AWS creds, tokens, or `.env` files.
  - Handle PII with care — Do not add logs that leak donor details or payment data.
  - Keep AWS changes scripted — Prefer repository scripts and CloudFormation; avoid manual console edits.

- **Lambda (packages/lambda)**
  - Repository lifecycle invariant — Each repository call manages its own `loadModels()` and closes in `.finally()`. Do not open a manual connection and then call repositories. If you need models with a manual connection, query models directly instead.
  - Avoid long‑lived connections — Keep handlers stateless and idempotent.

- **Frontend (packages/frontend)**
  - VIDEO_REGEX capture indices — `Media.getVideoData` relies on exact capture group positions in `src/admin-pages/helpers/media.js`:
    - Group 3 = provider domain
    - Group 6 = video ID
    Preserve these indices or update all dependent parsing.
  - Separate builds — Admin and Public builds use distinct Vite configs under `config/`.
  - No secrets in client code — Do not surface credentials or sensitive config in frontend bundles.

- **CloudFormation (packages/cloudformation)**
  - Make infra changes via templates and `bin/*.js` helpers.
  - For prod deploys, follow documented runbooks (see Harness KB) and confirm risk.

### Git / Review Hygiene

- No `git push --force`, `--force-with-lease`, `commit --amend`, or long rebases on shared branches.
- Add tests for new logic where feasible (especially Lambda data access).
- Keep PRs scoped; link to Harness plan/checkpoints when work spans days.

## Naming Conventions

- **Branches**: `feature/<STORY_KEY>` (e.g., `feature/GD-2383-harness`).
- **Skill launchers**: Prefixed with `gs-` (e.g., `gs-plan`, `gs-pr`, `gs-merge`).
- **Harness docs**: Kebab-case filenames; checkpoints prefixed with UTC timestamp `YYYYMMDD-HHMM-<topic>.md`.

Authoritative values (repo prefix, base branch, feature branch format) are defined in `harness/repo-config.yml`.

## Testing

- Primary: `make test` (delegates to existing npm scripts).
- Lint: `make lint`.
- Lambda tests: `npm --prefix packages/lambda run test` (mocha), `npm --prefix packages/lambda run test:coverage` for coverage.
- Run package builds before release as applicable.

---

## 3) Context Routing

| Need to… | Read this |
| --- | --- |
| Quick orientation, runbooks, invariants | `harness/givesource.md` |
| Packages, commands, deployment runbooks | `harness/repo-config.yml` |
| Start/track long‑running work | `gs-plan` or `/firespring:fs-plan`; checkpoints live in `harness/checkpoints/` |
| Amend scope / record decisions | `.devin/workflows/harness-amend.md`, `.devin/workflows/harness-adr.md` |
| Lambda API handlers | `packages/lambda/src/api/**` |
| Lambda data layer (repositories) | `packages/lambda/src/repositories/**` |
| Frontend Vite configs | `packages/frontend/config/vite.config.admin.js`, `vite.config.public.js` |
| Frontend styles/assets | `packages/frontend/src/public-pages/assets/css/` |
| CloudFormation scripts/templates | `packages/cloudformation/bin/*.js`, `packages/cloudformation/templates/` |

---

## 4) Commands (per package)

Use `npm --prefix <pkg> run <script>` from repo root.

### Frontend (`packages/frontend`)

```bash
npm --prefix packages/frontend run build        # Build admin + public
npm --prefix packages/frontend run build:admin  # Admin build
npm --prefix packages/frontend run build:public # Public build
npm --prefix packages/frontend run dev:admin    # Admin dev server
npm --prefix packages/frontend run dev:public   # Public dev server
npm --prefix packages/frontend run release      # Release artifacts
npm --prefix packages/frontend run deploy       # Deploy release
```

### Lambda (`packages/lambda`)

```bash
npm --prefix packages/lambda run build          # Bundle all functions (webpack)
npm --prefix packages/lambda run release:force  # Build + package for release
LAMBDA=<Name> npm --prefix packages/lambda run deploy  # Deploy a single function
npm --prefix packages/lambda run test           # Mocha tests
npm --prefix packages/lambda run test:coverage  # Coverage report
```

### CloudFormation (`packages/cloudformation`)

```bash
npm --prefix packages/cloudformation run build        # Build templates
npm --prefix packages/cloudformation run release:force# Package for release
npm --prefix packages/cloudformation run update       # Update stack
```

> End‑to‑end: See Harness KB "Build and deploy runbooks" for the New Lambda + API Gateway flow.

---

## 5) Forbidden Actions

- Commit `.env` or any secret credentials.
- Break `Media.getVideoData` capture group indices without updating all consumers.
- Mix manual `loadModels()` connections with repository calls in the same Lambda handler.
- Make manual, untracked changes in AWS console for production stacks.
- Force‑push, amend shared history, or rebase in a way that rewrites reviewed commits.

---

## 6) Known Pitfalls (Keep Updated)

- **Regex capture positions (frontend):** Group 3 = provider domain; Group 6 = video ID.
- **DB connection lifecycle (lambda):** Repositories own `loadModels()` + close. Don’t mix lifecycles.

Add new pitfalls here with symptoms, wrong approach, correct fix, and why it’s non‑obvious.

---

## 7) After Completing Work

1. Run package tests/builds as applicable (Lambda tests, Frontend builds).
2. Verify no secrets or `.env` files are staged.
3. If the task was long‑running, add a checkpoint under `harness/checkpoints/` (append-only; per-story checkpoints managed by the plugin).
4. If decisions were made, add an ADR (`.devin/workflows/harness-adr.md`).

---

## 8) Where to Ask for Help

- Harness KB: `harness/givesource.md`
- Repo config and runbooks: `harness/repo-config.yml`
- Open a plan or checkpoint and note open questions for review.

<!-- BEGIN FIRESPRING DEVIN BRANCH SAFETY -->
### Base-Branch Commit Safety (Generated)

> Generated from `templates/agents-branch-safety.md` in the Firespring Devin plugin. Do not edit this block by hand. The no-rebase / no-amend / no-force-push / no-branch-deletion rules already in Forbidden Actions are not repeated here.

- The base branch named in Project Identity (or `repo.base_branch` in `harness/repo-config.yml`) is protected from direct commits. A developer request to commit is not an override.
- Before staging or committing in any context — including a conversational request — read and apply the plugin's `skills/_shared/branch-safety.md`.
<!-- END FIRESPRING DEVIN BRANCH SAFETY -->
