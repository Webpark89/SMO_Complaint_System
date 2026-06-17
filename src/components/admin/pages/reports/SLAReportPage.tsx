import { useMemo, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Download,
  FileText,
  Calendar,
  Printer,
  CheckCircle,
  Clock,
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
  getSLAReportStatusVariant,
  useCRUD,
} from "@/components/admin/crud";
import { mockSLAReports } from "@/mock/reports";
import { SLA_REPORT_STATUS_OPTIONS } from "@/mock/master-data/statuses";
const STATUS_OPTIONS = SLA_REPORT_STATUS_OPTIONS;

type SLARow = {
  id: string;
  month: string;
  year: string;
  totalComplaints: number;
  withinSLA: number;
  breachedSLA: number;
  complianceRate: number;
  avgResponseHours: number;
  avgResolutionDays: number;
};

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสรายงาน" },
  { key: "month", label: "เดือน" },
  { key: "year", label: "ปี" },
  { key: "totalComplaints", label: "จำนวนรวม" },
  { key: "withinSLA", label: "ภายใน SLA" },
  { key: "breachedSLA", label: "เกิน SLA" },
  { key: "complianceRate", label: "อัตราความสอดคล้อง" },
  { key: "avgResponseHours", label: "เฉลี่ยชั่วโมงตอบ" },
  { key: "avgResolutionDays", label: "เฉลี่ยวันแก้ไข" },
];

export function SLAReportPage() {
  const [state, actions] = useCRUD<SLARow>(mockSLAReports);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SLARow | null>(null);

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: SLARow) => {
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
  const handleExportPDF = useCallback(
    () => alert("ส่งออก PDF รายงาน SLA (จำลอง)"),
    [],
  );
  const handlePrint = useCallback(() => alert("พิมพ์รายงาน SLA (จำลอง)"), []);
  const handleView = useCallback((row: SLARow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const columns: Column<SLARow>[] = [
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
          <FileText className="h-4 w-4 text-[var(--gold)]" />
          {r.month} {r.year}
        </span>
      ),
    },
    {
      key: "complianceRate",
      header: "อัตราความสอดคล้อง",
      render: (r) => (
        <span className="font-semibold text-slate-700">
          {r.complianceRate}%
        </span>
      ),
    },
    {
      key: "withinSLA",
      header: "ภายใน SLA",
      render: (r) => <span className="text-slate-600">{r.withinSLA} ราย</span>,
    },
    {
      key: "breachedSLA",
      header: "เกิน SLA",
      render: (r) => (
        <span className="text-slate-600">{r.breachedSLA} ราย</span>
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
        title="รายงาน SLA"
        description="รายงานการปฏิบัติตาม SLA (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "รายงาน" }, { label: "SLA" }]}
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
              placeholder="ค้นหารายงาน SLA..."
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
        title="รายละเอียดรายงาน SLA"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="lg"
      />
    </div>
  );
}
