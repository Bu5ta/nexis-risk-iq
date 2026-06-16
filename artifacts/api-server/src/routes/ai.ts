import { Router } from "express";
import OpenAI from "openai";
import {
  mutableControls,
  computeKpis,
  getImplementationTrend,
  departments,
  tenants,
} from "../data/mockData.js";

const router = Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function buildTenantContext(tenantId: string): string {
  const tenant = tenants.find((t) => t.id === tenantId);
  const kpis = computeKpis(tenantId);
  const controls = Array.from(mutableControls.values()).filter(
    (c) => c.tenantId === tenantId
  );
  const depts = departments.filter((d) => d.tenantId === tenantId);
  const trend = getImplementationTrend(tenantId);

  const highRisk = controls.filter((c) => c.overallRiskLevel === "High");
  const overdue = controls.filter((c) => c.implementationStatus === "Overdue");
  const breaches = controls.filter((c) => !c.withinAppetite);
  const escalated = controls.filter((c) => c.isEscalated);

  return `
You are RiskSight AI, an expert GRC intelligence assistant embedded in NEXIS Risk-IQ for ${tenant?.name} (${tenant?.sector} sector).

CURRENT KPIs:
- Compliance Rate: ${kpis.complianceRate}%  |  Target: 90%
- Total Controls: ${kpis.totalControls}  |  Implemented: ${kpis.implementedControls}
- Overdue: ${kpis.overdueActions}  |  Appetite Breaches: ${kpis.appetiteBreaches}
- Escalated: ${kpis.escalatedItems}  |  High Risk Items: ${kpis.highRiskItems}

HIGH RISK CONTROLS (${highRisk.length} total):
${highRisk
  .slice(0, 6)
  .map(
    (c) =>
      `- ${c.control} | Dept: ${c.department} | Residual: ${c.residualRiskScore} | Status: ${c.implementationStatus}`
  )
  .join("\n")}

OVERDUE CONTROLS (${overdue.length} total):
${overdue
  .slice(0, 5)
  .map((c) => `- ${c.control} | Dept: ${c.department} | Owner: ${c.controlOwner}`)
  .join("\n")}

APPETITE BREACHES (${breaches.length} total):
${breaches
  .slice(0, 5)
  .map((c) => `- ${c.control} | Residual Score: ${c.residualRiskScore} | Dept: ${c.department}`)
  .join("\n")}

ESCALATED ITEMS: ${escalated.map((c) => c.control).join(", ") || "None"}

DEPARTMENT HEALTH:
${depts
  .map(
    (d) =>
      `- ${d.name}: ${d.complianceRate}% compliant | ${d.highRiskCount} high-risk | ${d.overdueCount} overdue | ${d.status}`
  )
  .join("\n")}

TREND (last 6 months):
${trend
  .slice(-6)
  .map((t) => `- ${t.month}: ${t.implemented} done, ${t.inProgress} in progress, ${t.overdue} overdue`)
  .join("\n")}

Answer concisely in professional board-level English. Be specific and actionable — no generic statements.
`.trim();
}

router.get("/ai/analytics/:tenantId", (req, res) => {
  const { tenantId } = req.params;

  const controls = Array.from(mutableControls.values()).filter(
    (c) => c.tenantId === tenantId
  );
  const trend = getImplementationTrend(tenantId);
  const depts = departments.filter((d) => d.tenantId === tenantId);
  const kpis = computeKpis(tenantId);

  const last3 = trend.slice(-3);
  const overdueVelocity =
    last3.length >= 2
      ? last3[last3.length - 1].overdue - last3[0].overdue
      : 0;
  const implementedVelocity =
    last3.length >= 2
      ? last3[last3.length - 1].implemented - last3[0].implemented
      : 0;

  const scores = controls.map((c) => c.residualRiskScore);
  const mean = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
  const stdDev = Math.sqrt(
    scores.map((s) => (s - mean) ** 2).reduce((a, b) => a + b, 0) /
      (scores.length || 1)
  );
  const anomalies = controls
    .filter((c) => c.residualRiskScore > mean + stdDev)
    .sort((a, b) => b.residualRiskScore - a.residualRiskScore)
    .slice(0, 6)
    .map((c) => ({
      id: c.id,
      control: c.control,
      department: c.department,
      residualScore: c.residualRiskScore,
      zScore: parseFloat(((c.residualRiskScore - mean) / stdDev).toFixed(2)),
      status: c.implementationStatus,
      riskLevel: c.overallRiskLevel,
    }));

  const trendData = trend.slice(-6);
  const n = trendData.length;
  const xMean = (n - 1) / 2;
  const yValues = trendData.map((t) => {
    const total = t.implemented + t.inProgress + t.overdue;
    return total > 0 ? Math.round((t.implemented / total) * 100) : 0;
  });
  const yMean = yValues.reduce((a, b) => a + b, 0) / (n || 1);
  const slopeNum = trendData.reduce(
    (sum, _, i) => sum + (i - xMean) * (yValues[i] - yMean),
    0
  );
  const slopeDen = trendData.reduce((sum, _, i) => sum + (i - xMean) ** 2, 0);
  const slope = slopeDen !== 0 ? slopeNum / slopeDen : 0;

  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];
  const lastMonthIdx = new Date().getMonth();
  const forecast = [1, 2, 3].map((offset) => ({
    month: monthNames[(lastMonthIdx + offset) % 12],
    projected: Math.min(
      100,
      Math.max(0, Math.round(yMean + slope * (n - 1 + offset)))
    ),
    confidence: Math.max(60, 92 - offset * 10),
  }));

  const totalResidual = controls.reduce((sum, c) => sum + c.residualRiskScore, 0);
  const deptConcentration = depts
    .map((d) => {
      const dc = controls.filter((c) => c.department === d.name);
      const dr = dc.reduce((sum, c) => sum + c.residualRiskScore, 0);
      return {
        department: d.name,
        share: totalResidual > 0 ? parseFloat(((dr / totalResidual) * 100).toFixed(1)) : 0,
        residualTotal: dr,
        highRiskCount: d.highRiskCount,
        status: d.status,
      };
    })
    .sort((a, b) => b.share - a.share)
    .slice(0, 6);

  const totalInherent = controls.reduce((sum, c) => sum + c.inherentRiskScore, 0);
  const reductionEfficiency =
    totalInherent > 0
      ? parseFloat((((totalInherent - totalResidual) / totalInherent) * 100).toFixed(1))
      : 0;

  const criticalPath = controls
    .filter(
      (c) =>
        c.implementationStatus === "Overdue" &&
        c.overallRiskLevel === "High" &&
        !c.withinAppetite
    )
    .map((c) => ({
      id: c.id,
      control: c.control,
      department: c.department,
      owner: c.controlOwner,
      residualScore: c.residualRiskScore,
    }));

  const complianceScore = kpis.complianceRate * 0.4;
  const appetiteScore =
    (1 - kpis.appetiteBreaches / Math.max(1, kpis.totalControls)) * 100 * 0.3;
  const reductionScore = reductionEfficiency * 0.3;
  const mlScore = Math.round(complianceScore + appetiteScore + reductionScore);

  res.json({
    riskVelocity: {
      overdueChange: overdueVelocity,
      implementedChange: implementedVelocity,
      trend:
        overdueVelocity > 0
          ? "deteriorating"
          : overdueVelocity < 0
          ? "improving"
          : "stable",
    },
    anomalies,
    meanRiskScore: parseFloat(mean.toFixed(2)),
    stdDevRiskScore: parseFloat(stdDev.toFixed(2)),
    forecast,
    deptConcentration,
    reductionEfficiency,
    criticalPath,
    mlScore,
    trendHistory: trendData.map((t, i) => ({
      month: t.month,
      complianceRate: yValues[i],
      implemented: t.implemented,
      overdue: t.overdue,
    })),
  });
});

router.get("/ai/briefing/:tenantId", async (req, res) => {
  const { tenantId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const context = buildTenantContext(tenantId);
    const tenant = tenants.find((t) => t.id === tenantId);

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 600,
      messages: [
        { role: "system", content: context },
        {
          role: "user",
          content: `Generate a concise executive risk intelligence briefing for ${tenant?.name}. Structure it with these exact headings:

**Risk Posture** — 2-3 sentences on overall health.
**Priority Actions** — exactly 3 numbered items with urgency (🔴 Critical / 🟡 High / 🟢 Medium).
**Key Trend** — 1-2 sentences on the most important directional movement.

Be specific, board-level, and actionable.`,
        },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: unknown) {
    req.log.error({ err }, "AI briefing error");
    const message =
      err instanceof Error ? err.message : "Failed to generate briefing";
    const isQuota =
      message.includes("insufficient_quota") || message.includes("exceeded your current quota");
    res.write(
      `data: ${JSON.stringify({
        error: isQuota
          ? "OpenAI quota exceeded — please add credits to your OpenAI account at platform.openai.com/account/billing."
          : message,
      })}\n\n`
    );
    res.end();
  }
});

router.post("/ai/chat", async (req, res) => {
  const { tenantId, messages } = req.body as {
    tenantId: string;
    messages: Array<{ role: "user" | "assistant"; content: string }>;
  };

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const context = buildTenantContext(tenantId);

    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: context },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 500,
      messages: chatMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: unknown) {
    req.log.error({ err }, "AI chat error");
    const message =
      err instanceof Error ? err.message : "Failed to generate response";
    const isQuota =
      message.includes("insufficient_quota") || message.includes("exceeded your current quota");
    res.write(
      `data: ${JSON.stringify({
        error: isQuota
          ? "OpenAI quota exceeded — please add credits at platform.openai.com/account/billing."
          : message,
      })}\n\n`
    );
    res.end();
  }
});

export default router;
