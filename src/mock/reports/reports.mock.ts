export type ReportFormat = "PDF" | "XLSX" | "CSV";

export type ReportRow = {
  id: string;
  name: string;
  description: string;
  range: string;
  createdAt: string;
  createdBy: string;
  format: ReportFormat;
  status: string;
  downloads: number;
};

export const mockReports: ReportRow[] = [
  {
    id: "RPT-001",
    name: "สรุปจำนวนเรื่องร้องเรียนรายเดือน",
    description: "สรุปจำนวนเรื่องร้องเรียนแยกตามหมวดหมู่และสถานะ",
    range: "2026-05",
    createdAt: "2026-05-31 09:00",
    createdBy: "ระบบ",
    format: "PDF",
    status: "พร้อมดาวน์โหลด",
    downloads: 24,
  },
  {
    id: "RPT-002",
    name: "สรุปแยกตามหมวดหมู่",
    description: "สรุปเรื่องร้องเรียนแยกตามหมวดหมู่หลัก",
    range: "2026 Q2",
    createdAt: "2026-05-12 11:30",
    createdBy: "นางสมหญิง รักสงบ",
    format: "XLSX",
    status: "พร้อมดาวน์โหลด",
    downloads: 18,
  },
  {
    id: "RPT-003",
    name: "ตรวจสอบเรื่องที่ยังเปิดอยู่",
    description: "รายการเรื่องที่ยังไม่ปิดเรื่องและเกินกำหนด SLA",
    range: "30 วันที่ผ่านมา",
    createdAt: "2026-05-30 15:10",
    createdBy: "นายสมชาย ใจดี",
    format: "PDF",
    status: "กำลังเพิ่ม",
    downloads: 0,
  },
  {
    id: "RPT-004",
    name: "รายงาน SLA ประจำเดือน",
    description: "รายงานการปฏิบัติตาม SLA รายเดือน",
    range: "2026-05",
    createdAt: "2026-05-31 18:00",
    createdBy: "ระบบ",
    format: "XLSX",
    status: "พร้อมดาวน์โหลด",
    downloads: 31,
  },
  {
    id: "RPT-005",
    name: "รายงานสิ่งแวดล้อม",
    description: "สรุปเรื่องร้องเรียนด้านสิ่งแวดล้อมประจำไตรมาส",
    range: "2026 Q1",
    createdAt: "2026-04-01 08:00",
    createdBy: "นายวิชัย มั่นคง",
    format: "PDF",
    status: "พร้อมดาวน์โหลด",
    downloads: 12,
  },
  {
    id: "RPT-006",
    name: "รายงานบุคลากร",
    description: "สรุปเรื่องร้องเรียนด้านทรัพยากรบุคคล",
    range: "2026 Q2",
    createdAt: "2026-05-15 10:00",
    createdBy: "นางนภา สว่างรัศมี",
    format: "CSV",
    status: "รอดำเนินการ",
    downloads: 0,
  },
  {
    id: "RPT-007",
    name: "รายงานการเงิน",
    description: "สรุปเรื่องร้องเรียนด้านการเงินและบัญชี",
    range: "2026-04",
    createdAt: "2026-05-05 14:30",
    createdBy: "นายประเสริฐ ศรีสุข",
    format: "PDF",
    status: "พร้อมดาวน์โหลด",
    downloads: 8,
  },
  {
    id: "RPT-008",
    name: "รายงานความลับและรัศมีสูง",
    description: "สรุปเรื่องที่ถูกจัดเป็นความลับและความรัศมีสูง",
    range: "2026 Q2",
    createdAt: "2026-06-01 09:00",
    createdBy: "นางสมหญิง รักสงบ",
    format: "PDF",
    status: "กำลังเพิ่ม",
    downloads: 0,
  },
  {
    id: "RPT-009",
    name: "รายงานผู้บริหาร",
    description: "สรุปภาพรวมการร้องเรียนสำหรับผู้บริหาร",
    range: "2026-05",
    createdAt: "2026-05-31 20:00",
    createdBy: "ระบบ",
    format: "PDF",
    status: "พร้อมดาวน์โหลด",
    downloads: 45,
  },
  {
    id: "RPT-010",
    name: "รายงานการติดตามงาน",
    description: "สรุปความคืบหน้าในการดำเนินการเรื่อง",
    range: "2026-05",
    createdAt: "2026-06-01 10:00",
    createdBy: "นายสมชาย ใจดี",
    format: "XLSX",
    status: "พร้อมดาวน์โหลด",
    downloads: 15,
  },
];
