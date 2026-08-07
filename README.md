# Contract Lens

A multi-tenant SaaS platform for AI-driven contract management, built for small law firms. Contracts are uploaded as PDF or DOCX, parsed, and run through an LLM extraction pipeline that pulls out structured data — parties, dates, clauses, termination and renewal terms — which then drives a task and alert system so deadlines don't get missed.

[![Live Demo](https://img.shields.io/badge/%E2%96%B6_LIVE_DEMO-paragraph--plus.vercel.app-2EA043?style=for-the-badge)](https://paragraph-plus.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white)
![AI SDK](https://img.shields.io/badge/AI%20SDK-v6-000000?logo=vercel&logoColor=white)
![Multi-tenant](https://img.shields.io/badge/multi--tenant-5%20roles-0EA5E9)
![Encryption](https://img.shields.io/badge/encryption-AES--256--GCM-4B5563)
![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20DE-8B5CF6)

The product thesis: an AI that *extracts* rather than *chats*. No prompting required from the user — upload a contract, get structured fields and a deadline pipeline.

## Features

**Contract intelligence**
- PDF and DOCX ingestion with text extraction
- LLM extraction into a typed schema, with versioned prompt configurations (`actions/contract-extraction/prompts/configs/`) so extraction changes are traceable
- Streaming analysis endpoint for interactive review

**Multi-tenancy**
- Organizations with teams, memberships and role-based access (owner / admin / manager / member / viewer)
- Token-based email invitations with expiry
- Every query scoped to the caller's organization

**Operations**
- Task management tied to individual contracts
- Alert pipeline with responses and an event log
- Activity feed per organization

**Internationalisation** — full English and German localisation across the landing site and app shell.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Prisma |
| AI | Vercel AI SDK through AI Gateway |
| Auth | JWT sessions (`jose`) + bcrypt password hashing |
| Email | Resend |
| Editor | Tiptap |

**Model routing.** Requests are routed across two models by task shape: `openai/gpt-4o-mini` handles cheap classification and routing decisions, `deepseek/deepseek-r1` handles reasoning-heavy extraction. Routing through AI Gateway means the model choice is a string, so swapping providers doesn't touch application code.

## Data model

```
Organization ─┬─ Membership ── User
              ├─ Team ── TeamMember
              ├─ Invitation
              ├─ Contract ─┬─ Task
              │            └─ Alert ─┬─ AlertResponse
              │                      └─ AlertEvent
              └─ Activity
```

## Getting started

```bash
npm install                  # runs prisma generate via postinstall
cp .env.example .env.local    # then fill in the values below
npx prisma migrate dev
npm run dev
```

Required environment variables:

| Variable | Purpose |
|----------|---------|
| `POSTGRES_PRISMA_URL` | Pooled PostgreSQL connection string |
| `POSTGRES_URL_NON_POOLING` | Direct connection, used for migrations |
| `JWT_SECRET` | Signing key for session tokens |
| `ENCRYPTION_KEY` | Encryption of stored sensitive fields |
| `RESEND_API_KEY` | Transactional email (invitations, alerts) |
| `NEXT_PUBLIC_APP_URL` | Base URL used in invitation links |

Model calls go through Vercel AI Gateway, which authenticates via OIDC on Vercel or `AI_GATEWAY_API_KEY` locally.

Seed data for local development lives in `scripts/users.json` — placeholder accounts, teams and tasks for exercising the multi-tenant flows.

## Project structure

```
app/
  (dashboard)/       Authenticated app — contracts, tasks, alerts
  actions/           Server actions (auth, contracts, tasks, alerts, org)
  api/               Contract analysis and file-serving routes
actions/
  contract-extraction/   Extraction pipeline + versioned prompt configs
components/
  landing/           Marketing site with en/de translations
  shell/             App chrome — sidebar, navigation
prisma/              Schema and migrations
```
