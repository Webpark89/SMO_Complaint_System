export type ExecutiveRow = {
  id: string;
  period: string;
  totalComplaints: number;
  closedComplaints: number;
  avgResolutionDays: number;
  customerSatisfaction: number;
  topCategory: string;
  generatedAt: string;
};

export const mockExecutiveReports: ExecutiveRow[] = [
  {
    id: "EXE-001",
    period: "2026 Q1",
    totalComplaints: 135,
    closedComplaints: 126,
    avgResolutionDays: 13.5,
    customerSatisfaction: 87,
    topCategory: "การกำกับดูแล",
    generatedAt: "2026-04-01 09:00",
  },
  {
    id: "EXE-002",
    period: "2026 Q2",
    totalComplaints: 192,
    closedComplaints: 168,
    avgResolutionDays: 15.2,
    customerSatisfaction: 85,
    topCategory: "สิ่งแวดล้อม",
    generatedAt: "2026-07-01 09:00",
  },
];
