import { useMemo, useState, useCallback } from "react";
import { mockStates } from "@/mock/organization";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, CircleDot, Copy } from "lucide-react";
import {
  PageHeader,
  ActionToolbar,
  DataTable,
  Column,
  RowAction,
  CreateEditModal,
  DeleteDialog,
  DetailDrawer,
  SearchInput,
  FormField,
  useCRUD,
} from "@/components/admin/crud";
import { TABLE_LABELS } from "@/components/admin/constants/tableLabels";

type StateRow = {
  id: string;
  name: string;
  description: string;
  order: number;
  color: string;
};

const STATUS_OPTIONS = [{ value: "all", label: "ทั้งหมด" }];

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสสถานะ" },
  { key: "name", label: "ชื่อสถานะ" },
  { key: "description", label: "คำอธิบาย" },
  { key: "order", label: "ลำดับ" },
];

const CREATE_FIELDS: FormField[] = [
  {
    key: "name",
    label: "ชื่อสถานะ",
    type: "text",
    placeholder: "กรอกชื่อสถานะ",
    required: true,
  },
  {
    key: "description",
    label: "คำอธิบาย",
    type: "textarea",
    placeholder: "กรอกคำอธิบายสถานะ",
    required: true,
  },
  {
    key: "order",
    label: "ลำดับ",
    type: "number",
    placeholder: "0",
    required: true,
  },
];

const EDIT_FIELDS: FormField[] = [
  {
    key: "name",
    label: "ชื่อสถานะ",
    type: "text",
    placeholder: "กรอกชื่อสถานะ",
    required: true,
  },
  {
    key: "description",
    label: "คำอธิบาย",
    type: "textarea",
    placeholder: "กรอกคำอธิบายสถานะ",
    required: true,
  },
  {
    key: "order",
    label: "ลำดับ",
    type: "number",
    placeholder: "0",
    required: true,
  },
];

export function StatesPage() {
  const [state, actions] = useCRUD<StateRow>(mockStates);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StateRow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: StateRow) => {
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
      return matchQ;
    });
  }, [state.items, state.searchQuery]);

  const handleRefresh = useCallback(() => {
    actions.setLoading(true);
    setTimeout(() => actions.setLoading(false), 600);
  }, [actions]);

  const handleAddNew = useCallback(() => {
    setCreateValues({
      name: "",
      description: "",
      order: state.items.length + 1,
    });
    setModalOpen(true);
  }, [state.items.length]);

  const handleImport = useCallback(() => alert("นำเข้าสถานะ (จำลอง)"), []);
  const handleExport = useCallback(() => alert("ส่งออกสถานะ (จำลอง)"), []);

  const handleSubmitCreate = useCallback(() => {
    const newItem: StateRow = {
      id: `ST-${String(state.items.length + 1).padStart(3, "0")}`,
      name: createValues.name as string,
      description: createValues.description as string,
      order: Number(createValues.order) || 0,
      color: "success",
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: StateRow) => {
    setSelectedItem(row);
    setEditValues({ ...row });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, {
      name: editValues.name as string,
      description: editValues.description as string,
      order: Number(editValues.order) || 0,
    });
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: StateRow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) actions.deleteItem(selectedItem.id);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: StateRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const handleClone = useCallback(
    (row: StateRow) => {
      const clone: StateRow = {
        ...row,
        id: `${row.id}-clone`,
        name: `${row.name} (คัดลอก)`,
      };
      actions.addItem(clone);
    },
    [actions],
  );

  const columns: Column<StateRow>[] = [
    {
      key: "id",
      header: "รหัส",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "name",
      header: "ชื่อสถานะ",
      render: (r) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          <CircleDot className="h-4 w-4 text-[var(--gold)]" />
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
      key: "order",
      header: "ลำดับ",
      render: (r) => (
        <Badge className="border border-[rgba(176,141,87,0.25)] bg-[rgba(176,141,87,0.12)] text-[var(--gold)]">
          {r.order}
        </Badge>
      ),
    },
  ];

  const rowActions: RowAction<StateRow>[] = [
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
        title="สถานะเรื่องร้องเรียน"
        description="กำหนดสถานะเรื่องร้องเรียนทั้งหมด (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "ตั้งค่าระบบ" }, { label: "สถานะ" }]}
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
              placeholder="ค้นหาสถานะ..."
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
            emptyMessage="ไม่พบสถานะ"
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
        title="เพิ่มสถานะใหม่"
        description="กำหนดชื่อและคำอธิบายสำหรับสถานะใหม่"
        fields={CREATE_FIELDS}
        values={createValues}
        onValuesChange={setCreateValues}
        onSubmit={handleSubmitCreate}
        mode="create"
        submitLabel="เพิ่มสถานะ"
      />

      <CreateEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="แก้ไขสถานะ"
        description={`แก้ไขสถานะ: ${selectedItem?.name ?? ""}`}
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
        title="ยืนยันการลบสถานะ"
        description="สถานะที่ถูกลบจะไม่สามารถกู้คืนได้"
        itemName={selectedItem?.name}
        onConfirm={handleConfirmDelete}
      />

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดสถานะ"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="md"
      />
    </div>
  );
}
