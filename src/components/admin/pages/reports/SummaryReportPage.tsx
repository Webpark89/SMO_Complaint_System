import { useMemo, useState, useCallback } from "react";
import { mockSummaryReports } from "@/mock/reports";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronDown } from "lucide-react";
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

type SummaryRow = {
  id: string;
  month: string;
  year: string;
  totalComplaints: number;
  closedComplaints: number;
  pendingComplaints: number;
  avgDaysToClose: number;
  slaCompliance: number;
};

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสรายงาน" },
  { key: "month", label: "เดือน" },
  { key: "year", label: "ปี" },
  { key: "totalComplaints", label: "จำนวนเรื่องร้องเรียน" },
  { key: "closedComplaints", label: "เรื่องที่ปิดแล้ว" },
  { key: "pendingComplaints", label: "เรื่องที่รอดำเนินการ" },
  { key: "avgDaysToClose", label: "เฉลี่ยวันที่ปิดเรื่อง" },
  { key: "slaCompliance", label: "ความสอดคล้อง SLA" },
];

export function SummaryReportPage() {
  const [state, actions] = useCRUD<SummaryRow>(mockSummaryReports);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SummaryRow | null>(null);

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: SummaryRow) => {
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.month.toLowerCase().includes(q) ||
        r.year.toLowerCase().includes(q);
      return matchQ;
    });
  }, [state.items, state.searchQuery]);

  const handleRefresh = useCallback(() => {
    actions.setLoading(true);
    setTimeout(() => actions.setLoading(false), 600);
  }, [actions]);
  const handleExportPDF = useCallback(() => alert("ส่งออก PDF (จำลอง)"), []);
  const handleExportXLSX = useCallback(() => alert("ส่งออก XLSX (จำลอง)"), []);
  const handlePrint = useCallback(() => alert("พิมพ์รายงาน (จำลอง)"), []);
  const handleView = useCallback((row: SummaryRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const columns: Column<SummaryRow>[] = [
    {
      key: "id",
      header: "รหัสรายงาน",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "month",
      header: "เดือน",
      render: (r) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          <Calendar className="h-3 w-3 text-slate-400" />
          {r.month}
        </span>
      ),
    },
    {
      key: "year",
      header: "ปี",
      render: (r) => <span className="text-slate-600">{r.year}</span>,
    },
    {
      key: "totalComplaints",
      header: "จำนวนเรื่อง",
      render: (r) => (
        <span className="text-slate-600">{r.totalComplaints} เรื่อง</span>
      ),
    },
    {
      key: "closedComplaints",
      header: "ปิดแล้ว",
      render: (r) => (
        <Badge variant="default" className="bg-green-100 text-green-700">
          {r.closedComplaints}
        </Badge>
      ),
    },
    {
      key: "pendingComplaints",
      header: "รอดำเนินการ",
      render: (r) => (
        <Badge variant="default" className="bg-amber-100 text-amber-700">
          {r.pendingComplaints}
        </Badge>
      ),
    },
    {
      key: "avgDaysToClose",
      header: "เฉลี่ยวัน",
      render: (r) => (
        <span className="text-slate-600">{r.avgDaysToClose} วัน</span>
      ),
    },
    {
      key: "slaCompliance",
      header: "SLA %",
      render: (r) => <span className="text-slate-600">{r.slaCompliance}%</span>,
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
              onClick={() => alert(`ส่งออก PDF ${r.month} ${r.year} (จำลอง)`)}
            >
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alert(`ส่งออก CSV ${r.month} ${r.year} (จำลอง)`)}
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
        title="รายงานสรุปเรื่องร้องเรียน"
        description="รายงานสรุปและวิเคราะห์เรื่องร้องเรียน (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "รายงาน" }, { label: "สรุปเรื่องร้องเรียน" }]}
        actionButtons={
          <ActionToolbar
            onRefresh={handleRefresh}
            onExportPDF={handleExportPDF}
            exportLabel="ส่งออก"
            showAddNew
            showImport
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
              placeholder="ค้นหารายงาน..."
            />
            <FilterTabs
              options={[{ value: "all", label: "ทั้งหมด" }]}
              value={state.filterStatus}
              onChange={actions.setFilterStatus}
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
        title="รายละเอียดรายงาน"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="lg"
      />
    </div>
  );
}
