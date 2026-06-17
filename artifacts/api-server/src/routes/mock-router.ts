import { Router } from "express";
import {
  tenants,
  departments,
  controls,
  timelines,
  users,
  reports,
  mutableControls,
  mutableNotes,
  mutableAuditLog,
  mutableActivity,
  computeKpis,
  computeDepartmentRiskSummary,
  getImplementationTrend,
  getRiskLevelBreakdown,
  getInsights,
  addAuditEntry,
  addActivityEntry,
  addNote,
  getReportContent,
  generateId,
} from "../data/mockData.js";

const router = Router();

// ─── Health ───────────────────────────────────────────────────────────────────

router.get("/health", (_req, res) => {
  res.json({ status: "ok", mode: "mock" });
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

router.post("/auth/login", (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) return res.status(401).json({ error: "Invalid email or password." });
  if (password !== "demo123") return res.status(401).json({ error: "Invalid email or password." });
  const tenant = tenants.find(t => t.id === user.tenantId);
  return res.json({
    user: { ...user, tenantId: user.tenantId, role: user.role, passwordHash: undefined },
    tenant,
  });
});

router.get("/auth/demo-tenants", (_req, res) => {
  res.json(tenants.map(t => ({ ...t, isDemo: true })));
});

// ─── Tenants ──────────────────────────────────────────────────────────────────

router.get("/tenants", (_req, res) => {
  res.json(tenants.map(t => ({ ...t, isDemo: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" })));
});

router.get("/tenants/:tenantId/dashboard", (req, res) => {
  const { tenantId } = req.params;
  const tenant = tenants.find(t => t.id === tenantId);
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });

  const kpis = computeKpis(tenantId);
  const riskByDepartment = computeDepartmentRiskSummary(tenantId);
  const implementationTrend = getImplementationTrend(tenantId);
  const riskLevelBreakdown = getRiskLevelBreakdown(tenantId);
  const insights = getInsights(tenantId);
  const recentActivity = mutableActivity
    .filter(a => a.tenantId === tenantId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 10);

  res.json({ kpis, riskByDepartment, implementationTrend, riskLevelBreakdown, insights, recentActivity });
});

router.get("/tenants/:tenantId/kpis", (req, res) => {
  const { tenantId } = req.params;
  if (!tenants.find(t => t.id === tenantId)) return res.status(404).json({ error: "Tenant not found" });
  res.json(computeKpis(tenantId));
});

// ─── Departments ──────────────────────────────────────────────────────────────

router.get("/tenants/:tenantId/departments", (req, res) => {
  const { tenantId } = req.params;
  res.json(departments.filter(d => d.tenantId === tenantId));
});

router.post("/tenants/:tenantId/departments", (req, res) => {
  const { tenantId } = req.params;
  const { name, head, description, actor, actorRole } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  const newDept = {
    id: generateId("dep"), tenantId, name,
    head: head || "", description: description || "",
    totalRisks: 0, totalControls: 0, highRiskCount: 0, overdueCount: 0,
    complianceRate: 0, status: "On Track",
  };
  departments.push(newDept as typeof departments[0]);
  if (actor) {
    addAuditEntry({ tenantId, actor, actorRole: actorRole || "Risk Manager", action: "Created Department", item: name, itemId: newDept.id, timestamp: new Date().toISOString(), result: "Success", details: null });
  }
  res.status(201).json(newDept);
});

router.put("/tenants/:tenantId/departments/:departmentId", (req, res) => {
  const { tenantId, departmentId } = req.params;
  const { actor, actorRole, ...updates } = req.body;
  const idx = departments.findIndex(d => d.id === departmentId && d.tenantId === tenantId);
  if (idx === -1) return res.status(404).json({ error: "Department not found" });
  departments[idx] = { ...departments[idx], ...updates };
  if (actor) {
    addAuditEntry({ tenantId, actor, actorRole: actorRole || "Risk Manager", action: "Updated Department", item: departments[idx].name, itemId: departmentId, timestamp: new Date().toISOString(), result: "Success", details: null });
  }
  res.json(departments[idx]);
});

router.get("/tenants/:tenantId/departments/:departmentId", (req, res) => {
  const { tenantId, departmentId } = req.params;
  const dept = departments.find(d => d.id === departmentId && d.tenantId === tenantId);
  if (!dept) return res.status(404).json({ error: "Department not found" });

  const deptControls = Array.from(mutableControls.values()).filter(
    c => c.tenantId === tenantId && c.departmentId === departmentId
  );

  const total = deptControls.length;
  const implemented = deptControls.filter(c => c.implementationStatus === "Implemented").length;
  const complianceRate = total > 0 ? Math.round((implemented / total) * 100) : dept.complianceRate;

  const high   = deptControls.filter(c => c.overallRiskLevel === "High").length;
  const medium = deptControls.filter(c => c.overallRiskLevel === "Medium").length;
  const low    = deptControls.filter(c => c.overallRiskLevel === "Low").length;

  const riskBreakdown = [
    { level: "High",   count: high,   percentage: total > 0 ? Math.round((high   / total) * 100) : 0 },
    { level: "Medium", count: medium, percentage: total > 0 ? Math.round((medium / total) * 100) : 0 },
    { level: "Low",    count: low,    percentage: total > 0 ? Math.round((low    / total) * 100) : 0 },
  ];

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
    riskBreakdown, overdueItems, accountability,
  });
});

// ─── Controls ─────────────────────────────────────────────────────────────────

router.get("/controls", (req, res) => {
  const { tenantId, department, status, riskLevel, withinAppetite, search } =
    req.query as Record<string, string>;
  if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

  let result = Array.from(mutableControls.values()).filter(c => c.tenantId === tenantId);
  if (department) result = result.filter(c => c.departmentId === department || c.department === department);
  if (status) result = result.filter(c => c.implementationStatus === status);
  if (riskLevel) result = result.filter(c => c.overallRiskLevel === riskLevel);
  if (withinAppetite !== undefined && withinAppetite !== "") {
    result = result.filter(c => c.withinAppetite === (withinAppetite === "true"));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(c =>
      c.control.toLowerCase().includes(q) ||
      c.risk.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q) ||
      c.controlOwner.toLowerCase().includes(q)
    );
  }
  res.json(result);
});

router.post("/controls", (req, res) => {
  const { tenantId, actor, actorRole, ...body } = req.body;
  if (!tenantId) return res.status(400).json({ error: "tenantId is required" });
  const newCtrl = {
    id: generateId("ctl"), tenantId,
    department: body.department || "",
    departmentId: body.departmentId || "",
    risk: body.risk || "",
    riskId: generateId("rsk"),
    control: body.control || "",
    controlOwner: body.controlOwner || "",
    implementationDate: body.implementationDate || new Date().toISOString().split("T")[0],
    residualRiskScore: body.residualRiskScore ?? 10,
    withinAppetite: body.withinAppetite ?? true,
    overallRiskLevel: body.overallRiskLevel ?? "Medium",
    implementationStatus: body.implementationStatus ?? "Draft",
    lastReviewed: null,
    noteCount: 0,
    isEscalated: false,
    escalatedAt: null,
    riskDescription: body.riskDescription || "",
    controlDescription: body.controlDescription || "",
    inherentRiskScore: body.inherentRiskScore ?? 15,
  };
  mutableControls.set(newCtrl.id, newCtrl as typeof controls[0]);
  mutableNotes.set(newCtrl.id, []);
  if (actor) {
    addAuditEntry({ tenantId, actor, actorRole: actorRole || "Risk Manager", action: "Created Control", item: newCtrl.control, itemId: newCtrl.id, timestamp: new Date().toISOString(), result: "Success", details: null });
    addActivityEntry({ tenantId, actor, actorRole: actorRole || "Risk Manager", action: "Created", item: newCtrl.control, itemId: newCtrl.id, timestamp: new Date().toISOString(), result: "Created", severity: "low" });
  }
  res.status(201).json(newCtrl);
});

router.get("/controls/:controlId", (req, res) => {
  const { controlId } = req.params;
  const ctrl = mutableControls.get(controlId);
  if (!ctrl) return res.status(404).json({ error: "Control not found" });
  const ctrlNotes = mutableNotes.get(controlId) || [];
  const ctrlTimeline = timelines.filter(t => t.controlId === controlId);
  res.json({ ...ctrl, notes: ctrlNotes, timeline: ctrlTimeline });
});

router.patch("/controls/:controlId", (req, res) => {
  const { controlId } = req.params;
  const ctrl = mutableControls.get(controlId);
  if (!ctrl) return res.status(404).json({ error: "Control not found" });
  const { actor, actorRole, ...updates } = req.body;
  const updated = { ...ctrl, ...updates };
  mutableControls.set(controlId, updated);
  if (actor) {
    addAuditEntry({ tenantId: ctrl.tenantId, actor, actorRole: actorRole || "Risk Manager", action: "Updated Control", item: ctrl.control, itemId: controlId, timestamp: new Date().toISOString(), result: "Success", details: JSON.stringify(updates) });
    addActivityEntry({ tenantId: ctrl.tenantId, actor, actorRole: actorRole || "Risk Manager", action: "Updated", item: ctrl.control, itemId: controlId, timestamp: new Date().toISOString(), result: updates.implementationStatus || "Updated", severity: "low" });
  }
  const ctrlNotes = mutableNotes.get(controlId) || [];
  const ctrlTimeline = timelines.filter(t => t.controlId === controlId);
  res.json({ ...updated, notes: ctrlNotes, timeline: ctrlTimeline });
});

router.post("/controls/:controlId/notes", (req, res) => {
  const { controlId } = req.params;
  const ctrl = mutableControls.get(controlId);
  if (!ctrl) return res.status(404).json({ error: "Control not found" });
  const { content, author, actorRole } = req.body;
  if (!content) return res.status(400).json({ error: "content is required" });
  const newNote = addNote(controlId, { controlId, content, author: author || "User", createdAt: new Date().toISOString() });
  addAuditEntry({ tenantId: ctrl.tenantId, actor: author || "User", actorRole: actorRole || "Risk Manager", action: "Added Note", item: ctrl.control, itemId: controlId, timestamp: new Date().toISOString(), result: "Success", details: content.slice(0, 100) });
  res.status(201).json(newNote);
});

router.post("/controls/:controlId/escalate", (req, res) => {
  const { controlId } = req.params;
  const ctrl = mutableControls.get(controlId);
  if (!ctrl) return res.status(404).json({ error: "Control not found" });
  const { actor, actorRole, reason } = req.body;
  const updated = { ...ctrl, isEscalated: true, escalatedAt: new Date().toISOString() };
  mutableControls.set(controlId, updated);
  const entry = addAuditEntry({ tenantId: ctrl.tenantId, actor: actor || "Risk Manager", actorRole: actorRole || "Risk Manager", action: "Escalated", item: ctrl.control, itemId: controlId, timestamp: new Date().toISOString(), result: "Escalated", details: reason || null });
  addActivityEntry({ tenantId: ctrl.tenantId, actor: actor || "Risk Manager", actorRole: actorRole || "Risk Manager", action: "Escalated", item: ctrl.control, itemId: controlId, timestamp: new Date().toISOString(), result: "Escalated", severity: "critical" });
  res.json({ control: updated, auditEntry: entry });
});

router.post("/controls/:controlId/resolve", (req, res) => {
  const { controlId } = req.params;
  const ctrl = mutableControls.get(controlId);
  if (!ctrl) return res.status(404).json({ error: "Control not found" });
  const { actor, actorRole } = req.body;
  const updated = { ...ctrl, implementationStatus: "Implemented" as const, lastReviewed: new Date().toISOString() };
  mutableControls.set(controlId, updated);
  const entry = addAuditEntry({ tenantId: ctrl.tenantId, actor: actor || "Risk Manager", actorRole: actorRole || "Risk Manager", action: "Marked Complete", item: ctrl.control, itemId: controlId, timestamp: new Date().toISOString(), result: "Implemented", details: null });
  addActivityEntry({ tenantId: ctrl.tenantId, actor: actor || "Risk Manager", actorRole: actorRole || "Risk Manager", action: "Marked Complete", item: ctrl.control, itemId: controlId, timestamp: new Date().toISOString(), result: "Implemented", severity: "low" });
  res.json({ control: updated, auditEntry: entry });
});

router.post("/controls/import", (req, res) => {
  const { tenantId, controls: imported, actor, actorRole } = req.body;
  if (!tenantId || !Array.isArray(imported)) {
    return res.status(400).json({ error: "tenantId and controls array are required" });
  }
  const created = imported.map((row: Record<string, unknown>) => {
    const ctrl = {
      id: generateId("ctl"), tenantId,
      department: String(row.department || ""),
      departmentId: String(row.departmentId || ""),
      risk: String(row.risk || ""),
      riskId: generateId("rsk"),
      control: String(row.control || ""),
      controlOwner: String(row.controlOwner || ""),
      implementationDate: String(row.implementationDate || new Date().toISOString().split("T")[0]),
      residualRiskScore: Number(row.residualRiskScore) || 10,
      withinAppetite: row.withinAppetite !== false && row.withinAppetite !== "false",
      overallRiskLevel: (row.overallRiskLevel as "High" | "Medium" | "Low") || "Medium",
      implementationStatus: (row.implementationStatus as typeof controls[0]["implementationStatus"]) || "Draft",
      lastReviewed: null, noteCount: 0, isEscalated: false, escalatedAt: null,
      riskDescription: String(row.riskDescription || ""),
      controlDescription: String(row.controlDescription || ""),
      inherentRiskScore: Number(row.inherentRiskScore) || 15,
    };
    mutableControls.set(ctrl.id, ctrl);
    mutableNotes.set(ctrl.id, []);
    return ctrl;
  });
  if (actor && created.length > 0) {
    addAuditEntry({ tenantId, actor, actorRole: actorRole || "Risk Manager", action: "Imported", item: `${created.length} controls`, itemId: tenantId, timestamp: new Date().toISOString(), result: `${created.length} controls imported`, details: null });
    addActivityEntry({ tenantId, actor, actorRole: actorRole || "Risk Manager", action: "Imported", item: `${created.length} controls`, itemId: tenantId, timestamp: new Date().toISOString(), result: `${created.length} controls imported`, severity: "medium" });
  }
  res.status(201).json({ imported: created.length, controls: created });
});

router.get("/tenants/:tenantId/controls/export", (req, res) => {
  const { tenantId } = req.params;
  const rows = Array.from(mutableControls.values()).filter(c => c.tenantId === tenantId);
  const headers = ["id","tenantId","department","risk","control","controlOwner","implementationDate","implementationStatus","overallRiskLevel","residualRiskScore","withinAppetite","isEscalated"];
  const csv = [
    headers.join(","),
    ...rows.map(r => headers.map(h => `"${String((r as Record<string, unknown>)[h] ?? "").replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="controls-${tenantId}.csv"`);
  res.send(csv);
});

// ─── Audit Log ────────────────────────────────────────────────────────────────

router.get("/audit-log", (req, res) => {
  const { tenantId, actor, action, page } = req.query as Record<string, string>;
  if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

  let entries = mutableAuditLog.filter(e => e.tenantId === tenantId);
  if (actor) entries = entries.filter(e => e.actor.toLowerCase().includes(actor.toLowerCase()));
  if (action) entries = entries.filter(e => e.action.toLowerCase().includes(action.toLowerCase()));
  entries = [...entries].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const pageSize = 20;
  const pageNum = Math.max(1, parseInt(page || "1", 10));
  const total = entries.length;
  const paged = entries.slice((pageNum - 1) * pageSize, pageNum * pageSize);
  res.json({ entries: paged, total, page: pageNum, pageSize });
});

// ─── Reports ──────────────────────────────────────────────────────────────────

router.get("/tenants/:tenantId/reports", (req, res) => {
  const { tenantId } = req.params;
  res.json(reports.filter(r => r.tenantId === tenantId));
});

router.post("/tenants/:tenantId/reports/generate", (req, res) => {
  const { tenantId } = req.params;
  const { type, period, actor, actorRole } = req.body;
  const tenant = tenants.find(t => t.id === tenantId);
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  const typeLabels: Record<string, string> = {
    monthly_risk_summary: "Monthly Risk Summary",
    appetite_breach: "Appetite Breach Report",
    overdue_controls: "Overdue Controls Report",
    department_accountability: "Department Accountability Report",
  };
  const newReport = {
    id: generateId("rep"), tenantId,
    title: `${typeLabels[type] || type} — ${period || new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`,
    type: type || "monthly_risk_summary",
    description: "Generated report",
    generatedAt: new Date().toISOString(),
    period: period || new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
    status: "Final",
  };
  reports.push(newReport as typeof reports[0]);
  if (actor) {
    addAuditEntry({ tenantId, actor, actorRole: actorRole || "Risk Manager", action: "Generated Report", item: newReport.title, itemId: newReport.id, timestamp: new Date().toISOString(), result: "Success", details: null });
  }
  const kpis = computeKpis(tenantId);
  const deptCount = departments.filter(d => d.tenantId === tenantId).length;
  const content = getReportContent(newReport.id) || { summary: "", sections: [], recommendations: [] };
  res.json({ report: newReport, content });
});

router.get("/tenants/:tenantId/reports/:reportId/content", (req, res) => {
  const { reportId } = req.params;
  const content = getReportContent(reportId);
  if (!content) return res.status(404).json({ error: "Report not found" });
  res.json(content);
});

// ─── Health alias ─────────────────────────────────────────────────────────────

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok", mode: "mock" });
});

// ─── Controls: DELETE ──────────────────────────────────────────────────────────

router.delete("/controls/:controlId", (req, res) => {
  const { controlId } = req.params;
  const ctrl = mutableControls.get(controlId);
  if (!ctrl) return res.status(404).json({ error: "Control not found" });
  const { actor, actorRole } = req.body ?? {};
  mutableControls.delete(controlId);
  mutableNotes.delete(controlId);
  if (actor) {
    addAuditEntry({ tenantId: ctrl.tenantId, actor, actorRole: actorRole || "Risk Manager", action: "Deleted Control", item: ctrl.control, itemId: controlId, timestamp: new Date().toISOString(), result: "Deleted", details: null });
  }
  res.json({ success: true });
});

// ─── Controls: named actions ───────────────────────────────────────────────────

router.post("/controls/:controlId/actions", (req, res) => {
  const { controlId } = req.params;
  const ctrl = mutableControls.get(controlId);
  if (!ctrl) return res.status(404).json({ error: "Control not found" });
  const { action, actor = "Demo User", actorRole = "Risk Manager", note, assignee } = req.body ?? {};

  type StatusPatch = {
    implementationStatus?: typeof ctrl.implementationStatus;
    isEscalated?: boolean;
    escalatedAt?: string | null;
    controlOwner?: string;
    lastReviewed?: string | null;
  };

  let patch: StatusPatch = {};
  let auditResult = "";
  let activityAction = "";
  let severity = "medium";

  switch (action) {
    case "mark_complete":
      patch = { implementationStatus: "Implemented", lastReviewed: new Date().toISOString() };
      auditResult = "Marked as Implemented"; activityAction = "Marked Complete"; severity = "low"; break;
    case "mark_in_progress":
      patch = { implementationStatus: "In Progress" };
      auditResult = "Status changed to In Progress"; activityAction = "Updated Status"; break;
    case "escalate":
      patch = { implementationStatus: "Escalated", isEscalated: true, escalatedAt: new Date().toISOString() };
      auditResult = "Escalated"; activityAction = "Escalated"; severity = "critical"; break;
    case "assign_owner":
      if (!assignee) return res.status(400).json({ error: "assignee is required for assign_owner action" });
      patch = { controlOwner: assignee };
      auditResult = `Owner assigned to ${assignee}`; activityAction = "Assigned Owner"; break;
    case "mark_reviewed":
      patch = { lastReviewed: new Date().toISOString() };
      auditResult = "Marked as Reviewed"; activityAction = "Reviewed"; break;
    case "revert_to_draft":
      patch = { implementationStatus: "Draft", isEscalated: false, escalatedAt: null };
      auditResult = "Reverted to Draft"; activityAction = "Reverted to Draft"; break;
    default:
      return res.status(400).json({ error: `Unknown action: ${action}` });
  }

  const updated = { ...ctrl, ...patch };
  mutableControls.set(controlId, updated);
  if (note) addNote(controlId, { controlId, content: note, author: actor, createdAt: new Date().toISOString() });
  const auditEntry = addAuditEntry({ tenantId: ctrl.tenantId, actor, actorRole, action: activityAction, item: ctrl.control, itemId: controlId, timestamp: new Date().toISOString(), result: auditResult, details: note || null });
  addActivityEntry({ tenantId: ctrl.tenantId, actor, actorRole, action: activityAction, item: ctrl.control, itemId: controlId, timestamp: new Date().toISOString(), result: auditResult, severity });
  res.json({ success: true, control: updated, auditEntry });
});

// ─── Controls: tenanted import path alias ─────────────────────────────────────

router.post("/tenants/:tenantId/controls/import", (req, res) => {
  const { tenantId } = req.params;
  const { rows, controls: legacyControls, actor, actorRole } = req.body as { rows?: Record<string, unknown>[]; controls?: Record<string, unknown>[]; actor?: string; actorRole?: string };
  const imported = rows || legacyControls || [];
  if (!Array.isArray(imported)) return res.status(400).json({ error: "rows array is required" });
  const created = imported.map((row) => {
    const ctrl = {
      id: generateId("ctl"), tenantId,
      department: String(row.department || ""),
      departmentId: String(row.departmentId || ""),
      risk: String(row.risk || ""),
      riskId: generateId("rsk"),
      control: String(row.control || ""),
      controlOwner: String(row.controlOwner || ""),
      implementationDate: String(row.implementationDate || new Date().toISOString().split("T")[0]),
      residualRiskScore: Number(row.residualRiskScore) || 10,
      withinAppetite: row.withinAppetite !== false && row.withinAppetite !== "false",
      overallRiskLevel: (row.overallRiskLevel as "High" | "Medium" | "Low") || "Medium",
      implementationStatus: (row.implementationStatus as typeof controls[0]["implementationStatus"]) || "Draft",
      lastReviewed: null, noteCount: 0, isEscalated: false, escalatedAt: null,
      riskDescription: String(row.riskDescription || ""),
      controlDescription: String(row.controlDescription || ""),
      inherentRiskScore: Number(row.inherentRiskScore) || 15,
    };
    mutableControls.set(ctrl.id, ctrl);
    mutableNotes.set(ctrl.id, []);
    return ctrl;
  });
  if (actor && created.length > 0) {
    addAuditEntry({ tenantId, actor, actorRole: actorRole || "Risk Manager", action: "Imported", item: `${created.length} controls`, itemId: tenantId, timestamp: new Date().toISOString(), result: `${created.length} controls imported`, details: null });
    addActivityEntry({ tenantId, actor, actorRole: actorRole || "Risk Manager", action: "Imported", item: `${created.length} controls`, itemId: tenantId, timestamp: new Date().toISOString(), result: `${created.length} controls imported`, severity: "medium" });
  }
  res.status(201).json({ imported: created.length, controls: created });
});

// ─── Reports: full detail ──────────────────────────────────────────────────────

router.get("/tenants/:tenantId/reports/:reportId", (req, res) => {
  const { tenantId, reportId } = req.params;
  const report = reports.find(r => r.id === reportId && r.tenantId === tenantId);
  if (!report) return res.status(404).json({ error: "Report not found" });
  const content = getReportContent(reportId) || { summary: "No content available.", sections: [], recommendations: [] };
  res.json({ ...report, ...content });
});

// ─── Activity feed ─────────────────────────────────────────────────────────────

router.get("/tenants/:tenantId/activity", (req, res) => {
  const { tenantId } = req.params;
  const { limit } = req.query as Record<string, string>;
  const entries = mutableActivity
    .filter(a => a.tenantId === tenantId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, parseInt(limit || "20", 10));
  res.json(entries);
});

// ─── AI: analytics (pure computation — no OpenAI needed) ──────────────────────

router.get("/ai/analytics/:tenantId", (req, res) => {
  const { tenantId } = req.params;
  const ctrls = Array.from(mutableControls.values()).filter(c => c.tenantId === tenantId);
  const trend = getImplementationTrend(tenantId);
  const depts = departments.filter(d => d.tenantId === tenantId);
  const kpis = computeKpis(tenantId);

  const last3 = trend.slice(-3);
  const overdueVelocity = last3.length >= 2 ? last3[last3.length - 1].overdue - last3[0].overdue : 0;
  const implementedVelocity = last3.length >= 2 ? last3[last3.length - 1].implemented - last3[0].implemented : 0;

  const scores = ctrls.map(c => c.residualRiskScore);
  const mean = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
  const stdDev = Math.sqrt(scores.map(s => (s - mean) ** 2).reduce((a, b) => a + b, 0) / (scores.length || 1));

  const anomalies = ctrls.filter(c => c.residualRiskScore > mean + stdDev).sort((a, b) => b.residualRiskScore - a.residualRiskScore).slice(0, 6).map(c => ({
    id: c.id, control: c.control, department: c.department, residualScore: c.residualRiskScore,
    zScore: parseFloat(((c.residualRiskScore - mean) / (stdDev || 1)).toFixed(2)), status: c.implementationStatus, riskLevel: c.overallRiskLevel,
  }));

  const trendData = trend.slice(-6);
  const n = trendData.length;
  const xMean = (n - 1) / 2;
  const yValues = trendData.map(t => { const tot = t.implemented + t.inProgress + t.overdue; return tot > 0 ? Math.round((t.implemented / tot) * 100) : 0; });
  const yMean = yValues.reduce((a, b) => a + b, 0) / (n || 1);
  const slopeNum = trendData.reduce((sum, _, i) => sum + (i - xMean) * (yValues[i] - yMean), 0);
  const slopeDen = trendData.reduce((sum, _, i) => sum + (i - xMean) ** 2, 0);
  const slope = slopeDen !== 0 ? slopeNum / slopeDen : 0;

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const lastMonthIdx = new Date().getMonth();
  const forecast = [1, 2, 3].map(offset => ({
    month: monthNames[(lastMonthIdx + offset) % 12],
    projected: Math.min(100, Math.max(0, Math.round(yMean + slope * (n - 1 + offset)))),
    confidence: Math.max(60, 92 - offset * 10),
  }));

  const totalResidual = ctrls.reduce((sum, c) => sum + c.residualRiskScore, 0);
  const deptConcentration = depts.map(d => {
    const dc = ctrls.filter(c => c.department === d.name);
    const dr = dc.reduce((sum, c) => sum + c.residualRiskScore, 0);
    return { department: d.name, share: totalResidual > 0 ? parseFloat(((dr / totalResidual) * 100).toFixed(1)) : 0, residualTotal: dr, highRiskCount: d.highRiskCount, status: d.status };
  }).sort((a, b) => b.share - a.share).slice(0, 6);

  const totalInherent = ctrls.reduce((sum, c) => sum + c.inherentRiskScore, 0);
  const reductionEfficiency = totalInherent > 0 ? parseFloat((((totalInherent - totalResidual) / totalInherent) * 100).toFixed(1)) : 0;

  const criticalPath = ctrls.filter(c => c.implementationStatus === "Overdue" && c.overallRiskLevel === "High" && !c.withinAppetite).map(c => ({ id: c.id, control: c.control, department: c.department, owner: c.controlOwner, residualScore: c.residualRiskScore }));

  const mlScore = Math.round(kpis.complianceRate * 0.4 + (1 - kpis.appetiteBreaches / Math.max(1, kpis.totalControls)) * 100 * 0.3 + reductionEfficiency * 0.3);

  res.json({
    riskVelocity: { overdueChange: overdueVelocity, implementedChange: implementedVelocity, trend: overdueVelocity > 0 ? "deteriorating" : overdueVelocity < 0 ? "improving" : "stable" },
    anomalies, meanRiskScore: parseFloat(mean.toFixed(2)), stdDevRiskScore: parseFloat(stdDev.toFixed(2)),
    forecast, deptConcentration, reductionEfficiency, criticalPath, mlScore,
    trendHistory: trendData.map((t, i) => ({ month: t.month, complianceRate: yValues[i], implemented: t.implemented, overdue: t.overdue })),
  });
});

// ─── AI: executive briefing (mock SSE — no OpenAI needed) ─────────────────────

router.get("/ai/briefing/:tenantId", (req, res) => {
  const { tenantId } = req.params;
  const tenant = tenants.find(t => t.id === tenantId);
  const kpis = computeKpis(tenantId);
  const depts = departments.filter(d => d.tenantId === tenantId).sort((a, b) => a.complianceRate - b.complianceRate);
  const ctrls = Array.from(mutableControls.values()).filter(c => c.tenantId === tenantId);
  const overdue = ctrls.filter(c => c.implementationStatus === "Overdue");
  const breaches = ctrls.filter(c => !c.withinAppetite);
  const worstDept = depts[0];

  const posture = kpis.complianceRate >= 85 ? "strong" : kpis.complianceRate >= 70 ? "moderate" : "concerning";
  const trend = kpis.overdueActions > 5 ? "deteriorating" : kpis.overdueActions > 2 ? "stable" : "improving";

  const briefing = `**Risk Posture**\n${tenant?.name} presents a **${posture}** overall risk posture with a compliance rate of **${kpis.complianceRate}%** against a 90% target. ${kpis.implementedControls} of ${kpis.totalControls} controls are fully implemented. The portfolio trend is **${trend}**, with ${kpis.appetiteBreaches} appetite breaches requiring board attention.\n\n**Priority Actions**\n1. 🔴 Critical — Resolve ${overdue.length} overdue control${overdue.length !== 1 ? "s" : ""}${overdue.length > 0 ? `, including: *${overdue.slice(0, 2).map(c => c.control).join("; ")}*` : ""}. Immediate action required to prevent regulatory exposure.\n2. 🟡 High — Address ${breaches.length} risk appetite breach${breaches.length !== 1 ? "es" : ""}. ${breaches.length > 0 ? `Highest residual risk: ${breaches.sort((a,b) => b.residualRiskScore - a.residualRiskScore)[0]?.control}.` : "Portfolio is within appetite bounds."}\n3. 🟢 Medium — ${worstDept ? `${worstDept.name} department requires targeted intervention (${worstDept.complianceRate}% compliant, ${worstDept.overdueCount} overdue items).` : "Continue monitoring department-level compliance metrics."}\n\n**Key Trend**\nImplementation velocity ${trend === "improving" ? "is on an upward trajectory — momentum should be sustained through Q3 with focused resource allocation." : trend === "stable" ? "remains flat — a targeted remediation sprint is recommended to accelerate the ${kpis.totalControls - kpis.implementedControls} remaining controls." : "shows signs of pressure — escalated items require board-level intervention and clear ownership assignment this quarter."}`;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const words = briefing.split(/(\s+)/);
  let i = 0;
  const interval = setInterval(() => {
    if (i >= words.length) {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      clearInterval(interval);
      return;
    }
    const chunk = words.slice(i, i + 3).join("");
    res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    i += 3;
  }, 30);

  req.on("close", () => clearInterval(interval));
});

// ─── AI: chat (mock SSE — no OpenAI needed) ───────────────────────────────────

router.post("/ai/chat", (req, res) => {
  const { tenantId, messages } = req.body as { tenantId: string; messages: Array<{ role: string; content: string }> };
  const kpis = computeKpis(tenantId);
  const ctrls = Array.from(mutableControls.values()).filter(c => c.tenantId === tenantId);
  const depts = departments.filter(d => d.tenantId === tenantId);
  const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content?.toLowerCase() || "";

  let response = "";

  if (lastUserMsg.includes("overdue")) {
    const overdue = ctrls.filter(c => c.implementationStatus === "Overdue");
    response = `There are currently **${overdue.length} overdue controls** across your portfolio.\n\nTop items requiring immediate attention:\n${overdue.slice(0, 5).map((c, i) => `${i + 1}. **${c.control}** — ${c.department} | Owner: ${c.controlOwner} | Residual Score: ${c.residualRiskScore}`).join("\n")}\n\nI recommend scheduling a remediation sprint with the respective department heads this week.`;
  } else if (lastUserMsg.includes("high risk") || lastUserMsg.includes("high-risk")) {
    const high = ctrls.filter(c => c.overallRiskLevel === "High");
    response = `Your portfolio contains **${high.length} high-risk controls** (${Math.round((high.length / Math.max(1, kpis.totalControls)) * 100)}% of total).\n\nTop by residual risk score:\n${high.sort((a, b) => b.residualRiskScore - a.residualRiskScore).slice(0, 5).map((c, i) => `${i + 1}. **${c.control}** — Score: ${c.residualRiskScore} | ${c.implementationStatus}`).join("\n")}\n\nFocusing on these controls will yield the greatest reduction in overall risk exposure.`;
  } else if (lastUserMsg.includes("appetite") || lastUserMsg.includes("breach")) {
    const breaches = ctrls.filter(c => !c.withinAppetite);
    response = `There are **${breaches.length} appetite breaches** in your current portfolio — controls where residual risk exceeds the board-approved tolerance.\n\n${breaches.slice(0, 4).map((c, i) => `${i + 1}. **${c.control}** — ${c.department} | Score: ${c.residualRiskScore}`).join("\n")}\n\nThese must be reported to the Risk Committee and remediation plans escalated within 30 days per policy.`;
  } else if (lastUserMsg.includes("department") || lastUserMsg.includes("dept")) {
    response = `**Department Risk Summary:**\n\n${depts.slice(0, 6).map(d => `• **${d.name}**: ${d.complianceRate}% compliant | ${d.highRiskCount} high-risk | ${d.overdueCount} overdue | Status: **${d.status}**`).join("\n")}\n\n${depts.filter(d => d.status === "Critical").length > 0 ? `⚠️ ${depts.filter(d => d.status === "Critical").length} department(s) are in Critical status and require immediate intervention.` : "All departments are within acceptable performance bands."}`;
  } else if (lastUserMsg.includes("compliance") || lastUserMsg.includes("rate")) {
    response = `Current **compliance rate is ${kpis.complianceRate}%** against a 90% target.\n\n**Breakdown:**\n• Implemented: ${kpis.implementedControls} controls\n• In Progress: ${ctrls.filter(c => c.implementationStatus === "In Progress").length}\n• Overdue: ${kpis.overdueActions}\n• Draft: ${ctrls.filter(c => c.implementationStatus === "Draft").length}\n\n${kpis.complianceRate >= 90 ? "✅ You are meeting the target. Maintain momentum." : kpis.complianceRate >= 75 ? "🟡 You are tracking below target. Focus on in-progress items to close the gap." : "🔴 Significant gap to target. An urgent remediation programme is recommended."}`;
  } else if (lastUserMsg.includes("escalat")) {
    const escalated = ctrls.filter(c => c.isEscalated);
    response = `There are **${escalated.length} escalated control${escalated.length !== 1 ? "s" : ""}** currently requiring senior management attention:\n\n${escalated.slice(0, 5).map((c, i) => `${i + 1}. **${c.control}** — ${c.department} | Owner: ${c.controlOwner}`).join("\n") || "No controls are currently escalated."}\n\nEscalated items should be reviewed at the next Risk Committee meeting.`;
  } else if (lastUserMsg.includes("recommend") || lastUserMsg.includes("priorit")) {
    response = `Based on your current risk posture, here are my top recommendations:\n\n1. **Resolve overdue controls** (${kpis.overdueActions} items) — assign clear owners and set 2-week resolution deadlines.\n2. **Address appetite breaches** (${kpis.appetiteBreaches} items) — prepare a breach remediation report for the board.\n3. **Focus on ${depts.sort((a, b) => a.complianceRate - b.complianceRate)[0]?.name || "lowest-performing departments"}** — targeted resource allocation will have the highest impact.\n4. **Review escalated items** — ensure executive sponsors are assigned and action plans are in place.\n5. **Update draft controls** (${ctrls.filter(c => c.implementationStatus === "Draft").length} items) — move to active implementation to improve the compliance rate.`;
  } else {
    response = `Your current risk intelligence summary:\n\n**Compliance Rate:** ${kpis.complianceRate}% (target: 90%)\n**Total Controls:** ${kpis.totalControls} | Implemented: ${kpis.implementedControls}\n**Overdue:** ${kpis.overdueActions} | Appetite Breaches: ${kpis.appetiteBreaches}\n**Escalated Items:** ${kpis.escalatedItems} | High Risk: ${kpis.highRiskItems}\n\nAsk me about specific areas — overdue controls, high-risk items, appetite breaches, department performance, or recommendations — and I'll provide targeted analysis.`;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const words = response.split(/(\s+)/);
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
  }, 25);

  req.on("close", () => clearInterval(interval));
});

// ─── Users ────────────────────────────────────────────────────────────────────

router.get("/tenants/:tenantId/users", (req, res) => {
  const { tenantId } = req.params;
  res.json(users.filter(u => u.tenantId === tenantId).map(u => ({ ...u, passwordHash: undefined })));
});

router.post("/tenants/:tenantId/users", (req, res) => {
  const { tenantId } = req.params;
  const { name, email, role, department, actor, actorRole } = req.body;
  if (!name || !email) return res.status(400).json({ error: "name and email are required" });
  const newUser = { id: generateId("usr"), tenantId, name, email, role: role || "Risk Champion", department: department || "", avatar: null, lastActive: new Date().toISOString() };
  users.push(newUser as typeof users[0]);
  if (actor) {
    addAuditEntry({ tenantId, actor, actorRole: actorRole || "Tenant Admin", action: "Created User", item: name, itemId: newUser.id, timestamp: new Date().toISOString(), result: "Success", details: null });
  }
  res.status(201).json(newUser);
});

router.delete("/tenants/:tenantId/users/:userId", (req, res) => {
  const { tenantId, userId } = req.params;
  const { actor, actorRole } = req.body;
  const idx = users.findIndex(u => u.id === userId && u.tenantId === tenantId);
  if (idx === -1) return res.status(404).json({ error: "User not found" });
  const [removed] = users.splice(idx, 1);
  if (actor) {
    addAuditEntry({ tenantId, actor, actorRole: actorRole || "Tenant Admin", action: "Deleted User", item: removed.name, itemId: userId, timestamp: new Date().toISOString(), result: "Success", details: null });
  }
  res.json({ success: true });
});

export default router;
