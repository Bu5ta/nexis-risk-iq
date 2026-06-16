import { Router } from "express";
import { db } from "@workspace/db";
import { auditLog } from "@workspace/db";
import { eq, and, ilike, desc } from "drizzle-orm";

const router = Router();

// GET /api/audit-log
router.get("/audit-log", async (req, res) => {
  const { tenantId, actor, action, page } = req.query as Record<string, string>;

  if (!tenantId) return res.status(400).json({ error: "tenantId is required" });

  const allEntries = await db
    .select()
    .from(auditLog)
    .where(
      and(
        eq(auditLog.tenantId, tenantId),
        actor ? ilike(auditLog.actor, `%${actor}%`) : undefined,
        action ? ilike(auditLog.action, `%${action}%`) : undefined
      )
    )
    .orderBy(desc(auditLog.timestamp));

  const pageSize = 20;
  const pageNum = Math.max(1, parseInt(page || "1", 10));
  const total = allEntries.length;
  const paged = allEntries.slice((pageNum - 1) * pageSize, pageNum * pageSize);

  res.json({ entries: paged, total, page: pageNum, pageSize });
});

export default router;
