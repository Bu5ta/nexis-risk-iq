import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, users, tenants } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));

  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, user.tenantId));

  const { passwordHash: _omit, ...safeUser } = user;

  return res.json({ user: safeUser, tenant });
});

router.get("/auth/demo-tenants", async (_req, res) => {
  const demoTenants = await db.select().from(tenants).where(eq(tenants.isDemo, true));
  return res.json(demoTenants);
});

export default router;
