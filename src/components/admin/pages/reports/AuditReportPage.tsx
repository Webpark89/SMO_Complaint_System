import { useMemo, useState, useCallback } from "react";
import { mockAuditLogs } from "@/mock/audit";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Download,
  FileText,
  Calendar,
  Printer,
  User,
  Shield,
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
  useCRUD,
} from "@/components/admin/crud";

type LogStatus = "สำเร็จ" | "ล้มเหลว" | "กำลังดำเนินการ" | "ระงับ";

type LogRow = {
  id: string;
  timestamp: string;
  username: string;
  userRole: string;
  action: string;
  module: string;
  ipAddress: string;
  status: LogStatus;
  description: string;
};

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "สำเร็จ", label: "สำเร็จ" },
  { value: "ล้มเหลว", label: "ล้มเหลว" },
  { value: "กำลังดำเนินการ", label: "กำลังดำเนินการ" },
  { value: "ระงับ", label: "ระงับ" },
];

function statusVariant(s: LogStatus): StatusVariant {
  if (s === "สำเร็จ") return "success";
  if (s === "ล้มเหลว") return "danger";
  if (s === "ระงับ") return "warning";
  return "neutral";
}

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสบันทึก" },
  { key: "timestamp", label: "วันที่/เวลา" },
  { key: "username", label: "ชื่อผู้ใช้" },
  { key: "userRole", label: "บทบาท" },
  { key: "action", label: "การดำเนินการ" },
  { key: "module", label: "โมดูล" },
  { key: "ipAddress", label: "IP Address" },
  { key: "status", label: "สถานะ" },
  { key: "description", label: "รายละเอียด" },
];

export function AuditReportPage() {
  const [state, actions] = useCRUD<LogRow>(mockAuditLogs);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LogRow | null>(null);

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: LogRow) => {
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.username.toLowerCase().includes(q) ||
        r.action.toLowerCase().includes(q) ||
        r.module.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
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
    () => alert("ส่งออก PDF บันทึกตรวจสอบ (จำลอง)"),
    [],
  );
  const handlePrint = useCallback(
    () => alert("พิมพ์บันทึกตรวจสอบ (จำลอง)"),
    [],
  );
  const handleView = useCallback((row: LogRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const columns: Column<LogRow>[] = [
    {
      key: "id",
      header: "รหัสบันทึก",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "timestamp",
      header: "วันที่/เวลา",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <Clock className="h-3 w-3 text-slate-400" />
          {r.timestamp}
        </span>
      ),
    },
    {
      key: "username",
      header: "ผู้ใช้",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <User className="h-3 w-3 text-slate-400" />
          {r.username}
        </span>
      ),
    },
    {
      key: "action",
      header: "การดำเนินการ",
      render: (r) => (
        <span className="font-medium text-slate-700">{r.action}</span>
      ),
    },
    {
      key: "module",
      header: "โมดูล",
      render: (r) => (
        <Badge
          variant="outline"
          className="border-[var(--border)] text-slate-600"
        >
          {r.module}
        </Badge>
      ),
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
              onClick={() => alert(`ส่งออก PDF ${r.id} (จำลอง)`)}
            >
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alert(`ส่งออก CSV ${r.id} (จำลอง)`)}
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
        title="บันทึกตรวจสอบระบบ"
        description="บันทึกการใช้งานระบบและการเปลี่ยนแปลงต่างๆ (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "รายงาน" }, { label: "บันทึกตรวจสอบ" }]}
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
              placeholder="ค้นหาบันทึกตรวจสอบ..."
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
            emptyMessage="ไม่พบบันทึก"
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
        title="รายละเอียดบันทึกตรวจสอบ"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="lg"
      />
    </div>
  );
}
