import { Router } from "express";
import {
  tenants,
  departments,
  users,
  reports,
  activityFeed,
  mutableActivity,
  computeKpis,
  computeDepartmentRiskSummary,
  getImplementationTrend,
  getRiskLevelBreakdown,
  getInsights,
  mutableControls,
  mutableNotes,
  timelines,
  getReportContent,
} from "../data/mockData.js";

const router = Router();

// GET /api/tenants
router.get("/tenants", (_req, res) => {
  res.json(tenants);
});

// GET /api/tenants/:tenantId/dashboard
router.get("/tenants/:tenantId/dashboard", (req, res) => {
  const { tenantId } = req.params;
  const tenant = tenants.find(t => t.id === tenantId);
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });

  const kpis = computeKpis(tenantId);
  const riskByDepartment = computeDepartmentRiskSummary(tenantId);
  const implementationTrend = getImplementationTrend(tenantId);
  const riskLevelBreakdown = getRiskLevelBreakdown(tenantId);
  const insights = getInsights(tenantId);
  const recentActivity = mutableActivity.filter(a => a.tenantId === tenantId).slice(0, 10);

  res.json({ kpis, riskByDepartment, implementationTrend, riskLevelBreakdown, insights, recentActivity });
});

// GET /api/tenants/:tenantId/kpis
router.get("/tenants/:tenantId/kpis", (req, res) => {
  const { tenantId } = req.params;
  const tenant = tenants.find(t => t.id === tenantId);
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  res.json(computeKpis(tenantId));
});

// GET /api/tenants/:tenantId/departments
router.get("/tenants/:tenantId/departments", (req, res) => {
  const { tenantId } = req.params;
  const tenant = tenants.find(t => t.id === tenantId);
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  const result = departments.filter(d => d.tenantId === tenantId);
  res.json(result);
});

// GET /api/tenants/:tenantId/departments/:departmentId
router.get("/tenants/:tenantId/departments/:departmentId", (req, res) => {
  const { tenantId, departmentId } = req.params;
  const dept = departments.find(d => d.id === departmentId && d.tenantId === tenantId);
  if (!dept) return res.status(404).json({ error: "Department not found" });

  const deptControls = Array.from(mutableControls.values()).filter(
    c => c.tenantId === tenantId && c.departmentId === departmentId
  );
  const overdueItems = deptControls.filter(c => c.implementationStatus === "Overdue" || c.implementationStatus === "Escalated");

  const total = deptControls.length;
  const implemented = deptControls.filter(c => c.implementationStatus === "Implemented").length;
  const high = deptControls.filter(c => c.overallRiskLevel === "High").length;
  const medium = deptControls.filter(c => c.overallRiskLevel === "Medium").length;
  const low = deptControls.filter(c => c.overallRiskLevel === "Low").length;
  const complianceRate = total > 0 ? Math.round((implemented / total) * 100) : 0;

  // Build accountability map from unique owners
  const ownerMap: Record<string, { owner: string; controlCount: number; overdueCount: number }> = {};
  deptControls.forEach(c => {
    if (!ownerMap[c.controlOwner]) {
      ownerMap[c.controlOwner] = { owner: c.controlOwner, controlCount: 0, overdueCount: 0 };
    }
    ownerMap[c.controlOwner].controlCount++;
    if (c.implementationStatus === "Overdue" || c.implementationStatus === "Escalated") {
      ownerMap[c.controlOwner].overdueCount++;
    }
  });
  const accountability = Object.values(ownerMap).map(o => ({
    ...o,
    complianceRate: o.controlCount > 0 ? Math.round(((o.controlCount - o.overdueCount) / o.controlCount) * 100) : 100,
  }));

  res.json({
    id: dept.id,
    name: dept.name,
    head: dept.head,
    description: dept.description,
    complianceRate,
    controls: deptControls,
    riskBreakdown: [
      { level: "High", count: high, percentage: total > 0 ? Math.round((high / total) * 100) : 0 },
      { level: "Medium", count: medium, percentage: total > 0 ? Math.round((medium / total) * 100) : 0 },
      { level: "Low", count: low, percentage: total > 0 ? Math.round((low / total) * 100) : 0 },
    ],
    overdueItems,
    accountability,
  });
});

// GET /api/tenants/:tenantId/reports
router.get("/tenants/:tenantId/reports", (req, res) => {
  const { tenantId } = req.params;
  res.json(reports.filter(r => r.tenantId === tenantId));
});

// GET /api/tenants/:tenantId/reports/:reportId
router.get("/tenants/:tenantId/reports/:reportId", (req, res) => {
  const { tenantId, reportId } = req.params;
  const report = reports.find(r => r.id === reportId && r.tenantId === tenantId);
  if (!report) return res.status(404).json({ error: "Report not found" });

  const content = getReportContent(reportId);
  if (!content) return res.status(404).json({ error: "Report content not found" });

  res.json({ ...report, ...content });
});

// GET /api/tenants/:tenantId/users
router.get("/tenants/:tenantId/users", (req, res) => {
  const { tenantId } = req.params;
  res.json(users.filter(u => u.tenantId === tenantId));
});

// GET /api/tenants/:tenantId/activity
router.get("/tenants/:tenantId/activity", (req, res) => {
  const { tenantId } = req.params;
  res.json(mutableActivity.filter(a => a.tenantId === tenantId).slice(0, 20));
});

export default router;
