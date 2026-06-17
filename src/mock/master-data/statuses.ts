/**
 * STATUS OPTIONS - Single Source of Truth
 * All status dropdown options centralized here
 * Thai labels for UI display
 */

import type {
  ComplaintStatus,
  IntakeStatus,
  AssignmentStatus,
  InvestigationStatus,
  ApprovalStatus,
  ExtensionStatus,
  DocumentStatus,
  SensitiveStatus,
  ReportStatus,
  SLAReportStatus,
  InvestigationReportStatus,
  AuditLogStatus,
  OrganizationStatus,
  FormStatus,
  WorkflowStatus,
  SLAStatus,
} from "./enums";

// ============================================================
// COMPLAINT STATUS OPTIONS
// ============================================================
export const COMPLAINT_STATUS_OPTIONS: {
  value: ComplaintStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "pending", label: "รอดำเนินการ" },
  { value: "in_progress", label: "ดำเนินการแล้ว" },
  { value: "investigating", label: "กำลังสืบสวน" },
  { value: "completed", label: "เสร็จสิ้น" },
  { value: "rejected", label: "ปฏิเสธ" },
  { value: "closed", label: "ปิดเรื่อง" },
];

// ============================================================
// INTAKE STATUS OPTIONS
// ============================================================
export const INTAKE_STATUS_OPTIONS: {
  value: IntakeStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "pending", label: "รอรับเรื่อง" },
  { value: "approved", label: "รับเรื่องแล้ว" },
  { value: "rejected", label: "ปฏิเสธรับ" },
];

// ============================================================
// ASSIGNMENT STATUS OPTIONS
// ============================================================
export const ASSIGNMENT_STATUS_OPTIONS: {
  value: AssignmentStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "unassigned", label: "ยังไม่มอบหมาย" },
  { value: "assigned", label: "มอบหมายแล้ว" },
  { value: "rejected", label: "ปฏิเสธมอบหมาย" },
];

// ============================================================
// INVESTIGATION STATUS OPTIONS
// ============================================================
export const INVESTIGATION_STATUS_OPTIONS: {
  value: InvestigationStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "pending", label: "รอตรวจสอบ" },
  { value: "in_progress", label: "ดำเนินการแล้ว" },
  { value: "completed", label: "เสร็จสิ้น" },
  { value: "no_issue_found", label: "ไม่พบความผิด" },
];

// ============================================================
// APPROVAL STATUS OPTIONS
// ============================================================
export const APPROVAL_STATUS_OPTIONS: {
  value: ApprovalStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "pending", label: "รออนุมัติ" },
  { value: "approved", label: "อนุมัติแล้ว" },
  { value: "rejected", label: "ปฏิเสธ" },
];

// ============================================================
// EXTENSION STATUS OPTIONS
// ============================================================
export const EXTENSION_STATUS_OPTIONS: {
  value: ExtensionStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "pending", label: "รออนุมัติ" },
  { value: "approved", label: "อนุมัติแล้ว" },
  { value: "rejected", label: "ปฏิเสธ" },
];

// ============================================================
// DOCUMENT STATUS OPTIONS
// ============================================================
export const DOCUMENT_STATUS_OPTIONS: {
  value: DocumentStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "pending", label: "รอตรวจสอบ" },
  { value: "approved", label: "อนุมัติแล้ว" },
  { value: "rejected", label: "ปฏิเสธ" },
];

// ============================================================
// SENSITIVE CASE STATUS OPTIONS
// ============================================================
export const SENSITIVE_STATUS_OPTIONS: {
  value: SensitiveStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "open", label: "เปิด" },
  { value: "restricted", label: "จำกัด" },
  { value: "closed", label: "ปิด" },
];

// ============================================================
// REPORT STATUS OPTIONS
// ============================================================
export const REPORT_STATUS_OPTIONS: {
  value: ReportStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "ready", label: "พร้อมดาวน์โหลด" },
  { value: "preparing", label: "กำลังจัดทำ" },
  { value: "pending_approval", label: "รออนุมัติ" },
  { value: "archived", label: "เก็บถาวร" },
];

// ============================================================
// SLA REPORT STATUS OPTIONS
// ============================================================
export const SLA_REPORT_STATUS_OPTIONS: {
  value: SLAReportStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "pass", label: "ผ่าน SLA" },
  { value: "warning", label: "ใกล้เกิน SLA" },
  { value: "breach", label: "เกิน SLA" },
];

// ============================================================
// INVESTIGATION REPORT STATUS OPTIONS
// ============================================================
export const INVESTIGATION_REPORT_STATUS_OPTIONS: {
  value: InvestigationReportStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "completed", label: "เสร็จสิ้น" },
  { value: "in_progress", label: "อยู่ระหว่างดำเนินการ" },
  { value: "pending_info", label: "รอข้อมูลเพิ่มเติม" },
];

// ============================================================
// AUDIT LOG STATUS OPTIONS
// ============================================================
export const AUDIT_LOG_STATUS_OPTIONS: {
  value: AuditLogStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "success", label: "สำเร็จ" },
  { value: "failure", label: "ล้มเหลว" },
  { value: "warning", label: "เตือน" },
];

// ============================================================
// ORGANIZATION STATUS OPTIONS
// ============================================================
export const ORGANIZATION_STATUS_OPTIONS: {
  value: OrganizationStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "active", label: "เปิดใช้งาน" },
  { value: "inactive", label: "ระงับ" },
];

// ============================================================
// FORM STATUS OPTIONS
// ============================================================
export const FORM_STATUS_OPTIONS: {
  value: FormStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "active", label: "เปิดใช้งาน" },
  { value: "inactive", label: "ระงับ" },
  { value: "draft", label: "แบบร่าง" },
];

// ============================================================
// WORKFLOW STATUS OPTIONS
// ============================================================
export const WORKFLOW_STATUS_OPTIONS: {
  value: WorkflowStatus | "all";
  label: string;
}[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "active", label: "เปิดใช้งาน" },
  { value: "inactive", label: "ระงับ" },
  { value: "draft", label: "แบบร่าง" },
];

// ============================================================
// SLA STATUS OPTIONS
// ============================================================
export const SLA_STATUS_OPTIONS: { value: SLAStatus | "all"; label: string }[] =
  [
    { value: "all", label: "ทั้งหมด" },
    { value: "active", label: "เปิดใช้งาน" },
    { value: "inactive", label: "ระงับ" },
    { value: "draft", label: "แบบร่าง" },
  ];
