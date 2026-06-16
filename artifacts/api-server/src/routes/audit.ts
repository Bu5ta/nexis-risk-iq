import { Router } from "express";
import { mutableAuditLog } from "../data/mockData.js";

const router = Router();

// GET /api/audit-log
router.get("/audit-log", (req, res) => {
  const { tenantId, actor, action, page } = req.query as Record<string, string>;

  if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

  let entries = mutableAuditLog.filter(e => e.tenantId === tenantId);

  if (actor) {
    const q = actor.toLowerCase();
    entries = entries.filter(e => e.actor.toLowerCase().includes(q));
  }

  if (action) {
    const q = action.toLowerCase();
    entries = entries.filter(e => e.action.toLowerCase().includes(q));
  }

  const pageSize = 20;
  const pageNum = Math.max(1, parseInt(page || "1", 10));
  const total = entries.length;
  const paged = entries.slice((pageNum - 1) * pageSize, pageNum * pageSize);

  res.json({ entries: paged, total, page: pageNum, pageSize });
});

export default router;
