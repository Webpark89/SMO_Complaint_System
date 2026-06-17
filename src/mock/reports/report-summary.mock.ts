export type SummaryRow = {
  id: string;
  month: string;
  year: string;
  totalComplaints: number;
  closedComplaints: number;
  pendingComplaints: number;
  avgDaysToClose: number;
  slaCompliance: number;
};

export const mockSummaryReports: SummaryRow[] = [
  {
    id: "SUM-001",
    month: "มกราคม",
    year: "2026",
    totalComplaints: 45,
    closedComplaints: 42,
    pendingComplaints: 3,
    avgDaysToClose: 12.5,
    slaCompliance: 93,
  },
  {
    id: "SUM-002",
    month: "กุมภาพันธ์",
    year: "2026",
    totalComplaints: 52,
    closedComplaints: 48,
    pendingComplaints: 4,
    avgDaysToClose: 14.2,
    slaCompliance: 92,
  },
  {
    id: "SUM-003",
    month: "มีนาคม",
    year: "2026",
    totalComplaints: 38,
    closedComplaints: 36,
    pendingComplaints: 2,
    avgDaysToClose: 11.8,
    slaCompliance: 95,
  },
  {
    id: "SUM-004",
    month: "เมษายน",
    year: "2026",
    totalComplaints: 61,
    closedComplaints: 55,
    pendingComplaints: 6,
    avgDaysToClose: 15.3,
    slaCompliance: 90,
  },
  {
    id: "SUM-005",
    month: "พฤษภาคม",
    year: "2026",
    totalComplaints: 73,
    closedComplaints: 65,
    pendingComplaints: 8,
    avgDaysToClose: 16.1,
    slaCompliance: 89,
  },
];
