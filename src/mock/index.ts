/**
 * CENTRALIZED MOCK DATA EXPORTS
 * Barrel export for all mock modules
 */

// Master data (Single Source of Truth for enums, statuses, priorities, roles, categories)
export * from "./master-data";

// Shared data (types, users, organizations, constants, generators)
// Only export from shared what doesn't conflict with master-data
export {
  type User,
  type Role,
  type Workflow,
  type SLAConfig,
  type NotificationConfig,
  type Organization,
  type AuditLog,
  type ComplaintDocument,
  type ReportFilter,
  type KPIData,
} from "./shared";
export * from "./shared/users";
export * from "./shared/organizations";
export * from "./shared/constants";
export * from "./shared/generators";

// Module barrels
export * from "./complaints";
export * from "./users";
export * from "./roles";
export * from "./organization";
export * from "./forms";
export * from "./workflows";
export * from "./sla";
export * from "./notifications";
export * from "./branding";
export * from "./audit";
export * from "./reports";
export * from "./assignment";
export * from "./investigation";
export * from "./dashboard";
export * from "./auth";
// NOTE: options/ is NOT re-exported here because its constants (ROLES, DEPARTMENTS,
// CATEGORIES, etc.) are already exported from individual modules, which would cause
// duplicate export conflicts. Direct imports from "@/mock/options" still work.
