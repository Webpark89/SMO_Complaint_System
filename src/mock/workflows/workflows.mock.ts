/**
 * WORKFLOWS MOCK DATA
 * Uses canonical FormTypeId values from master-data/enums.ts
 */
import type { FormTypeId } from "../master-data/enums";
import { CATEGORY_OPTIONS } from "../category-taxonomy";

export type WorkflowRow = {
  id: string;
  name: string;
  category: FormTypeId;
  steps: number;
  avgDays: number;
  version: string;
  status: string;
};
export const mockWorkflows: WorkflowRow[] = [
  {
    id: "WF-001",
    name: "กระบวนการร้องเรียนทั่วไป",
    category: "ethics",
    steps: 5,
    avgDays: 15,
    version: "v3.0",
    status: "เปิดใช้งาน",
  },
  {
    id: "WF-002",
    name: "กระบวนการร้องเรียนผู้บริหาร",
    category: "fraud",
    steps: 7,
    avgDays: 30,
    version: "v2.0",
    status: "เปิดใช้งาน",
  },
  {
    id: "WF-003",
    name: "กระบวนการร้องเรียนด่วน",
    category: "employee_conduct",
    steps: 3,
    avgDays: 7,
    version: "v1.2",
    status: "แบบร่าง",
  },
  {
    id: "WF-004",
    name: "กระบวนการร้องเรียนสิ่งแวดล้อม",
    category: "environmental",
    steps: 6,
    avgDays: 20,
    version: "v1.0",
    status: "เปิดใช้งาน",
  },
  {
    id: "WF-005",
    name: "กระบวนการตรวจสอบภายใน",
    category: "safety",
    steps: 8,
    avgDays: 45,
    version: "v1.0",
    status: "แบบร่าง",
  },
];

// Re-export from canonical source - no more Thai display name duplication
export { CATEGORY_OPTIONS as WORKFLOW_CATEGORIES };
