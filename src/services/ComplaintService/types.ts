// Shared types for the complaint service layer.
// Kept in a separate file to avoid circular imports when ComplaintService.ts
// re-exports them (it is both the module root and the type source).

export type ComplaintStatus =
  | "pending"
  | "in_progress"
  | "investigating"
  | "completed"
  | "rejected"
  | "closed";

export type ComplaintPriority = "low" | "medium" | "high" | "critical";
export type UrgencyLevel = "low" | "medium" | "high" | "critical";

export type Category = {
  active: boolean;
  created_at: string;
  description: string | null;
  id: string;
  is_sensitive: boolean;
  name: string;
};

export type Complaint = {
  assignee_id: string | null;
  category_id: string | null;
  created_at: string;
  description: string;
  id: string;
  is_anonymous: boolean;
  is_sensitive: boolean;
  hasWitness: boolean;
  witnessNames: string[];
  urgencyLevel: UrgencyLevel;
  requestFollowUp: boolean;
  followUpContact: string | null;
  priority: ComplaintPriority;
  reference_number: string;
  reporter_department: string | null;
  reporter_email: string | null;
  reporter_name: string | null;
  reporter_phone: string | null;
  subtopic_id?: string | null;
  subtopic_other?: string | null;
  subcategory_other?: string | null;
  product_type?: string | null;
  product_type_other?: string | null;
  lot_reference?: string | null;
  contract_number?: string | null;
  delivery_date?: string | null;
  occurred_date?: string | null;
  occurred_time?: string | null;
  location?: string | null;
  reporter_user_id: string | null;
  status: ComplaintStatus;
  title: string;
  track_token: string;
  updated_at: string;
};

export type ComplaintComment = {
  author_id: string | null;
  author_name: string | null;
  body: string;
  complaint_id: string;
  created_at: string;
  id: string;
  is_internal: boolean;
};

export type ComplaintStatusHistory = {
  changed_by: string | null;
  complaint_id: string;
  created_at: string;
  from_status: ComplaintStatus | null;
  id: string;
  note: string | null;
  to_status: ComplaintStatus;
};

export interface WitnessInput {
  name: string;
  phone?: string;
}

export interface SubmitComplaintInput {
  title: string;
  description: string;
  category_id: string | null;
  priority: ComplaintPriority;
  hasWitness?: boolean;
  witnessNames?: string[];
  witnesses?: WitnessInput[];
  urgencyLevel?: UrgencyLevel;
  requestFollowUp?: boolean;
  followUpContact?: string;
  is_anonymous: boolean;
  reporter_name?: string;
  reporter_email?: string;
  reporter_phone?: string;
  reporter_department?: string;
  subtopic_id?: string;
  subtopic_other?: string;
  subcategory_other?: string;
  product_type?: string;
  product_type_other?: string;
  lot_reference?: string;
  contract_number?: string;
  delivery_date?: string;
  occurred_date?: string;
  occurred_time?: string;
  location?: string;
}
