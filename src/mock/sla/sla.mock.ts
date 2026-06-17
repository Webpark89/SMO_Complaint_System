/**
 * SLA MOCK DATA
 * Uses canonical values from master-data/enums.ts and category-taxonomy.ts
 */
import type { FormTypeId, ComplaintPriority } from "../master-data/enums";
import { CATEGORY_OPTIONS } from "../category-taxonomy";

export type SLARow = {
  id: string;
  category: FormTypeId;
  priority: ComplaintPriority;
  responseHours: number;
  resolutionHours: number;
  isActive: boolean;
};

export const mockSLAs: SLARow[] = [
  {
    id: "SLA-001",
    category: "ethics",
    priority: "critical",
    responseHours: 4,
    resolutionHours: 24,
    isActive: true,
  },
  {
    id: "SLA-002",
    category: "ethics",
    priority: "high",
    responseHours: 24,
    resolutionHours: 72,
    isActive: true,
  },
  {
    id: "SLA-003",
    category: "product_service",
    priority: "medium",
    responseHours: 48,
    resolutionHours: 168,
    isActive: true,
  },
  {
    id: "SLA-004",
    category: "environmental",
    priority: "high",
    responseHours: 12,
    resolutionHours: 48,
    isActive: false,
  },
  {
    id: "SLA-005",
    category: "employee_conduct",
    priority: "medium",
    responseHours: 72,
    resolutionHours: 240,
    isActive: true,
  },
];

// Re-export from canonical source - no more Thai display name duplication
export { CATEGORY_OPTIONS as SLA_CATEGORIES };
