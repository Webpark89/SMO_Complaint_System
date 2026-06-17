import { useMemo, useState, useCallback } from "react";
import { mockDocuments } from "@/mock/complaints/documents.mock";
import { DOCUMENT_STATUS_OPTIONS } from "@/mock/master-data/statuses";
import { DOC_TYPES as DOC_TYPES_CANONICAL } from "@/mock/shared/file-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Download,
  Edit,
  Trash2,
  FileText,
  Copy,
} from "lucide-react";
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
  getDocumentStatusVariant,
} from "@/components/admin/crud";
import { TABLE_LABELS } from "@/components/admin/constants/tableLabels";
import { DocumentRow } from "@/mock/complaints/documents.mock";

const DOC_TYPES = [...DOC_TYPES_CANONICAL];

const statusVariant = (s: string) => getDocumentStatusVariant(s);

const DETAIL_FIELDS = [
  { key: "id", label: "รหัสเอกสาร" },
  { key: "complaintId", label: "รหัสเรื่อง" },
  { key: "documentName", label: "ชื่อเอกสาร" },
  { key: "documentType", label: "ประเภท" },
  { key: "submittedBy", label: "ผู้ส่ง" },
  { key: "submittedAt", label: "วันที่ส่ง" },
  { key: "fileSize", label: "ขนาดไฟล์" },
  { key: "pageCount", label: "จำนวนหน้า" },
  { key: "status", label: "สถานะ" },
  { key: "verifiedBy", label: "ผู้ตรวจสอบ" },
  { key: "verifiedAt", label: "วันที่ตรวจ" },
];

const CREATE_FIELDS: FormField[] = [
  {
    key: "complaintId",
    label: "รหัสเรื่องร้องเรียน",
    type: "text",
    required: true,
  },
  { key: "documentName", label: "ชื่อเอกสาร", type: "text", required: true },
  {
    key: "documentType",
    label: "ประเภท",
    type: "select",
    options: DOC_TYPES,
    required: true,
  },
];

const EDIT_FIELDS: FormField[] = [
  ...CREATE_FIELDS,
  {
    key: "status",
    label: "สถานะ",
    type: "select",
    options: DOCUMENT_STATUS_OPTIONS.slice(1),
    required: true,
  },
];

export function DocumentsPage() {
  const [state, actions] = useCRUD<DocumentRow>(mockDocuments);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DocumentRow | null>(null);
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: DocumentRow) => {
      const matchQ =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.complaintId.toLowerCase().includes(q) ||
        r.documentName.toLowerCase().includes(q);
      const matchStatus =
        state.filterStatus === "all" ? true : r.status === state.filterStatus;
      return matchQ && matchStatus;
    });
  }, [state.items, state.searchQuery, state.filterStatus]);

  const handleAddNew = useCallback(() => {
    setCreateValues({ complaintId: "", documentName: "", documentType: "" });
    setModalOpen(true);
  }, []);

  const handleSubmitCreate = useCallback(() => {
    const newDoc: DocumentRow = {
      id: `DOC-${String(state.items.length + 1).padStart(3, "0")}`,
      complaintId: createValues.complaintId as string,
      documentName: createValues.documentName as string,
      documentType: createValues.documentType as string,
      submittedBy: "ผู้ดูแลระบบ",
      submittedAt: new Date().toLocaleString("th-TH"),
      fileSize: "0 MB",
      pageCount: 1,
      status: "รอตรวจสอบ",
      verifiedBy: "—",
      verifiedAt: "—",
    };
    actions.addItem(newDoc);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: DocumentRow) => {
    setSelectedItem(row);
    setEditValues({ ...row });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, editValues as Partial<DocumentRow>);
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: DocumentRow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) actions.deleteItem(selectedItem.id);
    setDeleteDialogOpen(false);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: DocumentRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const columns: Column<DocumentRow>[] = [
    {
      key: "id",
      header: "รหัสเอกสาร",
      render: (r) => <span className="font-semibold">{r.id}</span>,
    },
    { key: "complaintId", header: "รหัสเรื่อง" },
    {
      key: "documentName",
      header: "ชื่อเอกสาร",
      render: (r) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-amber-600" />
          {r.documentName}
        </div>
      ),
    },
    { key: "documentType", header: "ประเภท" },
    {
      key: "status",
      header: "สถานะ",
      render: (r) => (
        <StatusBadge status={r.status} variant={statusVariant(r.status)} />
      ),
    },
  ];

  const rowActions: RowAction<DocumentRow>[] = [
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
        title="เอกสารและหลักฐาน"
        description="จัดการเอกสารและหลักฐานประกอบเรื่องร้องเรียน"
        actionButtons={
          <ActionToolbar
            onAddNew={handleAddNew}
            addNewLabel={TABLE_LABELS.addNew}
            isLoading={state.isLoading}
          />
        }
      />
      <Card className="shadow-soft">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              value={state.searchQuery}
              onChange={actions.setSearchQuery}
              placeholder="ค้นหาเอกสาร..."
            />
            <FilterTabs
              options={DOCUMENT_STATUS_OPTIONS}
              value={state.filterStatus}
              onChange={actions.setFilterStatus}
            />
          </div>
          <DataTable
            columns={columns}
            data={filtered}
            keyAccessor={(r) => r.id}
            rowActions={rowActions}
            showRowNumbers
            onRowClick={handleView}
            pagination={{
              page: state.page,
              pageSize: state.pageSize,
              total: filtered.length,
              onPageChange: actions.setPage,
            }}
          />
        </CardContent>
      </Card>
      {/* Modals & Drawers */}
      <CreateEditModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="เพิ่มเอกสาร"
        fields={CREATE_FIELDS}
        values={createValues}
        onValuesChange={setCreateValues}
        onSubmit={handleSubmitCreate}
        mode="create"
      />
      <CreateEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="แก้ไขเอกสาร"
        fields={EDIT_FIELDS}
        values={editValues}
        onValuesChange={setEditValues}
        onSubmit={handleSubmitEdit}
        mode="edit"
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="ยืนยันการลบ"
        itemName={selectedItem?.documentName}
        onConfirm={handleConfirmDelete}
      />
      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดเอกสาร"
        item={selectedItem}
        fields={DETAIL_FIELDS}
      />
    </div>
  );
}
