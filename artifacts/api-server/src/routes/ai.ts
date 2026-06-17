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

// ── Computed fallbacks (no OpenAI needed) ────────────────────────────────────

function buildMockBriefing(tenantId: string): string {
  const tenant = tenants.find((t) => t.id === tenantId);
  const kpis = computeKpis(tenantId);
  const depts = departments.filter((d) => d.tenantId === tenantId).sort((a, b) => a.complianceRate - b.complianceRate);
  const controls = Array.from(mutableControls.values()).filter((c) => c.tenantId === tenantId);
  const overdue = controls.filter((c) => c.implementationStatus === "Overdue");
  const breaches = controls.filter((c) => !c.withinAppetite);
  const worstDept = depts[0];
  const posture = kpis.complianceRate >= 85 ? "strong" : kpis.complianceRate >= 70 ? "moderate" : "concerning";
  const trendWord = kpis.overdueActions > 5 ? "deteriorating" : kpis.overdueActions > 2 ? "stable" : "improving";
  return `**Risk Posture**\n${tenant?.name} presents a **${posture}** overall risk posture with a compliance rate of **${kpis.complianceRate}%** against a 90% target. ${kpis.implementedControls} of ${kpis.totalControls} controls are fully implemented. The portfolio trend is **${trendWord}**, with ${kpis.appetiteBreaches} appetite breach${kpis.appetiteBreaches !== 1 ? "es" : ""} requiring board attention.\n\n**Priority Actions**\n1. 🔴 Critical — Resolve ${overdue.length} overdue control${overdue.length !== 1 ? "s" : ""}${overdue.length > 0 ? `, including: *${overdue.slice(0, 2).map((c) => c.control).join("; ")}*` : ""}. Immediate action required to prevent regulatory exposure.\n2. 🟡 High — Address ${breaches.length} risk appetite breach${breaches.length !== 1 ? "es" : ""}. ${breaches.length > 0 ? `Highest residual risk: ${breaches.sort((a, b) => b.residualRiskScore - a.residualRiskScore)[0]?.control}.` : "Portfolio is within appetite bounds."}\n3. 🟢 Medium — ${worstDept ? `${worstDept.name} department requires targeted intervention (${worstDept.complianceRate}% compliant, ${worstDept.overdueCount} overdue items).` : "Continue monitoring department-level compliance metrics."}\n\n**Key Trend**\nImplementation velocity ${trendWord === "improving" ? "is on an upward trajectory — momentum should be sustained through Q3 with focused resource allocation." : trendWord === "stable" ? `remains flat — a targeted remediation sprint is recommended to accelerate the ${kpis.totalControls - kpis.implementedControls} remaining controls.` : "shows signs of pressure — escalated items require board-level intervention and clear ownership assignment this quarter."}`;
}

function buildMockChatResponse(tenantId: string, lastUserMsg: string): string {
  const kpis = computeKpis(tenantId);
  const controls = Array.from(mutableControls.values()).filter((c) => c.tenantId === tenantId);
  const depts = departments.filter((d) => d.tenantId === tenantId);
  const q = lastUserMsg.toLowerCase();
  if (q.includes("overdue")) {
    const overdue = controls.filter((c) => c.implementationStatus === "Overdue");
    return `There are currently **${overdue.length} overdue controls** across your portfolio.\n\nTop items requiring immediate attention:\n${overdue.slice(0, 5).map((c, i) => `${i + 1}. **${c.control}** — ${c.department} | Owner: ${c.controlOwner} | Residual Score: ${c.residualRiskScore}`).join("\n")}\n\nI recommend scheduling a remediation sprint with the respective department heads this week.`;
  }
  if (q.includes("high risk") || q.includes("high-risk")) {
    const high = controls.filter((c) => c.overallRiskLevel === "High");
    return `Your portfolio contains **${high.length} high-risk controls** (${Math.round((high.length / Math.max(1, kpis.totalControls)) * 100)}% of total).\n\nTop by residual risk score:\n${high.sort((a, b) => b.residualRiskScore - a.residualRiskScore).slice(0, 5).map((c, i) => `${i + 1}. **${c.control}** — Score: ${c.residualRiskScore} | ${c.implementationStatus}`).join("\n")}\n\nFocusing on these controls will yield the greatest reduction in overall risk exposure.`;
  }
  if (q.includes("appetite") || q.includes("breach")) {
    const breaches = controls.filter((c) => !c.withinAppetite);
    return `There are **${breaches.length} appetite breaches** in your current portfolio.\n\n${breaches.slice(0, 4).map((c, i) => `${i + 1}. **${c.control}** — ${c.department} | Score: ${c.residualRiskScore}`).join("\n")}\n\nThese must be reported to the Risk Committee and remediation plans escalated within 30 days per policy.`;
  }
  if (q.includes("department") || q.includes("dept")) {
    return `**Department Risk Summary:**\n\n${depts.slice(0, 6).map((d) => `• **${d.name}**: ${d.complianceRate}% compliant | ${d.highRiskCount} high-risk | ${d.overdueCount} overdue | Status: **${d.status}**`).join("\n")}\n\n${depts.filter((d) => d.status === "Critical").length > 0 ? `⚠️ ${depts.filter((d) => d.status === "Critical").length} department(s) are in Critical status and require immediate intervention.` : "All departments are within acceptable performance bands."}`;
  }
  if (q.includes("compliance") || q.includes("rate")) {
    return `Current **compliance rate is ${kpis.complianceRate}%** against a 90% target.\n\n**Breakdown:**\n• Implemented: ${kpis.implementedControls} controls\n• In Progress: ${controls.filter((c) => c.implementationStatus === "In Progress").length}\n• Overdue: ${kpis.overdueActions}\n• Draft: ${controls.filter((c) => c.implementationStatus === "Draft").length}\n\n${kpis.complianceRate >= 90 ? "✅ You are meeting the target. Maintain momentum." : kpis.complianceRate >= 75 ? "🟡 Tracking below target — focus on in-progress items to close the gap." : "🔴 Significant gap to target. An urgent remediation programme is recommended."}`;
  }
  if (q.includes("escalat")) {
    const escalated = controls.filter((c) => c.isEscalated);
    return `There are **${escalated.length} escalated control${escalated.length !== 1 ? "s" : ""}** currently requiring senior management attention:\n\n${escalated.slice(0, 5).map((c, i) => `${i + 1}. **${c.control}** — ${c.department} | Owner: ${c.controlOwner}`).join("\n") || "No controls are currently escalated."}\n\nEscalated items should be reviewed at the next Risk Committee meeting.`;
  }
  if (q.includes("recommend") || q.includes("priorit")) {
    return `Based on your current risk posture, here are my top recommendations:\n\n1. **Resolve overdue controls** (${kpis.overdueActions} items) — assign clear owners and set 2-week resolution deadlines.\n2. **Address appetite breaches** (${kpis.appetiteBreaches} items) — prepare a breach remediation report for the board.\n3. **Focus on ${depts.sort((a, b) => a.complianceRate - b.complianceRate)[0]?.name || "lowest-performing departments"}** — targeted resource allocation will have the highest impact.\n4. **Review escalated items** — ensure executive sponsors are assigned and action plans are in place.\n5. **Update draft controls** (${controls.filter((c) => c.implementationStatus === "Draft").length} items) — move to active implementation to improve the compliance rate.`;
  }
  return `Your current risk intelligence summary:\n\n**Compliance Rate:** ${kpis.complianceRate}% (target: 90%)\n**Total Controls:** ${kpis.totalControls} | Implemented: ${kpis.implementedControls}\n**Overdue:** ${kpis.overdueActions} | Appetite Breaches: ${kpis.appetiteBreaches}\n**Escalated Items:** ${kpis.escalatedItems} | High Risk: ${kpis.highRiskItems}\n\nAsk me about specific areas — overdue controls, high-risk items, appetite breaches, department performance, or recommendations — and I'll provide targeted analysis.`;
}

function streamText(res: import("express").Response, text: string): void {
  const words = text.split(/(\s+)/);
  let i = 0;
  const interval = setInterval(() => {
    if (i >= words.length) {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      clearInterval(interval);
      return;
    }
    res.write(`data: ${JSON.stringify({ content: words.slice(i, i + 3).join("") })}\n\n`);
    i += 3;
  }, 28);
  res.on("close", () => clearInterval(interval));
}

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
    req.log.warn({ err }, "AI briefing error — falling back to computed mock briefing");
    streamText(res, buildMockBriefing(tenantId));
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
    req.log.warn({ err }, "AI chat error — falling back to computed mock response");
    const lastUserMsg = messages.at(-1)?.content || "";
    streamText(res, buildMockChatResponse(tenantId, lastUserMsg));
  }
});

export default router;
