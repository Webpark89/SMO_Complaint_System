/**
 * ASSIGNMENT INDEX - Barrel export
 * Re-exports assignment-related mock data
 *
 * NOTE: Status options now come from master-data/index.ts
 */

// Assignment mock data
export {
  mockAssignments,
  type AssignmentRow,
} from "../complaints/assignment.mock";

// Approval mock data
export { mockApprovals, type ApprovalRow } from "../complaints/ApprovalMock";

// Intake mock data
export { mockIntakes, type IntakeRow } from "../complaints/intake.mock";

// Extension mock data
export {
  mockExtensions,
  type ExtensionRow,
} from "../complaints/extension.mock";

// Sensitive case mock data
export { mockSensitiveCases, type SensitiveRow } from "./sensitive.mock";
