# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: npx @next/codemod agents-md --output CLAUDE.md|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx,03-layouts-and-pages.mdx,04-linking-and-navigating.mdx,05-server-and-client-components.mdx,06-cache-components.mdx,07-fetching-data.mdx,08-updating-data.mdx,09-caching-and-revalidating.mdx,10-error-handling.mdx,11-css.mdx,12-images.mdx,13-fonts.mdx,14-metadata-and-og-images.mdx,15-route-handlers.mdx,16-proxy.mdx,17-deploying.mdx,18-upgrading.mdx}|01-app/02-guides:{analytics.mdx,authentication.mdx,backend-for-frontend.mdx,caching.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,data-security.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,json-ld.mdx,lazy-loading.mdx,local-development.mdx,mcp.mdx,mdx.mdx,memory-usage.mdx,multi-tenant.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,prefetching.mdx,production-checklist.mdx,progressive-web-apps.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,single-page-applications.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx,videos.mdx}|01-app/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|01-app/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|01-app/02-guides/upgrading:{codemods.mdx,version-14.mdx,version-15.mdx,version-16.mdx}|01-app/03-api-reference:{07-edge.mdx,08-turbopack.mdx}|01-app/03-api-reference/01-directives:{use-cache-private.mdx,use-cache-remote.mdx,use-cache.mdx,use-client.mdx,use-server.mdx}|01-app/03-api-reference/02-components:{font.mdx,form.mdx,image.mdx,link.mdx,script.mdx}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.mdx,manifest.mdx,opengraph-image.mdx,robots.mdx,sitemap.mdx}|01-app/03-api-reference/03-file-conventions:{default.mdx,dynamic-routes.mdx,error.mdx,forbidden.mdx,instrumentation-client.mdx,instrumentation.mdx,intercepting-routes.mdx,layout.mdx,loading.mdx,mdx-components.mdx,not-found.mdx,page.mdx,parallel-routes.mdx,proxy.mdx,public-folder.mdx,route-groups.mdx,route-segment-config.mdx,route.mdx,src-folder.mdx,template.mdx,unauthorized.mdx}|01-app/03-api-reference/04-functions:{after.mdx,cacheLife.mdx,cacheTag.mdx,connection.mdx,cookies.mdx,draft-mode.mdx,fetch.mdx,forbidden.mdx,generate-image-metadata.mdx,generate-metadata.mdx,generate-sitemaps.mdx,generate-static-params.mdx,generate-viewport.mdx,headers.mdx,image-response.mdx,next-request.mdx,next-response.mdx,not-found.mdx,permanentRedirect.mdx,redirect.mdx,refresh.mdx,revalidatePath.mdx,revalidateTag.mdx,unauthorized.mdx,unstable_cache.mdx,unstable_noStore.mdx,unstable_rethrow.mdx,updateTag.mdx,use-link-status.mdx,use-params.mdx,use-pathname.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,use-selected-layout-segment.mdx,use-selected-layout-segments.mdx,userAgent.mdx}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,appDir.mdx,assetPrefix.mdx,authInterrupts.mdx,basePath.mdx,browserDebugInfoInTerminal.mdx,cacheComponents.mdx,cacheHandlers.mdx,cacheLife.mdx,compress.mdx,crossOrigin.mdx,cssChunking.mdx,devIndicators.mdx,distDir.mdx,env.mdx,expireTime.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,htmlLimitedBots.mdx,httpAgentOptions.mdx,images.mdx,incrementalCacheHandlerPath.mdx,inlineCss.mdx,isolatedDevBuild.mdx,logging.mdx,mdxRs.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactCompiler.mdx,reactMaxHeadersLength.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,sassOptions.mdx,serverActions.mdx,serverComponentsHmrCache.mdx,serverExternalPackages.mdx,staleTimes.mdx,staticGeneration.mdx,taint.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,turbopackFileSystemCache.mdx,typedRoutes.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,viewTransition.mdx,webVitalsAttribution.mdx,webpack.mdx}|01-app/03-api-reference/05-config:{02-typescript.mdx,03-eslint.mdx}|01-app/03-api-reference/06-cli:{create-next-app.mdx,next.mdx}|02-pages/01-getting-started:{01-installation.mdx,02-project-structure.mdx,04-images.mdx,05-fonts.mdx,06-css.mdx,11-deploying.mdx}|02-pages/02-guides:{analytics.mdx,authentication.mdx,babel.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,lazy-loading.mdx,mdx.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,post-css.mdx,preview-mode.mdx,production-checklist.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx}|02-pages/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|02-pages/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|02-pages/02-guides/upgrading:{codemods.mdx,version-10.mdx,version-11.mdx,version-12.mdx,version-13.mdx,version-14.mdx,version-9.mdx}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.mdx,02-dynamic-routes.mdx,03-linking-and-navigating.mdx,05-custom-app.mdx,06-custom-document.mdx,07-api-routes.mdx,08-custom-error.mdx}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.mdx,02-static-site-generation.mdx,04-automatic-static-optimization.mdx,05-client-side-rendering.mdx}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.mdx,02-get-static-paths.mdx,03-forms-and-mutations.mdx,03-get-server-side-props.mdx,05-client-side.mdx}|02-pages/03-building-your-application/06-configuring:{12-error-handling.mdx}|02-pages/04-api-reference:{06-edge.mdx,08-turbopack.mdx}|02-pages/04-api-reference/01-components:{font.mdx,form.mdx,head.mdx,image-legacy.mdx,image.mdx,link.mdx,script.mdx}|02-pages/04-api-reference/02-file-conventions:{instrumentation.mdx,proxy.mdx,public-folder.mdx,src-folder.mdx}|02-pages/04-api-reference/03-functions:{get-initial-props.mdx,get-server-side-props.mdx,get-static-paths.mdx,get-static-props.mdx,next-request.mdx,next-response.mdx,use-report-web-vitals.mdx,use-router.mdx,userAgent.mdx}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,assetPrefix.mdx,basePath.mdx,bundlePagesRouterDependencies.mdx,compress.mdx,crossOrigin.mdx,devIndicators.mdx,distDir.mdx,env.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,httpAgentOptions.mdx,images.mdx,isolatedDevBuild.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,serverExternalPackages.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,webVitalsAttribution.mdx,webpack.mdx}|02-pages/04-api-reference/04-config:{01-typescript.mdx,02-eslint.mdx}|02-pages/04-api-reference/05-cli:{create-next-app.mdx,next.mdx}|03-architecture:{accessibility.mdx,fast-refresh.mdx,nextjs-compiler.mdx,supported-browsers.mdx}|04-community:{01-contribution-guide.mdx,02-rspack.mdx}<!-- NEXT-AGENTS-MD-END -->

## Project overview

Contract Lens is a multi-tenant SaaS for AI-driven contract management (target: small German law firms). Built with Next.js 16 App Router, React 19, TypeScript, Prisma + PostgreSQL (Supabase), Tailwind v4. The package name in `package.json` is `contract-lens`; the repo is `contract-lens`.

## Commands

```bash
npm run dev          # Next dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start prod server
npm run lint         # ESLint (next/core-web-vitals + next/typescript)
npm install          # Triggers `prisma generate` via postinstall
```

Database / Prisma:
```bash
npx prisma migrate dev --name <name>    # Create + apply migration in dev
npx prisma migrate deploy               # Apply migrations in prod
npx prisma generate                     # Regenerate client
npx prisma studio                       # GUI to inspect DB
```

One-off scripts (run with `tsx`):
```bash
npx tsx scripts/create-user.ts                # Seed users from scripts/users.json
npx tsx scripts/migrate-to-multi-tenant.ts    # Idempotent: backfill orgs/memberships
```

There is **no test runner configured** — do not invent test commands.

## Architecture

### Multi-tenant model (read `prisma/schema.prisma` first)

Every tenant-scoped record is owned jointly by a `User` and an `Organization`. The chain is:

```
User ──Membership(role)──> Organization ──> Contract / Team / Invitation
                                            (organizationId is required on Contract)
```

- Roles: `owner | admin | manager | member | viewer` (`lib/permissions.ts`). Permission checks go through `hasPermission(role, permission)`; per-resource ownership rules use `canModifyOthersResource(role)` (member can only edit their own).
- New users without an org get redirected to `/setup-organization` by `proxy.ts`.
- When writing queries that touch `Contract`, `Task`, `Alert`, `Activity`, `Invitation`, **always scope by `organizationId`** from the session — never trust client-supplied org IDs.

### Auth & routing (`proxy.ts` + `lib/auth.ts`)

- Sessions are JWTs (HS256, 1-week expiry) signed with `JWT_SECRET`, stored in the `auth_session` httpOnly cookie. Use `jose`, not `jsonwebtoken`.
- `proxy.ts` is the Next.js proxy (Next 16 renamed middleware → proxy; the `next/server` imports and `config.matcher` API are unchanged). It runs on every non-asset request and:
  1. Lets through `/`, `/login`, `/register`, `/invite/*`, API routes, static assets.
  2. Redirects unauthenticated users to `/login`.
  3. Redirects authenticated users without `orgId` to `/setup-organization`.
- Server-side, prefer `getSessionWithOrg()` over `getSession()` — it returns a typed `SessionWithOrg` and rejects sessions without org context.

### Two `actions/` directories — do not confuse them

- `actions/` (repo root) — **server-only library code** for the AI pipeline. Files here are imported by API routes and server actions; they are *not* themselves Next.js Server Actions (no `'use server'` at the module level except `analyze-contract.ts`).
- `app/actions/` — **Next.js Server Actions** (all start with `'use server'`) used by forms/buttons in the dashboard: `auth.ts`, `save-contract.ts`, `delete-contract.ts`, `members.ts`, `organization.ts`, `tasks.ts`, `alerts.ts`.

### AI contract analysis pipeline

Two entry points share the same logic:
- `app/api/analyze-contract/route.ts` — streaming endpoint (NDJSON, used by the contract-creator wizard for live progress logs). `maxDuration = 120s`.
- `actions/analyze-contract.ts` — non-streaming server action (used by the admin playground).

Both follow the same three-step pipeline (`actions/contract-extraction/`):

1. **Text extraction** — `lib/text-extractor.ts` uses `pdf-parse` for PDF and `mammoth` for DOCX. 10 MB limit, hardcoded.
2. **Router (classification)** — `openai/gpt-4o-mini` via the Vercel AI SDK (`ai` package + `AI_GATEWAY_API_KEY`), classifies into one of `CONTRACT_TYPES` (`lib/constants.ts`: `NDA | ServiceAgreement | LicenseAgreement | Other`). `Other` short-circuits with an error.
3. **Expert extraction** — `deepseek/deepseek-r1` with a per-type Zod schema (`actions/contract-extraction/schemas/`) and a system prompt loaded from `actions/contract-extraction/prompts/configs/v1.json` via `loadPromptConfig`. Reasoning is captured from `reasoning-delta` stream parts or `<think>...</think>` tags, then `stripToSchema` enforces the schema shape.

When adding a new contract type, you must update **all four** spots: `CONTRACT_TYPES` in `lib/constants.ts`, a new schema in `schemas/`, the schema barrel `schemas/index.ts`, and the `getSchemaForType` switch in the analyze route + `extract-contract-data.ts`.

### Encryption at rest (`lib/encryption.ts`)

Sensitive contract fields (`summary`, `conditions`, and the file blob `fileData`) are encrypted with AES-256-GCM before being written to Postgres. `ENCRYPTION_KEY` must be a 32-byte hex string (64 chars).

- String format: `${ivHex}:${authTagHex}:${encryptedHex}` — `decrypt` returns the input unchanged if the format doesn't match (legacy/plaintext rows).
- Buffer format: `IV(12) || AuthTag(16) || ciphertext` (single `Buffer`).
- When reading: any field that was encrypted on write must be passed through `decrypt`/`decryptBuffer` before returning to the client. New encrypted fields require updating both the write path (`app/actions/save-contract.ts`) and every read path.

### Path alias

`@/*` resolves to repo root (see `tsconfig.json`). Use it in all imports — e.g. `@/lib/prisma`, `@/components/shell/Sidebar`.

### Prisma client

Always import the shared singleton `import { prisma } from '@/lib/prisma'` — it caches on `globalThis` in dev to survive HMR. Do not instantiate `new PrismaClient()` outside `lib/prisma.ts` and one-off scripts.

## Environment variables

Required at runtime — server boot fails fast if missing:
- `JWT_SECRET` — session signing key
- `ENCRYPTION_KEY` — 32-byte hex (64 chars) for AES-256-GCM
- `POSTGRES_PRISMA_URL` (pooled) and `POSTGRES_URL_NON_POOLING` (direct, used for migrations)
- `AI_GATEWAY_API_KEY` — Vercel AI Gateway, used by the `ai` SDK for both router and expert models
- `RESEND_API_KEY` — transactional email (invitations) via `lib/email.ts`

## Conventions

- Server-side files that perform mutations live in `app/actions/*.ts` and start with `'use server'`. They typically: validate session via `getSessionWithOrg`, check permissions, mutate via `prisma`, then `revalidatePath`.
- The dashboard lives under the `app/(dashboard)/` route group with a shared `layout.tsx`. Public routes (`/`, `/login`, `/register`, `/invite/*`, `/setup-organization`) are siblings.
- Landing-page components under `components/landing/` use `LanguageContext` for DE/EN i18n; the dashboard is currently EN-only.
- The contract editor (`app/(dashboard)/contract-creator/wizard/`) is a 4-step wizard; centralized state lives in `hooks/use-contract-form.ts` — prefer extending that hook over adding parallel state.
