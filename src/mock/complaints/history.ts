export const complaintHistory = [
  {
    id: "CMP-2026-0001",
    title: "ยักยอกเงินบริษัท",
    datetime: "05/05/2569 12:00",
    branch: "สำนักงานใหญ่",
    status: "Pending",
  },
  {
    id: "CMP-2026-0002",
    title: "พูดจาไม่สุภาพกับลูกค้า",
    datetime: "04/05/2569 15:30",
    branch: "สาขาท่าชนะ",
    status: "In Progress",
  },
  {
    id: "CMP-2026-0003",
    title: "สินค้าชำรุด",
    datetime: "03/05/2569 09:20",
    branch: "สาขาพนม",
    status: "Completed",
  },
  {
    id: "CMP-2026-0004",
    title: "ไม่สวม PPE",
    datetime: "02/05/2569 11:10",
    branch: "สาขาสระบุรี",
    status: "Investigating",
  },
];

export type ComplaintHistoryItem = {
  id: string;
  title: string;
  datetime: string;
  branch: string;
  status: string;
};
