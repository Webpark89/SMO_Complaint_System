import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Column, RowAction } from "@/components/admin/crud";

// 1. ฟังก์ชันสำหรับสร้างคอลัมน์ "ดูรายละเอียด" (รูปดวงตา)
export const createViewColumn = <T,>(onView: (row: T) => void): Column<T> => ({
  key: "view" as const,
  header: "",
  render: (r: T) => (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-8 w-8 text-[#B8BABF] hover:text-[#8e6c25]"
      onClick={(e) => {
        e.stopPropagation();
        onView(r);
      }}
    >
      <Eye className="h-4 w-4" />
    </Button>
  ),
});

// 2. ฟังก์ชันสำหรับสร้าง Row Actions มาตรฐาน (แก้ไข, ลบ)
export const createStandardRowActions = <T,>({
  onEdit,
  onDelete,
}: {
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}): RowAction<T>[] => {
  const actions: RowAction<T>[] = [];

  if (onEdit) {
    actions.push({
      label: "แก้ไข",
      icon: <Edit className="h-4 w-4" />,
      onClick: onEdit,
    });
  }

  if (onDelete) {
    actions.push({
      label: "ลบ",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: onDelete,
      variant: "danger",
    });
  }

  return actions;
};