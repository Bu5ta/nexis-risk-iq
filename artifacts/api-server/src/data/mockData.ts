// NEXIS Risk & Control Intelligence — Comprehensive Mock Data Layer

export type RiskLevel = "High" | "Medium" | "Low";
export type ControlStatus = "Implemented" | "In Progress" | "Overdue" | "Draft" | "Awaiting Review" | "Escalated";
export type UserRole = "Super Admin" | "Tenant Admin" | "Risk Manager" | "Department Owner" | "Executive Viewer";

export interface Tenant {
  id: string;
  name: string;
  sector: string;
  logo: string | null;
  primaryColor: string;
  description: string;
  totalUsers: number;
  totalDepartments: number;
}

export interface Department {
  id: string;
  tenantId: string;
  name: string;
  head: string;
  description: string;
  totalRisks: number;
  totalControls: number;
  highRiskCount: number;
  overdueCount: number;
  complianceRate: number;
  status: string;
}

export interface Control {
  id: string;
  tenantId: string;
  department: string;
  departmentId: string;
  risk: string;
  riskId: string;
  control: string;
  controlOwner: string;
  implementationDate: string;
  residualRiskScore: number;
  withinAppetite: boolean;
  overallRiskLevel: RiskLevel;
  implementationStatus: ControlStatus;
  lastReviewed: string | null;
  noteCount: number;
  isEscalated: boolean;
  escalatedAt: string | null;
  riskDescription: string;
  controlDescription: string;
  inherentRiskScore: number;
}

export interface Note {
  id: string;
  controlId: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface TimelineEntry {
  id: string;
  controlId: string;
  action: string;
  actor: string;
  timestamp: string;
  description: string;
  result: string;
}

export interface AuditEntry {
  id: string;
  tenantId: string;
  actor: string;
  actorRole: string;
  action: string;
  item: string;
  itemId: string;
  timestamp: string;
  result: string;
  details: string | null;
}

export interface ActivityEntry {
  id: string;
  tenantId: string;
  actor: string;
  actorRole: string;
  action: string;
  item: string;
  itemId: string;
  timestamp: string;
  result: string;
  severity: string;
}

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string | null;
  lastActive: string;
}

export interface Report {
  id: string;
  tenantId: string;
  title: string;
  type: string;
  description: string;
  generatedAt: string;
  period: string;
  status: string;
}

// ─── TENANTS ────────────────────────────────────────────────────────────────

export const tenants: Tenant[] = [
  {
    id: "ten-gov",
    name: "National Revenue Authority",
    sector: "Government",
    logo: null,
    primaryColor: "#1e40af",
    description: "The National Revenue Authority (NRA) is the primary tax collection and revenue management body responsible for fiscal policy implementation and compliance oversight across all public institutions.",
    totalUsers: 48,
    totalDepartments: 9,
  },
  {
    id: "ten-para",
    name: "Meridian Power & Utilities",
    sector: "Parastatal",
    logo: null,
    primaryColor: "#065f46",
    description: "Meridian Power & Utilities is a state-owned enterprise responsible for national electricity generation, transmission, and distribution infrastructure, serving both industrial and residential consumers.",
    totalUsers: 63,
    totalDepartments: 10,
  },
  {
    id: "ten-priv",
    name: "Apex Financial Services Group",
    sector: "Private Sector",
    logo: null,
    primaryColor: "#7c2d12",
    description: "Apex Financial Services Group is a leading private-sector financial institution offering banking, insurance, and investment management services, regulated under national financial services legislation.",
    totalUsers: 112,
    totalDepartments: 11,
  },
];

// ─── DEPARTMENTS ─────────────────────────────────────────────────────────────

export const departments: Department[] = [
  // GOV departments
  { id: "dep-gov-1", tenantId: "ten-gov", name: "Corporate Affairs", head: "Director Amara Sesay", description: "Oversees governance, board secretarial functions, stakeholder relations, and regulatory compliance filings.", totalRisks: 12, totalControls: 14, highRiskCount: 3, overdueCount: 2, complianceRate: 82, status: "At Risk" },
  { id: "dep-gov-2", tenantId: "ten-gov", name: "Human Capital & Administration", head: "Director Fatima Koroma", description: "Manages human resources, payroll, staff welfare, training programmes, and organisational development.", totalRisks: 9, totalControls: 11, highRiskCount: 2, overdueCount: 1, complianceRate: 87, status: "On Track" },
  { id: "dep-gov-3", tenantId: "ten-gov", name: "Finance & Procurement", head: "Director Mohamed Bangura", description: "Handles all financial reporting, budgeting, audit liaison, and public procurement in accordance with PFMA requirements.", totalRisks: 15, totalControls: 17, highRiskCount: 5, overdueCount: 4, complianceRate: 71, status: "Critical" },
  { id: "dep-gov-4", tenantId: "ten-gov", name: "Strategy & Planning", head: "Director Isatu Turay", description: "Leads corporate strategy, performance monitoring, and strategic risk assessment across the organisation.", totalRisks: 7, totalControls: 9, highRiskCount: 1, overdueCount: 0, complianceRate: 94, status: "On Track" },
  { id: "dep-gov-5", tenantId: "ten-gov", name: "Digital Transformation", head: "Director Samuel Conteh", description: "Drives ICT strategy, digital systems implementation, cybersecurity governance, and technology innovation.", totalRisks: 11, totalControls: 13, highRiskCount: 4, overdueCount: 3, complianceRate: 74, status: "At Risk" },
  { id: "dep-gov-6", tenantId: "ten-gov", name: "Legal Secretariat", head: "Director Mariama Jalloh", description: "Provides legal advisory services, manages litigation, and ensures regulatory and statutory compliance.", totalRisks: 6, totalControls: 8, highRiskCount: 1, overdueCount: 1, complianceRate: 88, status: "On Track" },
  { id: "dep-gov-7", tenantId: "ten-gov", name: "Ethics & Standards Compliance", head: "Director Paul Kamara", description: "Oversees the implementation of the code of conduct, ethics policies, and whistleblower protection mechanisms.", totalRisks: 8, totalControls: 10, highRiskCount: 2, overdueCount: 2, complianceRate: 79, status: "At Risk" },
  { id: "dep-gov-8", tenantId: "ten-gov", name: "Risk & Internal Audit", head: "Director Adama Kanneh", description: "Provides independent assurance on internal controls, risk management processes, and governance frameworks.", totalRisks: 5, totalControls: 7, highRiskCount: 0, overdueCount: 0, complianceRate: 97, status: "On Track" },
  { id: "dep-gov-9", tenantId: "ten-gov", name: "Teaching & Professional Services", head: "Director Hawa Koroma", description: "Delivers capacity building, professional development, and knowledge management initiatives for staff.", totalRisks: 4, totalControls: 5, highRiskCount: 1, overdueCount: 1, complianceRate: 80, status: "At Risk" },

  // PARA departments
  { id: "dep-para-1", tenantId: "ten-para", name: "Generation & Operations", head: "Eng. David Mensah", description: "Manages power generation assets including thermal, hydro, and renewable energy plants across national grid.", totalRisks: 18, totalControls: 20, highRiskCount: 6, overdueCount: 5, complianceRate: 68, status: "Critical" },
  { id: "dep-para-2", tenantId: "ten-para", name: "Transmission Network", head: "Eng. Abena Owusu", description: "Responsible for high-voltage transmission infrastructure, grid stability, and inter-regional power exchange.", totalRisks: 14, totalControls: 16, highRiskCount: 4, overdueCount: 3, complianceRate: 75, status: "At Risk" },
  { id: "dep-para-3", tenantId: "ten-para", name: "Customer & Commercial", head: "Director Kofi Asante", description: "Manages billing, metering, customer relations, revenue protection, and commercial partnerships.", totalRisks: 10, totalControls: 12, highRiskCount: 2, overdueCount: 2, complianceRate: 83, status: "On Track" },
  { id: "dep-para-4", tenantId: "ten-para", name: "Finance & Treasury", head: "Director Ama Boateng", description: "Oversees financial planning, treasury operations, government grant administration, and financial reporting.", totalRisks: 13, totalControls: 15, highRiskCount: 5, overdueCount: 4, complianceRate: 72, status: "At Risk" },
  { id: "dep-para-5", tenantId: "ten-para", name: "Human Resources", head: "Director Kwame Osei", description: "Manages workforce planning, industrial relations, employee welfare, and skills development programmes.", totalRisks: 7, totalControls: 9, highRiskCount: 1, overdueCount: 1, complianceRate: 89, status: "On Track" },
  { id: "dep-para-6", tenantId: "ten-para", name: "HSE & Environment", head: "Director Efua Donkoh", description: "Oversees health, safety, and environmental compliance across all operational sites and facilities.", totalRisks: 16, totalControls: 18, highRiskCount: 7, overdueCount: 5, complianceRate: 65, status: "Critical" },
  { id: "dep-para-7", tenantId: "ten-para", name: "ICT & Digital Infrastructure", head: "Director Nana Agyei", description: "Manages SCADA systems, operational technology, IT governance, and cybersecurity for critical infrastructure.", totalRisks: 12, totalControls: 14, highRiskCount: 4, overdueCount: 3, complianceRate: 77, status: "At Risk" },
  { id: "dep-para-8", tenantId: "ten-para", name: "Legal & Regulatory Affairs", head: "Director Akosua Frimpong", description: "Handles regulatory compliance, litigation management, licensing, and statutory reporting obligations.", totalRisks: 6, totalControls: 8, highRiskCount: 1, overdueCount: 1, complianceRate: 90, status: "On Track" },
  { id: "dep-para-9", tenantId: "ten-para", name: "Corporate Governance", head: "Director Yaw Adjei", description: "Oversees board governance, ethics, audit committee liaison, and enterprise risk framework implementation.", totalRisks: 5, totalControls: 7, highRiskCount: 0, overdueCount: 0, complianceRate: 96, status: "On Track" },
  { id: "dep-para-10", tenantId: "ten-para", name: "Supply Chain & Assets", head: "Director Cecilia Ansah", description: "Manages procurement, inventory, asset lifecycle, and contractor performance across the supply chain.", totalRisks: 9, totalControls: 11, highRiskCount: 3, overdueCount: 2, complianceRate: 81, status: "On Track" },

  // PRIV departments
  { id: "dep-priv-1", tenantId: "ten-priv", name: "Retail Banking", head: "Director James Okafor", description: "Manages consumer banking products, branch network, digital banking channels, and personal financial services.", totalRisks: 16, totalControls: 18, highRiskCount: 4, overdueCount: 3, complianceRate: 79, status: "At Risk" },
  { id: "dep-priv-2", tenantId: "ten-priv", name: "Corporate & Investment Banking", head: "Director Chisom Adeyemi", description: "Handles large-scale corporate lending, structured finance, capital markets advisory, and institutional relationships.", totalRisks: 19, totalControls: 22, highRiskCount: 7, overdueCount: 5, complianceRate: 72, status: "At Risk" },
  { id: "dep-priv-3", tenantId: "ten-priv", name: "Compliance & Regulatory", head: "Director Ngozi Eze", description: "Ensures adherence to AML/CFT obligations, financial regulations, and international reporting standards.", totalRisks: 14, totalControls: 16, highRiskCount: 5, overdueCount: 4, complianceRate: 75, status: "At Risk" },
  { id: "dep-priv-4", tenantId: "ten-priv", name: "Risk Management", head: "Director Emeka Nwosu", description: "Leads enterprise risk identification, credit risk modelling, market risk oversight, and operational risk management.", totalRisks: 11, totalControls: 13, highRiskCount: 2, overdueCount: 1, complianceRate: 88, status: "On Track" },
  { id: "dep-priv-5", tenantId: "ten-priv", name: "Finance & Treasury", head: "Director Adaeze Okonkwo", description: "Manages balance sheet, liquidity, capital adequacy, financial reporting, and investor relations.", totalRisks: 12, totalControls: 14, highRiskCount: 3, overdueCount: 2, complianceRate: 83, status: "On Track" },
  { id: "dep-priv-6", tenantId: "ten-priv", name: "Information Technology", head: "Director Taiwo Babatunde", description: "Oversees core banking systems, cybersecurity, data governance, and digital transformation initiatives.", totalRisks: 15, totalControls: 17, highRiskCount: 6, overdueCount: 4, complianceRate: 70, status: "At Risk" },
  { id: "dep-priv-7", tenantId: "ten-priv", name: "Human Resources", head: "Director Funmi Adesanya", description: "Manages talent acquisition, performance management, remuneration, and employee relations.", totalRisks: 6, totalControls: 8, highRiskCount: 1, overdueCount: 0, complianceRate: 92, status: "On Track" },
  { id: "dep-priv-8", tenantId: "ten-priv", name: "Insurance Division", head: "Director Chukwu Aniebo", description: "Oversees underwriting, claims management, actuarial functions, and insurance regulatory compliance.", totalRisks: 13, totalControls: 15, highRiskCount: 3, overdueCount: 3, complianceRate: 78, status: "At Risk" },
  { id: "dep-priv-9", tenantId: "ten-priv", name: "Legal & Secretariat", head: "Director Amara Obi", description: "Provides legal counsel, manages litigation, oversees company secretarial duties, and regulatory liaison.", totalRisks: 5, totalControls: 7, highRiskCount: 0, overdueCount: 0, complianceRate: 95, status: "On Track" },
  { id: "dep-priv-10", tenantId: "ten-priv", name: "Internal Audit", head: "Director Nkechi Osuji", description: "Conducts independent audits, reviews control effectiveness, and reports findings to the Audit Committee.", totalRisks: 4, totalControls: 6, highRiskCount: 0, overdueCount: 0, complianceRate: 98, status: "On Track" },
  { id: "dep-priv-11", tenantId: "ten-priv", name: "Digital Banking & Fintech", head: "Director Olumide Adegoke", description: "Drives digital product development, fintech partnerships, mobile banking, and open banking API strategy.", totalRisks: 10, totalControls: 12, highRiskCount: 3, overdueCount: 2, complianceRate: 80, status: "On Track" },
];

// ─── CONTROLS ────────────────────────────────────────────────────────────────

export const controls: Control[] = [
  // ── GOV CONTROLS ──
  {
    id: "ctl-gov-001", tenantId: "ten-gov", department: "Finance & Procurement", departmentId: "dep-gov-3",
    risk: "Procurement Fraud and Irregular Expenditure", riskId: "rsk-gov-001",
    control: "Segregation of Duties in Procurement Approval Workflow",
    controlOwner: "Director Mohamed Bangura", implementationDate: "2024-09-30",
    residualRiskScore: 14, withinAppetite: false, overallRiskLevel: "High", implementationStatus: "Overdue",
    lastReviewed: null, noteCount: 3, isEscalated: true, escalatedAt: "2025-05-15T09:22:00Z",
    riskDescription: "Risk of fraudulent procurement transactions, collusive tendering, and irregular expenditure that may result in financial loss and breach of Public Financial Management Act provisions.",
    controlDescription: "Implementation of a four-eyes approval principle requiring independent sign-off from two senior officers for all procurement transactions exceeding SLL 50 million, with full audit trail captured in the ERP system.",
    inherentRiskScore: 20,
  },
  {
    id: "ctl-gov-002", tenantId: "ten-gov", department: "Finance & Procurement", departmentId: "dep-gov-3",
    risk: "Inaccurate Financial Reporting and IFRS Non-Compliance", riskId: "rsk-gov-002",
    control: "Monthly Reconciliation and Financial Close Review",
    controlOwner: "Senior Accountant Ruth Bangura", implementationDate: "2025-03-31",
    residualRiskScore: 9, withinAppetite: true, overallRiskLevel: "Medium", implementationStatus: "In Progress",
    lastReviewed: "2025-05-01", noteCount: 1, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of material misstatements in financial statements due to inadequate reconciliation processes, resulting in qualified audit opinion and reputational harm.",
    controlDescription: "Structured monthly financial close process including trial balance reconciliation, variance analysis against budget, and CFO sign-off on management accounts before publication.",
    inherentRiskScore: 16,
  },
  {
    id: "ctl-gov-003", tenantId: "ten-gov", department: "Finance & Procurement", departmentId: "dep-gov-3",
    risk: "Undisclosed Conflicts of Interest in Tender Evaluation", riskId: "rsk-gov-003",
    control: "Mandatory Declaration of Interest by Tender Evaluation Committees",
    controlOwner: "Procurement Manager James Conteh", implementationDate: "2024-12-31",
    residualRiskScore: 16, withinAppetite: false, overallRiskLevel: "High", implementationStatus: "Overdue",
    lastReviewed: null, noteCount: 2, isEscalated: true, escalatedAt: "2025-05-22T14:15:00Z",
    riskDescription: "Risk that evaluation committee members with undisclosed interests influence procurement decisions, creating liability for the organisation and violating integrity standards.",
    controlDescription: "All tender evaluation committee members must complete a signed declaration of interest form prior to any evaluation. Members with conflicts must recuse themselves. Declarations filed with the Legal Secretariat.",
    inherentRiskScore: 20,
  },
  {
    id: "ctl-gov-004", tenantId: "ten-gov", department: "Digital Transformation", departmentId: "dep-gov-5",
    risk: "Cyber Intrusion on Core Revenue Management System", riskId: "rsk-gov-004",
    control: "Multi-Factor Authentication and Privileged Access Management",
    controlOwner: "CISO Lansana Kamara", implementationDate: "2025-06-30",
    residualRiskScore: 12, withinAppetite: false, overallRiskLevel: "High", implementationStatus: "In Progress",
    lastReviewed: "2025-04-15", noteCount: 4, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of unauthorised access to core revenue management systems, resulting in data exfiltration, system disruption, and compromise of taxpayer data.",
    controlDescription: "Deployment of MFA across all privileged accounts with quarterly access recertification reviews. Privileged access management (PAM) solution to enforce least-privilege principles and session recording.",
    inherentRiskScore: 18,
  },
  {
    id: "ctl-gov-005", tenantId: "ten-gov", department: "Digital Transformation", departmentId: "dep-gov-5",
    risk: "Unplanned System Downtime Affecting Revenue Collection", riskId: "rsk-gov-005",
    control: "Disaster Recovery Plan Testing and Business Continuity Readiness",
    controlOwner: "IT Manager Solomon Conteh", implementationDate: "2024-11-30",
    residualRiskScore: 10, withinAppetite: true, overallRiskLevel: "Medium", implementationStatus: "Overdue",
    lastReviewed: null, noteCount: 2, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of prolonged system outages during critical revenue collection periods (tax filing deadlines) due to inadequate recovery capabilities.",
    controlDescription: "Annual DR tabletop exercise and live failover test with documented RTO/RPO targets. Results reported to IT Steering Committee with corrective action plans for identified gaps.",
    inherentRiskScore: 16,
  },
  {
    id: "ctl-gov-006", tenantId: "ten-gov", department: "Corporate Affairs", departmentId: "dep-gov-1",
    risk: "Failure to Meet Statutory Regulatory Reporting Deadlines", riskId: "rsk-gov-006",
    control: "Regulatory Reporting Calendar and Escalation Protocol",
    controlOwner: "Company Secretary Hawa Turay", implementationDate: "2025-01-31",
    residualRiskScore: 7, withinAppetite: true, overallRiskLevel: "Medium", implementationStatus: "Implemented",
    lastReviewed: "2025-05-10", noteCount: 0, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of regulatory penalties and loss of operating licence due to late or incomplete submission of statutory reports to the supervising ministry and audit general.",
    controlDescription: "Comprehensive regulatory reporting calendar maintained by Company Secretary with automated reminders at 30, 14, and 7 days before each deadline. Escalation to Director level if submissions are at risk.",
    inherentRiskScore: 12,
  },
  {
    id: "ctl-gov-007", tenantId: "ten-gov", department: "Corporate Affairs", departmentId: "dep-gov-1",
    risk: "Board Meeting Procedural Non-Compliance", riskId: "rsk-gov-007",
    control: "Board Pack Preparation Standard and Quorum Verification",
    controlOwner: "Company Secretary Hawa Turay", implementationDate: "2024-10-31",
    residualRiskScore: 5, withinAppetite: true, overallRiskLevel: "Low", implementationStatus: "Implemented",
    lastReviewed: "2025-04-20", noteCount: 1, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of board resolutions being invalidated due to procedural errors including inadequate notice periods, quorum failures, and incomplete board packs.",
    controlDescription: "Standardised board pack template distributed no fewer than 5 working days before meetings. Quorum confirmed in writing by Company Secretary before resolutions are passed.",
    inherentRiskScore: 10,
  },
  {
    id: "ctl-gov-008", tenantId: "ten-gov", department: "Human Capital & Administration", departmentId: "dep-gov-2",
    risk: "Payroll Fraud and Ghost Employee Risk", riskId: "rsk-gov-008",
    control: "Biometric Attendance System and Payroll Reconciliation",
    controlOwner: "HR Manager Aminata Sesay", implementationDate: "2025-02-28",
    residualRiskScore: 8, withinAppetite: true, overallRiskLevel: "Medium", implementationStatus: "Implemented",
    lastReviewed: "2025-05-15", noteCount: 2, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of fictitious employees on payroll or attendance manipulation resulting in financial losses and violation of civil service regulations.",
    controlDescription: "Biometric clocking system cross-referenced against HR master file monthly. Payroll reconciliation signed off by HR Director and Finance Director before each pay run.",
    inherentRiskScore: 16,
  },
  {
    id: "ctl-gov-009", tenantId: "ten-gov", department: "Ethics & Standards Compliance", departmentId: "dep-gov-7",
    risk: "Corruption and Bribery in Tax Assessment Process", riskId: "rsk-gov-009",
    control: "Anonymous Whistleblower Hotline and Case Management System",
    controlOwner: "Director Paul Kamara", implementationDate: "2024-08-31",
    residualRiskScore: 13, withinAppetite: false, overallRiskLevel: "High", implementationStatus: "Overdue",
    lastReviewed: null, noteCount: 5, isEscalated: true, escalatedAt: "2025-04-30T11:00:00Z",
    riskDescription: "Risk of tax officials soliciting or accepting bribes to reduce assessments or overlook non-compliance, undermining revenue collection integrity and public trust.",
    controlDescription: "Independently managed whistleblower hotline accessible 24/7 with guaranteed anonymity. All cases logged, triaged within 48 hours, and referred to Internal Audit for investigation. Quarterly reporting to Board.",
    inherentRiskScore: 20,
  },
  {
    id: "ctl-gov-010", tenantId: "ten-gov", department: "Risk & Internal Audit", departmentId: "dep-gov-8",
    risk: "Ineffective Risk Register Maintenance", riskId: "rsk-gov-010",
    control: "Quarterly Enterprise Risk Register Review and Board Reporting",
    controlOwner: "Director Adama Kanneh", implementationDate: "2025-03-31",
    residualRiskScore: 4, withinAppetite: true, overallRiskLevel: "Low", implementationStatus: "Implemented",
    lastReviewed: "2025-05-30", noteCount: 0, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk that the enterprise risk register is not regularly updated, resulting in outdated risk ratings that fail to reflect current operating environment and emerging threats.",
    controlDescription: "Risk register reviewed quarterly by Risk & Internal Audit with mandatory input from all department heads. Summary presented to the Risk Committee and Board Risk Committee at each meeting.",
    inherentRiskScore: 10,
  },
  {
    id: "ctl-gov-011", tenantId: "ten-gov", department: "Strategy & Planning", departmentId: "dep-gov-4",
    risk: "Strategic Plan Misalignment with National Development Goals", riskId: "rsk-gov-011",
    control: "Annual Strategy Review and KPI Alignment Assessment",
    controlOwner: "Director Isatu Turay", implementationDate: "2024-12-31",
    residualRiskScore: 6, withinAppetite: true, overallRiskLevel: "Low", implementationStatus: "Implemented",
    lastReviewed: "2025-01-15", noteCount: 1, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk that NRA's strategic objectives diverge from national fiscal policy priorities, leading to resource misallocation and political accountability gaps.",
    controlDescription: "Annual strategic review workshop facilitated by external consultants aligning NRA objectives with Ministry of Finance policy directives. KPIs mapped to national development plan indicators.",
    inherentRiskScore: 12,
  },
  {
    id: "ctl-gov-012", tenantId: "ten-gov", department: "Legal Secretariat", departmentId: "dep-gov-6",
    risk: "Exposure to Material Litigation and Statutory Penalties", riskId: "rsk-gov-012",
    control: "Litigation Register and Legal Provision Review",
    controlOwner: "Director Mariama Jalloh", implementationDate: "2025-04-30",
    residualRiskScore: 8, withinAppetite: true, overallRiskLevel: "Medium", implementationStatus: "Awaiting Review",
    lastReviewed: "2025-03-01", noteCount: 1, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of unprovisioned litigation claims resulting in unexpected financial outflows and adverse judgments that damage organisational reputation.",
    controlDescription: "Centralised litigation register maintained by Legal Secretariat. All claims above SLL 5 million reviewed quarterly for provision adequacy with input from external legal counsel and Finance.",
    inherentRiskScore: 14,
  },

  // ── PARA CONTROLS ──
  {
    id: "ctl-para-001", tenantId: "ten-para", department: "Generation & Operations", departmentId: "dep-para-1",
    risk: "Major Plant Failure Causing Grid Collapse", riskId: "rsk-para-001",
    control: "Planned Preventive Maintenance Programme with Independent Inspection",
    controlOwner: "Eng. Charles Quaye", implementationDate: "2025-04-30",
    residualRiskScore: 15, withinAppetite: false, overallRiskLevel: "High", implementationStatus: "Overdue",
    lastReviewed: null, noteCount: 4, isEscalated: true, escalatedAt: "2025-05-20T08:00:00Z",
    riskDescription: "Risk of catastrophic equipment failure at key generation plant resulting in extended grid collapse, revenue loss exceeding USD 2M per day, and reputational damage.",
    controlDescription: "Quarterly preventive maintenance schedule for all generation assets above 50MW, with independent engineering inspection every six months. Maintenance logs reviewed by Operations Director monthly.",
    inherentRiskScore: 25,
  },
  {
    id: "ctl-para-002", tenantId: "ten-para", department: "HSE & Environment", departmentId: "dep-para-6",
    risk: "Occupational Fatality or Serious Injury at Operational Site", riskId: "rsk-para-002",
    control: "Permit to Work System and Safety Management System Audit",
    controlOwner: "HSE Manager Gloria Adu", implementationDate: "2024-10-31",
    residualRiskScore: 16, withinAppetite: false, overallRiskLevel: "High", implementationStatus: "Overdue",
    lastReviewed: null, noteCount: 6, isEscalated: true, escalatedAt: "2025-04-15T10:30:00Z",
    riskDescription: "Risk of fatality or life-changing injury to employees or contractors at high-voltage and high-heat operational sites due to inadequate safety management.",
    controlDescription: "Mandatory Permit to Work for all hot work, confined space entry, and electrical isolation activities. Safety Management System audited semi-annually against ISO 45001. Non-conformances closed within 30 days.",
    inherentRiskScore: 25,
  },
  {
    id: "ctl-para-003", tenantId: "ten-para", department: "Finance & Treasury", departmentId: "dep-para-4",
    risk: "Liquidity Crisis Due to Government Subsidy Arrears", riskId: "rsk-para-003",
    control: "Treasury Cash Flow Forecasting and Government Receivables Escalation",
    controlOwner: "Treasury Manager Abena Acheampong", implementationDate: "2025-01-31",
    residualRiskScore: 14, withinAppetite: false, overallRiskLevel: "High", implementationStatus: "In Progress",
    lastReviewed: "2025-04-01", noteCount: 3, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of liquidity shortfall due to extended delays in government subsidy disbursements, threatening operational continuity and debt service obligations.",
    controlDescription: "13-week rolling cash flow forecast reviewed weekly by Finance Director. Government receivables above 60 days automatically escalated to CEO for direct ministerial engagement.",
    inherentRiskScore: 20,
  },
  {
    id: "ctl-para-004", tenantId: "ten-para", department: "ICT & Digital Infrastructure", departmentId: "dep-para-7",
    risk: "SCADA Cyberattack on Critical Infrastructure", riskId: "rsk-para-004",
    control: "OT/IT Network Segmentation and SCADA Security Monitoring",
    controlOwner: "CISO Frederick Amponsah", implementationDate: "2025-06-30",
    residualRiskScore: 13, withinAppetite: false, overallRiskLevel: "High", implementationStatus: "In Progress",
    lastReviewed: "2025-03-15", noteCount: 5, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of nation-state or criminal cyber attack targeting SCADA systems controlling generation and transmission assets, with potential for widespread blackout.",
    controlDescription: "Physical and logical separation of OT and IT networks. 24/7 SCADA security monitoring via SOC. Annual penetration testing of OT environment by ICS-certified security firm.",
    inherentRiskScore: 22,
  },
  {
    id: "ctl-para-005", tenantId: "ten-para", department: "Transmission Network", departmentId: "dep-para-2",
    risk: "Transmission Line Sabotage or Vandalism", riskId: "rsk-para-005",
    control: "Infrastructure Security Surveillance and Community Engagement Programme",
    controlOwner: "Eng. Kwabena Mensah", implementationDate: "2024-12-31",
    residualRiskScore: 11, withinAppetite: false, overallRiskLevel: "High", implementationStatus: "Overdue",
    lastReviewed: null, noteCount: 2, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of intentional damage to transmission towers and conductors by communities or criminal elements, resulting in extended outages and significant repair costs.",
    controlDescription: "Drone surveillance of critical transmission corridors monthly. Community liaison officers deployed in high-risk zones. Rapid response protocol for incidents with 4-hour restoration target.",
    inherentRiskScore: 18,
  },
  {
    id: "ctl-para-006", tenantId: "ten-para", department: "Customer & Commercial", departmentId: "dep-para-3",
    risk: "High Commercial Loss and Electricity Theft", riskId: "rsk-para-006",
    control: "Smart Metering Rollout and Revenue Protection Field Operations",
    controlOwner: "Revenue Manager Josephine Adjei", implementationDate: "2025-09-30",
    residualRiskScore: 9, withinAppetite: true, overallRiskLevel: "Medium", implementationStatus: "Draft",
    lastReviewed: null, noteCount: 1, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of continued high commercial losses (currently 22% of units distributed) due to electricity theft, meter tampering, and billing anomalies.",
    controlDescription: "Phased deployment of AMI smart meters in all commercial and industrial customer segments by Q3 2025. Monthly revenue protection raids with Police support in high-loss areas.",
    inherentRiskScore: 16,
  },
  {
    id: "ctl-para-007", tenantId: "ten-para", department: "Corporate Governance", departmentId: "dep-para-9",
    risk: "Enterprise Risk Framework Not Embedded Across Business", riskId: "rsk-para-007",
    control: "Risk Appetite Statement Review and Departmental Risk Champion Programme",
    controlOwner: "Director Yaw Adjei", implementationDate: "2025-02-28",
    residualRiskScore: 4, withinAppetite: true, overallRiskLevel: "Low", implementationStatus: "Implemented",
    lastReviewed: "2025-05-25", noteCount: 0, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk that enterprise risk management is siloed in the governance function and not embedded across operational departments, limiting risk culture maturity.",
    controlDescription: "Annual review and Board approval of Risk Appetite Statement. Designated Risk Champions in each department trained quarterly. Enterprise risk framework compliance assessed annually.",
    inherentRiskScore: 12,
  },
  {
    id: "ctl-para-008", tenantId: "ten-para", department: "HSE & Environment", departmentId: "dep-para-6",
    risk: "Environmental Regulatory Breach at Generation Site", riskId: "rsk-para-008",
    control: "Continuous Emissions Monitoring and Environmental Compliance Reporting",
    controlOwner: "Environmental Officer Abena Sarpong", implementationDate: "2024-09-30",
    residualRiskScore: 14, withinAppetite: false, overallRiskLevel: "High", implementationStatus: "Overdue",
    lastReviewed: null, noteCount: 3, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of regulatory fines and operating licence suspension due to exceedance of permitted emission limits at thermal generation facilities.",
    controlDescription: "CEMS installed at all thermal plants reporting real-time data to EPA portal. Monthly compliance reports prepared by HSE team and reviewed by Director before submission to regulator.",
    inherentRiskScore: 20,
  },

  // ── PRIV CONTROLS ──
  {
    id: "ctl-priv-001", tenantId: "ten-priv", department: "Compliance & Regulatory", departmentId: "dep-priv-3",
    risk: "AML/CFT Programme Non-Compliance and Regulatory Sanction", riskId: "rsk-priv-001",
    control: "Enhanced Customer Due Diligence and Transaction Monitoring System",
    controlOwner: "MLRO Christine Abara", implementationDate: "2025-05-31",
    residualRiskScore: 14, withinAppetite: false, overallRiskLevel: "High", implementationStatus: "In Progress",
    lastReviewed: "2025-04-30", noteCount: 5, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of regulatory sanction, licence revocation, or criminal prosecution due to failure to implement adequate AML/CFT controls, particularly for high-risk customers and correspondent banking relationships.",
    controlDescription: "Automated transaction monitoring system with risk-based thresholds reviewed quarterly. Enhanced due diligence mandatory for PEPs, high-risk jurisdictions, and customers with complex ownership structures. SAR filing target: 100% within 24 hours.",
    inherentRiskScore: 22,
  },
  {
    id: "ctl-priv-002", tenantId: "ten-priv", department: "Corporate & Investment Banking", departmentId: "dep-priv-2",
    risk: "Credit Concentration Risk in Single-Sector Lending", riskId: "rsk-priv-002",
    control: "Sector Concentration Limits and Portfolio Stress Testing",
    controlOwner: "Director Emeka Nwosu", implementationDate: "2025-03-31",
    residualRiskScore: 13, withinAppetite: false, overallRiskLevel: "High", implementationStatus: "Awaiting Review",
    lastReviewed: "2025-02-28", noteCount: 2, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of material credit losses due to excessive lending concentration in the real estate and construction sector, particularly given current market pressures.",
    controlDescription: "Board-approved sector concentration limits set at 25% of total loan portfolio per sector. Quarterly stress test scenarios run against a 30% NPL increase in concentrated sectors. Results reviewed by Credit Committee.",
    inherentRiskScore: 18,
  },
  {
    id: "ctl-priv-003", tenantId: "ten-priv", department: "Information Technology", departmentId: "dep-priv-6",
    risk: "Core Banking System Breach and Data Exfiltration", riskId: "rsk-priv-003",
    control: "ISO 27001 Implementation and Annual Penetration Testing",
    controlOwner: "CISO Tunde Adebayo", implementationDate: "2024-11-30",
    residualRiskScore: 12, withinAppetite: false, overallRiskLevel: "High", implementationStatus: "Overdue",
    lastReviewed: null, noteCount: 4, isEscalated: true, escalatedAt: "2025-05-10T16:00:00Z",
    riskDescription: "Risk of unauthorised access to core banking systems resulting in customer data breach, financial loss, regulatory fine under data protection law, and reputational damage.",
    controlDescription: "ISO 27001 certification maintained with annual surveillance audit. External penetration test conducted annually with all critical findings remediated within 30 days. Security Operations Centre operational 24/7.",
    inherentRiskScore: 20,
  },
  {
    id: "ctl-priv-004", tenantId: "ten-priv", department: "Retail Banking", departmentId: "dep-priv-1",
    risk: "Digital Fraud and Unauthorized Account Takeover", riskId: "rsk-priv-004",
    control: "Behavioural Analytics Fraud Detection and Customer Authentication Controls",
    controlOwner: "Head of Fraud Risk Bola Oladele", implementationDate: "2025-04-30",
    residualRiskScore: 10, withinAppetite: true, overallRiskLevel: "Medium", implementationStatus: "In Progress",
    lastReviewed: "2025-05-01", noteCount: 3, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of financial losses and customer harm from digital banking fraud including SIM swap attacks, phishing, and account takeover targeting retail banking customers.",
    controlDescription: "Machine learning-based behavioural analytics engine monitoring all digital transactions. Step-up authentication for high-value transactions. Customer awareness campaigns quarterly. Fraud losses reviewed weekly by Retail Banking MD.",
    inherentRiskScore: 16,
  },
  {
    id: "ctl-priv-005", tenantId: "ten-priv", department: "Finance & Treasury", departmentId: "dep-priv-5",
    risk: "Capital Adequacy Ratio Below Regulatory Minimum", riskId: "rsk-priv-005",
    control: "ICAAP and Monthly Capital Monitoring Against Regulatory Thresholds",
    controlOwner: "Director Adaeze Okonkwo", implementationDate: "2025-01-31",
    residualRiskScore: 7, withinAppetite: true, overallRiskLevel: "Medium", implementationStatus: "Implemented",
    lastReviewed: "2025-05-31", noteCount: 1, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of capital ratio falling below the 13% regulatory minimum set by the Central Bank, triggering supervisory intervention and restrictions on business activities.",
    controlDescription: "Internal Capital Adequacy Assessment Process (ICAAP) conducted annually and submitted to Central Bank. Monthly capital monitoring dashboard reviewed by Board Risk Committee with early warning triggers at 15% CAR.",
    inherentRiskScore: 14,
  },
  {
    id: "ctl-priv-006", tenantId: "ten-priv", department: "Insurance Division", departmentId: "dep-priv-8",
    risk: "Inadequate Claims Reserving and Actuarial Accuracy", riskId: "rsk-priv-006",
    control: "Independent Actuarial Review and Claims Reserve Adequacy Testing",
    controlOwner: "Chief Actuary Patrick Aniebo", implementationDate: "2025-06-30",
    residualRiskScore: 11, withinAppetite: false, overallRiskLevel: "High", implementationStatus: "Draft",
    lastReviewed: null, noteCount: 2, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of insufficient technical reserves for outstanding claims leading to solvency concerns, regulatory intervention, and inability to honour policyholder obligations.",
    controlDescription: "Bi-annual independent actuarial review of all reserve adequacy including IBNR. Results presented to Insurance Board with remediation plan for any identified deficiency exceeding 10% of required reserves.",
    inherentRiskScore: 18,
  },
  {
    id: "ctl-priv-007", tenantId: "ten-priv", department: "Compliance & Regulatory", departmentId: "dep-priv-3",
    risk: "IFRS 9 Provisioning Model Inaccuracies", riskId: "rsk-priv-007",
    control: "ECL Model Validation and Back-Testing Framework",
    controlOwner: "Head of Model Risk Uche Nwankwo", implementationDate: "2025-04-30",
    residualRiskScore: 9, withinAppetite: true, overallRiskLevel: "Medium", implementationStatus: "Awaiting Review",
    lastReviewed: "2025-03-31", noteCount: 2, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of material misstatement in Expected Credit Loss provisions due to model weaknesses, inadequate back-testing, or incorrect staging criteria under IFRS 9.",
    controlDescription: "Annual model validation of ECL model by independent Model Risk team. Quarterly back-testing results reviewed by the Credit Risk Committee. Model overlays documented and approved by CFO when material.",
    inherentRiskScore: 14,
  },
  {
    id: "ctl-priv-008", tenantId: "ten-priv", department: "Human Resources", departmentId: "dep-priv-7",
    risk: "Loss of Critical Skilled Personnel and Key Person Dependency", riskId: "rsk-priv-008",
    control: "Succession Planning and Critical Role Coverage Assessment",
    controlOwner: "Director Funmi Adesanya", implementationDate: "2024-12-31",
    residualRiskScore: 6, withinAppetite: true, overallRiskLevel: "Low", implementationStatus: "Implemented",
    lastReviewed: "2025-03-31", noteCount: 1, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of operational disruption and loss of institutional knowledge due to departure of key technical or leadership personnel without adequate succession plans.",
    controlDescription: "Succession plans documented for all roles graded M5 and above. Annual talent review with Board Remuneration Committee. At least one identified successor for each critical role with personal development plan.",
    inherentRiskScore: 12,
  },
  {
    id: "ctl-priv-009", tenantId: "ten-priv", department: "Digital Banking & Fintech", departmentId: "dep-priv-11",
    risk: "Third-Party Fintech Partner Failure or Data Breach", riskId: "rsk-priv-009",
    control: "Third-Party Risk Management Framework and API Security Review",
    controlOwner: "Director Olumide Adegoke", implementationDate: "2025-05-31",
    residualRiskScore: 10, withinAppetite: true, overallRiskLevel: "Medium", implementationStatus: "In Progress",
    lastReviewed: "2025-04-15", noteCount: 2, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk of operational or data security incidents arising from inadequate oversight of third-party fintech partners accessing customer data through open banking APIs.",
    controlDescription: "TPRM framework applied to all fintech partners before onboarding. Annual security reviews including API penetration testing. Data processing agreements in place. Real-time API usage monitoring with anomaly alerts.",
    inherentRiskScore: 16,
  },
  {
    id: "ctl-priv-010", tenantId: "ten-priv", department: "Internal Audit", departmentId: "dep-priv-10",
    risk: "Inadequate Audit Coverage of High-Risk Business Areas", riskId: "rsk-priv-010",
    control: "Risk-Based Annual Internal Audit Plan with Quarterly Board Reporting",
    controlOwner: "Director Nkechi Osuji", implementationDate: "2024-12-31",
    residualRiskScore: 3, withinAppetite: true, overallRiskLevel: "Low", implementationStatus: "Implemented",
    lastReviewed: "2025-05-30", noteCount: 0, isEscalated: false, escalatedAt: null,
    riskDescription: "Risk that internal audit coverage is insufficient to provide the Board with adequate assurance over high-risk business activities, particularly in fast-growing digital banking segments.",
    controlDescription: "Annual audit plan approved by Audit Committee using risk-based methodology. All high-risk areas audited at minimum annually. Audit results and management responses presented to Audit Committee quarterly.",
    inherentRiskScore: 10,
  },
];

// ─── NOTES ───────────────────────────────────────────────────────────────────

export const notes: Note[] = [
  {
    id: "note-001", controlId: "ctl-gov-001", content: "Escalated to Commissioner level following failure to implement after two extended deadlines. External procurement consultant engaged to review the workflow design. Expected completion now Q3 2025.", author: "Director Mohamed Bangura", createdAt: "2025-05-16T10:30:00Z",
  },
  {
    id: "note-002", controlId: "ctl-gov-001", content: "Vendor for ERP module upgrade has been contracted. Integration testing scheduled for week commencing 9 June 2025.", author: "Procurement Manager James Conteh", createdAt: "2025-05-28T14:00:00Z",
  },
  {
    id: "note-003", controlId: "ctl-gov-001", content: "Noted that IT infrastructure upgrade is a prerequisite. IT have confirmed priority allocation. Requesting weekly progress update from CISO.", author: "Director Adama Kanneh", createdAt: "2025-06-02T09:15:00Z",
  },
  {
    id: "note-004", controlId: "ctl-gov-004", content: "MFA rolled out to 78% of privileged accounts. Remaining 22% are legacy system accounts requiring custom integration. Vendor engaged.", author: "CISO Lansana Kamara", createdAt: "2025-05-10T11:00:00Z",
  },
  {
    id: "note-005", controlId: "ctl-gov-004", content: "PAM solution vendor shortlist finalised. Board approval for CapEx pending next meeting.", author: "Director Samuel Conteh", createdAt: "2025-05-20T15:30:00Z",
  },
  {
    id: "note-006", controlId: "ctl-gov-009", content: "Whistleblower portal had a 72-hour outage in April. Root cause identified as hosting provider maintenance without adequate notice. Failover procedures now documented.", author: "Director Paul Kamara", createdAt: "2025-04-25T08:00:00Z",
  },
  {
    id: "note-007", controlId: "ctl-para-001", content: "Unit 3 turbine preventive maintenance missed due to contractor unavailability. Emergency maintenance scheduled for 14 June 2025. Risk accepted by Operations Director pending resolution.", author: "Eng. Charles Quaye", createdAt: "2025-05-21T09:00:00Z",
  },
  {
    id: "note-008", controlId: "ctl-priv-001", content: "Transaction monitoring system upgrade completed. New typology rules added covering crypto-to-fiat conversions and layering patterns. Effectiveness review scheduled for September 2025.", author: "MLRO Christine Abara", createdAt: "2025-05-15T14:00:00Z",
  },
  {
    id: "note-009", controlId: "ctl-priv-003", content: "Penetration test findings received. Two critical vulnerabilities identified in API gateway. Patch deployment in progress — target completion 20 June 2025. CEO notified.", author: "CISO Tunde Adebayo", createdAt: "2025-05-12T10:00:00Z",
  },
];

// ─── TIMELINES ────────────────────────────────────────────────────────────────

export const timelines: TimelineEntry[] = [
  { id: "tl-001", controlId: "ctl-gov-001", action: "Control Created", actor: "Director Adama Kanneh", timestamp: "2024-06-15T09:00:00Z", description: "Control added to enterprise risk register following Q2 risk assessment.", result: "Completed" },
  { id: "tl-002", controlId: "ctl-gov-001", action: "Implementation Deadline Extended", actor: "Director Mohamed Bangura", timestamp: "2024-09-28T11:30:00Z", description: "Implementation deadline extended from September to December 2024 due to ERP migration delays.", result: "Approved" },
  { id: "tl-003", controlId: "ctl-gov-001", action: "Implementation Deadline Extended", actor: "Commissioner James Turay", timestamp: "2024-12-30T14:00:00Z", description: "Second deadline extension granted to Q2 2025 subject to monthly progress reporting.", result: "Conditionally Approved" },
  { id: "tl-004", controlId: "ctl-gov-001", action: "Escalated", actor: "Director Adama Kanneh", timestamp: "2025-05-15T09:22:00Z", description: "Control escalated to Commissioner level after third missed deadline. External consultant appointed.", result: "Escalated" },
  { id: "tl-005", controlId: "ctl-gov-004", action: "Control Created", actor: "CISO Lansana Kamara", timestamp: "2024-12-01T10:00:00Z", description: "Control established following cybersecurity risk assessment recommendation.", result: "Completed" },
  { id: "tl-006", controlId: "ctl-gov-004", action: "Progress Update", actor: "CISO Lansana Kamara", timestamp: "2025-04-15T11:00:00Z", description: "MFA rollout at 78% completion. Legacy system integration in progress.", result: "In Progress" },
  { id: "tl-007", controlId: "ctl-para-001", action: "Control Created", actor: "Eng. David Mensah", timestamp: "2024-03-10T09:00:00Z", description: "Preventive maintenance programme established as part of asset management framework.", result: "Completed" },
  { id: "tl-008", controlId: "ctl-para-001", action: "Missed Maintenance Cycle", actor: "Eng. Charles Quaye", timestamp: "2025-05-15T14:00:00Z", description: "Q2 maintenance for Unit 3 missed due to contractor unavailability. Risk flagged to Operations Director.", result: "Non-Conformance" },
  { id: "tl-009", controlId: "ctl-para-001", action: "Escalated", actor: "Eng. David Mensah", timestamp: "2025-05-20T08:00:00Z", description: "Escalated to Board following consecutive maintenance failures on critical generation assets.", result: "Escalated" },
  { id: "tl-010", controlId: "ctl-priv-003", action: "Control Created", actor: "Director Nkechi Osuji", timestamp: "2024-03-15T10:00:00Z", description: "ISO 27001 implementation control added to risk register.", result: "Completed" },
  { id: "tl-011", controlId: "ctl-priv-003", action: "Penetration Test Commissioned", actor: "CISO Tunde Adebayo", timestamp: "2024-11-01T09:00:00Z", description: "Annual penetration test commenced with external security firm.", result: "In Progress" },
  { id: "tl-012", controlId: "ctl-priv-003", action: "Critical Findings Identified", actor: "CISO Tunde Adebayo", timestamp: "2025-05-10T16:00:00Z", description: "Two critical API vulnerabilities found. Remediation underway.", result: "Action Required" },
  { id: "tl-013", controlId: "ctl-priv-003", action: "Escalated", actor: "Director Nkechi Osuji", timestamp: "2025-05-10T17:00:00Z", description: "Escalated to CEO given criticality of findings in core banking API.", result: "Escalated" },
];

// ─── AUDIT LOG ────────────────────────────────────────────────────────────────

export const auditLog: AuditEntry[] = [
  // GOV
  { id: "aud-gov-001", tenantId: "ten-gov", actor: "Director Adama Kanneh", actorRole: "Risk Manager", action: "Escalated Control", item: "Segregation of Duties in Procurement", itemId: "ctl-gov-001", timestamp: "2025-05-15T09:22:00Z", result: "Success", details: "Escalated to Commissioner level. External consultant appointed." },
  { id: "aud-gov-002", tenantId: "ten-gov", actor: "Director Paul Kamara", actorRole: "Department Owner", action: "Added Note", item: "Anonymous Whistleblower Hotline", itemId: "ctl-gov-009", timestamp: "2025-04-25T08:00:00Z", result: "Success", details: "Portal outage root cause documented. Failover procedures updated." },
  { id: "aud-gov-003", tenantId: "ten-gov", actor: "CISO Lansana Kamara", actorRole: "Risk Manager", action: "Updated Control Status", item: "Multi-Factor Authentication Implementation", itemId: "ctl-gov-004", timestamp: "2025-05-10T11:00:00Z", result: "Success", details: "Status updated to In Progress. 78% completion noted." },
  { id: "aud-gov-004", tenantId: "ten-gov", actor: "Director Mohamed Bangura", actorRole: "Department Owner", action: "Assigned Owner", item: "Monthly Reconciliation and Financial Close Review", itemId: "ctl-gov-002", timestamp: "2025-04-01T14:30:00Z", result: "Success", details: "Ownership transferred to Senior Accountant Ruth Bangura." },
  { id: "aud-gov-005", tenantId: "ten-gov", actor: "Company Secretary Hawa Turay", actorRole: "Department Owner", action: "Marked Complete", item: "Regulatory Reporting Calendar", itemId: "ctl-gov-006", timestamp: "2025-05-10T09:00:00Z", result: "Success", details: "Control fully implemented. Q1 and Q2 reports submitted on time." },
  { id: "aud-gov-006", tenantId: "ten-gov", actor: "Director Adama Kanneh", actorRole: "Risk Manager", action: "Reviewed Control", item: "Quarterly Enterprise Risk Register Review", itemId: "ctl-gov-010", timestamp: "2025-05-30T16:00:00Z", result: "Success", details: "Q2 risk register review completed. Board summary prepared." },
  { id: "aud-gov-007", tenantId: "ten-gov", actor: "Director Mariama Jalloh", actorRole: "Department Owner", action: "Updated Status to Awaiting Review", item: "Litigation Register and Legal Provision Review", itemId: "ctl-gov-012", timestamp: "2025-05-01T11:00:00Z", result: "Success", details: "Q1 litigation review completed. Awaiting Finance sign-off on provisions." },
  { id: "aud-gov-008", tenantId: "ten-gov", actor: "Director Isatu Turay", actorRole: "Department Owner", action: "Marked Complete", item: "Annual Strategy Review and KPI Alignment Assessment", itemId: "ctl-gov-011", timestamp: "2025-01-15T10:00:00Z", result: "Success", details: "Strategy alignment review completed and endorsed by Board." },

  // PARA
  { id: "aud-para-001", tenantId: "ten-para", actor: "Eng. David Mensah", actorRole: "Department Owner", action: "Escalated Control", item: "Planned Preventive Maintenance Programme", itemId: "ctl-para-001", timestamp: "2025-05-20T08:00:00Z", result: "Success", details: "Escalated to Board. Unit 3 maintenance failure constitutes critical risk event." },
  { id: "aud-para-002", tenantId: "ten-para", actor: "Gloria Adu", actorRole: "Department Owner", action: "Added Note", item: "Permit to Work System", itemId: "ctl-para-002", timestamp: "2025-04-15T10:30:00Z", result: "Success", details: "Semi-annual ISO 45001 audit findings reviewed. 7 non-conformances identified." },
  { id: "aud-para-003", tenantId: "ten-para", actor: "Director Yaw Adjei", actorRole: "Risk Manager", action: "Marked Complete", item: "Risk Appetite Statement Review", itemId: "ctl-para-007", timestamp: "2025-05-25T14:00:00Z", result: "Success", details: "FY2026 Risk Appetite Statement approved by Board on 24 May 2025." },
  { id: "aud-para-004", tenantId: "ten-para", actor: "Frederick Amponsah", actorRole: "Risk Manager", action: "Updated Control Status", item: "SCADA Cyberattack Controls", itemId: "ctl-para-004", timestamp: "2025-03-15T09:00:00Z", result: "Success", details: "OT/IT network segmentation 60% complete. SOC monitoring live." },
  { id: "aud-para-005", tenantId: "ten-para", actor: "Abena Acheampong", actorRole: "Department Owner", action: "Added Note", item: "Treasury Cash Flow Forecasting", itemId: "ctl-para-003", timestamp: "2025-04-01T11:30:00Z", result: "Success", details: "Government subsidy arrears now at GHS 45M. Ministerial escalation letter sent by CEO." },

  // PRIV
  { id: "aud-priv-001", tenantId: "ten-priv", actor: "CISO Tunde Adebayo", actorRole: "Department Owner", action: "Escalated Control", item: "ISO 27001 and Annual Penetration Testing", itemId: "ctl-priv-003", timestamp: "2025-05-10T17:00:00Z", result: "Success", details: "Critical API vulnerabilities escalated to CEO. Remediation plan approved." },
  { id: "aud-priv-002", tenantId: "ten-priv", actor: "MLRO Christine Abara", actorRole: "Department Owner", action: "Added Note", item: "Enhanced Customer Due Diligence", itemId: "ctl-priv-001", timestamp: "2025-05-15T14:00:00Z", result: "Success", details: "Transaction monitoring upgrade deployed. New typology rules active." },
  { id: "aud-priv-003", tenantId: "ten-priv", actor: "Director Adaeze Okonkwo", actorRole: "Department Owner", action: "Marked Complete", item: "ICAAP and Monthly Capital Monitoring", itemId: "ctl-priv-005", timestamp: "2025-01-31T15:00:00Z", result: "Success", details: "ICAAP 2025 submitted to Central Bank. CAR at 17.2%, well above 13% minimum." },
  { id: "aud-priv-004", tenantId: "ten-priv", actor: "Director Emeka Nwosu", actorRole: "Risk Manager", action: "Updated Status to Awaiting Review", item: "Sector Concentration Limits", itemId: "ctl-priv-002", timestamp: "2025-02-28T10:00:00Z", result: "Success", details: "Q4 stress test results prepared. Real estate exposure at 23% of book." },
  { id: "aud-priv-005", tenantId: "ten-priv", actor: "Director Funmi Adesanya", actorRole: "Department Owner", action: "Marked Complete", item: "Succession Planning", itemId: "ctl-priv-008", timestamp: "2024-12-31T16:00:00Z", result: "Success", details: "Succession plans documented for all M5+ roles. Talent review completed." },
  { id: "aud-priv-006", tenantId: "ten-priv", actor: "Director Nkechi Osuji", actorRole: "Risk Manager", action: "Reviewed Control", item: "Risk-Based Annual Internal Audit Plan", itemId: "ctl-priv-010", timestamp: "2025-05-30T14:00:00Z", result: "Success", details: "Q2 audit plan execution 82% complete. Two additional reviews added for Digital Banking." },
];

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────────

export const activityFeed: ActivityEntry[] = [
  { id: "act-001", tenantId: "ten-gov", actor: "Director Adama Kanneh", actorRole: "Risk Manager", action: "Escalated", item: "Segregation of Duties in Procurement", itemId: "ctl-gov-001", timestamp: "2025-05-15T09:22:00Z", result: "Escalated to Commissioner", severity: "critical" },
  { id: "act-002", tenantId: "ten-gov", actor: "CISO Lansana Kamara", actorRole: "Risk Manager", action: "Updated Status", item: "MFA Implementation", itemId: "ctl-gov-004", timestamp: "2025-05-10T11:00:00Z", result: "In Progress", severity: "medium" },
  { id: "act-003", tenantId: "ten-gov", actor: "Company Secretary Hawa Turay", actorRole: "Department Owner", action: "Marked Complete", item: "Regulatory Reporting Calendar", itemId: "ctl-gov-006", timestamp: "2025-05-10T09:00:00Z", result: "Implemented", severity: "low" },
  { id: "act-004", tenantId: "ten-gov", actor: "Director Adama Kanneh", actorRole: "Risk Manager", action: "Reviewed", item: "Enterprise Risk Register", itemId: "ctl-gov-010", timestamp: "2025-05-30T16:00:00Z", result: "Reviewed & Updated", severity: "low" },
  { id: "act-005", tenantId: "ten-gov", actor: "Director Paul Kamara", actorRole: "Department Owner", action: "Added Note", item: "Whistleblower Hotline", itemId: "ctl-gov-009", timestamp: "2025-04-25T08:00:00Z", result: "Note Added", severity: "medium" },
  { id: "act-006", tenantId: "ten-para", actor: "Eng. David Mensah", actorRole: "Department Owner", action: "Escalated", item: "Preventive Maintenance Programme", itemId: "ctl-para-001", timestamp: "2025-05-20T08:00:00Z", result: "Escalated to Board", severity: "critical" },
  { id: "act-007", tenantId: "ten-para", actor: "Director Yaw Adjei", actorRole: "Risk Manager", action: "Marked Complete", item: "Risk Appetite Statement Review", itemId: "ctl-para-007", timestamp: "2025-05-25T14:00:00Z", result: "Implemented", severity: "low" },
  { id: "act-008", tenantId: "ten-para", actor: "Abena Acheampong", actorRole: "Department Owner", action: "Added Note", item: "Treasury Cash Flow Forecasting", itemId: "ctl-para-003", timestamp: "2025-04-01T11:30:00Z", result: "Note Added", severity: "high" },
  { id: "act-009", tenantId: "ten-priv", actor: "CISO Tunde Adebayo", actorRole: "Department Owner", action: "Escalated", item: "ISO 27001 Penetration Testing", itemId: "ctl-priv-003", timestamp: "2025-05-10T17:00:00Z", result: "Escalated to CEO", severity: "critical" },
  { id: "act-010", tenantId: "ten-priv", actor: "MLRO Christine Abara", actorRole: "Department Owner", action: "Added Note", item: "Enhanced Customer Due Diligence", itemId: "ctl-priv-001", timestamp: "2025-05-15T14:00:00Z", result: "Note Added", severity: "medium" },
  { id: "act-011", tenantId: "ten-priv", actor: "Director Adaeze Okonkwo", actorRole: "Department Owner", action: "Marked Complete", item: "ICAAP and Capital Monitoring", itemId: "ctl-priv-005", timestamp: "2025-01-31T15:00:00Z", result: "Implemented", severity: "low" },
  { id: "act-012", tenantId: "ten-priv", actor: "Director Nkechi Osuji", actorRole: "Risk Manager", action: "Reviewed", item: "Annual Internal Audit Plan", itemId: "ctl-priv-010", timestamp: "2025-05-30T14:00:00Z", result: "Reviewed", severity: "low" },
];

// ─── USERS ────────────────────────────────────────────────────────────────────

export const users: User[] = [
  // GOV
  // GOV
  { id: "usr-gov-001", tenantId: "ten-gov", name: "Commissioner James Turay", email: "j.turay@nra.gov.bw", role: "Executive Management", department: "Executive Office", avatar: null, lastActive: "2025-06-16T08:30:00Z" },
  { id: "usr-gov-002", tenantId: "ten-gov", name: "Director Adama Kanneh", email: "a.kanneh@nra.gov.bw", role: "Manager - Risk and Compliance", department: "Risk & Internal Audit", avatar: null, lastActive: "2025-06-16T09:15:00Z" },
  { id: "usr-gov-003", tenantId: "ten-gov", name: "Director Mohamed Bangura", email: "m.bangura@nra.gov.bw", role: "Director / Head of Department", department: "Finance & Procurement", avatar: null, lastActive: "2025-06-15T16:45:00Z" },
  { id: "usr-gov-004", tenantId: "ten-gov", name: "Director Fatima Koroma", email: "f.koroma@nra.gov.bw", role: "Director / Head of Department", department: "Human Capital & Administration", avatar: null, lastActive: "2025-06-14T11:00:00Z" },
  { id: "usr-gov-005", tenantId: "ten-gov", name: "Lansana Kamara", email: "l.kamara@nra.gov.bw", role: "Risk Champion", department: "Digital Transformation", avatar: null, lastActive: "2025-06-16T07:50:00Z" },
  // PARA
  { id: "usr-para-001", tenantId: "ten-para", name: "CEO Patricia Asante", email: "p.asante@meridianpower.co.bw", role: "Executive Management", department: "Executive Office", avatar: null, lastActive: "2025-06-16T08:00:00Z" },
  { id: "usr-para-002", tenantId: "ten-para", name: "Director Yaw Adjei", email: "y.adjei@meridianpower.co.bw", role: "Manager - Risk and Compliance", department: "Corporate Governance", avatar: null, lastActive: "2025-06-16T09:30:00Z" },
  { id: "usr-para-003", tenantId: "ten-para", name: "Eng. David Mensah", email: "d.mensah@meridianpower.co.bw", role: "Director / Head of Department", department: "Generation & Operations", avatar: null, lastActive: "2025-06-16T06:15:00Z" },
  { id: "usr-para-004", tenantId: "ten-para", name: "Director Efua Donkoh", email: "e.donkoh@meridianpower.co.bw", role: "Risk Owner", department: "HSE & Environment", avatar: null, lastActive: "2025-06-15T17:30:00Z" },
  { id: "usr-para-005", tenantId: "ten-para", name: "Frederick Amponsah", email: "f.amponsah@meridianpower.co.bw", role: "Risk Champion", department: "ICT & Digital Infrastructure", avatar: null, lastActive: "2025-06-16T08:45:00Z" },
  // PRIV
  { id: "usr-priv-001", tenantId: "ten-priv", name: "Group CEO Chidi Okonkwo", email: "c.okonkwo@apexfinancial.co.bw", role: "Executive Management", department: "Group Executive", avatar: null, lastActive: "2025-06-16T07:00:00Z" },
  { id: "usr-priv-002", tenantId: "ten-priv", name: "Director Emeka Nwosu", email: "e.nwosu@apexfinancial.co.bw", role: "Manager - Risk and Compliance", department: "Risk Management", avatar: null, lastActive: "2025-06-16T09:00:00Z" },
  { id: "usr-priv-003", tenantId: "ten-priv", name: "Christine Abara", email: "c.abara@apexfinancial.co.bw", role: "Risk Champion", department: "Compliance & Regulatory", avatar: null, lastActive: "2025-06-16T08:30:00Z" },
  { id: "usr-priv-004", tenantId: "ten-priv", name: "Tunde Adebayo", email: "t.adebayo@apexfinancial.co.bw", role: "Risk Owner", department: "Information Technology", avatar: null, lastActive: "2025-06-16T07:45:00Z" },
  { id: "usr-priv-005", tenantId: "ten-priv", name: "Director Nkechi Osuji", email: "n.osuji@apexfinancial.co.bw", role: "Director / Head of Department", department: "Internal Audit", avatar: null, lastActive: "2025-06-15T16:00:00Z" },
];

// ─── REPORTS ──────────────────────────────────────────────────────────────────

export const reports: Report[] = [
  // GOV
  { id: "rep-gov-001", tenantId: "ten-gov", title: "Monthly Risk Summary — May 2025", type: "monthly_risk_summary", description: "Executive summary of risk register status, key movements, and management actions for May 2025.", generatedAt: "2025-06-01T08:00:00Z", period: "May 2025", status: "Final" },
  { id: "rep-gov-002", tenantId: "ten-gov", title: "Appetite Breach Report — Q2 FY2025", type: "appetite_breach", description: "Detailed analysis of all controls where residual risk exceeds the approved appetite threshold, with escalation status and remediation timelines.", generatedAt: "2025-06-10T10:00:00Z", period: "Q2 FY2025", status: "Final" },
  { id: "rep-gov-003", tenantId: "ten-gov", title: "Overdue Controls Report — June 2025", type: "overdue_controls", description: "Comprehensive listing of all controls past their implementation deadline, with accountable officers and escalation history.", generatedAt: "2025-06-14T09:00:00Z", period: "June 2025", status: "Draft" },
  { id: "rep-gov-004", tenantId: "ten-gov", title: "Department Accountability Report — FY2025", type: "department_accountability", description: "Comparative performance of all departments against risk and control KPIs, including compliance rates, overdue actions, and accountability assessment.", generatedAt: "2025-06-12T14:00:00Z", period: "FY2025", status: "Final" },

  // PARA
  { id: "rep-para-001", tenantId: "ten-para", title: "Monthly Risk Summary — May 2025", type: "monthly_risk_summary", description: "Executive summary of risk register status and critical operational risk events for May 2025.", generatedAt: "2025-06-01T08:00:00Z", period: "May 2025", status: "Final" },
  { id: "rep-para-002", tenantId: "ten-para", title: "Appetite Breach Report — Q2 FY2025", type: "appetite_breach", description: "Analysis of HSE, generation, and financial controls exceeding risk appetite thresholds.", generatedAt: "2025-06-10T10:00:00Z", period: "Q2 FY2025", status: "Final" },
  { id: "rep-para-003", tenantId: "ten-para", title: "Overdue Controls Report — June 2025", type: "overdue_controls", description: "Status report on all overdue maintenance, safety, and environmental controls.", generatedAt: "2025-06-14T09:00:00Z", period: "June 2025", status: "Draft" },
  { id: "rep-para-004", tenantId: "ten-para", title: "Department Accountability Report — FY2025", type: "department_accountability", description: "Performance assessment across all operational departments with HSE weighting.", generatedAt: "2025-06-12T14:00:00Z", period: "FY2025", status: "Final" },

  // PRIV
  { id: "rep-priv-001", tenantId: "ten-priv", title: "Monthly Risk Summary — May 2025", type: "monthly_risk_summary", description: "Group-level risk summary for Board Risk Committee including credit, market, operational, and compliance risk movements.", generatedAt: "2025-06-01T08:00:00Z", period: "May 2025", status: "Final" },
  { id: "rep-priv-002", tenantId: "ten-priv", title: "Appetite Breach Report — Q2 FY2025", type: "appetite_breach", description: "Regulatory and credit risk appetite breaches requiring Board Risk Committee attention and management response.", generatedAt: "2025-06-10T10:00:00Z", period: "Q2 FY2025", status: "Final" },
  { id: "rep-priv-003", tenantId: "ten-priv", title: "Overdue Controls Report — June 2025", type: "overdue_controls", description: "Controls past implementation deadline across all business divisions with risk impact assessment.", generatedAt: "2025-06-14T09:00:00Z", period: "June 2025", status: "Draft" },
  { id: "rep-priv-004", tenantId: "ten-priv", title: "Department Accountability Report — FY2025", type: "department_accountability", description: "Divisional risk performance scorecard for annual Board review and CEO performance assessment linkage.", generatedAt: "2025-06-12T14:00:00Z", period: "FY2025", status: "Final" },
];

// ─── IN-MEMORY MUTATION STATE ─────────────────────────────────────────────────

// Clone controls into mutable state
export const mutableControls: Map<string, Control> = new Map(
  controls.map(c => [c.id, { ...c }])
);

export const mutableNotes: Map<string, Note[]> = new Map(
  controls.map(c => [c.id, notes.filter(n => n.controlId === c.id)])
);

export const mutableAuditLog: AuditEntry[] = [...auditLog];
export const mutableActivity: ActivityEntry[] = [...activityFeed];

let noteCounter = 1000;
let auditCounter = 1000;
let activityCounter = 1000;

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── COMPUTED KPIs ────────────────────────────────────────────────────────────

export function computeKpis(tenantId: string) {
  const tenantControls = Array.from(mutableControls.values()).filter(c => c.tenantId === tenantId);
  const total = tenantControls.length;
  const implemented = tenantControls.filter(c => c.implementationStatus === "Implemented").length;
  const inProgress = tenantControls.filter(c => c.implementationStatus === "In Progress").length;
  const overdue = tenantControls.filter(c => c.implementationStatus === "Overdue").length;
  const high = tenantControls.filter(c => c.overallRiskLevel === "High").length;
  const breaches = tenantControls.filter(c => !c.withinAppetite).length;
  const awaiting = tenantControls.filter(c => c.implementationStatus === "Awaiting Review").length;
  const escalated = tenantControls.filter(c => c.isEscalated).length;
  const complianceRate = total > 0 ? Math.round((implemented / total) * 100) : 0;

  return {
    totalRisks: total,
    totalControls: total,
    controlsInProgress: inProgress,
    overdueActions: overdue,
    highRiskItems: high,
    complianceRate,
    appetiteBreaches: breaches,
    implementedControls: implemented,
    awaitingReview: awaiting,
    escalatedItems: escalated,
  };
}

export function computeDepartmentRiskSummary(tenantId: string) {
  const tenantDepts = departments.filter(d => d.tenantId === tenantId);
  return tenantDepts.map(dept => {
    const deptControls = Array.from(mutableControls.values()).filter(
      c => c.tenantId === tenantId && c.departmentId === dept.id
    );
    const high = deptControls.filter(c => c.overallRiskLevel === "High").length;
    const medium = deptControls.filter(c => c.overallRiskLevel === "Medium").length;
    const low = deptControls.filter(c => c.overallRiskLevel === "Low").length;
    const implemented = deptControls.filter(c => c.implementationStatus === "Implemented").length;
    const complianceRate = deptControls.length > 0 ? Math.round((implemented / deptControls.length) * 100) : 0;
    return { department: dept.name, high, medium, low, total: deptControls.length, complianceRate };
  });
}

export function getImplementationTrend(tenantId: string) {
  // Generate realistic 12-month trend data
  const trendData: Record<string, { tenantId: string; implemented: number; inProgress: number; overdue: number; month: string }> = {};
  const months = ["Jul '24", "Aug '24", "Sep '24", "Oct '24", "Nov '24", "Dec '24", "Jan '25", "Feb '25", "Mar '25", "Apr '25", "May '25", "Jun '25"];
  const baseData: Record<string, number[][]> = {
    "ten-gov": [[3,5,4],[4,5,4],[4,4,4],[5,4,3],[6,4,3],[6,5,3],[7,4,2],[7,5,2],[8,4,2],[8,5,2],[9,4,2],[10,4,2]],
    "ten-para": [[4,7,6],[5,7,5],[5,6,5],[6,6,5],[7,6,4],[7,7,4],[8,6,4],[8,7,3],[9,6,3],[9,7,3],[10,6,3],[11,6,3]],
    "ten-priv": [[5,8,5],[6,8,5],[6,8,4],[7,7,4],[8,7,4],[8,8,3],[9,7,3],[9,8,3],[10,7,3],[10,8,2],[11,7,2],[11,8,2]],
  };
  const data = baseData[tenantId] || baseData["ten-gov"];
  return months.map((month, i) => ({
    month,
    implemented: data[i][0],
    inProgress: data[i][1],
    overdue: data[i][2],
  }));
}

export function getRiskLevelBreakdown(tenantId: string) {
  const tenantControls = Array.from(mutableControls.values()).filter(c => c.tenantId === tenantId);
  const total = tenantControls.length;
  const high = tenantControls.filter(c => c.overallRiskLevel === "High").length;
  const medium = tenantControls.filter(c => c.overallRiskLevel === "Medium").length;
  const low = tenantControls.filter(c => c.overallRiskLevel === "Low").length;
  return [
    { level: "High", count: high, percentage: total > 0 ? Math.round((high / total) * 100) : 0 },
    { level: "Medium", count: medium, percentage: total > 0 ? Math.round((medium / total) * 100) : 0 },
    { level: "Low", count: low, percentage: total > 0 ? Math.round((low / total) * 100) : 0 },
  ];
}

export function getInsights(tenantId: string): string[] {
  const kpis = computeKpis(tenantId);
  const insights: Record<string, string[]> = {
    "ten-gov": [
      `${kpis.appetiteBreaches} controls are operating above the approved risk appetite threshold — immediate remediation plans should be presented to the Risk Committee at the next scheduled meeting.`,
      `Finance & Procurement continues to represent the highest concentration of critical risk exposure, with ${kpis.overdueActions} overdue controls. The Board is advised to commission an independent review of procurement governance.`,
      `Digital Transformation cybersecurity controls are progressing but remain incomplete — MFA deployment at 78% with PAM solution pending CapEx approval. Recommend expediting the investment case.`,
      `Overall compliance rate of ${kpis.complianceRate}% reflects meaningful progress but remains below the 90% target established by the Risk Committee. A trajectory of 3-4% quarterly improvement is achievable with current resourcing.`,
    ],
    "ten-para": [
      `Generation & Operations presents the most critical risk profile — Unit 3 maintenance failure constitutes a major risk event requiring Board-level attention and written assurance from the CEO on remediation timelines.`,
      `HSE compliance rate of 65% is materially below the ISO 45001 standard requirement. The Board should consider commissioning an external safety audit given the severity and frequency of non-conformances.`,
      `SCADA cybersecurity controls are progressing but OT/IT network segmentation remains incomplete, leaving critical infrastructure exposed to potential cyberattack vectors for an extended period.`,
      `Government subsidy arrears represent a systemic liquidity risk. The Board should escalate to shareholder level if ministerial engagement does not produce a payment commitment within 30 days.`,
    ],
    "ten-priv": [
      `AML/CFT controls are strengthened following the TMS upgrade, but appetite breaches in Compliance & Regulatory remain concerning given the Central Bank's stated intention to intensify AML supervision across the sector.`,
      `The critical API vulnerabilities identified in the penetration test represent an unacceptable level of cyber risk to core banking infrastructure. The Board should require weekly remediation updates until all critical findings are closed.`,
      `Capital adequacy ratio at 17.2% provides adequate headroom above the 13% regulatory minimum, but the Board Risk Committee should stress-test the ratio against a 40% increase in NPLs in the current credit environment.`,
      `Compliance rate of ${kpis.complianceRate}% across the Group is tracking ahead of Q2 target but momentum is concentrated in lower-risk divisions. High-risk areas — particularly Compliance, IT, and Corporate Banking — require dedicated executive attention.`,
    ],
  };
  return insights[tenantId] || insights["ten-gov"];
}

export function addAuditEntry(entry: Omit<AuditEntry, "id">): AuditEntry {
  const newEntry: AuditEntry = { ...entry, id: `aud-${++auditCounter}` };
  mutableAuditLog.unshift(newEntry);
  return newEntry;
}

export function addActivityEntry(entry: Omit<ActivityEntry, "id">): ActivityEntry {
  const newEntry: ActivityEntry = { ...entry, id: `act-${++activityCounter}` };
  mutableActivity.unshift(newEntry);
  return newEntry;
}

export function addNote(controlId: string, note: Omit<Note, "id">): Note {
  const newNote: Note = { ...note, id: `note-${++noteCounter}` };
  const existing = mutableNotes.get(controlId) || [];
  mutableNotes.set(controlId, [...existing, newNote]);
  const ctrl = mutableControls.get(controlId);
  if (ctrl) {
    mutableControls.set(controlId, { ...ctrl, noteCount: ctrl.noteCount + 1 });
  }
  return newNote;
}

export function getReportContent(reportId: string) {
  const report = reports.find(r => r.id === reportId);
  if (!report) return null;

  const tenantId = report.tenantId;
  const kpis = computeKpis(tenantId);
  const tenant = tenants.find(t => t.id === tenantId);

  const contentByType: Record<string, { sections: Array<{ title: string; content: string; data?: object }>; summary: string; recommendations: string[] }> = {
    monthly_risk_summary: {
      summary: `The ${tenant?.name} risk register for ${report.period} reflects a compliance rate of ${kpis.complianceRate}%, with ${kpis.overdueActions} controls overdue and ${kpis.appetiteBreaches} operating above the approved risk appetite. ${kpis.escalatedItems} items have been formally escalated and are subject to enhanced oversight.`,
      sections: [
        { title: "Executive Summary", content: `As of ${report.period}, the organisation's risk profile reflects ${kpis.totalRisks} registered risks across ${departments.filter(d => d.tenantId === tenantId).length} departments. The overall compliance rate stands at ${kpis.complianceRate}%, against a target of 90%. ${kpis.highRiskItems} risks are rated High, ${kpis.overdueActions} controls are overdue, and ${kpis.appetiteBreaches} controls are operating outside the approved risk appetite.` },
        { title: "Key Risk Movements", content: `This period saw ${kpis.escalatedItems} controls escalated due to persistent implementation failures. Escalated controls relate primarily to procurement integrity, cybersecurity, and operational safety — representing the highest residual risk exposure in the current portfolio. No new critical risk events were identified during the period that were not previously registered.` },
        { title: "Controls Implementation Status", content: `Of ${kpis.totalControls} registered controls: ${kpis.implementedControls} are Implemented (${kpis.complianceRate}%), ${kpis.controlsInProgress} are In Progress, ${kpis.overdueActions} are Overdue, and ${kpis.awaitingReview} are Awaiting Review. Overdue controls represent the primary focus area for the coming month.` },
        { title: "Appetite Breach Analysis", content: `${kpis.appetiteBreaches} controls are operating above the Board-approved risk appetite threshold. Each breach has a documented remediation plan and assigned accountable officer. Management is required to close or de-escalate at least 50% of outstanding breaches within the next 60 days.` },
      ],
      recommendations: [
        `Commission a root cause analysis for all controls overdue by more than 90 days, with findings presented to the Risk Committee within 21 days.`,
        `Increase the frequency of progress reporting for escalated controls from monthly to fortnightly, with direct CEO accountability for closure timelines.`,
        `Revisit the risk appetite thresholds for cybersecurity and procurement risks in light of the current threat environment and internal control weaknesses.`,
        `Consider engaging an independent external reviewer to assess the adequacy of remediation plans for the top five appetite breach items.`,
      ],
    },
    appetite_breach: {
      summary: `${kpis.appetiteBreaches} controls are currently operating above the ${tenant?.name} risk appetite threshold. The majority of breaches are concentrated in high-risk functional areas and represent persistent control implementation failures requiring Board-level attention.`,
      sections: [
        { title: "Appetite Breach Overview", content: `The Board-approved Risk Appetite Statement establishes clear thresholds for residual risk across all risk categories. As of ${report.period}, ${kpis.appetiteBreaches} of ${kpis.totalControls} controls (${Math.round((kpis.appetiteBreaches / kpis.totalControls) * 100)}%) are operating above appetite. This exceeds the Board's target of maintaining fewer than 3 appetite breaches at any given time.` },
        { title: "Breach Detail by Department", content: `Finance & Procurement accounts for the highest number of appetite breaches, followed by Digital Transformation and Ethics & Standards Compliance. Each breach is documented with the residual risk score, inherent risk score, appetite threshold, and status of remediation actions. All breach owners have confirmed awareness of their obligations.` },
        { title: "Escalated Breaches", content: `Of the ${kpis.appetiteBreaches} appetite breaches, ${kpis.escalatedItems} have been formally escalated due to repeated missed implementation deadlines. Escalated items are subject to monthly Board oversight and biweekly management reporting until resolved.` },
        { title: "Remediation Timeline", content: `Management has committed to reducing total appetite breaches by 40% within the next quarter through a combination of accelerated control implementation, revised implementation plans, and in one case, formal risk acceptance pending longer-term structural remediation.` },
      ],
      recommendations: [
        `The Board should formally ratify management's proposed risk acceptance for items where implementation timelines exceed 6 months due to structural constraints.`,
        `Implement a consequence management framework that links persistent appetite breaches to individual performance assessments for accountable department heads.`,
        `Consider whether the approved risk appetite for cybersecurity remains calibrated to the current threat landscape, particularly given the proliferation of nation-state attacks on government systems.`,
      ],
    },
    overdue_controls: {
      summary: `${kpis.overdueActions} controls are currently past their scheduled implementation dates. This report provides a comprehensive listing of all overdue items, the accountable officers, and the planned remediation approach.`,
      sections: [
        { title: "Overdue Controls Summary", content: `As at ${report.period}, ${kpis.overdueActions} controls have passed their implementation deadline without being moved to Implemented or Awaiting Review status. These controls represent active control gaps that may increase the organisation's exposure to the associated risks.` },
        { title: "Age Analysis", content: `Of the overdue controls: 2 have been overdue for more than 180 days, 3 have been overdue for 90–180 days, and the remainder have been overdue for less than 90 days. The oldest overdue controls relate to procurement governance and have been subject to two previous deadline extensions.` },
        { title: "Compensating Controls", content: `Where primary controls are overdue, management has identified and documented compensating controls for ${Math.ceil(kpis.overdueActions * 0.7)} of the ${kpis.overdueActions} overdue items. These compensating controls are assessed as partially effective and do not fully mitigate the associated risks.` },
        { title: "Accountability and Consequences", content: `All overdue controls have named accountable officers who have been formally notified. Department heads with more than 2 overdue controls will be required to present remediation plans directly to the CEO. Continued non-compliance will be escalated to the Board Remuneration Committee for performance consequence consideration.` },
      ],
      recommendations: [
        `Require all department heads with overdue controls to submit revised implementation plans with weekly milestones within 10 business days.`,
        `Establish a Remediation Task Force, chaired by the Chief Risk Officer, to provide hands-on support for the highest-risk overdue controls.`,
        `Review the root causes of repeated deadline extensions to determine whether resource constraints, technical dependencies, or governance failures are the primary driver.`,
      ],
    },
    department_accountability: {
      summary: `This report assesses the risk management performance of each department against the organisation's approved KPIs for FY2025, including compliance rates, overdue actions, appetite breaches, and risk culture indicators.`,
      sections: [
        { title: "Performance Overview", content: `Departmental performance for FY2025 shows significant variation in risk management maturity. Risk & Internal Audit leads with a compliance rate of 97%, while Finance & Procurement remains the lowest-performing department at 71%. The organisation-wide average of ${kpis.complianceRate}% reflects steady improvement from the prior year's 68% but falls short of the 90% target.` },
        { title: "High-Performing Departments", content: `Risk & Internal Audit (97%), Strategy & Planning (94%), and Legal Secretariat (88%) demonstrate strong control culture with no appetite breaches and consistent implementation within agreed timelines. These departments should be recognised and their practices shared across the organisation.` },
        { title: "Departments Requiring Intervention", content: `Finance & Procurement (71%), Ethics & Standards Compliance (79%), and Digital Transformation (74%) are identified as requiring urgent management intervention. Each department has a dedicated improvement plan agreed with the Commissioner and will be subject to monthly performance reviews for the remainder of FY2025.` },
        { title: "Accountability Assessment", content: `Three department heads have received formal written warnings regarding persistent control implementation failures. All three are required to attend a performance review with the Commissioner before the end of Q3 FY2025. Results will be incorporated into the annual performance assessment process.` },
      ],
      recommendations: [
        `Implement a quarterly departmental accountability scorecard, shared with the Board Risk Committee, that links risk management performance to executive remuneration.`,
        `Deploy risk management capacity-building resources to the three lowest-performing departments, including dedicated Risk Champion training and system support.`,
        `Recognise high-performing departments through the existing awards programme to reinforce positive risk culture.`,
        `Mandate that all department heads complete a refresher on the Enterprise Risk Management Framework by Q3 FY2025.`,
      ],
    },
  };

  return contentByType[report.type] || contentByType.monthly_risk_summary;
}
