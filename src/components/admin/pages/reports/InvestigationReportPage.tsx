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
  useCRUD,
  getInvestigationReportStatusVariant,
  AdvancedFilter,
  AdvancedFilterValues,
  FilterFieldConfig,
} from "@/components/admin/crud";
import { exportToCSV } from "@/utils/exportUtils";

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
  const [filterValues, setFilterValues] = useState<AdvancedFilterValues>({});
  const [hasSearched, setHasSearched] = useState(false);

  const filterFields: FilterFieldConfig[] = useMemo(
    () => [
      {
        key: "search",
        label: "ค้นหา",
        type: "text",
        placeholder: "รหัสสืบสวน, รหัสเรื่อง, หัวข้อ, ผู้สืบสวน...",
      },
      {
        key: "status",
        label: "สถานะ",
        type: "select",
        options: STATUS_OPTIONS.slice(1),
        placeholder: "เลือกสถานะ",
      },
      {
        key: "investigationStart",
        label: "ช่วงวันที่เริ่มสืบสวน",
        type: "daterange",
      },
    ],
    [],
  );

  const matchRow = useCallback(
    (r: InvestigationRow, vals: AdvancedFilterValues) => {
      const q = (vals.search ?? "").trim().toLowerCase();
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.complaintId.toLowerCase().includes(q) ||
        r.complaintTitle.toLowerCase().includes(q) ||
        r.investigator.toLowerCase().includes(q);
      const matchStatus =
        !vals.status || vals.status === "all"
          ? true
          : r.status === vals.status;
      const matchDateFrom = !vals.investigationStart_from
        ? true
        : r.investigationStart >= vals.investigationStart_from;
      const matchDateTo = !vals.investigationStart_to
        ? true
        : r.investigationStart <= vals.investigationStart_to + " 23:59";
      return matchQ && matchStatus && matchDateFrom && matchDateTo;
    },
    [],
  );

  const filtered = useMemo(() => {
    return state.items.filter((r: InvestigationRow) => matchRow(r, filterValues));
  }, [state.items, filterValues, matchRow]);

  const handleRefresh = useCallback(() => {
    actions.setLoading(true);
    setTimeout(() => actions.setLoading(false), 600);
  }, [actions]);

  const handleExportPDF = useCallback(
    () => alert("ส่งออก PDF รายงานสืบสวน (จำลอง)"),
    [],
  );

  const handleExportCSV = useCallback(
    (vals: AdvancedFilterValues) => {
      const rows = state.items.filter((r: InvestigationRow) => matchRow(r, vals));
      exportToCSV(
        rows.map((r) => ({
          รหัสสืบสวน: r.id,
          รหัสเรื่องร้องเรียน: r.complaintId,
          หัวข้อ: r.complaintTitle,
          ผู้สืบสวน: r.investigator,
          วันที่เริ่ม: r.investigationStart,
          วันที่สิ้นสุด: r.investigationEnd,
          สถานะ: r.status,
          ผลการสืบสวน: r.result,
        })),
        "รายงานสืบสวนเรื่องร้องเรียน",
      );
    },
    [state.items, matchRow],
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
              onClick={() => handleExportCSV({ status: r.status })}
            >
              CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // คำนวณยอดรวมสถิติสืบสวน จากข้อมูลที่กรองแล้ว (filtered)
  const summaryStats = useMemo(() => {
    let total = 0;
    let completed = 0;
    let active = 0;
    let pending = 0;

    filtered.forEach((r) => {
      total++;
      if (r.status === "เสร็จสิ้น") completed++;
      else if (r.status === "กำลังดำเนินการ") active++;
      else if (r.status === "รอดำเนินการ") pending++;
    });

    return {
      total,
      completed,
      active,
      pending,
    };
  }, [filtered]);

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
            onExportCSV={() => handleExportCSV(filterValues)}
            exportLabel="ส่งออก"
            showAddNew
            showImport
            showExport
            isLoading={state.isLoading}
          />
        }
      />

      <AdvancedFilter
        fields={filterFields}
        onApply={(vals) => {
          setFilterValues(vals);
          setHasSearched(true);
        }}
        onReset={() => setHasSearched(false)}
        onExport={handleExportCSV}
        resultCount={filtered.length}
        totalCount={state.items.length}
        isLoading={state.isLoading}
      />

      {hasSearched && (
        <>
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-[var(--border)] bg-white shadow-soft">
              <CardContent className="p-5">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">เคสสืบสวนทั้งหมด</div>
                <div className="text-2xl font-bold text-slate-800 mt-2">{summaryStats.total} รายการ</div>
              </CardContent>
            </Card>
            <Card className="border-[var(--border)] bg-white shadow-soft">
              <CardContent className="p-5">
                <div className="text-xs font-semibold text-green-600 uppercase tracking-wider">เสร็จสิ้นแล้ว</div>
                <div className="text-2xl font-bold text-green-700 mt-2">{summaryStats.completed} รายการ</div>
              </CardContent>
            </Card>
            <Card className="border-[var(--border)] bg-white shadow-soft">
              <CardContent className="p-5">
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">กำลังดำเนินการ</div>
                <div className="text-2xl font-bold text-blue-700 mt-2">{summaryStats.active} รายการ</div>
              </CardContent>
            </Card>
            <Card className="border-[var(--border)] bg-white shadow-soft">
              <CardContent className="p-5">
                <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">รอดำเนินการ</div>
                <div className="text-2xl font-bold text-[#b08730] mt-2">{summaryStats.pending} รายการ</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-[var(--border)] bg-white shadow-soft">
            <CardContent className="p-6 space-y-4">
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
        </>
      )}

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
