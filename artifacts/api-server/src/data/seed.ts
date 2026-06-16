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

export async function seedIfEmpty(): Promise<void> {
  try {
    const existing = await db.select().from(tenantsTable).limit(1);
    if (existing.length > 0) {
      logger.info("Database already seeded — skipping");
      return;
    }

    logger.info("Seeding database from mock data…");

    // Tenants
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
      }))
    ).onConflictDoNothing();

    // Departments
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

    // Controls
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

    // Notes
    await db.insert(notesTable).values(
      notesData.map(n => ({
        id: n.id,
        controlId: n.controlId,
        content: n.content,
        author: n.author,
        createdAt: new Date(n.createdAt),
      }))
    ).onConflictDoNothing();

    // Timeline
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

    // Audit log
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

    // Activity feed
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

    // Users
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
      }))
    ).onConflictDoNothing();

    // Reports
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
