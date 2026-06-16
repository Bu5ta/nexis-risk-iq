import { Router } from "express";
import {
  mutableControls,
  mutableNotes,
  timelines,
  addNote,
  addAuditEntry,
  addActivityEntry,
  generateId,
} from "../data/mockData.js";

const router = Router();

// GET /api/controls — list with optional filters
router.get("/controls", (req, res) => {
  const { tenantId, department, status, riskLevel, withinAppetite, search } = req.query as Record<string, string>;

  if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

  let result = Array.from(mutableControls.values()).filter(c => c.tenantId === tenantId);

  if (department) result = result.filter(c => c.departmentId === department || c.department === department);
  if (status) result = result.filter(c => c.implementationStatus === status);
  if (riskLevel) result = result.filter(c => c.overallRiskLevel === riskLevel);
  if (withinAppetite !== undefined && withinAppetite !== "") {
    const wa = withinAppetite === "true";
    result = result.filter(c => c.withinAppetite === wa);
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

// GET /api/controls/:controlId
router.get("/controls/:controlId", (req, res) => {
  const { controlId } = req.params;
  const control = mutableControls.get(controlId);
  if (!control) return res.status(404).json({ error: "Control not found" });

  const notes = mutableNotes.get(controlId) || [];
  const timeline = timelines.filter(t => t.controlId === controlId);

  res.json({ ...control, notes, timeline });
});

// PATCH /api/controls/:controlId
router.patch("/controls/:controlId", (req, res) => {
  const { controlId } = req.params;
  const control = mutableControls.get(controlId);
  if (!control) return res.status(404).json({ error: "Control not found" });

  const updates = req.body as Partial<typeof control>;
  const updated = { ...control, ...updates };
  mutableControls.set(controlId, updated);

  res.json(updated);
});

// POST /api/controls/:controlId/notes
router.post("/controls/:controlId/notes", (req, res) => {
  const { controlId } = req.params;
  const control = mutableControls.get(controlId);
  if (!control) return res.status(404).json({ error: "Control not found" });

  const { content, author } = req.body as { content: string; author: string };
  if (!content || !author) return res.status(400).json({ error: "content and author are required" });

  const note = addNote(controlId, {
    controlId,
    content,
    author,
    createdAt: new Date().toISOString(),
  });

  addAuditEntry({
    tenantId: control.tenantId,
    actor: author,
    actorRole: "Risk Manager",
    action: "Added Note",
    item: control.control,
    itemId: controlId,
    timestamp: new Date().toISOString(),
    result: "Note Added",
    details: content.slice(0, 100),
  });

  res.status(201).json(note);
});

// POST /api/controls/:controlId/actions
router.post("/controls/:controlId/actions", (req, res) => {
  const { controlId } = req.params;
  const control = mutableControls.get(controlId);
  if (!control) return res.status(404).json({ error: "Control not found" });

  const { action, assignee, note, actor = "System User" } = req.body as {
    action: string;
    assignee?: string;
    note?: string;
    actor?: string;
  };

  let updatedControl = { ...control };
  let auditResult = "";
  let activityAction = "";
  let severity = "low";

  switch (action) {
    case "mark_complete":
      updatedControl.implementationStatus = "Implemented";
      updatedControl.lastReviewed = new Date().toISOString();
      auditResult = "Marked as Implemented";
      activityAction = "Marked Complete";
      break;

    case "mark_in_progress":
      updatedControl.implementationStatus = "In Progress";
      auditResult = "Status changed to In Progress";
      activityAction = "Updated Status";
      break;

    case "escalate":
      updatedControl.implementationStatus = "Escalated";
      updatedControl.isEscalated = true;
      updatedControl.escalatedAt = new Date().toISOString();
      auditResult = "Escalated";
      activityAction = "Escalated";
      severity = "critical";
      break;

    case "assign_owner":
      if (!assignee) return res.status(400).json({ error: "assignee is required for assign_owner action" });
      updatedControl.controlOwner = assignee;
      auditResult = `Owner assigned to ${assignee}`;
      activityAction = "Assigned Owner";
      severity = "medium";
      break;

    case "mark_reviewed":
      updatedControl.lastReviewed = new Date().toISOString();
      auditResult = "Marked as Reviewed";
      activityAction = "Reviewed";
      break;

    case "revert_to_draft":
      updatedControl.implementationStatus = "Draft";
      updatedControl.isEscalated = false;
      updatedControl.escalatedAt = null;
      auditResult = "Reverted to Draft";
      activityAction = "Reverted to Draft";
      break;

    default:
      return res.status(400).json({ error: `Unknown action: ${action}` });
  }

  mutableControls.set(controlId, updatedControl);

  const auditEntry = addAuditEntry({
    tenantId: control.tenantId,
    actor,
    actorRole: "Risk Manager",
    action: activityAction,
    item: control.control,
    itemId: controlId,
    timestamp: new Date().toISOString(),
    result: auditResult,
    details: note || null,
  });

  addActivityEntry({
    tenantId: control.tenantId,
    actor,
    actorRole: "Risk Manager",
    action: activityAction,
    item: control.control,
    itemId: controlId,
    timestamp: new Date().toISOString(),
    result: auditResult,
    severity,
  });

  res.json({ success: true, control: updatedControl, auditEntry });
});

export default router;
