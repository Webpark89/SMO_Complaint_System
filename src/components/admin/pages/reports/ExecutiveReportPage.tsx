import { useMemo, useState, useCallback } from "react";
import { mockExecutiveReports } from "@/mock/reports";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Download,
  FileText,
  Calendar,
  Printer,
  TrendingUp,
  Users,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PageHeader,
  ActionToolbar,
  DataTable,
  Column,
  DetailDrawer,
  FilterTabs,
  SearchInput,
  useCRUD,
} from "@/components/admin/crud";

type ExecutiveRow = {
  id: string;
  period: string;
  totalComplaints: number;
  closedComplaints: number;
  avgResolutionDays: number;
  customerSatisfaction: number;
  topCategory: string;
  generatedAt: string;
};

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสรายงาน" },
  { key: "period", label: "ช่วงเวลา" },
  { key: "totalComplaints", label: "เรื่องรวม" },
  { key: "closedComplaints", label: "เรื่องปิดแล้ว" },
  { key: "avgResolutionDays", label: "เฉลี่ยวันแก้ไข" },
  { key: "customerSatisfaction", label: "ความพึงพอใจ" },
  { key: "topCategory", label: "หมวดหมู่สูงสุด" },
  { key: "generatedAt", label: "เพิ่มเมื่อ" },
];

export function ExecutiveReportPage() {
  const [state, actions] = useCRUD<ExecutiveRow>(mockExecutiveReports);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExecutiveRow | null>(null);

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: ExecutiveRow) => {
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.period.toLowerCase().includes(q) ||
        r.topCategory.toLowerCase().includes(q);
      return matchQ;
    });
  }, [state.items, state.searchQuery]);

  const handleRefresh = useCallback(() => {
    actions.setLoading(true);
    setTimeout(() => actions.setLoading(false), 600);
  }, [actions]);
  const handleExportPDF = useCallback(
    () => alert("ส่งออก PDF รายงานผู้บริหาร (จำลอง)"),
    [],
  );
  const handlePrint = useCallback(
    () => alert("พิมพ์รายงานผู้บริหาร (จำลอง)"),
    [],
  );
  const handleView = useCallback((row: ExecutiveRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const columns: Column<ExecutiveRow>[] = [
    {
      key: "id",
      header: "รหัสรายงาน",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "period",
      header: "ช่วงเวลา",
      render: (r) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          <FileText className="h-4 w-4 text-[var(--gold)]" />
          {r.period}
        </span>
      ),
    },
    {
      key: "totalComplaints",
      header: "เรื่องรวม",
      render: (r) => (
        <span className="text-slate-600">{r.totalComplaints} เรื่อง</span>
      ),
    },
    {
      key: "closedComplaints",
      header: "ปิดแล้ว",
      render: (r) => (
        <span className="text-slate-600">{r.closedComplaints} เรื่อง</span>
      ),
    },
    {
      key: "avgResolutionDays",
      header: "เฉลี่ยวัน",
      render: (r) => (
        <span className="text-slate-600">{r.avgResolutionDays} วัน</span>
      ),
    },
    {
      key: "customerSatisfaction",
      header: "ความพึงพอใจ",
      render: (r) => (
        <span className="text-slate-600">{r.customerSatisfaction}%</span>
      ),
    },
    {
      key: "actions",
      header: "จัดการ",
      render: (r) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="gap-1 border-[var(--border)] bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              ส่งออก
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => alert(`ส่งออก PDF ${r.period} (จำลอง)`)}
            >
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alert(`ส่งออก CSV ${r.period} (จำลอง)`)}
            >
              CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="รายงานผู้บริหาร"
        description="รายงานสรุปภาพรวมสำหรับผู้บริหารระดับสูง (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "รายงาน" }, { label: "ผู้บริหาร" }]}
        actionButtons={
          <ActionToolbar
            onRefresh={handleRefresh}
            onExportPDF={handleExportPDF}
            exportLabel="ส่งออก"
            showExport
            isLoading={state.isLoading}
          />
        }
      />

      <Card className="border-[var(--border)] bg-white shadow-soft">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              value={state.searchQuery}
              onChange={actions.setSearchQuery}
              placeholder="ค้นหารายงานผู้บริหาร..."
            />
          </div>
          <DataTable
            columns={columns}
            data={filtered}
            keyAccessor={(r) => r.id}
            selectedIds={state.selectedIds}
            onToggleSelect={actions.toggleSelect}
            onSelectAll={actions.selectAll}
            onRowClick={handleView}
            emptyMessage="ไม่พบรายงาน"
            isLoading={state.isLoading}
            showRowNumbers
            pagination={{
              page: state.page,
              pageSize: state.pageSize,
              total: filtered.length,
              onPageChange: actions.setPage,
            }}
          />
        </CardContent>
      </Card>

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดรายงานผู้บริหาร"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="lg"
      />
    </div>
  );
}
