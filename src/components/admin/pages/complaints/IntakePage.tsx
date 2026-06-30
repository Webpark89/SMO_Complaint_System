import { useMemo, useState, useCallback } from "react";
import { mockIntakes } from "@/mock/complaints/intake.mock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, User, Copy, ChevronDown } from "lucide-react";
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
  getIntakeStatusVariant,
} from "@/components/admin/crud";
import { TABLE_LABELS } from "@/components/admin/constants/tableLabels";
import { createViewColumn, createStandardRowActions } from "@/components/admin/layout/tableActions";

type IntakeRow = {
  id: string;
  complaintId: string;
  submittedAt: string;
  formName: string;
  category: string;
  subcategory: string;
  priority: string;
  applicant: string;
  email: string;
  phone: string;
  isAnonymous: boolean;
  eventDate: string;
  location: string;
  department: string;
  description: string;
  files: { name: string; date: string }[];
  status: string;
  assignee: string;
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
  { value: "รอรับเรื่อง", label: "รอรับเรื่อง" },
  { value: "รับเรื่องแล้ว", label: "รับเรื่องแล้ว" },
  { value: "กำลังคัดกรอง", label: "กำลังคัดกรอง" },
  { value: "ส่งกลับ", label: "ส่งกลับ" },
  { value: "ขอข้อมูลเพิ่ม", label: "ขอข้อมูลเพิ่ม" },
  { value: "ปฏิเสธ", label: "ปฏิเสธ" },
];

const statusVariant = (s: string) => getIntakeStatusVariant(s);

const DETAIL_FIELDS = [
  { key: "id", label: "เลขรับเรื่อง" },
  { key: "complaintId", label: "รหัสเรื่อง" },
  { key: "submittedAt", label: "วันที่แจ้ง" },
  { key: "category", label: "ประเภทเรื่อง" },
  { key: "subcategory", label: "หัวข้อย่อย" },
  { key: "priority", label: "ระดับความสำคัญ" },
  { key: "applicant", label: "ผู้แจ้ง" },
  { key: "phone", label: "โทรศัพท์" },
  { key: "eventDate", label: "วันที่เกิดเหตุ" },
  { key: "location", label: "สถานที่เกิดเหตุ" },
  { key: "department", label: "หน่วยงานที่เกี่ยวข้อง" },
  { key: "description", label: "รายละเอียด" },
  { key: "assignee", label: "ผู้รับผิดชอบ" },
  { key: "status", label: "สถานะ" },
];

const CREATE_FIELDS: FormField[] = [
  {
    key: "applicant",
    label: "ผู้ยื่น/หน่วยงาน",
    type: "text",
    placeholder: "กรอกชื่อผู้ยื่น",
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
];

const EDIT_FIELDS: FormField[] = [
  {
    key: "applicant",
    label: "ผู้ยื่น/หน่วยงาน",
    type: "text",
    placeholder: "กรอกชื่อผู้ยื่น",
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
    key: "status",
    label: "สถานะ",
    type: "select",
    placeholder: "เลือกสถานะ",
    required: true,
    options: STATUS_OPTIONS.slice(1),
  },
];

export function IntakePage() {
  const [state, actions] = useCRUD<IntakeRow>(mockIntakes);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IntakeRow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: IntakeRow) => {
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.complaintId.toLowerCase().includes(q) ||
        r.applicant.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.subcategory.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q);
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
    setCreateValues({ applicant: "", category: "" });
    setModalOpen(true);
  }, []);

  const handleImport = useCallback(() => alert("นำเข้ารายการ (จำลอง)"), []);
  const handleExportPDF = useCallback(() => alert("ส่งออก PDF (จำลอง)"), []);

  const handleSubmitCreate = useCallback(() => {
    const newItem: IntakeRow = {
      id: `INT-${String(state.items.length + 1).padStart(4, "0")}`,
      applicant: createValues.applicant as string,
      category: createValues.category as string,
      submittedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      complaintId: "",
      formName: "",
      subcategory: "",
      priority: "",
      email: "",
      phone: "",
      isAnonymous: false,
      eventDate: "",
      location: "",
      department: "",
      description: "",
      files: [],
      status: "รอรับเรื่อง",
      assignee: "",
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: IntakeRow) => {
    setSelectedItem(row);
    setEditValues({ ...row });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, {
      applicant: editValues.applicant as string,
      category: editValues.category as string,
      status: editValues.status as string,
    });
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: IntakeRow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) actions.deleteItem(selectedItem.id);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: IntakeRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const handleClone = useCallback(
    (row: IntakeRow) => {
      const clone: IntakeRow = {
        ...row,
        id: `${row.id}-clone`,
        applicant: `${row.applicant} (คัดลอก)`,
        status: "รอรับเรื่อง",
      };
      actions.addItem(clone);
    },
    [actions],
  );

  const columns: Column<IntakeRow>[] = [
    createViewColumn<IntakeRow>(handleView),
    {
      key: "id",
      header: "เลขรับเรื่อง",
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
      key: "submittedAt",
      header: "วันที่แจ้ง",
      render: (r) => <span className="text-slate-600">{r.submittedAt}</span>,
    },

    {
      key: "applicant",
      header: "ผู้แจ้ง",
      render: (r) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-[var(--gold)]" />
          <span className="font-medium">{r.applicant}</span>
        </div>
      ),
    },

    {
      key: "formName",
      header: "แบบฟอร์ม",
      render: (r) => <span>{r.formName}</span>,
    },

    {
      key: "category",
      header: "ประเภทเรื่อง",
      render: (r) => (
        <Badge className="border border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-600 hover:bg-[rgba(193,201,214,0.12)] hover:bg-[rgba(108,117,132,0.12)]">
          {r.category}
        </Badge>
      ),
    },

    {
      key: "priority",
      header: "ระดับความสำคัญ",
      render: (r) => <span>{r.priority}</span>,
    },

    {
      key: "department",
      header: "หน่วยงาน",
      render: (r) => <span>{r.department}</span>,
    },

    {
      key: "assignee",
      header: "ผู้รับผิดชอบ",
      render: (r) => <span>{r.assignee}</span>,
    },

    {
      key: "status",
      header: "สถานะ",
      render: (r) => (
        <StatusBadge status={r.status} variant={statusVariant(r.status)} />
      ),
    },
  ];

  const rowActions = createStandardRowActions<IntakeRow>({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="การรับเรื่องร้องเรียน"
        description="จัดการรายการรับเรื่องร้องเรียน (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "เรื่องร้องเรียน" }, { label: "การรับเรื่อง" }]}
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
              placeholder="ค้นหารายการรับเรื่อง..."
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
        title="เพิ่มรายการรับเรื่องใหม่"
        description="กรอกรายละเอียดการรับเรื่องร้องเรียน"
        fields={CREATE_FIELDS}
        values={createValues}
        onValuesChange={setCreateValues}
        onSubmit={handleSubmitCreate}
        mode="create"
        submitLabel="เพิ่มรายการ"
      />

      <CreateEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="แก้ไขรายการรับเรื่อง"
        description={`แก้ไขรายการ: ${selectedItem?.applicant ?? ""}`}
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
        title="ยืนยันการลบรายการ"
        description="รายการที่ถูกลบจะไม่สามารถกู้คืนได้"
        itemName={selectedItem?.applicant}
        onConfirm={handleConfirmDelete}
      />

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดการรับเรื่อง"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="md"
      />
    </div>
  );
}
