import { useMemo, useState, useCallback } from "react";
import { mockInvestigationReports } from "@/mock/reports";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Download,
  FileText,
  Calendar,
  Printer,
  Search,
  AlertCircle,
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
  StatusBadge,
  StatusVariant,
  FilterTabs,
  SearchInput,
  useCRUD,
  getInvestigationReportStatusVariant,
} from "@/components/admin/crud";

type InvestigationRow = {
  id: string;
  complaintId: string;
  complaintTitle: string;
  investigator: string;
  investigationStart: string;
  investigationEnd: string;
  status: string;
  result: string;
};

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "รอดำเนินการ", label: "รอดำเนินการ" },
  { value: "กำลังดำเนินการ", label: "กำลังดำเนินการ" },
  { value: "เสร็จสิ้น", label: "เสร็จสิ้น" },
];

const statusVariant = (s: string): StatusVariant =>
  getInvestigationReportStatusVariant(s);

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสสืบสวน" },
  { key: "complaintId", label: "รหัสเรื่องร้องเรียน" },
  { key: "complaintTitle", label: "หัวข้อ" },
  { key: "investigator", label: "ผู้สืบสวน" },
  { key: "investigationStart", label: "วันที่เริ่ม" },
  { key: "investigationEnd", label: "วันที่สิ้นสุด" },
  { key: "status", label: "สถานะ" },
  { key: "result", label: "ผลการสืบสวน" },
];

export function InvestigationReportPage() {
  const [state, actions] = useCRUD<InvestigationRow>(mockInvestigationReports);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InvestigationRow | null>(
    null,
  );

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: InvestigationRow) => {
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.complaintId.toLowerCase().includes(q) ||
        r.complaintTitle.toLowerCase().includes(q) ||
        r.investigator.toLowerCase().includes(q);
      const matchStatus =
        state.filterStatus === "all" ? true : r.status === state.filterStatus;
      return matchQ && matchStatus;
    });
  }, [state.items, state.searchQuery, state.filterStatus]);

  const handleRefresh = useCallback(() => {
    actions.setLoading(true);
    setTimeout(() => actions.setLoading(false), 600);
  }, [actions]);
  const handleExportPDF = useCallback(
    () => alert("ส่งออก PDF รายงานสืบสวน (จำลอง)"),
    [],
  );
  const handlePrint = useCallback(() => alert("พิมพ์รายงานสืบสวน (จำลอง)"), []);
  const handleView = useCallback((row: InvestigationRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const columns: Column<InvestigationRow>[] = [
    {
      key: "id",
      header: "รหัสสืบสวน",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "complaintId",
      header: "รหัสเรื่อง",
      render: (r) => <span className="text-slate-600">{r.complaintId}</span>,
    },
    {
      key: "complaintTitle",
      header: "หัวข้อ",
      render: (r) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          <Search className="h-4 w-4 text-[var(--gold)]" />
          {r.complaintTitle}
        </span>
      ),
    },
    {
      key: "investigator",
      header: "ผู้สืบสวน",
      render: (r) => <span className="text-slate-600">{r.investigator}</span>,
    },
    {
      key: "status",
      header: "สถานะ",
      render: (r) => (
        <StatusBadge status={r.status} variant={statusVariant(r.status)} />
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
              onClick={() => alert(`ส่งออก PDF ${r.complaintTitle} (จำลอง)`)}
            >
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alert(`ส่งออก CSV ${r.complaintTitle} (จำลอง)`)}
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
        title="รายงานสืบสวนเรื่องร้องเรียน"
        description="รายงานความคืบหน้าและผลการสืบสวนเรื่องร้องเรียน (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "รายงาน" }, { label: "สืบสวน" }]}
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
              placeholder="ค้นหารายงานสืบสวน..."
            />
            <FilterTabs
              options={STATUS_OPTIONS}
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
        title="รายละเอียดรายงานสืบสวน"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="lg"
      />
    </div>
  );
}
