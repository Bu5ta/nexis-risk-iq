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
  const riskBreakdown = {
    high: deptControls.filter(c => c.overallRiskLevel === "High").length,
    medium: deptControls.filter(c => c.overallRiskLevel === "Medium").length,
    low: deptControls.filter(c => c.overallRiskLevel === "Low").length,
  };
  const statusBreakdown = {
    implemented: deptControls.filter(c => c.implementationStatus === "Implemented").length,
    inProgress: deptControls.filter(c => c.implementationStatus === "In Progress").length,
    overdue: deptControls.filter(c => c.implementationStatus === "Overdue").length,
    draft: deptControls.filter(c => c.implementationStatus === "Draft").length,
    awaitingReview: deptControls.filter(c => c.implementationStatus === "Awaiting Review").length,
  };
  const deptUsers = users.filter(u => u.tenantId === tenantId && u.department === dept.name);
  res.json({ ...dept, riskBreakdown, statusBreakdown, users: deptUsers, controls: deptControls });
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
