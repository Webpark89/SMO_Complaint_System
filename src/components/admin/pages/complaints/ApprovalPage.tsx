import { useMemo, useState, useCallback } from "react";
import { mockApprovals } from "@/mock/complaints/ApprovalMock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ChevronDown } from "lucide-react";
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
  StatusVariant,
  FilterTabs,
  SearchInput,
  FormField,
  getApprovalStatusVariant,
  useCRUD,
} from "@/components/admin/crud";
import { TABLE_LABELS } from "@/components/admin/constants/tableLabels";

type ApprovalRow = {
  id: string;
  complaintId: string;
  complaintTitle: string;
  submittedBy: string;
  submittedAt: string;
  assignedTo: string;
  status: string;
  priority: string;
  dueAt: string;
  topic: string;
  submitter: string;
  approver: string;
  approvedAt: string;
  level: string;
};

const LEVEL_OPTIONS = [
  { value: "ระดับ 1", label: "ระดับ 1" },
  { value: "ระดับ 2", label: "ระดับ 2" },
  { value: "ระดับ 3", label: "ระดับ 3" },
  { value: "ระดับ 4", label: "ระดับ 4" },
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "ทั้งหมด" },
  { value: "รออนุมัติ", label: "รออนุมัติ" },
  { value: "อนุมัติแล้ว", label: "อนุมัติแล้ว" },
  { value: "ปฏิเสธ", label: "ปฏิเสธ" },
];

const statusVariant = (s: string): StatusVariant => getApprovalStatusVariant(s);

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสอนุมัติ" },
  { key: "complaintId", label: "รหัสเรื่อง" },
  { key: "complaintTitle", label: "หัวข้อ" },
  { key: "submittedBy", label: "ผู้ยื่นขอ" },
  { key: "submittedAt", label: "วันที่ยื่น" },
  { key: "assignedTo", label: "ผู้รับมอบหมาย" },
  { key: "priority", label: "ความสำคัญ" },
  { key: "dueAt", label: "กำหนด" },
  { key: "topic", label: "หัวข้อ" },
  { key: "submitter", label: "ผู้ยื่นขอ" },
  { key: "approver", label: "ผู้อนุมัติ" },
  { key: "approvedAt", label: "วันที่อนุมัติ" },
  { key: "level", label: "ระดับ" },
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
    key: "complaintTitle",
    label: "หัวข้อ",
    type: "text",
    placeholder: "กรอกหัวข้อการอนุมัติ",
    required: true,
  },
  {
    key: "level",
    label: "ระดับ",
    type: "select",
    placeholder: "เลือกระดับ",
    required: true,
    options: LEVEL_OPTIONS,
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
    key: "complaintTitle",
    label: "หัวข้อ",
    type: "text",
    placeholder: "กรอกหัวข้อการอนุมัติ",
    required: true,
  },
  {
    key: "level",
    label: "ระดับ",
    type: "select",
    placeholder: "เลือกระดับ",
    required: true,
    options: LEVEL_OPTIONS,
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

export function ApprovalPage() {
  const [state, actions] = useCRUD<ApprovalRow>(mockApprovals);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ApprovalRow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: ApprovalRow) => {
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.complaintId.toLowerCase().includes(q) ||
        r.complaintTitle.toLowerCase().includes(q) ||
        r.submittedBy.toLowerCase().includes(q);
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
    setCreateValues({ complaintId: "", complaintTitle: "", level: "" });
    setModalOpen(true);
  }, []);

  const handleImport = useCallback(() => alert("นำเข้างานอนุมัติ (จำลอง)"), []);
  const handleExportPDF = useCallback(() => alert("ส่งออก PDF (จำลอง)"), []);

  const handleSubmitCreate = useCallback(() => {
    const newItem: ApprovalRow = {
      id: `APR-${String(state.items.length + 1).padStart(3, "0")}`,
      complaintId: createValues.complaintId as string,
      complaintTitle: createValues.complaintTitle as string,
      submittedBy: "ระบบ",
      submittedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      assignedTo: "—",
      status: "รออนุมัติ",
      priority: "ปกติ",
      dueAt: "—",
      topic: "—",
      submitter: "ระบบ",
      approver: "—",
      approvedAt: "—",
      level: createValues.level as string,
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: ApprovalRow) => {
    setSelectedItem(row);
    setEditValues({ ...row });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, {
      complaintId: editValues.complaintId as string,
      complaintTitle: editValues.complaintTitle as string,
      level: editValues.level as string,
      status: editValues.status as string,
    });
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: ApprovalRow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) actions.deleteItem(selectedItem.id);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: ApprovalRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const handleClone = useCallback(
    (row: ApprovalRow) => {
      const clone: ApprovalRow = {
        ...row,
        id: `${row.id}-clone`,
        complaintId: `${row.complaintId}-clone`,
        status: "รออนุมัติ",
      };
      actions.addItem(clone);
    },
    [actions],
  );

  const columns: Column<ApprovalRow>[] = [
    {
      key: "id",
      header: "รหัสอนุมัติ",
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
      header: "หัวข้อ",
      render: (r) => (
        <span className="text-slate-600 line-clamp-1">{r.complaintTitle}</span>
      ),
    },
    {
      key: "submittedBy",
      header: "ผู้ยื่น",
      render: (r) => <span className="text-slate-600">{r.submittedBy}</span>,
    },
    {
      key: "assignedTo",
      header: "ผู้รับมอบหมาย",
      render: (r) => <span className="text-slate-600">{r.assignedTo}</span>,
    },
    {
      key: "priority",
      header: "ความสำคัญ",
      render: (r) => (
        <Badge
          variant="outline"
          className="border-[var(--border)] text-slate-600"
        >
          {r.priority}
        </Badge>
      ),
    },
    {
      key: "level",
      header: "ระดับ",
      render: (r) => <span className="text-slate-600">{r.level}</span>,
    },
    {
      key: "status",
      header: "สถานะ",
      render: (r) => (
        <StatusBadge status={r.status} variant={statusVariant(r.status)} />
      ),
    },
  ];

  const rowActions: RowAction<ApprovalRow>[] = [
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
        title="การอนุมัติเรื่องร้องเรียน"
        description="จัดการงานอนุมัติเรื่องร้องเรียน (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "เรื่องร้องเรียน" }, { label: "การอนุมัติ" }]}
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
              placeholder="ค้นหางานอนุมัติ..."
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
            onRowClick={handleView}
          />
        </CardContent>
      </Card>

      <CreateEditModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="เพิ่มอนุมัติใหม่"
        description="กำหนดรายละเอียดการอนุมัติเรื่องร้องเรียน"
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
        title="แก้ไขงานอนุมัติ"
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
        title="ยืนยันการลบงานอนุมัติ"
        description="งานที่ถูกลบจะไม่สามารถกู้คืนได้"
        itemName={selectedItem?.id}
        onConfirm={handleConfirmDelete}
      />

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดงานอนุมัติ"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="lg"
      />
    </div>
  );
}
