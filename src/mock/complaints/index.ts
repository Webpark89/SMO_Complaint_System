/**
 * COMPLAINTS INDEX - Barrel export
 * Re-exports all complaint-related mock data
 *
 * NOTE: Status options (INTAKE_STATUS_OPTIONS, DOCUMENT_STATUS_OPTIONS, etc.)
 * are now in master-data/index.ts - import from there instead
 */

// Re-export from canonical taxonomy (Single Source of Truth for categories)
export {
  complaintTypes,
  getFormTypeName,
  getSubcategoryName,
  getSubcategories,
  hasWitnessField,
  getFormTypeById,
} from "./complaintTypes";

export type { SubCategory, ComplaintType } from "./complaintTypes";

// Intake mock data (status options now in master-data)
export { mockIntakes, type IntakeRow } from "./intake.mock";

// Complaints mock data
export {
  mockComplaints,
  mockComplaintList,
  mockDashboardComplaints,
  type ComplaintRow,
  type ComplaintListRow,
  type DashboardComplaintRow,
} from "./ComplaintsMock";

// Document mock data (status options now in master-data)
export { mockDocuments, type DocumentRow } from "./documents.mock";

// History is intentionally kept for backward compatibility
export { complaintHistory } from "./history";
