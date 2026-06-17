/**
 * MASTER ENUM TYPES - Single Source of Truth
 * All type definitions that are used across the mock architecture
 * DO NOT add mock data arrays here - only types and type constants
 */

// ============================================================
// FORM TYPE ENUMS
// ============================================================
export type FormTypeId =
  | "ethics"
  | "business_ethics"
  | "fraud"
  | "employee_conduct"
  | "product_service"
  | "safety"
  | "environmental";

// ============================================================
// COMPLAINT STATUS ENUMS
// ============================================================
export type ComplaintStatus =
  | "pending"
  | "in_progress"
  | "investigating"
  | "completed"
  | "rejected"
  | "closed";

// ============================================================
// COMPLAINT PRIORITY ENUMS
// ============================================================
export type ComplaintPriority = "low" | "medium" | "high" | "critical";
export type UrgencyLevel = "low" | "medium" | "high" | "critical";

// ============================================================
// USER & ROLE ENUMS
// ============================================================
export type UserRole = "admin" | "supervisor" | "investigator" | "viewer";

// ============================================================
// WORKFLOW ENUMS
// ============================================================
export type WorkflowStepStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "skipped"
  | "rejected";

// ============================================================
// INTAKE ENUMS
// ============================================================
export type IntakeStatus = "pending" | "approved" | "rejected";

// ============================================================
// ASSIGNMENT ENUMS
// ============================================================
export type AssignmentStatus = "unassigned" | "assigned" | "rejected";

// ============================================================
// INVESTIGATION ENUMS
// ============================================================
export type InvestigationStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "no_issue_found";

// ============================================================
// APPROVAL ENUMS
// ============================================================
export type ApprovalStatus = "pending" | "approved" | "rejected";

// ============================================================
// EXTENSION ENUMS
// ============================================================
export type ExtensionStatus = "pending" | "approved" | "rejected";

// ============================================================
// DOCUMENT ENUMS
// ============================================================
export type DocumentStatus = "pending" | "approved" | "rejected";

// ============================================================
// SENSITIVE CASE ENUMS
// ============================================================
export type SensitiveStatus = "open" | "restricted" | "closed";
export type ClassificationLevel =
  | "confidential"
  | "restricted"
  | "internal"
  | "public";

// ============================================================
// REPORT ENUMS
// ============================================================
export type ReportStatus =
  | "ready"
  | "preparing"
  | "pending_approval"
  | "archived";
export type SLAReportStatus = "pass" | "warning" | "breach";
export type InvestigationReportStatus =
  | "completed"
  | "in_progress"
  | "pending_info";

// ============================================================
// AUDIT ENUMS
// ============================================================
export type AuditLogStatus = "success" | "failure" | "warning";

// ============================================================
// ORGANIZATION ENUMS
// ============================================================
export type OrganizationType =
  | "headquarters"
  | "branch"
  | "department"
  | "division";
export type OrganizationStatus = "active" | "inactive";

// ============================================================
// FORM ENUMS
// ============================================================
export type FormStatus = "active" | "inactive" | "draft";

// ============================================================
// WORKFLOW ENUMS
// ============================================================
export type WorkflowStatus = "active" | "inactive" | "draft";

// ============================================================
// SLA ENUMS
// ============================================================
export type SLAStatus = "active" | "inactive" | "draft";

// ============================================================
// HELPER: Get FormTypeId values array
// ============================================================
export const FORM_TYPE_ID_VALUES: FormTypeId[] = [
  "ethics",
  "business_ethics",
  "fraud",
  "employee_conduct",
  "product_service",
  "safety",
  "environmental",
];

// ============================================================
// HELPER: Get ComplaintStatus values array
// ============================================================
export const COMPLAINT_STATUS_VALUES: ComplaintStatus[] = [
  "pending",
  "in_progress",
  "investigating",
  "completed",
  "rejected",
  "closed",
];

// ============================================================
// HELPER: Get ComplaintPriority values array
// ============================================================
export const COMPLAINT_PRIORITY_VALUES: ComplaintPriority[] = [
  "low",
  "medium",
  "high",
  "critical",
];

// ============================================================
// HELPER: Get UserRole values array
// ============================================================
export const USER_ROLE_VALUES: UserRole[] = [
  "admin",
  "supervisor",
  "investigator",
  "viewer",
];
