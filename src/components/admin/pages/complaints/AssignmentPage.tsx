import { useMemo, useState, useCallback } from "react";
import { mockAssignments } from "@/mock/complaints/assignment.mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  RefreshCw,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Clock,
  Copy,
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
  RowAction,
  CreateEditModal,
  DeleteDialog,
  DetailDrawer,
  StatusBadge,
  FilterTabs,
  SearchInput,
  FormField,
  useCRUD,
  getAssignmentStatusVariant,
} from "@/components/admin/crud";
import { TABLE_LABELS } from "@/components/admin/constants/tableLabels";
import { TEAMS as TEAMS_CANONICAL } from "@/mock/shared/file-types";

type AssignmentRow = {
  id: string;
  complaintId: string;
  complaintTitle: string;
  category: string;
  priority: string;
  submittedAt: string;
  assignedTo: string;
  status: string;
  dueAt: string;
};

const TEAMS = [...TEAMS_CANONICAL];

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "รอมอบหมาย", label: "รอมอบหมาย" },
  { value: "มอบหมายแล้ว", label: "มอบหมายแล้ว" },
];

const statusVariant = (s: string) => getAssignmentStatusVariant(s);

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสมอบหมาย" },
  { key: "complaintId", label: "รหัสเรื่องร้องเรียน" },
  { key: "complaintTitle", label: "เรื่องร้องเรียน" },
  { key: "category", label: "หมวดหมู่" },
  { key: "priority", label: "ระดับความสำคัญ" },
  { key: "submittedAt", label: "วันที่รับเรื่อง" },
  { key: "assignedTo", label: "ผู้รับมอบหมาย" },
  { key: "dueAt", label: "กำหนดเสร็จ" },
  { key: "status", label: "สถานะ" },
];

const CREATE_FIELDS: FormField[] = [
  {
    key: "complaintId",
    label: "รหัสเรื่องร้องเรียน",
    type: "text",
    placeholder: "กรอกรหัสเรื่อง",
    required: true,
  },
  {
    key: "assignedTo",
    label: "ผู้รับมอบหมาย",
    type: "select",
    placeholder: "เลือกทีมงาน",
    required: true,
    options: TEAMS,
  },
  {
    key: "dueAt",
    label: "กำหนดส่ง",
    type: "text",
    placeholder: "เช่น 2026-06-05 17:00",
    required: true,
  },
];

const EDIT_FIELDS: FormField[] = [
  {
    key: "complaintId",
    label: "รหัสเรื่องร้องเรียน",
    type: "text",
    placeholder: "กรอกรหัสเรื่อง",
    required: true,
  },
  {
    key: "assignedTo",
    label: "ผู้รับมอบหมาย",
    type: "select",
    placeholder: "เลือกทีมงาน",
    required: true,
    options: TEAMS,
  },
  {
    key: "dueAt",
    label: "กำหนดส่ง",
    type: "text",
    placeholder: "เช่น 2026-06-05 17:00",
    required: true,
  },
  {
    key: "status",
    label: "สถานะ",
    type: "select",
    placeholder: "เลือกสถานะ",
    required: true,
    options: STATUS_OPTIONS.slice(1),
  },
];

export function AssignmentPage() {
  const [state, actions] = useCRUD<AssignmentRow>(mockAssignments);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AssignmentRow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();

    return state.items.filter((r: AssignmentRow) => {
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.complaintId.toLowerCase().includes(q) ||
        r.complaintTitle.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.assignedTo.toLowerCase().includes(q);

      const matchStatus =
        state.filterStatus === "all" ? true : r.status === state.filterStatus;

      return matchQ && matchStatus;
    });
  }, [state.items, state.searchQuery, state.filterStatus]);
  const handleRefresh = useCallback(() => {
    actions.setLoading(true);
    setTimeout(() => actions.setLoading(false), 600);
  }, [actions]);

  const handleAddNew = useCallback(() => {
    setCreateValues({ complaintId: "", assignedTo: "", dueAt: "" });
    setModalOpen(true);
  }, []);

  const handleImport = useCallback(() => alert("นำเข้างานมอบหมาย (จำลอง)"), []);
  const handleExportPDF = useCallback(() => alert("ส่งออก PDF (จำลอง)"), []);

  const handleSubmitCreate = useCallback(() => {
    const newItem: AssignmentRow = {
      id: `ASN-${String(state.items.length + 1).padStart(4, "0")}`,
      complaintId: createValues.complaintId as string,
      complaintTitle: "",
      category: "",
      priority: "",
      submittedAt: "",
      assignedTo: createValues.assignedTo as string,
      dueAt: createValues.dueAt as string,
      status: "รอมอบหมาย",
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: AssignmentRow) => {
    setSelectedItem(row);
    setEditValues({ ...row });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, {
      complaintId: editValues.complaintId as string,
      assignedTo: editValues.assignedTo as string,
      dueAt: editValues.dueAt as string,
      status: editValues.status as string,
    });
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: AssignmentRow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) actions.deleteItem(selectedItem.id);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: AssignmentRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const handleClone = useCallback(
    (row: AssignmentRow) => {
      const clone: AssignmentRow = {
        ...row,
        id: `${row.id}-clone`,
        complaintId: `${row.complaintId}-clone`,
        status: "รอมอบหมาย",
      };
      actions.addItem(clone);
    },
    [actions],
  );

  const columns: Column<AssignmentRow>[] = [
    {
      key: "id",
      header: "รหัสมอบหมาย",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },

    {
      key: "complaintId",
      header: "รหัสเรื่อง",
      render: (r) => (
        <span className="font-medium text-slate-800">{r.complaintId}</span>
      ),
    },

    {
      key: "complaintTitle",
      header: "เรื่องร้องเรียน",
      render: (r) => <span className="text-slate-700">{r.complaintTitle}</span>,
    },

    {
      key: "category",
      header: "หมวดหมู่",
      render: (r) => (
        <Badge className="border border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-600 hover:bg-[rgba(193,201,214,0.12)]">
          {r.category}
        </Badge>
      ),
    },

    {
      key: "priority",
      header: "ระดับความสำคัญ",
      render: (r) => <span className="text-slate-600">{r.priority}</span>,
    },

    {
      key: "assignedTo",
      header: "ผู้รับมอบหมาย",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <UserCheck className="h-3 w-3 text-slate-400" />
          {r.assignedTo}
        </span>
      ),
    },

    {
      key: "submittedAt",
      header: "วันที่รับเรื่อง",
      render: (r) => <span className="text-slate-600">{r.submittedAt}</span>,
    },

    {
      key: "dueAt",
      header: "กำหนดส่ง",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <Clock className="h-3 w-3 text-slate-400" />
          {r.dueAt}
        </span>
      ),
    },

    {
      key: "status",
      header: "สถานะ",
      render: (r) => (
        <StatusBadge status={r.status} variant={statusVariant(r.status)} />
      ),
    },
  ];
  const rowActions: RowAction<AssignmentRow>[] = [
    { label: "แก้ไข", icon: <Edit className="h-4 w-4" />, onClick: handleEdit },
    {
      label: "ลบ",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "danger",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="การมอบหมายและประสานงาน"
        description="จัดการงานมอบหมายเรื่องร้องเรียน (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "เรื่องร้องเรียน" }, { label: "การมอบหมาย" }]}
        actionButtons={
          <ActionToolbar
            onRefresh={handleRefresh}
            onImport={handleImport}
            onExportPDF={handleExportPDF}
            exportLabel="ส่งออก"
            onAddNew={handleAddNew}
            addNewLabel={TABLE_LABELS.addNew}
            isLoading={state.isLoading}
            showAddNew
            showImport
            showExport
          />
        }
      />

      <Card className="border-[var(--border)] bg-white shadow-soft">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              value={state.searchQuery}
              onChange={actions.setSearchQuery}
              placeholder="ค้นหางานมอบหมาย..."
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
            rowActions={rowActions}
            emptyMessage="ไม่พบรายการ"
            isLoading={state.isLoading}
            showRowNumbers
            pagination={{
              page: state.page,
              pageSize: state.pageSize,
              total: filtered.length,
              onPageChange: actions.setPage,
            }}
            bulkActions={
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[var(--border)] bg-white"
                    >
                      ส่งออกที่เลือก
                      <ChevronDown className="ml-1 h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        alert(
                          `ส่งออก PDF ${state.selectedIds.size} รายการ (จำลอง)`,
                        )
                      }
                    >
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        alert(
                          `ส่งออก CSV ${state.selectedIds.size} รายการ (จำลอง)`,
                        )
                      }
                    >
                      CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[var(--border)] bg-white"
                  onClick={() =>
                    alert(`ลบ ${state.selectedIds.size} รายการ (จำลอง)`)
                  }
                >
                  <Trash2 className="mr-1 h-3 w-3" /> ลบที่เลือก
                </Button>
              </div>
            }
          />
        </CardContent>
      </Card>

      <CreateEditModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="เพิ่มมอบหมายใหม่"
        description="กำหนดรายละเอียดการมอบหมายงาน"
        fields={CREATE_FIELDS}
        values={createValues}
        onValuesChange={setCreateValues}
        onSubmit={handleSubmitCreate}
        mode="create"
        submitLabel="เพิ่ม"
      />

      <CreateEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="แก้ไขงานมอบหมาย"
        description={`แก้ไขงาน: ${selectedItem?.id ?? ""}`}
        fields={EDIT_FIELDS}
        values={editValues}
        onValuesChange={setEditValues}
        onSubmit={handleSubmitEdit}
        mode="edit"
        submitLabel="บันทึก"
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="ยืนยันการลบงานมอบหมาย"
        description="งานที่ถูกลบจะไม่สามารถกู้คืนได้"
        itemName={selectedItem?.id}
        onConfirm={handleConfirmDelete}
      />

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดงานมอบหมาย"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="md"
        actions={
          selectedItem && (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="gap-1 border-[var(--border)]"
                onClick={() => handleEdit(selectedItem)}
              >
                <Edit className="h-3 w-3" /> แก้ไข
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1 border-[var(--border)]"
                onClick={() => handleClone(selectedItem)}
              >
                <Copy className="h-3 w-3" /> คัดลอก
              </Button>
            </div>
          )
        }
      />
    </div>
  );
}
