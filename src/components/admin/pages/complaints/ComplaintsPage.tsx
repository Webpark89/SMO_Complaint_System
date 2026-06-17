import { useMemo, useState, useCallback } from "react";
import { mockComplaintList } from "@/mock/complaints";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  FileText,
  MapPin,
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
  getComplaintStatusVariant,
  getComplaintPriorityVariant,
  useCRUD,
} from "@/components/admin/crud";
import { TABLE_LABELS } from "@/components/admin/constants/tableLabels";

type ComplaintRow = {
  id: string;
  title: string;
  category: string;
  submittedAt: string;
  location: string;
  status: string;
  priority: string;
  submittedBy: string;
};

const CATEGORIES = [
  { value: "ethics", label: "จริยธรรม", code: "1.1" },
  { value: "fraud", label: "การทุจริต", code: "1.2" },
  { value: "employee_conduct", label: "พฤติกรรมพนักงาน", code: "1.3" },
  { value: "product_service", label: "ผลิตภัณฑ์และบริการ", code: "1.4" },
  { value: "safety", label: "ความปลอดภัย", code: "1.5" },
  { value: "environmental", label: "ด้านสิ่งแวดล้อม", code: "1.6" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "ใหม่", label: "ใหม่" },
  { value: "กำลังดำเนินการ", label: "กำลังดำเนินการ" },
  { value: "รอตรวจสอบ", label: "รอตรวจสอบ" },
  { value: "ปิดเรื่อง", label: "ปิดเรื่อง" },
];

const PRIORITIES = [
  { value: "ด่วนมาก", label: "ด่วนมาก" },
  { value: "ด่วน", label: "ด่วน" },
  { value: "ปกติ", label: "ปกติ" },
  { value: "ไม่ด่วน", label: "ไม่ด่วน" },
];

const statusVariant = (s: string) => getComplaintStatusVariant(s);

const priorityVariant = (p: string) => getComplaintPriorityVariant(p);

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสเรื่อง" },
  { key: "title", label: "หัวข้อ" },
  { key: "category", label: "หมวดหมู่" },
  { key: "submittedAt", label: "วันที่ร้องเรียน" },
  { key: "submittedBy", label: "ผู้ร้องเรียน" },
  { key: "location", label: "พื้นที่/สาขา" },
  { key: "status", label: "สถานะ" },
  { key: "priority", label: "ระดับความสำคัญ" },
];

const CREATE_FIELDS: FormField[] = [
  {
    key: "title",
    label: "หัวข้อ",
    type: "text",
    placeholder: "กรอกหัวข้อเรื่องร้องเรียน",
    required: true,
  },
  {
    key: "category",
    label: "หมวดหมู่",
    type: "select",
    placeholder: "เลือกหมวดหมู่",
    required: true,
    options: CATEGORIES,
  },
  {
    key: "location",
    label: "พื้นที่/สาขา",
    type: "text",
    placeholder: "กรอกพื้นที่หรือสาขา",
    required: true,
  },
  {
    key: "priority",
    label: "ระดับความสำคัญ",
    type: "select",
    placeholder: "เลือกระดับความสำคัญ",
    required: true,
    options: PRIORITIES,
  },
  {
    key: "submittedBy",
    label: "ผู้ร้องเรียน",
    type: "text",
    placeholder: "กรอกชื่อผู้ร้องเรียน",
    required: true,
  },
];

const EDIT_FIELDS: FormField[] = [
  {
    key: "title",
    label: "หัวข้อ",
    type: "text",
    placeholder: "กรอกหัวข้อเรื่องร้องเรียน",
    required: true,
  },
  {
    key: "category",
    label: "หมวดหมู่",
    type: "select",
    placeholder: "เลือกหมวดหมู่",
    required: true,
    options: CATEGORIES,
  },
  {
    key: "location",
    label: "พื้นที่/สาขา",
    type: "text",
    placeholder: "กรอกพื้นที่หรือสาขา",
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
  {
    key: "priority",
    label: "ระดับความสำคัญ",
    type: "select",
    placeholder: "เลือกระดับความสำคัญ",
    required: true,
    options: PRIORITIES,
  },
  {
    key: "submittedBy",
    label: "ผู้ร้องเรียน",
    type: "text",
    placeholder: "กรอกชื่อผู้ร้องเรียน",
    required: true,
  },
];

export function ComplaintsPage() {
  const [state, actions] = useCRUD<ComplaintRow>(mockComplaintList);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ComplaintRow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: ComplaintRow) => {
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
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
    setCreateValues({
      title: "",
      category: "",
      location: "",
      priority: "ปกติ",
      submittedBy: "",
    });
    setModalOpen(true);
  }, []);

  const handleImport = useCallback(() => alert("นำเข้ารายการ (จำลอง)"), []);
  const handleExportPDF = useCallback(() => alert("ส่งออก PDF (จำลอง)"), []);

  const handleSubmitCreate = useCallback(() => {
    const newItem: ComplaintRow = {
      id: `CMP-${String(state.items.length + 1).padStart(4, "0")}`,
      title: createValues.title as string,
      category: createValues.category as string,
      submittedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      location: createValues.location as string,
      status: "ใหม่",
      priority: createValues.priority as string,
      submittedBy: createValues.submittedBy as string,
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: ComplaintRow) => {
    setSelectedItem(row);
    setEditValues({ ...row });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, {
      title: editValues.title as string,
      category: editValues.category as string,
      location: editValues.location as string,
      status: editValues.status as string,
      priority: editValues.priority as string,
      submittedBy: editValues.submittedBy as string,
    });
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: ComplaintRow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) actions.deleteItem(selectedItem.id);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: ComplaintRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const handleClone = useCallback(
    (row: ComplaintRow) => {
      const clone: ComplaintRow = {
        ...row,
        id: `${row.id}-clone`,
        title: `${row.title} (คัดลอก)`,
        status: "ใหม่",
      };
      actions.addItem(clone);
    },
    [actions],
  );

  const columns: Column<ComplaintRow>[] = [
    {
      key: "id",
      header: "รหัสเรื่อง",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "title",
      header: "หัวข้อ",
      render: (r) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          <FileText className="h-4 w-4 text-[var(--gold)]" />
          {r.title}
        </span>
      ),
    },
    {
      key: "category",
      header: "หมวดหมู่",
      render: (r) => (
        <Badge className="border border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-600 hover:bg-[rgba(193,201,214,0.12)] hover:bg-[rgba(193,201,214,0.12)]">
          {r.category}
        </Badge>
      ),
    },
    {
      key: "location",
      header: "พื้นที่/สาขา",
      render: (r) => (
        <span className="flex items-center gap-1 text-slate-600">
          <MapPin className="h-3 w-3 text-slate-400" />
          {r.location}
        </span>
      ),
    },
    {
      key: "submittedAt",
      header: "วันที่ร้องเรียน",
      render: (r) => <span className="text-slate-600">{r.submittedAt}</span>,
    },
    {
      key: "status",
      header: "สถานะ",
      render: (r) => (
        <StatusBadge status={r.status} variant={statusVariant(r.status)} />
      ),
    },
    {
      key: "priority",
      header: "ระดับความสำคัญ",
      render: (r) => (
        <Badge variant="outline" className={priorityVariant(r.priority)}>
          {r.priority}
        </Badge>
      ),
    },
  ];

  const rowActions: RowAction<ComplaintRow>[] = [
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
        title="รายการเรื่องร้องเรียน"
        description="จัดการรายการเรื่องร้องเรียนทั้งหมด (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "เรื่องร้องเรียน" }, { label: "รายการ" }]}
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
              placeholder="ค้นหาเรื่องร้องเรียน..."
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
        title="เพิ่มเรื่องร้องเรียนใหม่"
        description="กรอกรายละเอียดเรื่องร้องเรียน"
        fields={CREATE_FIELDS}
        values={createValues}
        onValuesChange={setCreateValues}
        onSubmit={handleSubmitCreate}
        mode="create"
        submitLabel="เพิ่มเรื่อง"
      />

      <CreateEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="แก้ไขเรื่องร้องเรียน"
        description={`แก้ไขเรื่อง: ${selectedItem?.title ?? ""}`}
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
        title="ยืนยันการลบเรื่องร้องเรียน"
        description="เรื่องร้องเรียนที่ถูกลบจะไม่สามารถกู้คืนได้"
        itemName={selectedItem?.title}
        onConfirm={handleConfirmDelete}
      />

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดเรื่องร้องเรียน"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="lg"
      />
    </div>
  );
}
