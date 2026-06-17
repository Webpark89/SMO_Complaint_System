export type NotificationRow = {
  id: string;
  name: string;
  channel: "อีเมล" | "Line" | "SMS" | "แจ้งเตือนในระบบ";
  trigger: string;
  recipients: string;
  isActive: boolean;
};

export const mockNotifications: NotificationRow[] = [
  {
    id: "NOT-001",
    name: "แจ้งเตือนเรื่องใหม่",
    channel: "อีเมล",
    trigger: "เมื่อมีเรื่องใหม่เข้ามา",
    recipients: "ผู้ดูแลเรื่อง",
    isActive: true,
  },
  {
    id: "NOT-002",
    name: "แจ้งเตือนใกล้ครบกำหนด SLA",
    channel: "Line",
    trigger: "24 ชม. ก่อนครบกำหนด",
    recipients: "ผู้ดูแลเรื่อง, หัวหน้าฝ่าย",
    isActive: true,
  },
  {
    id: "NOT-003",
    name: "แจ้งเตือนเกิน SLA",
    channel: "SMS",
    trigger: "เมื่อเกินกำหนด SLA",
    recipients: "ผู้บริหาร",
    isActive: false,
  },
  {
    id: "NOT-004",
    name: "สรุปรายงานประจำสัปดาห์",
    channel: "อีเมล",
    trigger: "ทุกวันจันทร์ 09:00",
    recipients: "ผู้บริหาร",
    isActive: true,
  },
  {
    id: "NOT-005",
    name: "แจ้งเตือนเมื่อมีการอัปเดตสถานะ",
    channel: "แจ้งเตือนในระบบ",
    trigger: "เมื่อสถานะเรื่องเปลี่ยนแปลง",
    recipients: "ผู้แจ้งเรื่อง",
    isActive: true,
  },
];
