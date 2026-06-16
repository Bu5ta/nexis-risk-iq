import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  tenants as tenantsTable,
  departments as departmentsTable,
  controls as controlsTable,
  notes as notesTable,
  timeline as timelineTable,
  auditLog as auditLogTable,
  activityFeed as activityFeedTable,
  users as usersTable,
  reports as reportsTable,
} from "@workspace/db";
import {
  tenants as tenantsData,
  departments as departmentsData,
  controls as controlsData,
  notes as notesData,
  timelines as timelinesData,
  auditLog as auditLogData,
  activityFeed as activityFeedData,
  users as usersData,
  reports as reportsData,
} from "./mockData.js";
import { logger } from "../lib/logger.js";

export async function applyMigrations(): Promise<void> {
  try {
    await db.execute(sql`ALTER TABLE tenants ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false`);
    await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text`);

    try {
      await db.execute(sql`ALTER TABLE users ALTER COLUMN role TYPE text USING role::text`);
      await db.execute(sql`DROP TYPE IF EXISTS user_role CASCADE`);
    } catch {
      // Already text — ignore
    }

    await db.execute(sql`UPDATE tenants SET is_demo = true WHERE id IN ('ten-gov','ten-para','ten-priv') AND is_demo = false`);

    await db.execute(sql`UPDATE users SET role = 'Manager - Risk and Compliance' WHERE role IN ('Super Admin','Tenant Admin','Risk Manager')`);
    await db.execute(sql`UPDATE users SET role = 'Director / Head of Department' WHERE role = 'Department Owner'`);
    await db.execute(sql`UPDATE users SET role = 'Executive Management' WHERE role = 'Executive Viewer'`);

    const demoHash = await bcrypt.hash("demo123", 10);
    await db.execute(sql`UPDATE users SET password_hash = ${demoHash} WHERE password_hash IS NULL`);

    logger.info("Schema migrations applied");
  } catch (err) {
    logger.error({ err }, "Migration error");
    throw err;
  }
}

export async function seedIfEmpty(): Promise<void> {
  try {
    const existing = await db.select().from(tenantsTable).limit(1);
    if (existing.length > 0) {
      logger.info("Database already seeded — skipping");
      return;
    }

    logger.info("Seeding database from mock data…");

    const demoHash = await bcrypt.hash("demo123", 10);

    await db.insert(tenantsTable).values(
      tenantsData.map(t => ({
        id: t.id,
        name: t.name,
        sector: t.sector,
        logo: t.logo,
        primaryColor: t.primaryColor,
        description: t.description,
        totalUsers: t.totalUsers,
        totalDepartments: t.totalDepartments,
        isDemo: true,
      }))
    ).onConflictDoNothing();

    await db.insert(departmentsTable).values(
      departmentsData.map(d => ({
        id: d.id,
        tenantId: d.tenantId,
        name: d.name,
        head: d.head,
        description: d.description,
        totalRisks: d.totalRisks,
        totalControls: d.totalControls,
        highRiskCount: d.highRiskCount,
        overdueCount: d.overdueCount,
        complianceRate: d.complianceRate,
        status: d.status,
      }))
    ).onConflictDoNothing();

    await db.insert(controlsTable).values(
      controlsData.map(c => ({
        id: c.id,
        tenantId: c.tenantId,
        departmentId: c.departmentId,
        department: c.department,
        risk: c.risk,
        riskId: c.riskId,
        control: c.control,
        controlOwner: c.controlOwner,
        implementationDate: c.implementationDate,
        residualRiskScore: c.residualRiskScore,
        withinAppetite: c.withinAppetite,
        overallRiskLevel: c.overallRiskLevel,
        implementationStatus: c.implementationStatus,
        lastReviewed: c.lastReviewed,
        noteCount: c.noteCount,
        isEscalated: c.isEscalated,
        escalatedAt: c.escalatedAt,
        riskDescription: c.riskDescription,
        controlDescription: c.controlDescription,
        inherentRiskScore: c.inherentRiskScore,
      }))
    ).onConflictDoNothing();

    await db.insert(notesTable).values(
      notesData.map(n => ({
        id: n.id,
        controlId: n.controlId,
        content: n.content,
        author: n.author,
        createdAt: new Date(n.createdAt),
      }))
    ).onConflictDoNothing();

    await db.insert(timelineTable).values(
      timelinesData.map(t => ({
        id: t.id,
        controlId: t.controlId,
        action: t.action,
        actor: t.actor,
        timestamp: t.timestamp,
        description: t.description,
        result: t.result,
      }))
    ).onConflictDoNothing();

    await db.insert(auditLogTable).values(
      auditLogData.map(a => ({
        id: a.id,
        tenantId: a.tenantId,
        actor: a.actor,
        actorRole: a.actorRole,
        action: a.action,
        item: a.item,
        itemId: a.itemId,
        timestamp: a.timestamp,
        result: a.result,
        details: a.details,
      }))
    ).onConflictDoNothing();

    await db.insert(activityFeedTable).values(
      activityFeedData.map(a => ({
        id: a.id,
        tenantId: a.tenantId,
        actor: a.actor,
        actorRole: a.actorRole,
        action: a.action,
        item: a.item,
        itemId: a.itemId,
        timestamp: a.timestamp,
        result: a.result,
        severity: a.severity,
      }))
    ).onConflictDoNothing();

    await db.insert(usersTable).values(
      usersData.map(u => ({
        id: u.id,
        tenantId: u.tenantId,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
        avatar: u.avatar,
        lastActive: u.lastActive,
        passwordHash: demoHash,
      }))
    ).onConflictDoNothing();

    await db.insert(reportsTable).values(
      reportsData.map(r => ({
        id: r.id,
        tenantId: r.tenantId,
        title: r.title,
        type: r.type,
        description: r.description,
        generatedAt: r.generatedAt,
        period: r.period,
        status: r.status,
      }))
    ).onConflictDoNothing();

    logger.info("Database seeded successfully");
  } catch (err) {
    logger.error({ err }, "Failed to seed database");
    throw err;
  }
}
