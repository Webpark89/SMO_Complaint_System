// ========== Form Types ==========
export type FormTypeId =
  | "ethics"
  | "fraud"
  | "employee_conduct"
  | "product_service"
  | "safety"
  | "environmental";

export interface SubCategory {
  id: string;
  name: string;
  formTypeId: FormTypeId;
}

export interface ComplaintType {
  id: FormTypeId;
  name: string;
  nameTh: string;
  description: string;
  hasWitnessField: boolean;
  subcategories: SubCategory[];
}

// ========== Complaint ==========
export type ComplaintStatus =
  | "pending"
  | "in_progress"
  | "investigating"
  | "completed"
  | "rejected"
  | "closed";

export type ComplaintPriority = "low" | "medium" | "high" | "critical";
export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export interface Complaint {
  id: string;
  reference_number: string;
  title: string;
  description: string;
  formTypeId: FormTypeId;
  subcategoryId: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  is_sensitive: boolean;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  // Reporter info
  reporter_name: string | null;
  reporter_email: string | null;
  reporter_phone: string | null;
  reporter_department: string | null;
  // Incident info
  occurred_date: string | null;
  occurred_time: string | null;
  location: string | null;
  // Witness
  hasWitness: boolean;
  witnessNames: string[];
  // Follow up
  requestFollowUp: boolean;
  followUpContact: string | null;
  // Assignment
  assignee_id: string | null;
  assignee_name: string | null;
  assignedAt: string | null;
  dueAt: string | null;
  // Product/Service specific
  product_type: string | null;
  lot_reference: string | null;
  contract_number: string | null;
  delivery_date: string | null;
}

export interface ComplaintComment {
  id: string;
  complaint_id: string;
  author_id: string;
  author_name: string;
  body: string;
  is_internal: boolean;
  created_at: string;
}

export interface ComplaintStatusHistory {
  id: string;
  complaint_id: string;
  from_status: ComplaintStatus | null;
  to_status: ComplaintStatus;
  changed_by: string;
  changed_by_name: string;
  note: string | null;
  created_at: string;
}

// ========== User & Role ==========
export type UserRole = "admin" | "supervisor" | "investigator" | "viewer";

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: UserRole;
  department: string;
  branch: string;
  is_active: boolean;
  created_at: string;
  lastLogin: string | null;
}

export interface Role {
  id: string;
  name: string;
  nameTh: string;
  permissions: string[];
  description: string;
  userCount: number;
}

// ========== Workflow ==========
export interface WorkflowStep {
  step_order: number;
  step_name: string;
  assignee_role: UserRole;
  sla_hours: number;
  action_required: string;
}

export interface Workflow {
  id: string;
  name: string;
  formTypeId: FormTypeId;
  steps: WorkflowStep[];
  is_active: boolean;
}

// ========== SLA ==========
export interface SLAConfig {
  id: string;
  formTypeId: FormTypeId;
  priority: ComplaintPriority;
  response_sla_hours: number;
  resolution_sla_hours: number;
  escalation_email: string;
}

// ========== Notification ==========
export interface NotificationConfig {
  id: string;
  event_type: string;
  channel: "email" | "line" | "system";
  recipient_role: UserRole;
  template: string;
  is_active: boolean;
}

// ========== Organization ==========
export interface Organization {
  id: string;
  name: string;
  branch_code: string;
  parent_id: string | null;
  level: number;
  is_active: boolean;
}

// ========== Audit Log ==========
export interface AuditLog {
  id: string;
  action: string;
  module: string;
  record_id: string;
  username: string;
  timestamp: string;
  details: string;
  ip_address: string;
}

// ========== Document ==========
export interface ComplaintDocument {
  id: string;
  complaint_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: string;
  is_evidence: boolean;
  description: string | null;
}

// ========== Report ==========
export interface ReportFilter {
  dateFrom: string;
  dateTo: string;
  formTypeId?: FormTypeId;
  status?: ComplaintStatus;
  branch?: string;
}

export interface KPIData {
  label: string;
  value: number;
  change?: number;
  trend?: "up" | "down" | "neutral";
}
