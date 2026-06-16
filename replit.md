# NEXIS Risk-IQ

A production-grade multi-tenant SaaS executive dashboard for governance, risk, and compliance (GRC) management. Three demo tenants: National Revenue Authority (Government), Meridian Power & Utilities (Parastatal), Apex Financial Services Group (Private).

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/nexis run dev` — run the React frontend (port 18139, proxied at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- **Frontend:** React + Vite, Tailwind CSS, shadcn/ui, Recharts, Wouter routing, TanStack Query, next-themes, Sonner toasts, Framer Motion
- **Backend:** Express 5, in-memory mock data (no DB — pure demo)
- **API contract:** OpenAPI spec → Orval codegen (React Query hooks + Zod schemas)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI source of truth
- `lib/api-client-react/src/generated/` — generated React Query hooks and schemas
- `artifacts/api-server/src/data/mockData.ts` — all in-memory mock data (3 tenants, 30 departments, 20+ controls, audit log, reports, users)
- `artifacts/api-server/src/routes/` — Express route handlers (tenants, controls, audit, health)
- `artifacts/nexis/src/pages/` — all frontend pages (login, dashboard, register, departments, reports, audit, admin)
- `artifacts/nexis/src/components/layout.tsx` — sidebar + header shell with tenant switcher and dark mode
- `artifacts/nexis/src/lib/tenant-context.tsx` — TenantProvider (localStorage-backed auth state)

## Architecture decisions

- **No database** — all data is in-memory mock data in `mockData.ts`. No `DATABASE_URL` needed.
- **Contract-first API** — OpenAPI spec drives codegen; frontend never calls fetch directly, always uses generated hooks.
- **Multi-tenant via context** — tenant selection stored in localStorage; all API calls pass `tenantId` as a path or query param.
- **QueryKey discipline** — all `useXxx()` hook calls must pass `queryKey: getXxxQueryKey(...)` explicitly in the query options (Orval v7 requirement).
- **Dark mode default** — `ThemeProvider defaultTheme="dark"` with `storageKey="nexis-theme"`.

## Product

Three-tenant GRC dashboard with:
- **Login** — tenant and role picker (Super Admin / Risk Manager / Executive Viewer)
- **Executive Dashboard** — KPI cards, risk-by-department bar chart, implementation trend line, risk level pie chart, recent activity feed
- **Risk & Control Register** — searchable/filterable table of all controls; click-through drawer with details, timeline, notes, and action buttons (escalate, mark complete)
- **Departments** — grid of department cards with compliance rate progress bars; detail page with accountability breakdown
- **Reports** — pre-configured board packs; generate modal with formatted report preview
- **Audit Trail** — filterable immutable log of all actions
- **Admin** — user management table, tenant settings, notification preferences

## User preferences

- **Target market: Botswana public & private sector organisations** — clients primarily use manual, spreadsheet-based processes. API integrations are uncommon and should never be assumed. Every feature must work fully without any API connection.
- **Dual-mode data ingestion is non-negotiable:** the system must support (1) manual data entry via forms and (2) spreadsheet import (CSV/Excel upload) as the primary on-ramp. API connectors are a secondary, future-ready layer — expose the endpoints but don't require them.
- When building data entry or import features, always design for the non-technical civil servant or compliance officer first, then layer in the technical path.

## Gotchas

- Do NOT run `pnpm dev` at workspace root — use `restart_workflow` or individual filter commands.
- After any route change in `api-server`, restart the API Server workflow so esbuild picks up the changes.
- `getGetControlQueryKey` must be explicitly imported (not inferred) in `register.tsx` — TypeScript won't find it via re-export without explicit import.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
