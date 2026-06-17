import { useMemo, useState, useCallback } from "react";
import { mockNotifications } from "@/mock/notifications";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Bell, Mail, MessageSquare, Copy } from "lucide-react";
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
} from "@/components/admin/crud";
import { TABLE_LABELS } from "@/components/admin/constants/tableLabels";

type NotificationRow = {
  id: string;
  name: string;
  channel: "อีเมล" | "Line" | "SMS" | "แจ้งเตือนในระบบ";
  trigger: string;
  recipients: string;
  isActive: boolean;
};

const CHANNELS = [
  { value: "อีเมล", label: "อีเมล" },
  { value: "Line", label: "Line" },
  { value: "SMS", label: "SMS" },
  { value: "แจ้งเตือนในระบบ", label: "แจ้งเตือนในระบบ" },
];

const IS_ACTIVE_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "true", label: "เปิดใช้งาน" },
  { value: "false", label: "ปิดใช้งาน" },
];

function channelVariant(c: string): string {
  if (c === "อีเมล" || c === "Line")
    return "border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.12)] text-[var(--success)]";
  if (c === "SMS")
    return "border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] text-[var(--warning)]";
  return "border border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-600 hover:bg-[rgba(193,201,214,0.12)]";
}

const DETAIL_FIELDS = [
  { key: "id", label: "รหัส" },
  { key: "name", label: "ชื่อการแจ้งเตือน" },
  { key: "channel", label: "ช่องทาง" },
  { key: "trigger", label: "เงื่อนไข" },
  { key: "recipients", label: "ผู้รับ" },
  {
    key: "isActive",
    label: "สถานะ",
    render: (v: unknown) => (
      <span className={v ? "text-[var(--success)]" : "text-red-500"}>
        {v ? "เปิดใช้งาน" : "ปิดใช้งาน"}
      </span>
    ),
  },
];

const CREATE_FIELDS: FormField[] = [
  {
    key: "name",
    label: "ชื่อการแจ้งเตือน",
    type: "text",
    placeholder: "กรอกชื่อการแจ้งเตือน",
    required: true,
  },
  {
    key: "channel",
    label: "ช่องทาง",
    type: "select",
    placeholder: "เลือกช่องทาง",
    required: true,
    options: CHANNELS,
  },
  {
    key: "trigger",
    label: "เงื่อนไข",
    type: "text",
    placeholder: "กรอกเงื่อนไข",
    required: true,
  },
  {
    key: "recipients",
    label: "ผู้รับ",
    type: "text",
    placeholder: "กรอกผู้รับ",
    required: true,
  },
];

const EDIT_FIELDS: FormField[] = [
  {
    key: "name",
    label: "ชื่อการแจ้งเตือน",
    type: "text",
    placeholder: "กรอกชื่อการแจ้งเตือน",
    required: true,
  },
  {
    key: "channel",
    label: "ช่องทาง",
    type: "select",
    placeholder: "เลือกช่องทาง",
    required: true,
    options: CHANNELS,
  },
  {
    key: "trigger",
    label: "เงื่อนไข",
    type: "text",
    placeholder: "กรอกเงื่อนไข",
    required: true,
  },
  {
    key: "recipients",
    label: "ผู้รับ",
    type: "text",
    placeholder: "กรอกผู้รับ",
    required: true,
  },
  {
    key: "isActive",
    label: "สถานะ",
    type: "select",
    required: true,
    options: [
      { value: "true", label: "เปิดใช้งาน" },
      { value: "false", label: "ปิดใช้งาน" },
    ],
  },
];

export function NotificationsPage() {
  const [state, actions] = useCRUD<NotificationRow>(mockNotifications);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NotificationRow | null>(
    null,
  );
  const [createValues, setCreateValues] = useState<Record<string, unknown>>({});
  const [editValues, setEditValues] = useState<Record<string, unknown>>({});

  const filtered = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    return state.items.filter((r: NotificationRow) => {
      const matchQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.channel.toLowerCase().includes(q) ||
        r.trigger.toLowerCase().includes(q);
      const matchStatus =
        state.filterStatus === "all"
          ? true
          : state.filterStatus === "true"
            ? r.isActive === true
            : state.filterStatus === "false"
              ? r.isActive === false
              : true;
      return matchQ && matchStatus;
    });
  }, [state.items, state.searchQuery, state.filterStatus]);

  const handleRefresh = useCallback(() => {
    actions.setLoading(true);
    setTimeout(() => actions.setLoading(false), 600);
  }, [actions]);

  const handleAddNew = useCallback(() => {
    setCreateValues({ name: "", channel: "", trigger: "", recipients: "" });
    setModalOpen(true);
  }, []);

  const handleImport = useCallback(
    () => alert("นำเข้าการแจ้งเตือน (จำลอง)"),
    [],
  );
  const handleExport = useCallback(
    () => alert("ส่งออกการแจ้งเตือน (จำลอง)"),
    [],
  );

  const handleSubmitCreate = useCallback(() => {
    const newItem: NotificationRow = {
      id: `NOT-${String(state.items.length + 1).padStart(3, "0")}`,
      name: createValues.name as string,
      channel: createValues.channel as NotificationRow["channel"],
      trigger: createValues.trigger as string,
      recipients: createValues.recipients as string,
      isActive: true,
    };
    actions.addItem(newItem);
    setModalOpen(false);
  }, [actions, createValues, state.items.length]);

  const handleEdit = useCallback((row: NotificationRow) => {
    setSelectedItem(row);
    setEditValues({ ...row, isActive: row.isActive ? "true" : "false" });
    setEditModalOpen(true);
  }, []);

  const handleSubmitEdit = useCallback(() => {
    if (!selectedItem) return;
    actions.updateItem(selectedItem.id, {
      name: editValues.name as string,
      channel: editValues.channel as NotificationRow["channel"],
      trigger: editValues.trigger as string,
      recipients: editValues.recipients as string,
      isActive: editValues.isActive === "true",
    });
    setEditModalOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem, editValues]);

  const handleDelete = useCallback((row: NotificationRow) => {
    setSelectedItem(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) actions.deleteItem(selectedItem.id);
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  }, [actions, selectedItem]);

  const handleView = useCallback((row: NotificationRow) => {
    setSelectedItem(row);
    setDetailDrawerOpen(true);
  }, []);

  const handleClone = useCallback(
    (row: NotificationRow) => {
      const clone: NotificationRow = {
        ...row,
        id: `${row.id}-clone`,
        name: `${row.name} (คัดลอก)`,
      };
      actions.addItem(clone);
    },
    [actions],
  );

  const columns: Column<NotificationRow>[] = [
    {
      key: "id",
      header: "รหัส",
      render: (r) => (
        <span className="font-semibold text-slate-700">{r.id}</span>
      ),
    },
    {
      key: "name",
      header: "ชื่อการแจ้งเตือน",
      render: (r) => (
        <span className="flex items-center gap-1 font-medium text-slate-800">
          <Bell className="h-4 w-4 text-[var(--gold)]" />
          {r.name}
        </span>
      ),
    },
    {
      key: "channel",
      header: "ช่องทาง",
      render: (r) => (
        <Badge className={channelVariant(r.channel)}>
          {r.channel === "อีเมล" && <Mail className="mr-1 h-3 w-3" />}
          {r.channel === "Line" && <MessageSquare className="mr-1 h-3 w-3" />}
          {r.channel === "แจ้งเตือนในระบบ" && <Bell className="mr-1 h-3 w-3" />}
          {r.channel}
        </Badge>
      ),
    },
    {
      key: "trigger",
      header: "เงื่อนไข",
      render: (r) => <span className="text-slate-600">{r.trigger}</span>,
    },
    {
      key: "recipients",
      header: "ผู้รับ",
      render: (r) => <span className="text-slate-600">{r.recipients}</span>,
    },
    {
      key: "isActive",
      header: "สถานะ",
      render: (r) => (
        <StatusBadge
          status={r.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
          variant={r.isActive ? "success" : "danger"}
        />
      ),
    },
  ];

  const rowActions: RowAction<NotificationRow>[] = [
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
        title="การแจ้งเตือน"
        description="ตั้งค่าการแจ้งเตือน (ข้อมูลจำลอง)"
        breadcrumbs={[{ label: "ตั้งค่าระบบ" }, { label: "การแจ้งเตือน" }]}
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
              placeholder="ค้นหาการแจ้งเตือน..."
            />
            <FilterTabs
              options={IS_ACTIVE_OPTIONS}
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
            emptyMessage="ไม่พบการแจ้งเตือน"
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
        title="เพิ่มการแจ้งเตือนใหม่"
        description="กำหนดชื่อ ช่องทาง และเงื่อนไขสำหรับการแจ้งเตือน"
        fields={CREATE_FIELDS}
        values={createValues}
        onValuesChange={setCreateValues}
        onSubmit={handleSubmitCreate}
        mode="create"
        submitLabel="เพิ่มการแจ้งเตือน"
      />

      <CreateEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="แก้ไขการแจ้งเตือน"
        description={`แก้ไขการแจ้งเตือน: ${selectedItem?.name ?? ""}`}
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
        title="ยืนยันการลบการแจ้งเตือน"
        description="การแจ้งเตือนที่ถูกลบจะไม่สามารถกู้คืนได้"
        itemName={selectedItem?.name}
        onConfirm={handleConfirmDelete}
      />

      <DetailDrawer
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        title="รายละเอียดการแจ้งเตือน"
        item={selectedItem as Record<string, unknown> | null}
        fields={DETAIL_FIELDS}
        size="md"
      />
    </div>
  );
}
