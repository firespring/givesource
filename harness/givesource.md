# Givesource Knowledge Base (Harness)

Use these targeted notes and searches to orient quickly and ground agents before making changes.

## Repo map
- **Frontend (Vue + Vite)**: `packages/frontend`
  - Admin build: `config/vite.config.admin.js`
  - Public build: `config/vite.config.public.js`
  - Assets/styles: `src/public-pages/assets/css/`
  - Helper to watch: `src/admin-pages/helpers/media.js` (VIDEO_REGEX invariant)
- **Lambda (Node, Webpack)**: `packages/lambda`
  - Webpack: `config/webpack.config.js`
  - API handlers: `src/api/**`
  - Data layer: `src/repositories/**` (uses `loadModels()` lifecycle)
- **Infrastructure (CloudFormation)**: `packages/cloudformation`
  - Templates/stack scripts: `bin/*.js`

## Critical invariants
- **VIDEO_REGEX capture groups**: In `packages/frontend/src/admin-pages/helpers/media.js`, `Media.getVideoData` expects group 3 = provider domain and group 6 = video ID. Preserve these indices when editing the regex or parsing will break.
- **Repository DB lifecycle**: Each repository calls `loadModels()` internally and closes the connection in `.finally()`. Do not combine repository calls with a manually-managed `loadModels()` in the same handler; query models directly instead.

## Common searches
- Find repository usage of models:
  - `rg "loadModels\(" packages/lambda/src/repositories`
- Find API handlers touching donations:
  - `rg "getDonations|donation" packages/lambda/src/api`
- Find CloudFormation release/update scripts:
  - `rg "release|update" packages/cloudformation/bin`
- Frontend entrypoints (admin/public):
  - `rg "createApp|createRouter" packages/frontend/src`

## Build and deploy runbooks
- **Frontend**
  - Build: `npm --prefix packages/frontend run build`
  - Release: `npm --prefix packages/frontend run release`
  - Deploy: `npm --prefix packages/frontend run deploy`
- **Lambda**
  - Build all: `npm --prefix packages/lambda run build`
  - Release all: `npm --prefix packages/lambda run release:force`
  - Update existing function only: `LAMBDA=<Name> npm --prefix packages/lambda run build && LAMBDA=<Name> npm --prefix packages/lambda run deploy`
- **CloudFormation**
  - Build: `npm --prefix packages/cloudformation run build`
  - Release: `npm --prefix packages/cloudformation run release:force`
  - Update stack: `npm --prefix packages/cloudformation run update`
- **New Lambda + API Gateway (prod)**
  1. Bump root `package.json` version
  2. Release lambda: `npm --prefix packages/lambda run release:force`
  3. Release CloudFormation: `npm --prefix packages/cloudformation run release:force`
  4. Update stack: `npm --prefix packages/cloudformation run update`
  5. Manually deploy API Gateway to `prod` stage (Console) or CLI: `aws apigateway create-deployment --rest-api-id <ID> --stage-name prod`

## Agent guidance
- Read `harness/repo-config.yml` first. Prefer repository utilities and scripts over bespoke commands.
- When a task spans multiple days, open or update a plan under `harness/plans/`, then checkpoint daily under `harness/checkpoints/`.
- For scope/approach changes, append an amendment; for durable tech choices, file an ADR.
