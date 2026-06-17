export type StateRow = {
  id: string;
  name: string;
  description: string;
  order: number;
  color: string;
};

export const mockStates: StateRow[] = [
  {
    id: "ST-001",
    name: "ใหม่",
    description: "ส่งมาแล้วและรอการตรวจสอบเบื้องต้น",
    order: 1,
    color: "success",
  },
  {
    id: "ST-002",
    name: "รับเรื่องแล้ว",
    description: "ผ่านการคัดกรองเรื่องแรก",
    order: 2,
    color: "success",
  },
  {
    id: "ST-003",
    name: "กำลังดำเนินการ",
    description: "อยู่ระหว่างการสืบสวนหรือดำเนินการ",
    order: 3,
    color: "warning",
  },
  {
    id: "ST-004",
    name: "รอตรวจสอบ",
    description: "รอการตรวจสอบจากผู้มีอำนาจอนุมัติ",
    order: 4,
    color: "gold",
  },
  {
    id: "ST-005",
    name: "อยู่ระหว่างขยายเวลา",
    description: "ได้รับการขยายเวลาดำเนินการ",
    order: 5,
    color: "warning",
  },
  {
    id: "ST-006",
    name: "ปิดเรื่อง",
    description: "ดำเนินการเสร็จสิ้นและปิดเรื่อง",
    order: 6,
    color: "neutral",
  },
  {
    id: "ST-007",
    name: "ปิดเรื่องโดยไม่ดำเนินการ",
    description: "ปิดเรื่องเนื่องจากไม่อยู่ในข่ายที่ต้องดำเนินการ",
    order: 7,
    color: "neutral",
  },
  {
    id: "ST-008",
    name: "ส่งต่อ",
    description: "ส่งเรื่องไปยังหน่วยงานที่เกี่ยวข้อง",
    order: 8,
    color: "neutral",
  },
  {
    id: "ST-009",
    name: "ระงับ",
    description: "ระงับการดำเนินการชั่วคราว",
    order: 9,
    color: "danger",
  },
  {
    id: "ST-010",
    name: "เรื่องลับ",
    description: "เป็นเรื่องที่ต้องจัดการแบบพิเศษ",
    order: 10,
    color: "danger",
  },
  {
    id: "ST-011",
    name: "อุทธรณ์",
    description: "ผู้ร้องเรียนได้ยื่นอุทธรณ์คำตัดสิน",
    order: 11,
    color: "gold",
  },
  {
    id: "ST-012",
    name: "เปิดใหม่",
    description: "เปิดเรื่องขึ้นมาดำเนินการใหม่",
    order: 12,
    color: "warning",
  },
];

export const STATE_STATUS_OPTIONS = [{ value: "all", label: "ทั้งหมด" }];
