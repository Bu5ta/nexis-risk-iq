import { Router } from "express";
import { db } from "@workspace/db";
import {
  controls,
  notes,
  timeline,
  auditLog,
  activityFeed,
  departments,
} from "@workspace/db";
import { eq, and, or, ilike, desc } from "drizzle-orm";

const router = Router();

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// GET /api/controls
router.get("/controls", async (req, res) => {
  const { tenantId, department, status, riskLevel, withinAppetite, search } =
    req.query as Record<string, string>;

  if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

  const result = await db
    .select()
    .from(controls)
    .where(
      and(
        eq(controls.tenantId, tenantId),
        department
          ? or(
              eq(controls.departmentId, department),
              eq(controls.department, department)
            )
          : undefined,
        status ? eq(controls.implementationStatus, status as any) : undefined,
        riskLevel
          ? eq(controls.overallRiskLevel, riskLevel as any)
          : undefined,
        withinAppetite !== undefined && withinAppetite !== ""
          ? eq(controls.withinAppetite, withinAppetite === "true")
          : undefined,
        search
          ? or(
              ilike(controls.control, `%${search}%`),
              ilike(controls.risk, `%${search}%`),
              ilike(controls.department, `%${search}%`),
              ilike(controls.controlOwner, `%${search}%`)
            )
          : undefined
      )
    )
    .orderBy(desc(controls.updatedAt));

  res.json(result);
});

// GET /api/controls/:controlId
router.get("/controls/:controlId", async (req, res) => {
  const { controlId } = req.params;

  const [control] = await db
    .select()
    .from(controls)
    .where(eq(controls.id, controlId));
  if (!control) return res.status(404).json({ error: "Control not found" });

  const controlNotes = await db
    .select()
    .from(notes)
    .where(eq(notes.controlId, controlId))
    .orderBy(notes.createdAt);

  const controlTimeline = await db
    .select()
    .from(timeline)
    .where(eq(timeline.controlId, controlId));

  res.json({ ...control, notes: controlNotes, timeline: controlTimeline });
});

// POST /api/controls — create new control
router.post("/controls", async (req, res) => {
  const body = req.body;

  if (!body.tenantId || !body.departmentId || !body.control || !body.risk) {
    return res
      .status(400)
      .json({ error: "tenantId, departmentId, control, and risk are required" });
  }

  let deptName = body.department;
  if (!deptName && body.departmentId) {
    const [dept] = await db
      .select({ name: departments.name })
      .from(departments)
      .where(eq(departments.id, body.departmentId));
    deptName = dept?.name || "";
  }

  const [inserted] = await db
    .insert(controls)
    .values({
      id: generateId("ctl"),
      tenantId: body.tenantId,
      departmentId: body.departmentId,
      department: deptName || "",
      risk: body.risk,
      riskId: body.riskId || generateId("rsk"),
      control: body.control,
      controlOwner: body.controlOwner || "",
      implementationDate:
        body.implementationDate || new Date().toISOString().slice(0, 10),
      residualRiskScore: Number(body.residualRiskScore) || 0,
      withinAppetite: body.withinAppetite ?? true,
      overallRiskLevel: body.overallRiskLevel || "Medium",
      implementationStatus: body.implementationStatus || "Draft",
      lastReviewed: body.lastReviewed || null,
      noteCount: 0,
      isEscalated: false,
      escalatedAt: null,
      riskDescription: body.riskDescription || "",
      controlDescription: body.controlDescription || "",
      inherentRiskScore: Number(body.inherentRiskScore) || 0,
    })
    .returning();

  if (body.actor) {
    await db.insert(auditLog).values({
      id: generateId("aud"),
      tenantId: body.tenantId,
      actor: body.actor,
      actorRole: body.actorRole || "Risk Manager",
      action: "Created Control",
      item: inserted.control,
      itemId: inserted.id,
      timestamp: new Date().toISOString(),
      result: "Success",
      details: `New control created in ${deptName}`,
    });
    await db.insert(activityFeed).values({
      id: generateId("act"),
      tenantId: body.tenantId,
      actor: body.actor,
      actorRole: body.actorRole || "Risk Manager",
      action: "Created",
      item: inserted.control,
      itemId: inserted.id,
      timestamp: new Date().toISOString(),
      result: "Control Created",
      severity: "low",
    });
  }

  res.status(201).json(inserted);
});

// PUT /api/controls/:controlId — update control fields
router.put("/controls/:controlId", async (req, res) => {
  const { controlId } = req.params;

  const [existing] = await db
    .select()
    .from(controls)
    .where(eq(controls.id, controlId));
  if (!existing) return res.status(404).json({ error: "Control not found" });

  const { actor, actorRole, ...updates } = req.body;

  const [updated] = await db
    .update(controls)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(controls.id, controlId))
    .returning();

  if (actor) {
    await db.insert(auditLog).values({
      id: generateId("aud"),
      tenantId: existing.tenantId,
      actor,
      actorRole: actorRole || "Risk Manager",
      action: "Updated Control",
      item: existing.control,
      itemId: controlId,
      timestamp: new Date().toISOString(),
      result: "Success",
      details: null,
    });
  }

  res.json(updated);
});

// PATCH /api/controls/:controlId — named action
router.patch("/controls/:controlId", async (req, res) => {
  const { controlId } = req.params;
  const { action, actor = "System", note, assignee } = req.body;

  const [control] = await db
    .select()
    .from(controls)
    .where(eq(controls.id, controlId));
  if (!control) return res.status(404).json({ error: "Control not found" });

  type StatusPatch = {
    implementationStatus?: (typeof control)["implementationStatus"];
    isEscalated?: boolean;
    escalatedAt?: string | null;
    controlOwner?: string;
    lastReviewed?: string;
  };

  let patch: StatusPatch = {};
  let auditResult = "";
  let activityAction = "";
  let severity = "medium";

  switch (action) {
    case "mark_complete":
      patch = { implementationStatus: "Implemented", lastReviewed: new Date().toISOString() };
      auditResult = "Marked as Implemented";
      activityAction = "Marked Complete";
      severity = "low";
      break;
    case "mark_in_progress":
      patch = { implementationStatus: "In Progress" };
      auditResult = "Status changed to In Progress";
      activityAction = "Updated Status";
      break;
    case "escalate":
      patch = { implementationStatus: "Escalated", isEscalated: true, escalatedAt: new Date().toISOString() };
      auditResult = "Escalated";
      activityAction = "Escalated";
      severity = "critical";
      break;
    case "assign_owner":
      if (!assignee) return res.status(400).json({ error: "assignee is required for assign_owner action" });
      patch = { controlOwner: assignee };
      auditResult = `Owner assigned to ${assignee}`;
      activityAction = "Assigned Owner";
      break;
    case "mark_reviewed":
      patch = { lastReviewed: new Date().toISOString() };
      auditResult = "Marked as Reviewed";
      activityAction = "Reviewed";
      break;
    case "revert_to_draft":
      patch = { implementationStatus: "Draft", isEscalated: false, escalatedAt: null };
      auditResult = "Reverted to Draft";
      activityAction = "Reverted to Draft";
      break;
    default:
      return res.status(400).json({ error: `Unknown action: ${action}` });
  }

  const [updatedControl] = await db
    .update(controls)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(controls.id, controlId))
    .returning();

  if (note) {
    await db.insert(notes).values({ id: generateId("note"), controlId, content: note, author: actor });
    await db.update(controls).set({ noteCount: control.noteCount + 1 }).where(eq(controls.id, controlId));
  }

  const [auditEntry] = await db.insert(auditLog).values({
    id: generateId("aud"),
    tenantId: control.tenantId,
    actor,
    actorRole: "Risk Manager",
    action: activityAction,
    item: control.control,
    itemId: controlId,
    timestamp: new Date().toISOString(),
    result: auditResult,
    details: note || null,
  }).returning();

  await db.insert(activityFeed).values({
    id: generateId("act"),
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

// POST /api/controls/:controlId/notes
router.post("/controls/:controlId/notes", async (req, res) => {
  const { controlId } = req.params;
  const { content, author = "System" } = req.body;

  if (!content) return res.status(400).json({ error: "content is required" });

  const [control] = await db.select().from(controls).where(eq(controls.id, controlId));
  if (!control) return res.status(404).json({ error: "Control not found" });

  const [newNote] = await db
    .insert(notes)
    .values({ id: generateId("note"), controlId, content, author })
    .returning();

  await db.update(controls)
    .set({ noteCount: control.noteCount + 1, updatedAt: new Date() })
    .where(eq(controls.id, controlId));

  res.status(201).json(newNote);
});

// DELETE /api/controls/:controlId
router.delete("/controls/:controlId", async (req, res) => {
  const { controlId } = req.params;
  const { actor, actorRole } = req.body ?? {};

  const [control] = await db.select().from(controls).where(eq(controls.id, controlId));
  if (!control) return res.status(404).json({ error: "Control not found" });

  await db.delete(controls).where(eq(controls.id, controlId));

  if (actor) {
    await db.insert(auditLog).values({
      id: generateId("aud"),
      tenantId: control.tenantId,
      actor,
      actorRole: actorRole || "Risk Manager",
      action: "Deleted Control",
      item: control.control,
      itemId: controlId,
      timestamp: new Date().toISOString(),
      result: "Deleted",
      details: null,
    });
  }

  res.json({ success: true });
});

// POST /api/tenants/:tenantId/controls/import — bulk import from client-parsed CSV/Excel
router.post("/tenants/:tenantId/controls/import", async (req, res) => {
  const { tenantId } = req.params;
  const { rows, actor, actorRole } = req.body as {
    rows: Array<{
      department?: string;
      risk: string;
      control: string;
      controlOwner?: string;
      implementationDate?: string;
      overallRiskLevel?: string;
      implementationStatus?: string;
      withinAppetite?: string | boolean;
      residualRiskScore?: number | string;
      inherentRiskScore?: number | string;
      riskDescription?: string;
      controlDescription?: string;
    }>;
    actor?: string;
    actorRole?: string;
  };

  if (!Array.isArray(rows) || rows.length === 0)
    return res.status(400).json({ error: "rows array is required and must not be empty" });

  const deptRows = await db
    .select({ id: departments.id, name: departments.name })
    .from(departments)
    .where(eq(departments.tenantId, tenantId));

  const deptByName: Record<string, string> = {};
  deptRows.forEach(d => { deptByName[d.name.toLowerCase()] = d.id; });

  const validStatuses = ["Implemented", "In Progress", "Overdue", "Draft", "Awaiting Review", "Escalated"] as const;
  const validLevels = ["High", "Medium", "Low"] as const;

  const inserted: string[] = [];
  const errors: Array<{ row: number; error: string }> = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row.risk || !row.control) {
      errors.push({ row: i + 1, error: "risk and control are required" });
      continue;
    }

    const deptName = row.department || "";
    const departmentId = deptByName[deptName.toLowerCase()] || deptRows[0]?.id || "";

    if (!departmentId) {
      errors.push({ row: i + 1, error: `Department "${deptName}" not found and no departments exist` });
      continue;
    }

    const resolvedDeptName = deptRows.find(d => d.id === departmentId)?.name || deptName;
    const resolvedStatus = validStatuses.includes(row.implementationStatus as any)
      ? (row.implementationStatus as (typeof validStatuses)[number])
      : "Draft";
    const resolvedLevel = validLevels.includes(row.overallRiskLevel as any)
      ? (row.overallRiskLevel as (typeof validLevels)[number])
      : "Medium";

    try {
      const newId = generateId("ctl");
      await db.insert(controls).values({
        id: newId,
        tenantId,
        departmentId,
        department: resolvedDeptName,
        risk: row.risk,
        riskId: generateId("rsk"),
        control: row.control,
        controlOwner: row.controlOwner || "",
        implementationDate: row.implementationDate || new Date().toISOString().slice(0, 10),
        residualRiskScore: Number(row.residualRiskScore) || 0,
        withinAppetite: String(row.withinAppetite).toLowerCase() !== "false" && row.withinAppetite !== false,
        overallRiskLevel: resolvedLevel,
        implementationStatus: resolvedStatus,
        lastReviewed: null,
        noteCount: 0,
        isEscalated: false,
        escalatedAt: null,
        riskDescription: row.riskDescription || "",
        controlDescription: row.controlDescription || "",
        inherentRiskScore: Number(row.inherentRiskScore) || 0,
      });
      inserted.push(newId);
    } catch (err) {
      errors.push({ row: i + 1, error: String(err) });
    }
  }

  if (actor && inserted.length > 0) {
    await db.insert(auditLog).values({
      id: generateId("aud"),
      tenantId,
      actor,
      actorRole: actorRole || "Risk Manager",
      action: "Bulk Import",
      item: `${inserted.length} controls`,
      itemId: tenantId,
      timestamp: new Date().toISOString(),
      result: "Success",
      details: `Imported ${inserted.length} controls via spreadsheet.${errors.length > 0 ? ` ${errors.length} rows had errors.` : ""}`,
    });
    await db.insert(activityFeed).values({
      id: generateId("act"),
      tenantId,
      actor,
      actorRole: actorRole || "Risk Manager",
      action: "Imported",
      item: `${inserted.length} controls`,
      itemId: tenantId,
      timestamp: new Date().toISOString(),
      result: `${inserted.length} controls imported`,
      severity: "medium",
    });
  }

  res.json({ inserted: inserted.length, errors });
});

// GET /api/tenants/:tenantId/controls/export — CSV download
router.get("/tenants/:tenantId/controls/export", async (req, res) => {
  const { tenantId } = req.params;

  const rows = await db
    .select()
    .from(controls)
    .where(eq(controls.tenantId, tenantId))
    .orderBy(controls.department, controls.risk);

  const headers = [
    "id", "department", "risk", "control", "controlOwner", "implementationDate",
    "overallRiskLevel", "implementationStatus", "withinAppetite", "residualRiskScore",
    "inherentRiskScore", "isEscalated", "lastReviewed", "riskDescription", "controlDescription",
  ];

  const esc = (v: unknown): string => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const csv = [
    headers.join(","),
    ...rows.map(r => headers.map(h => esc((r as any)[h])).join(",")),
  ].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="controls-${tenantId}-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csv);
});

export default router;
