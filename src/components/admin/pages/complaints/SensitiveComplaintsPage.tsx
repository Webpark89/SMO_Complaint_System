import { useMemo, useState, useCallback } from "react";
import { mockSensitiveCases } from "@/mock/assignment/sensitive.mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Shield, Copy, ChevronDown } from "lucide-react";
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
  getSensitiveStatusVariant,
} from "@/components/admin/crud";
import { TABLE_LABELS } from "@/components/admin/constants/tableLabels";

type SensitiveRow = {
  id: string;
  complaintId: string;
  complaintTitle: string;
  category: string;
  priority: string;
  reportedBy: string;
  reportedAt: string;
  assignedTo: string;
  status: string;
  accessLevel: string;
};

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "รอประเมิน", label: "รอประเมิน" },
  { value: "กำลังสืบสวน", label: "กำลังสืบสวน" },
  { value: "เสร็จสิ้น", label: "เสร็จสิ้น" },
];

const statusVariant = (s: string) => getSensitiveStatusVariant(s);

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสเรื่องลับ" },
  { key: "complaintId", label: "รหัสเรื่อง" },
  { key: "complaintTitle", label: "หัวข้อ" },
  { key: "category", label: "หมวดหมู่" },
  { key: "priority", label: "ระดับความสำคัญ" },
  { key: "reportedBy", label: "ผู้แจ้ง" },
  { key: "reportedAt", label: "วันที่แจ้ง" },
  { key: "assignedTo", label: "ผู้ดูแล" },
  { key: "status", label: "สถานะ" },
  { key: "accessLevel", label: "ระดับการเข้าถึง" },
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
    placeholder: "กรอกหัวข้อเรื่องลับ",
    required: true,
  },
  {
    key: "category",
    label: "หมวดหมู่",
    type: "text",
    placeholder: "กรอกหมวดหมู่",
    required: true,
  },
  {
    key: "priority",
    label: "ระดับความสำคัญ",
    type: "text",
    placeholder: "กรอกระดับความสำคัญ",
    required: true,
  },
  {
    key: "accessLevel",
    label: "ระดับการเข้าถึง",
    type: "text",
    placeholder: "กรอกระดับการเข้าถึง",
    required: false,
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
    placeholder: "กรอกหัวข้อเรื่องลับ",
    required: true,
  },
  {
    key: "category",
    label: "หมวดหมู่",
    type: "text",
    placeholder: "กรอกหมวดหมู่",
    required: true,
  },
  {
    key: "priority",
    label: "ระดับความสำคัญ",
    type: "text",
    placeholder: "กรอกระดับความสำคัญ",
    required: true,
  },
  {
    key: "accessLevel",
    label: "ระดับการเข้าถึง",
    type: "text",
    placeholder: "กรอกระดับการเข้าถึง",
    required: false,
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

export function SensitiveComplaintsPage() {
  const [state, actions] = useCRUD<SensitiveRow>(mockSensitiveCases);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SensitiveRow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: SensitiveRow) => {
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.complaintId.toLowerCase().includes(q) ||
        r.complaintTitle.toLowerCase().includes(q);
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
    setCreateValues({
      complaintId: "",
      topic: "",
      classification: "",
      securityLevel: "",
    });
    setModalOpen(true);
  }, []);

  const handleImport = useCallback(() => alert("นำเข้าเรื่องลับ (จำลอง)"), []);
  const handleExportPDF = useCallback(
    () => alert("ส่งออก PDF เรื่องลับ (จำลอง)"),
    [],
  );

  const handleSubmitCreate = useCallback(() => {
    const newItem: SensitiveRow = {
      id: `SEC-${String(state.items.length + 1).padStart(3, "0")}`,
      complaintId: createValues.complaintId as string,
      complaintTitle: createValues.complaintTitle as string,
      category: createValues.category as string,
      priority: createValues.priority as string,
      reportedBy: "ระบบ",
      reportedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      assignedTo: "—",
      accessLevel: (createValues.accessLevel as string) || "—",
      status: "รอประเมิน",
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: SensitiveRow) => {
    setSelectedItem(row);
    setEditValues({ ...row });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, {
      complaintId: editValues.complaintId as string,
      complaintTitle: editValues.complaintTitle as string,
      category: editValues.category as string,
      priority: editValues.priority as string,
      accessLevel: (editValues.accessLevel as string) || "—",
      status: editValues.status as string,
    });
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: SensitiveRow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) actions.deleteItem(selectedItem.id);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: SensitiveRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const handleClone = useCallback(
    (row: SensitiveRow) => {
      const clone: SensitiveRow = {
        ...row,
        id: `${row.id}-clone`,
        complaintId: `${row.complaintId}-clone`,
        status: "รอประเมิน",
      };
      actions.addItem(clone);
    },
    [actions],
  );

  const columns: Column<SensitiveRow>[] = [
    {
      key: "id",
      header: "รหัสเรื่องลับ",
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
      key: "category",
      header: "หมวดหมู่",
      render: (r) => (
        <Badge className="border border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-600 hover:bg-[rgba(193,201,214,0.12)]">
          {r.category}
        </Badge>
      ),
    },
    {
      key: "accessLevel",
      header: "ระดับ",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <Shield className="h-3 w-3 text-[var(--gold)]" />
          {r.accessLevel}
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

  const rowActions: RowAction<SensitiveRow>[] = [
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
        title="เรื่องร้องเรียนลับและรัศมีสูง"
        description="จัดการเรื่องร้องเรียนลับและรัศมีสูง (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "เรื่องร้องเรียน" }, { label: "เรื่องลับ" }]}
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
              placeholder="ค้นหาเรื่องลับ..."
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
        title="เพิ่มเรื่องลับใหม่"
        description="กำหนดรายละเอียดเรื่องร้องเรียนลับและรัศมีสูง"
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
        title="แก้ไขเรื่องลับ"
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
        title="ยืนยันการลบเรื่องลับ"
        description="เรื่องที่ถูกลบจะไม่สามารถกู้คืนได้"
        itemName={selectedItem?.id}
        onConfirm={handleConfirmDelete}
      />

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดเรื่องลับ"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="lg"
      />
    </div>
  );
}
