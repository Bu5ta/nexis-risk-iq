import {
  pgTable,
  text,
  integer,
  boolean,
  real,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const riskLevelEnum = pgEnum("risk_level", ["High", "Medium", "Low"]);

export const controlStatusEnum = pgEnum("control_status", [
  "Implemented",
  "In Progress",
  "Overdue",
  "Draft",
  "Awaiting Review",
  "Escalated",
]);

export const userRoleEnum = pgEnum("user_role", [
  "Super Admin",
  "Tenant Admin",
  "Risk Manager",
  "Department Owner",
  "Executive Viewer",
]);

// ─── Tenants ──────────────────────────────────────────────────────────────────

export const tenants = pgTable("tenants", {
  id:               text("id").primaryKey(),
  name:             text("name").notNull(),
  sector:           text("sector").notNull(),
  logo:             text("logo"),
  primaryColor:     text("primary_color").notNull().default("#1e40af"),
  description:      text("description").notNull().default(""),
  totalUsers:       integer("total_users").notNull().default(0),
  totalDepartments: integer("total_departments").notNull().default(0),
  createdAt:        timestamp("created_at").notNull().defaultNow(),
  updatedAt:        timestamp("updated_at").notNull().defaultNow(),
});

// ─── Departments ──────────────────────────────────────────────────────────────

export const departments = pgTable("departments", {
  id:             text("id").primaryKey(),
  tenantId:       text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  name:           text("name").notNull(),
  head:           text("head").notNull().default(""),
  description:    text("description").notNull().default(""),
  totalRisks:     integer("total_risks").notNull().default(0),
  totalControls:  integer("total_controls").notNull().default(0),
  highRiskCount:  integer("high_risk_count").notNull().default(0),
  overdueCount:   integer("overdue_count").notNull().default(0),
  complianceRate: real("compliance_rate").notNull().default(0),
  status:         text("status").notNull().default("On Track"),
  createdAt:      timestamp("created_at").notNull().defaultNow(),
  updatedAt:      timestamp("updated_at").notNull().defaultNow(),
});

// ─── Controls ─────────────────────────────────────────────────────────────────

export const controls = pgTable("controls", {
  id:                   text("id").primaryKey(),
  tenantId:             text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  departmentId:         text("department_id").notNull().references(() => departments.id, { onDelete: "cascade" }),
  department:           text("department").notNull(),
  risk:                 text("risk").notNull(),
  riskId:               text("risk_id").notNull(),
  control:              text("control").notNull(),
  controlOwner:         text("control_owner").notNull(),
  implementationDate:   text("implementation_date").notNull(),
  residualRiskScore:    integer("residual_risk_score").notNull().default(0),
  withinAppetite:       boolean("within_appetite").notNull().default(true),
  overallRiskLevel:     riskLevelEnum("overall_risk_level").notNull().default("Medium"),
  implementationStatus: controlStatusEnum("implementation_status").notNull().default("Draft"),
  lastReviewed:         text("last_reviewed"),
  noteCount:            integer("note_count").notNull().default(0),
  isEscalated:          boolean("is_escalated").notNull().default(false),
  escalatedAt:          text("escalated_at"),
  riskDescription:      text("risk_description").notNull().default(""),
  controlDescription:   text("control_description").notNull().default(""),
  inherentRiskScore:    integer("inherent_risk_score").notNull().default(0),
  createdAt:            timestamp("created_at").notNull().defaultNow(),
  updatedAt:            timestamp("updated_at").notNull().defaultNow(),
});

// ─── Notes ────────────────────────────────────────────────────────────────────

export const notes = pgTable("notes", {
  id:        text("id").primaryKey(),
  controlId: text("control_id").notNull().references(() => controls.id, { onDelete: "cascade" }),
  content:   text("content").notNull(),
  author:    text("author").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Timeline ─────────────────────────────────────────────────────────────────

export const timeline = pgTable("timeline", {
  id:          text("id").primaryKey(),
  controlId:   text("control_id").notNull().references(() => controls.id, { onDelete: "cascade" }),
  action:      text("action").notNull(),
  actor:       text("actor").notNull(),
  timestamp:   text("timestamp").notNull(),
  description: text("description").notNull().default(""),
  result:      text("result").notNull().default(""),
});

// ─── Audit Log ────────────────────────────────────────────────────────────────

export const auditLog = pgTable("audit_log", {
  id:        text("id").primaryKey(),
  tenantId:  text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  actor:     text("actor").notNull(),
  actorRole: text("actor_role").notNull(),
  action:    text("action").notNull(),
  item:      text("item").notNull(),
  itemId:    text("item_id").notNull(),
  timestamp: text("timestamp").notNull(),
  result:    text("result").notNull(),
  details:   text("details"),
});

// ─── Activity Feed ────────────────────────────────────────────────────────────

export const activityFeed = pgTable("activity_feed", {
  id:        text("id").primaryKey(),
  tenantId:  text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  actor:     text("actor").notNull(),
  actorRole: text("actor_role").notNull(),
  action:    text("action").notNull(),
  item:      text("item").notNull(),
  itemId:    text("item_id").notNull(),
  timestamp: text("timestamp").notNull(),
  result:    text("result").notNull(),
  severity:  text("severity").notNull().default("low"),
});

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id:         text("id").primaryKey(),
  tenantId:   text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  name:       text("name").notNull(),
  email:      text("email").notNull(),
  role:       userRoleEnum("role").notNull().default("Executive Viewer"),
  department: text("department").notNull(),
  avatar:     text("avatar"),
  lastActive: text("last_active").notNull(),
});

// ─── Reports ──────────────────────────────────────────────────────────────────

export const reports = pgTable("reports", {
  id:          text("id").primaryKey(),
  tenantId:    text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  title:       text("title").notNull(),
  type:        text("type").notNull(),
  description: text("description").notNull().default(""),
  generatedAt: text("generated_at").notNull(),
  period:      text("period").notNull(),
  status:      text("status").notNull().default("Ready"),
});
