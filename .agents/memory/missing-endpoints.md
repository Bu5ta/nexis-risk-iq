---
name: Missing API endpoints (mock + DB router)
description: 10 endpoints discovered missing during full module audit; all fixed.
---

## The rule
Any endpoint defined in `openapi.yaml` must exist in BOTH `mock-router.ts` AND the DB-backed route files. When adding a new OpenAPI operation, add it to both layers.

**Why:** The mock router is the fallback when DB is unreachable (Vercel cold start, no DATABASE_URL). Missing endpoints silently fail with 404s in demo mode.

**How to apply:** After adding a route to `routes/controls.ts` or `routes/tenants.ts`, immediately mirror it in `mock-router.ts`.

## Gaps found and fixed (commit 2308553)
Mock router was missing:
1. `GET /healthz` (hook called /healthz, mock only had /health)
2. `DELETE /controls/:controlId`
3. `POST /controls/:controlId/actions`
4. `POST /tenants/:tenantId/controls/import` (tenanted path; mock had bare /controls/import)
5. `GET /tenants/:tenantId/reports/:reportId` (useGetReport; only /content existed)
6. `GET /tenants/:tenantId/activity`
7. `GET /ai/analytics/:tenantId`
8. `GET /ai/briefing/:tenantId` (SSE)
9. `POST /ai/chat` (SSE)

DB router (controls.ts) was missing:
10. `POST /controls/:controlId/actions` (PATCH existed with same logic, POST is what the hook calls)
