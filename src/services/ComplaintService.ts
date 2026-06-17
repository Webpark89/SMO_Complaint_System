/**
 * ComplaintService — unified data layer.
 */

import type {
  SubmitComplaintInput,
  Complaint,
  ComplaintComment,
  ComplaintStatus,
  ComplaintStatusHistory,
  Category,
  ComplaintPriority,
  UrgencyLevel,
} from "@/services/ComplaintService/types";

export type {
  SubmitComplaintInput,
  Complaint,
  ComplaintComment,
  ComplaintStatus,
  ComplaintStatusHistory,
  Category,
  ComplaintPriority,
  UrgencyLevel,
};

// ─── Labels ─────────────────────────────────────────────

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  pending: "รอพิจารณา",
  in_progress: "กำลังดำเนินการ",
  investigating: "อยู่ระหว่างการสืบสวน",
  completed: "เสร็จสิ้น",
  rejected: "ปฏิเสธ",
  closed: "ปิดเรื่อง",
};

export const PRIORITY_LABELS: Record<ComplaintPriority, string> = {
  low: "ต่ำ",
  medium: "ปานกลาง",
  high: "สูง",
  critical: "เร่งด่วน",
};

// ─── Mock switch ────────────────────────────────────────

const USE_MOCK =
  typeof import.meta.env.VITE_USE_MOCK === "string"
    ? import.meta.env.VITE_USE_MOCK !== "no"
    : import.meta.env.DEV;

// ─── Categories ─────────────────────────────────────────

export async function listCategories(): Promise<Category[]> {
  if (USE_MOCK) {
    const m = await import("@/services/mock/ComplaintMockService");
    return m.mockCategories.getAll();
  }

  const { apiCategories } = await import("@/services/api/client");

  return apiCategories.list();
}

// ─── Complaints ─────────────────────────────────────────

export async function submitComplaint(
  input: SubmitComplaintInput,
): Promise<{ reference_number: string; id: string }> {
  if (USE_MOCK) {
    const { createComplaint } =
      await import("@/services/mock/ComplaintMockService");

    return createComplaint(input);
  }

  const { apiComplaints } = await import("@/services/api/client");

  return apiComplaints.create({
    ...input,
    witnessNames: input.witnessNames ?? [],
  });
}

export async function trackByReference(ref: string) {
  if (USE_MOCK) {
    const { trackComplaint } =
      await import("@/services/mock/ComplaintMockService");

    return trackComplaint(ref.trim().toUpperCase());
  }

  const { apiComplaints } = await import("@/services/api/client");

  return apiComplaints.getByReference(ref.trim().toUpperCase());
}

export async function listMyComplaints() {
  if (USE_MOCK) {
    const { listComplaintsWithCategory } =
      await import("@/services/mock/ComplaintMockService");

    return listComplaintsWithCategory();
  }

  const { apiComplaints } = await import("@/services/api/client");

  return apiComplaints.list();
}

export async function getComplaint(id: string) {
  if (USE_MOCK) {
    const { getComplaintWithCategory } =
      await import("@/services/mock/ComplaintMockService");

    return getComplaintWithCategory(id);
  }

  const { apiComplaints } = await import("@/services/api/client");

  return apiComplaints.getById(id);
}

// ─── Comments ───────────────────────────────────────────

export async function listComments(complaintId: string) {
  if (USE_MOCK) {
    const { listComments } =
      await import("@/services/mock/ComplaintMockService");

    return listComments(complaintId);
  }

  const { apiComments } = await import("@/services/api/client");

  return apiComments.list(complaintId);
}

export async function addComment(
  complaintId: string,
  body: string,
  isInternal: boolean,
) {
  if (USE_MOCK) {
    const { addComment } = await import("@/services/mock/ComplaintMockService");

    return addComment(complaintId, body, isInternal);
  }

  const { apiComments } = await import("@/services/api/client");

  return apiComments.create(complaintId, body, isInternal);
}

// ─── Status ─────────────────────────────────────────────

export async function updateStatus(
  complaintId: string,
  status: ComplaintStatus,
) {
  if (USE_MOCK) {
    const { updateComplaintStatus } =
      await import("@/services/mock/ComplaintMockService");

    return updateComplaintStatus(complaintId, status);
  }

  const { apiComplaints } = await import("@/services/api/client");

  return apiComplaints.updateStatus(complaintId, status);
}

export async function listStatusHistory(complaintId: string) {
  if (USE_MOCK) {
    const { listStatusHistory } =
      await import("@/services/mock/ComplaintMockService");

    return listStatusHistory(complaintId);
  }

  const { apiHistory } = await import("@/services/api/client");

  return apiHistory.list(complaintId);
}
