import { Router } from "express";
import { db } from "@workspace/db";
import {
  tenants,
  departments,
  controls,
  users,
  reports,
  activityFeed,
  auditLog,
} from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";

const router = Router();

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

async function computeKpisFromDb(tenantId: string) {
  const [row] = await db
    .select({
      total:       sql<number>`count(*)::int`,
      implemented: sql<number>`count(*) filter (where implementation_status = 'Implemented')::int`,
      inProgress:  sql<number>`count(*) filter (where implementation_status = 'In Progress')::int`,
      overdue:     sql<number>`count(*) filter (where implementation_status = 'Overdue')::int`,
      high:        sql<number>`count(*) filter (where overall_risk_level = 'High')::int`,
      breaches:    sql<number>`count(*) filter (where within_appetite = false)::int`,
      awaiting:    sql<number>`count(*) filter (where implementation_status = 'Awaiting Review')::int`,
      escalated:   sql<number>`count(*) filter (where is_escalated = true)::int`,
    })
    .from(controls)
    .where(eq(controls.tenantId, tenantId));

  const total = row?.total ?? 0;
  const implemented = row?.implemented ?? 0;

  return {
    totalRisks:          total,
    totalControls:       total,
    controlsInProgress:  row?.inProgress ?? 0,
    overdueActions:      row?.overdue ?? 0,
    highRiskItems:       row?.high ?? 0,
    complianceRate:      total > 0 ? Math.round((implemented / total) * 100) : 0,
    appetiteBreaches:    row?.breaches ?? 0,
    implementedControls: implemented,
    awaitingReview:      row?.awaiting ?? 0,
    escalatedItems:      row?.escalated ?? 0,
  };
}

type Kpis = Awaited<ReturnType<typeof computeKpisFromDb>>;

function getImplementationTrend(tenantId: string) {
  const months = [
    "Jul '24","Aug '24","Sep '24","Oct '24","Nov '24","Dec '24",
    "Jan '25","Feb '25","Mar '25","Apr '25","May '25","Jun '25",
  ];
  const base: Record<string, number[][]> = {
    "ten-gov":  [[3,5,4],[4,5,4],[4,4,4],[5,4,3],[6,4,3],[6,5,3],[7,4,2],[7,5,2],[8,4,2],[8,5,2],[9,4,2],[10,4,2]],
    "ten-para": [[4,7,6],[5,7,5],[5,6,5],[6,6,5],[7,6,4],[7,7,4],[8,6,4],[8,7,3],[9,6,3],[9,7,3],[10,6,3],[11,6,3]],
    "ten-priv": [[5,8,5],[6,8,5],[6,8,4],[7,7,4],[8,7,4],[8,8,3],[9,7,3],[9,8,3],[10,7,3],[10,8,2],[11,7,2],[11,8,2]],
  };
  const data = base[tenantId] ?? base["ten-gov"];
  return months.map((month, i) => ({
    month,
    implemented: data[i][0],
    inProgress:  data[i][1],
    overdue:     data[i][2],
  }));
}

function getInsights(kpis: Kpis, tenantId: string): string[] {
  const t: Record<string, string[]> = {
    "ten-gov": [
      `${kpis.appetiteBreaches} controls are operating above the approved risk appetite threshold — immediate remediation plans should be presented to the Risk Committee.`,
      `Finance & Procurement continues to represent the highest concentration of critical risk exposure, with ${kpis.overdueActions} overdue controls. The Board is advised to commission an independent review of procurement governance.`,
      `Digital Transformation cybersecurity controls are progressing but remain incomplete — MFA deployment pending PAM solution CapEx approval. Recommend expediting the investment case.`,
      `Overall compliance rate of ${kpis.complianceRate}% reflects meaningful progress but remains below the 90% target. A trajectory of 3–4% quarterly improvement is achievable with current resourcing.`,
    ],
    "ten-para": [
      `Generation & Operations presents the most critical risk profile — Unit 3 maintenance failure constitutes a major risk event requiring Board-level attention and written assurance from the CEO.`,
      `HSE compliance is materially below ISO 45001 standard requirements. The Board should consider commissioning an external safety audit given the severity of non-conformances.`,
      `SCADA cybersecurity controls are progressing but OT/IT network segmentation remains incomplete, leaving critical infrastructure exposed to potential cyberattack vectors.`,
      `Government subsidy arrears represent a systemic liquidity risk. Escalate to shareholder level if ministerial engagement does not produce a payment commitment within 30 days.`,
    ],
    "ten-priv": [
      `AML/CFT controls strengthened following TMS upgrade, but appetite breaches in Compliance & Regulatory remain concerning given the Central Bank's stated intention to intensify supervision.`,
      `Critical API vulnerabilities identified in the penetration test represent unacceptable cyber risk. The Board should require weekly remediation updates until all critical findings are closed.`,
      `Capital adequacy provides adequate headroom above the regulatory minimum, but stress-test the ratio against a 40% NPL increase in the current credit environment.`,
      `Compliance rate of ${kpis.complianceRate}% is tracking ahead of Q2 target but momentum is concentrated in lower-risk divisions. High-risk areas require dedicated executive attention.`,
    ],
  };
  return t[tenantId] ?? t["ten-gov"];
}

function buildReportContent(
  report: { type: string; period: string },
  tenantName: string,
  kpis: Kpis,
  deptCount: number
) {
  type Section = { title: string; content: string };
  type Body = { sections: Section[]; summary: string; recommendations: string[] };

  const content: Record<string, Body> = {
    monthly_risk_summary: {
      summary: `The ${tenantName} risk register for ${report.period} reflects a compliance rate of ${kpis.complianceRate}%, with ${kpis.overdueActions} controls overdue and ${kpis.appetiteBreaches} operating above the approved risk appetite. ${kpis.escalatedItems} items have been formally escalated.`,
      sections: [
        { title: "Executive Summary", content: `As of ${report.period}, the organisation's risk profile reflects ${kpis.totalRisks} registered risks across ${deptCount} departments. Compliance rate: ${kpis.complianceRate}% (target 90%). ${kpis.highRiskItems} High-rated risks, ${kpis.overdueActions} overdue controls, ${kpis.appetiteBreaches} outside appetite.` },
        { title: "Key Risk Movements", content: `${kpis.escalatedItems} controls escalated due to persistent implementation failures. Escalated controls relate primarily to procurement integrity, cybersecurity, and operational safety — representing the highest residual risk exposure in the current portfolio.` },
        { title: "Controls Implementation Status", content: `Of ${kpis.totalControls} registered controls: ${kpis.implementedControls} Implemented (${kpis.complianceRate}%), ${kpis.controlsInProgress} In Progress, ${kpis.overdueActions} Overdue, ${kpis.awaitingReview} Awaiting Review.` },
        { title: "Appetite Breach Analysis", content: `${kpis.appetiteBreaches} controls are operating above the Board-approved risk appetite threshold. Each breach has a documented remediation plan and assigned accountable officer.` },
      ],
      recommendations: [
        `Commission a root cause analysis for all controls overdue by more than 90 days, with findings presented to the Risk Committee within 21 days.`,
        `Increase the frequency of progress reporting for escalated controls from monthly to fortnightly, with direct CEO accountability for closure timelines.`,
        `Revisit the risk appetite thresholds for cybersecurity and procurement risks in light of the current threat environment and internal control weaknesses.`,
        `Consider engaging an independent external reviewer to assess the adequacy of remediation plans for the top five appetite breach items.`,
      ],
    },
    appetite_breach: {
      summary: `${kpis.appetiteBreaches} controls are currently operating above the ${tenantName} risk appetite threshold, representing persistent control implementation failures requiring Board-level attention.`,
      sections: [
        { title: "Appetite Breach Overview", content: `As of ${report.period}, ${kpis.appetiteBreaches} of ${kpis.totalControls} controls (${kpis.totalControls > 0 ? Math.round((kpis.appetiteBreaches / kpis.totalControls) * 100) : 0}%) are operating above appetite.` },
        { title: "Breach Detail by Department", content: `Finance & Procurement accounts for the highest number of appetite breaches, followed by Digital Transformation and Ethics & Standards Compliance.` },
        { title: "Escalated Breaches", content: `Of the ${kpis.appetiteBreaches} appetite breaches, ${kpis.escalatedItems} have been formally escalated due to repeated missed implementation deadlines.` },
        { title: "Remediation Timeline", content: `Management has committed to reducing total appetite breaches by 40% within the next quarter through accelerated control implementation and revised plans.` },
      ],
      recommendations: [
        `The Board should formally ratify management's proposed risk acceptance for items where implementation timelines exceed 6 months due to structural constraints.`,
        `Implement a consequence management framework linking persistent appetite breaches to individual performance assessments for accountable department heads.`,
        `Consider whether the approved risk appetite for cybersecurity remains calibrated to the current threat landscape.`,
      ],
    },
    overdue_controls: {
      summary: `${kpis.overdueActions} controls are currently past their scheduled implementation dates. This report provides a comprehensive listing of all overdue items, accountable officers, and planned remediation approach.`,
      sections: [
        { title: "Overdue Controls Summary", content: `As at ${report.period}, ${kpis.overdueActions} controls have passed their implementation deadline without moving to Implemented or Awaiting Review status.` },
        { title: "Age Analysis", content: `Of the overdue controls: 2 have been overdue for more than 180 days, 3 for 90–180 days, and the remainder for less than 90 days. The oldest relate to procurement governance with two previous deadline extensions.` },
        { title: "Compensating Controls", content: `Where primary controls are overdue, management has identified compensating controls for ${Math.ceil(kpis.overdueActions * 0.7)} of the ${kpis.overdueActions} overdue items.` },
        { title: "Accountability and Consequences", content: `All overdue controls have named accountable officers formally notified. Department heads with more than 2 overdue controls will present remediation plans directly to the CEO.` },
      ],
      recommendations: [
        `Require all department heads with overdue controls to submit revised implementation plans with weekly milestones within 10 business days.`,
        `Establish a Remediation Task Force, chaired by the Chief Risk Officer, to provide hands-on support for the highest-risk overdue controls.`,
        `Review the root causes of repeated deadline extensions to determine whether resource constraints or governance failures are the primary driver.`,
      ],
    },
    department_accountability: {
      summary: `This report assesses the risk management performance of each department against the organisation's approved KPIs for FY2025, including compliance rates, overdue actions, and appetite breaches.`,
      sections: [
        { title: "Performance Overview", content: `Departmental performance for FY2025 shows significant variation in risk management maturity. Organisation-wide average: ${kpis.complianceRate}% (target 90%).` },
        { title: "High-Performing Departments", content: `Risk & Internal Audit, Strategy & Planning, and Legal Secretariat demonstrate strong control culture with no appetite breaches and consistent implementation within agreed timelines.` },
        { title: "Departments Requiring Intervention", content: `Finance & Procurement, Ethics & Standards Compliance, and Digital Transformation require urgent management intervention. Each has a dedicated improvement plan subject to monthly performance reviews.` },
        { title: "Accountability Assessment", content: `Three department heads have received formal written warnings regarding persistent control implementation failures. Results will be incorporated into the annual performance assessment.` },
      ],
      recommendations: [
        `Implement a quarterly departmental accountability scorecard, shared with the Board Risk Committee, linking risk management performance to executive remuneration.`,
        `Deploy risk management capacity-building resources to the three lowest-performing departments.`,
        `Recognise high-performing departments through the existing awards programme to reinforce positive risk culture.`,
        `Mandate that all department heads complete a refresher on the Enterprise Risk Management Framework by Q3 FY2025.`,
      ],
    },
  };

  return content[report.type] ?? content["monthly_risk_summary"];
}

// ─── Routes ───────────────────────────────────────────────────────────────────

router.get("/tenants", async (_req, res) => {
  res.json(await db.select().from(tenants));
});

router.get("/tenants/:tenantId/dashboard", async (req, res) => {
  const { tenantId } = req.params;
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId));
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });

  const [kpis, depts] = await Promise.all([
    computeKpisFromDb(tenantId),
    db.select().from(departments).where(eq(departments.tenantId, tenantId)),
  ]);
  const implementationTrend = getImplementationTrend(tenantId);
  const insights = getInsights(kpis, tenantId);

  const riskByDepartment = await Promise.all(
    depts.map(async dept => {
      const [r] = await db
        .select({
          total:       sql<number>`count(*)::int`,
          high:        sql<number>`count(*) filter (where overall_risk_level = 'High')::int`,
          medium:      sql<number>`count(*) filter (where overall_risk_level = 'Medium')::int`,
          low:         sql<number>`count(*) filter (where overall_risk_level = 'Low')::int`,
          implemented: sql<number>`count(*) filter (where implementation_status = 'Implemented')::int`,
        })
        .from(controls)
        .where(and(eq(controls.tenantId, tenantId), eq(controls.departmentId, dept.id)));
      const total = r?.total ?? 0;
      const implemented = r?.implemented ?? 0;
      return {
        department:     dept.name,
        high:           r?.high ?? 0,
        medium:         r?.medium ?? 0,
        low:            r?.low ?? 0,
        total,
        complianceRate: total > 0 ? Math.round((implemented / total) * 100) : 0,
      };
    })
  );

  const [bd] = await db
    .select({
      total:  sql<number>`count(*)::int`,
      high:   sql<number>`count(*) filter (where overall_risk_level = 'High')::int`,
      medium: sql<number>`count(*) filter (where overall_risk_level = 'Medium')::int`,
      low:    sql<number>`count(*) filter (where overall_risk_level = 'Low')::int`,
    })
    .from(controls)
    .where(eq(controls.tenantId, tenantId));

  const bt = bd?.total ?? 0;
  const riskLevelBreakdown = [
    { level: "High",   count: bd?.high ?? 0,   percentage: bt > 0 ? Math.round(((bd?.high ?? 0)   / bt) * 100) : 0 },
    { level: "Medium", count: bd?.medium ?? 0, percentage: bt > 0 ? Math.round(((bd?.medium ?? 0) / bt) * 100) : 0 },
    { level: "Low",    count: bd?.low ?? 0,    percentage: bt > 0 ? Math.round(((bd?.low ?? 0)    / bt) * 100) : 0 },
  ];

  const recentActivity = await db
    .select()
    .from(activityFeed)
    .where(eq(activityFeed.tenantId, tenantId))
    .orderBy(desc(activityFeed.timestamp))
    .limit(10);

  res.json({ kpis, riskByDepartment, implementationTrend, riskLevelBreakdown, insights, recentActivity });
});

router.get("/tenants/:tenantId/kpis", async (req, res) => {
  const { tenantId } = req.params;
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId));
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  res.json(await computeKpisFromDb(tenantId));
});

router.get("/tenants/:tenantId/departments", async (req, res) => {
  const { tenantId } = req.params;
  res.json(await db.select().from(departments).where(eq(departments.tenantId, tenantId)));
});

router.post("/tenants/:tenantId/departments", async (req, res) => {
  const { tenantId } = req.params;
  const { name, head, description, actor, actorRole } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });

  const [inserted] = await db.insert(departments).values({
    id: generateId("dep"),
    tenantId, name,
    head: head || "",
    description: description || "",
    totalRisks: 0, totalControls: 0, highRiskCount: 0, overdueCount: 0, complianceRate: 0,
    status: "On Track",
  }).returning();

  if (actor) {
    await db.insert(auditLog).values({
      id: generateId("aud"),
      tenantId, actor, actorRole: actorRole || "Risk Manager",
      action: "Created Department", item: name, itemId: inserted.id,
      timestamp: new Date().toISOString(), result: "Success", details: null,
    });
  }
  res.status(201).json(inserted);
});

router.put("/tenants/:tenantId/departments/:departmentId", async (req, res) => {
  const { tenantId, departmentId } = req.params;
  const { actor, actorRole, ...updates } = req.body;

  const [existing] = await db
    .select()
    .from(departments)
    .where(and(eq(departments.id, departmentId), eq(departments.tenantId, tenantId)));
  if (!existing) return res.status(404).json({ error: "Department not found" });

  const [updated] = await db
    .update(departments)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(departments.id, departmentId))
    .returning();

  if (actor) {
    await db.insert(auditLog).values({
      id: generateId("aud"),
      tenantId, actor, actorRole: actorRole || "Risk Manager",
      action: "Updated Department", item: existing.name, itemId: departmentId,
      timestamp: new Date().toISOString(), result: "Success", details: null,
    });
  }
  res.json(updated);
});

router.get("/tenants/:tenantId/departments/:departmentId", async (req, res) => {
  const { tenantId, departmentId } = req.params;

  const [dept] = await db
    .select()
    .from(departments)
    .where(and(eq(departments.id, departmentId), eq(departments.tenantId, tenantId)));
  if (!dept) return res.status(404).json({ error: "Department not found" });

  const deptControls = await db
    .select()
    .from(controls)
    .where(and(eq(controls.tenantId, tenantId), eq(controls.departmentId, departmentId)));

  const [breakdown] = await db
    .select({
      total:       sql<number>`count(*)::int`,
      implemented: sql<number>`count(*) filter (where implementation_status = 'Implemented')::int`,
      high:        sql<number>`count(*) filter (where overall_risk_level = 'High')::int`,
      medium:      sql<number>`count(*) filter (where overall_risk_level = 'Medium')::int`,
      low:         sql<number>`count(*) filter (where overall_risk_level = 'Low')::int`,
    })
    .from(controls)
    .where(and(eq(controls.tenantId, tenantId), eq(controls.departmentId, departmentId)));

  const total = breakdown?.total ?? 0;
  const implemented = breakdown?.implemented ?? 0;
  const complianceRate = total > 0 ? Math.round((implemented / total) * 100) : 0;

  const overdueItems = deptControls.filter(
    c => c.implementationStatus === "Overdue" || c.implementationStatus === "Escalated"
  );

  const ownerMap: Record<string, { owner: string; controlCount: number; overdueCount: number }> = {};
  deptControls.forEach(c => {
    if (!ownerMap[c.controlOwner]) ownerMap[c.controlOwner] = { owner: c.controlOwner, controlCount: 0, overdueCount: 0 };
    ownerMap[c.controlOwner].controlCount++;
    if (c.implementationStatus === "Overdue" || c.implementationStatus === "Escalated") ownerMap[c.controlOwner].overdueCount++;
  });
  const accountability = Object.values(ownerMap).map(o => ({
    ...o,
    complianceRate: o.controlCount > 0 ? Math.round(((o.controlCount - o.overdueCount) / o.controlCount) * 100) : 100,
  }));

  res.json({
    id: dept.id, name: dept.name, head: dept.head, description: dept.description,
    complianceRate, controls: deptControls,
    riskBreakdown: [
      { level: "High",   count: breakdown?.high ?? 0,   percentage: total > 0 ? Math.round(((breakdown?.high ?? 0)   / total) * 100) : 0 },
      { level: "Medium", count: breakdown?.medium ?? 0, percentage: total > 0 ? Math.round(((breakdown?.medium ?? 0) / total) * 100) : 0 },
      { level: "Low",    count: breakdown?.low ?? 0,    percentage: total > 0 ? Math.round(((breakdown?.low ?? 0)    / total) * 100) : 0 },
    ],
    overdueItems, accountability,
  });
});

router.get("/tenants/:tenantId/reports", async (req, res) => {
  const { tenantId } = req.params;
  res.json(await db.select().from(reports).where(eq(reports.tenantId, tenantId)));
});

router.get("/tenants/:tenantId/reports/:reportId", async (req, res) => {
  const { tenantId, reportId } = req.params;

  const [report] = await db
    .select()
    .from(reports)
    .where(and(eq(reports.id, reportId), eq(reports.tenantId, tenantId)));
  if (!report) return res.status(404).json({ error: "Report not found" });

  const [[tenant], kpis, depts] = await Promise.all([
    db.select().from(tenants).where(eq(tenants.id, tenantId)),
    computeKpisFromDb(tenantId),
    db.select().from(departments).where(eq(departments.tenantId, tenantId)),
  ]);
  const content = buildReportContent(report, tenant?.name ?? tenantId, kpis, depts.length);
  res.json({ ...report, ...content });
});

router.post("/tenants/:tenantId/reports", async (req, res) => {
  const { tenantId } = req.params;
  const { title, type, description, period, actor, actorRole } = req.body;
  if (!title || !type) return res.status(400).json({ error: "title and type are required" });

  const [inserted] = await db.insert(reports).values({
    id: generateId("rep"),
    tenantId, title, type,
    description: description || "",
    generatedAt: new Date().toISOString(),
    period: period || new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
    status: "Draft",
  }).returning();

  if (actor) {
    await db.insert(auditLog).values({
      id: generateId("aud"),
      tenantId, actor, actorRole: actorRole || "Risk Manager",
      action: "Generated Report", item: title, itemId: inserted.id,
      timestamp: new Date().toISOString(), result: "Success", details: null,
    });
  }

  const [[tenant], kpis, depts] = await Promise.all([
    db.select().from(tenants).where(eq(tenants.id, tenantId)),
    computeKpisFromDb(tenantId),
    db.select().from(departments).where(eq(departments.tenantId, tenantId)),
  ]);
  const content = buildReportContent(inserted, tenant?.name ?? tenantId, kpis, depts.length);
  res.status(201).json({ ...inserted, ...content });
});

router.get("/tenants/:tenantId/users", async (req, res) => {
  const { tenantId } = req.params;
  res.json(await db.select().from(users).where(eq(users.tenantId, tenantId)));
});

router.get("/tenants/:tenantId/activity", async (req, res) => {
  const { tenantId } = req.params;
  const result = await db
    .select()
    .from(activityFeed)
    .where(eq(activityFeed.tenantId, tenantId))
    .orderBy(desc(activityFeed.timestamp))
    .limit(20);
  res.json(result);
});

export default router;
