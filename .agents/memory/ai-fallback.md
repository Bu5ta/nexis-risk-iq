---
name: RiskSight AI fallback pattern
description: AI routes fall back to computed mock responses; never show OpenAI errors to demo users.
---

## The rule
`artifacts/api-server/src/routes/ai.ts` briefing and chat routes catch ALL errors and fall back to `buildMockBriefing()` / `buildMockChatResponse()` + `streamText()` instead of surfacing errors via SSE.

**Why:** OpenAI quota can be exhausted; showing quota errors during a demo is unacceptable. The computed responses are data-accurate (derived from live KPIs, controls, depts) and present as professional board-level briefings.

**How to apply:** Never add `res.write(error)` fallbacks to AI SSE routes. Always call `streamText(res, buildMock*(tenantId))` in the catch block.

## Mock AI logic
- `buildMockBriefing(tenantId)` — markdown briefing with Risk Posture, Priority Actions, Key Trend. Uses computeKpis + departments.
- `buildMockChatResponse(tenantId, lastUserMsg)` — keyword-matched (overdue/high-risk/appetite/dept/compliance/escalated/recommend) with data-accurate answers.
- `streamText(res, text)` — chunks by 3 words every 28ms; cleans up interval on close.
- Identical logic is also in `mock-router.ts` for pure mock mode (no DB).
