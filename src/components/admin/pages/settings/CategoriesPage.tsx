import { useMemo, useState, useCallback } from "react";
import { mockCategories } from "@/mock/organization";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, FolderOpen } from "lucide-react";
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
  useCRUD,
} from "@/components/admin/crud";
import { TABLE_LABELS } from "@/components/admin/constants/tableLabels";

type CategoryStatus = "เปิดใช้งาน" | "ระงับ";

type CategoryRow = {
  id: string;
  name: string;
  description: string;
  subcategoryCount: number;
  status: CategoryStatus;
};

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "เปิดใช้งาน", label: "เปิดใช้งาน" },
  { value: "ระงับ", label: "ระงับ" },
];

function statusVariant(s: CategoryStatus): StatusVariant {
  return s === "เปิดใช้งาน" ? "success" : "danger";
}

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสหมวดหมู่" },
  { key: "name", label: "ชื่อหมวดหมู่" },
  { key: "description", label: "คำอธิบาย" },
  { key: "subcategoryCount", label: "จำนวนหมวดย่อย" },
  { key: "status", label: "สถานะ" },
];

const CREATE_FIELDS: FormField[] = [
  {
    key: "name",
    label: "ชื่อหมวดหมู่",
    type: "text",
    placeholder: "กรอกชื่อหมวดหมู่",
    required: true,
  },
  {
    key: "description",
    label: "คำอธิบาย",
    type: "textarea",
    placeholder: "กรอกคำอธิบายหมวดหมู่",
    required: true,
  },
];

const EDIT_FIELDS: FormField[] = [
  {
    key: "name",
    label: "ชื่อหมวดหมู่",
    type: "text",
    placeholder: "กรอกชื่อหมวดหมู่",
    required: true,
  },
  {
    key: "description",
    label: "คำอธิบาย",
    type: "textarea",
    placeholder: "กรอกคำอธิบายหมวดหมู่",
    required: true,
  },
  {
    key: "status",
    label: "สถานะ",
    type: "select",
    required: true,
    options: STATUS_OPTIONS.slice(1),
  },
];

export function CategoriesPage() {
  const [state, actions] = useCRUD<CategoryRow>(mockCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CategoryRow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: CategoryRow) => {
      const matchQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
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

  const handleAddNew = useCallback(() => {
    setCreateValues({ name: "", description: "" });
    setModalOpen(true);
  }, []);

  const handleImport = useCallback(() => alert("นำเข้าหมวดหมู่ (จำลอง)"), []);
  const handleExport = useCallback(() => alert("ส่งออกหมวดหมู่ (จำลอง)"), []);

  const handleSubmitCreate = useCallback(() => {
    const newItem: CategoryRow = {
      id: `CMP-${String(state.items.length + 1).padStart(3, "0")}`,
      name: createValues.name as string,
      description: createValues.description as string,
      subcategoryCount: 0,
      status: "เปิดใช้งาน",
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: CategoryRow) => {
    setSelectedItem(row);
    setEditValues({ ...row });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, {
      name: editValues.name as string,
      description: editValues.description as string,
      status: editValues.status as CategoryStatus,
    });
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: CategoryRow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) actions.deleteItem(selectedItem.id);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: CategoryRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const handleClone = useCallback(
    (row: CategoryRow) => {
      const clone: CategoryRow = {
        ...row,
        id: `${row.id}-clone`,
        name: `${row.name} (คัดลอก)`,
        subcategoryCount: 0,
      };
      actions.addItem(clone);
    },
    [actions],
  );

  const columns: Column<CategoryRow>[] = [
    {
      key: "id",
      header: "รหัส",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "name",
      header: "ชื่อหมวดหมู่",
      render: (r) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          <FolderOpen className="h-4 w-4 text-[var(--gold)]" />
          {r.name}
        </span>
      ),
    },
    {
      key: "description",
      header: "คำอธิบาย",
      render: (r) => <span className="text-slate-600">{r.description}</span>,
    },
    {
      key: "subcategoryCount",
      header: "หมวดย่อย",
      render: (r) => (
        <span className="text-slate-600">{r.subcategoryCount} รายการ</span>
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

  const rowActions: RowAction<CategoryRow>[] = [
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
        title="ประเภทเรื่องร้องเรียน"
        description="จัดการหมวดหมู่และประเภทเรื่อง (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "ตั้งค่าระบบ" }, { label: "หมวดหมู่" }]}
        actionButtons={
          <ActionToolbar
            onRefresh={handleRefresh}
            onImport={handleImport}
            onAddNew={handleAddNew}
            addNewLabel={TABLE_LABELS.addNew}
            exportLabel="ส่งออก"
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
              placeholder="ค้นหาหมวดหมู่..."
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
            emptyMessage="ไม่พบหมวดหมู่"
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
        title="เพิ่มหมวดหมู่ใหม่"
        description="กำหนดชื่อและคำอธิบายสำหรับหมวดหมู่ใหม่"
        fields={CREATE_FIELDS}
        values={createValues}
        onValuesChange={setCreateValues}
        onSubmit={handleSubmitCreate}
        mode="create"
        submitLabel="เพิ่มหมวดหมู่"
      />

      <CreateEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="แก้ไขหมวดหมู่"
        description={`แก้ไขหมวดหมู่: ${selectedItem?.name ?? ""}`}
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
        title="ยืนยันการลบหมวดหมู่"
        description="หมวดหมู่ที่ถูกลบจะไม่สามารถกู้คืนได้"
        itemName={selectedItem?.name}
        onConfirm={handleConfirmDelete}
      />

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดหมวดหมู่"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="md"
      />
    </div>
  );
}
