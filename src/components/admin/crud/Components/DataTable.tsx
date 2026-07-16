import type { ReactNode } from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Search,
  X,
  ArrowUpAZ,
  ArrowDownAZ,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { startOfDay, endOfDay, isValid } from "date-fns";
import { th } from "date-fns/locale/th";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  width?: string;
}

export interface RowAction<T> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  variant?: "default" | "outline" | "ghost" | "danger";
  disabled?: (row: T) => boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyAccessor: (row: T) => string;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
  rowActions?: RowAction<T>[];
  onSort?: (key: string, direction: "asc" | "desc") => void;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  isLoading?: boolean;
  showRowNumbers?: boolean;
  onRowClick?: (row: T) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
  };
  bulkActions?: ReactNode;
  enableColumnFilters?: boolean;
}

function parseItemDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  let d = new Date(dateStr);
  if (isValid(d) && !isNaN(d.getTime())) return d;

  // Try parsing DD-MM-YYYY format
  const parts = dateStr.split(" ");
  const dateParts = parts[0].split("-");
  if (dateParts.length === 3) {
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    let hour = 0;
    let min = 0;
    if (parts[1]) {
      const timeParts = parts[1].split(":");
      if (timeParts.length >= 2) {
        hour = parseInt(timeParts[0], 10);
        min = parseInt(timeParts[1], 10);
      }
    }
    d = new Date(year, month, day, hour, min);
    if (isValid(d) && !isNaN(d.getTime())) return d;
  }
  return null;
}

function getFilterType(key: string, header: string): "checkbox" | "dateRange" | "text" {
  const k = key.toLowerCase();
  const h = header.toLowerCase();

  if (
    k.includes("date") ||
    k.includes("time") ||
    k.endsWith("at") ||
    k.includes("login") ||
    h.includes("วัน") ||
    h.includes("เวลา")
  ) {
    return "dateRange";
  }

  if (
    k.includes("status") ||
    k.includes("priority") ||
    k.includes("category") ||
    k.includes("role") ||
    k.includes("department") ||
    k.includes("type") ||
    k.includes("level") ||
    k.includes("group") ||
    h.includes("สถานะ") ||
    h.includes("ความสำคัญ") ||
    h.includes("หมวดหมู่") ||
    h.includes("บทบาท") ||
    h.includes("แผนก") ||
    h.includes("ประเภท") ||
    h.includes("ระดับ")
  ) {
    return "checkbox";
  }

  return "text";
}

interface FilterPopoverProps<T> {
  col: Column<T>;
  data: T[];
  filterValue: any;
  onFilterChange: (value: any) => void;
  activeSortKey: string | null;
  activeSortDir: "asc" | "desc" | null;
  onSortChange: (key: string, dir: "asc" | "desc" | null) => void;
}

function FilterPopover<T>({
  col,
  data,
  filterValue,
  onFilterChange,
  activeSortKey,
  activeSortDir,
  onSortChange,
}: FilterPopoverProps<T>) {
  const [open, setOpen] = useState(false);
  const filterType = getFilterType(col.key, col.header);

  const [searchTerm, setSearchTerm] = useState("");
  const uniqueValues = useMemo(() => {
    if (filterType !== "checkbox") return [];
    const vals = new Set<string>();
    data.forEach((row) => {
      const rawVal = (row as any)[col.key];
      const strVal = rawVal !== undefined && rawVal !== null ? String(rawVal) : "—";
      vals.add(strVal);
    });
    return Array.from(vals);
  }, [data, col.key, filterType]);

  const [tempChecked, setTempChecked] = useState<Set<string>>(new Set());
  const [tempText, setTempText] = useState("");
  const [tempRange, setTempRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    if (open) {
      if (filterType === "checkbox") {
        setTempChecked(new Set(filterValue || []));
      } else if (filterType === "text") {
        setTempText(filterValue || "");
      } else if (filterType === "dateRange") {
        setTempRange(filterValue);
      }
    }
  }, [open, filterValue, filterType]);

  const handleApply = () => {
    if (filterType === "checkbox") {
      onFilterChange(tempChecked.size > 0 ? tempChecked : null);
    } else if (filterType === "text") {
      onFilterChange(tempText.trim() ? tempText : null);
    } else if (filterType === "dateRange") {
      onFilterChange(tempRange?.from ? tempRange : null);
    }
    setOpen(false);
  };

  const handleClear = () => {
    onFilterChange(null);
    setTempChecked(new Set());
    setTempText("");
    setTempRange(undefined);
    setOpen(false);
  };

  const isFiltered = !!filterValue;
  const isSorted = activeSortKey === col.key && !!activeSortDir;

  const filteredUniqueValues = uniqueValues.filter((v) =>
    v.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 p-0 ml-1 hover:bg-slate-100/50 hover:text-slate-800 focus:ring-0 ${
            isFiltered || isSorted ? "text-[var(--gold)] font-bold" : "text-slate-400"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[15px] font-bold">▾</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-3 bg-white border border-slate-200 rounded-xl shadow-elegant z-50"
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-3.5">
          {/* Sorting Header */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">จัดเรียง</div>
            <div className="grid grid-cols-2 gap-1.5">
              <Button
                variant={isSorted && activeSortDir === "asc" ? "default" : "outline"}
                size="sm"
                className={`justify-start text-xs font-semibold h-8 ${
                  isSorted && activeSortDir === "asc"
                    ? "bg-[var(--gold)] text-[#111827] hover:bg-[var(--gold)]/90"
                    : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
                }`}
                onClick={() => onSortChange(col.key, "asc")}
              >
                <ArrowUpAZ className="mr-1.5 h-4 w-4" /> น้อย-มาก
              </Button>
              <Button
                variant={isSorted && activeSortDir === "desc" ? "default" : "outline"}
                size="sm"
                className={`justify-start text-xs font-semibold h-8 ${
                  isSorted && activeSortDir === "desc"
                    ? "bg-[var(--gold)] text-[#111827] hover:bg-[var(--gold)]/90"
                    : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
                }`}
                onClick={() => onSortChange(col.key, "desc")}
              >
                <ArrowDownAZ className="mr-1.5 h-4 w-4" /> มาก-น้อย
              </Button>
            </div>
            {isSorted && (
              <Button
                variant="ghost"
                size="sm"
                className="text-[11px] font-bold text-red-500 hover:text-red-600 h-6 px-1.5 mt-0.5"
                onClick={() => onSortChange(col.key, null)}
              >
                <X className="mr-1 h-3 w-3" /> ล้างการจัดเรียง
              </Button>
            )}
          </div>

          <hr className="border-slate-100" />

          {/* Filter Body */}
          <div className="space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">กรองข้อมูล</div>

            {/* Checkbox filter */}
            {filterType === "checkbox" && (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="ค้นหาตัวเลือก..."
                    className="h-8 pl-8 text-xs border-slate-200 rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] font-bold text-slate-500 h-6 px-1.5 bg-slate-50 hover:bg-slate-100"
                    onClick={() => setTempChecked(new Set(uniqueValues))}
                  >
                    เลือกทั้งหมด
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] font-bold text-slate-500 h-6 px-1.5 bg-slate-50 hover:bg-slate-100"
                    onClick={() => setTempChecked(new Set())}
                  >
                    ล้างการเลือก
                  </Button>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 border border-slate-100 rounded-lg p-1.5 bg-slate-50/50">
                  {filteredUniqueValues.length === 0 ? (
                    <div className="text-[11px] text-slate-400 text-center py-2">ไม่พบตัวเลือก</div>
                  ) : (
                    filteredUniqueValues.map((val) => (
                      <div key={val} className="flex items-center gap-2 hover:bg-slate-100/50 p-0.5 rounded">
                        <Checkbox
                          id={`filter-${col.key}-${val}`}
                          checked={tempChecked.has(val)}
                          onCheckedChange={(checked) => {
                            setTempChecked((prev) => {
                              const next = new Set(prev);
                              if (checked) {
                                next.add(val);
                              } else {
                                next.delete(val);
                              }
                              return next;
                            });
                          }}
                        />
                        <label
                          htmlFor={`filter-${col.key}-${val}`}
                          className="text-xs text-slate-700 font-medium cursor-pointer truncate flex-1 select-none"
                        >
                          {val}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Date range filter */}
            {filterType === "dateRange" && (
              <div className="space-y-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100 overflow-hidden flex justify-center">
                <Calendar
                  mode="range"
                  selected={tempRange}
                  onSelect={setTempRange}
                  locale={th}
                  className="rounded-md border-0 bg-white scale-90 -my-2"
                />
              </div>
            )}

            {/* Text Search filter */}
            {filterType === "text" && (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="พิมพ์คำค้นหา..."
                  className="h-8 pl-8 text-xs border-slate-200 rounded-lg bg-white"
                  value={tempText}
                  onChange={(e) => setTempText(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-slate-200 text-slate-600 bg-white hover:bg-slate-50 h-8"
              onClick={handleClear}
            >
              ล้างตัวกรอง
            </Button>
            <Button
              size="sm"
              className="text-xs bg-[var(--gold)] text-[#111827] hover:bg-[var(--gold)]/95 h-8 font-semibold px-4"
              onClick={handleApply}
            >
              ตกลง
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function DataTable<T>({
  columns,
  data,
  keyAccessor,
  selectedIds = new Set(),
  onToggleSelect,
  onSelectAll,
  rowActions,
  onSort,
  sortKey: externalSortKey,
  sortDirection: externalSortDirection,
  emptyMessage = "ไม่พบรายการ",
  emptyIcon,
  isLoading = false,
  showRowNumbers = false,
  onRowClick,
  pagination,
  bulkActions,
  enableColumnFilters = true,
}: DataTableProps<T>) {
  const [columnFilters, setColumnFilters] = useState<Record<string, any>>({});
  const [localSortKey, setLocalSortKey] = useState<string | null>(null);
  const [localSortDir, setLocalSortDir] = useState<"asc" | "desc" | null>(null);

  const activeSortKey = onSort ? externalSortKey : localSortKey;
  const activeSortDir = onSort ? (externalSortDirection as "asc" | "desc" | null) : localSortDir;

  const handleSortChange = (key: string, dir: "asc" | "desc" | null) => {
    if (onSort) {
      if (dir === null) {
        onSort(key, "asc");
      } else {
        onSort(key, dir);
      }
    } else {
      setLocalSortKey(dir ? key : null);
      setLocalSortDir(dir);
    }
  };

  const processedData = useMemo(() => {
    let result = [...data];

    if (!enableColumnFilters) return result;

    Object.entries(columnFilters).forEach(([colKey, filterVal]) => {
      if (filterVal === undefined || filterVal === null) return;

      const col = columns.find((c) => c.key === colKey);
      if (!col) return;

      const filterType = getFilterType(colKey, col.header);

      if (filterType === "checkbox") {
        const selectedSet = filterVal as Set<string>;
        if (selectedSet && selectedSet.size > 0) {
          result = result.filter((row) => {
            const rawVal = (row as any)[colKey];
            const strVal = rawVal !== undefined && rawVal !== null ? String(rawVal) : "—";
            return selectedSet.has(strVal);
          });
        }
      } else if (filterType === "dateRange") {
        const range = filterVal as { from?: Date; to?: Date };
        if (range && range.from) {
          const fromDate = startOfDay(range.from);
          const toDate = range.to ? endOfDay(range.to) : endOfDay(range.from);

          result = result.filter((row) => {
            const rawVal = (row as any)[colKey];
            if (!rawVal) return false;
            const itemDate = parseItemDate(String(rawVal));
            if (!itemDate) return false;
            return itemDate >= fromDate && itemDate <= toDate;
          });
        }
      } else if (filterType === "text") {
        const searchTxt = String(filterVal).trim().toLowerCase();
        if (searchTxt) {
          result = result.filter((row) => {
            const rawVal = (row as any)[colKey];
            const strVal = rawVal !== undefined && rawVal !== null ? String(rawVal).toLowerCase() : "";
            return strVal.includes(searchTxt);
          });
        }
      }
    });

    if (activeSortKey && activeSortDir) {
      result.sort((a, b) => {
        const valA = (a as any)[activeSortKey];
        const valB = (b as any)[activeSortKey];

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        const numA = Number(valA);
        const numB = Number(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return activeSortDir === "asc" ? numA - numB : numB - numA;
        }

        const dateA = parseItemDate(String(valA));
        const dateB = parseItemDate(String(valB));
        if (dateA && dateB) {
          return activeSortDir === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return activeSortDir === "asc" ? -1 : 1;
        if (strA > strB) return activeSortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, columnFilters, columns, activeSortKey, activeSortDir, enableColumnFilters]);

  // Adjust pagination page if filters reduce item count
  useEffect(() => {
    if (pagination) {
      const maxPage = Math.max(1, Math.ceil(processedData.length / pagination.pageSize));
      if (pagination.page > maxPage) {
        pagination.onPageChange(1);
      }
    }
  }, [processedData.length, pagination]);

  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return processedData.slice(start, end);
  }, [processedData, pagination]);

  const allSelected =
    paginatedData.length > 0 && paginatedData.every((row) => selectedIds.has(keyAccessor(row)));
  const someSelected =
    paginatedData.some((row) => selectedIds.has(keyAccessor(row))) && !allSelected;

  const totalPages = pagination
    ? Math.ceil(processedData.length / pagination.pageSize)
    : 1;

  const handleFilterChange = (colKey: string, value: any) => {
    setColumnFilters((prev) => ({
      ...prev,
      [colKey]: value,
    }));
  };

  return (
    <div className="space-y-4">
      {bulkActions && selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold-soft)] px-4 py-3">
          <span className="text-sm font-semibold text-[#111827]">
            เลือกแล้ว {selectedIds.size} รายการ
          </span>
          {bulkActions}
        </div>
      )}

      <div className="rounded-xl border border-[var(--border)] bg-white shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[var(--border)] bg-[var(--surface-muted)]">
                {onToggleSelect && (
                  <TableHead className="w-[48px]">
                    <Checkbox
                      checked={allSelected}
                      ref={(el) => {
                        if (el && someSelected) {
                          (el as unknown as HTMLInputElement).indeterminate =
                            someSelected;
                        }
                      }}
                      onCheckedChange={() => {
                        if (allSelected) {
                          onSelectAll?.([]);
                        } else {
                          onSelectAll?.(paginatedData.map(keyAccessor));
                        }
                      }}
                      aria-label="เลือกทั้งหมด"
                    />
                  </TableHead>
                )}
                {showRowNumbers && (
                  <TableHead className="w-[48px] text-center">#</TableHead>
                )}
                {columns.map((col) => {
                  const isFiltered = !!columnFilters[col.key];
                  return (
                    <TableHead
                      key={col.key}
                      className={col.width ? `w-[${col.width}]` : undefined}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className={`font-semibold text-slate-800 ${isFiltered ? "text-[var(--gold)]" : ""}`}>
                          {col.header}
                        </span>
                        {enableColumnFilters && (
                          <FilterPopover
                            col={col}
                            data={data}
                            filterValue={columnFilters[col.key]}
                            onFilterChange={(val) => handleFilterChange(col.key, val)}
                            activeSortKey={activeSortKey || null}
                            activeSortDir={activeSortDir}
                            onSortChange={handleSortChange}
                          />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
                {rowActions && rowActions.length > 0 && (
                  <TableHead className="w-[120px] text-center">จัดการ</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {onToggleSelect && (
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                    )}
                    {showRowNumbers && (
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        <Skeleton />
                      </TableCell>
                    ))}
                    {rowActions && (
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length +
                      (onToggleSelect ? 1 : 0) +
                      (showRowNumbers ? 1 : 0) +
                      (rowActions ? 1 : 0)
                    }
                    className="py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      {emptyIcon && (
                        <span className="text-slate-400">{emptyIcon}</span>
                      )}
                      <span className="text-sm font-semibold text-slate-500">
                        {emptyMessage}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => {
                  const id = keyAccessor(row);
                  const isSelected = selectedIds.has(id);
                  const displayIndex = pagination
                    ? (pagination.page - 1) * pagination.pageSize + index + 1
                    : index + 1;
                  return (
                    <TableRow
                      key={id}
                      className={[
                        isSelected ? "bg-[var(--gold-soft)]/30" : "",
                        onRowClick
                          ? "cursor-pointer hover:bg-slate-50 transition-colors"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                    >
                      {onToggleSelect && (
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => onToggleSelect(id)}
                            aria-label={`เลือก ${id}`}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                      )}
                      {showRowNumbers && (
                        <TableCell className="text-center text-sm text-slate-500">
                          {displayIndex}
                        </TableCell>
                      )}
                      {columns.map((col) => (
                        <TableCell key={col.key}>
                          {col.render
                            ? col.render(row)
                            : ((row as Record<string, unknown>)[
                                col.key
                              ] as ReactNode)}
                        </TableCell>
                      ))}
                      {rowActions && rowActions.length > 0 && (
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            {rowActions.map((action, i) => (
                              <Button
                                key={i}
                                type="button"
                                variant={
                                  (action.variant as
                                    | "default"
                                    | "outline"
                                    | "ghost"
                                    | "destructive") || "ghost"
                                }
                                size="sm"
                                className={
                                  action.variant === "danger"
                                    ? "text-red-500 hover:bg-red-50 hover:text-red-600"
                                    : "text-slate-600 hover:text-[#111827]"
                                }
                                disabled={action.disabled?.(row)}
                                onClick={(
                                  e: React.MouseEvent<HTMLButtonElement>,
                                ) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                              >
                                {action.icon || action.label}
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm font-medium text-slate-500">
            แสดง {(pagination.page - 1) * pagination.pageSize + 1}–
            {Math.min(pagination.page * pagination.pageSize, processedData.length)}{" "}
            จาก {processedData.length} รายการ
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-[var(--border)] bg-white"
              onClick={() => pagination.onPageChange(1)}
              disabled={pagination.page <= 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-[var(--border)] bg-white"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm font-semibold text-[#111827]">
              {pagination.page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-[var(--border)] bg-white"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-[var(--border)] bg-white"
              onClick={() => pagination.onPageChange(totalPages)}
              disabled={pagination.page >= totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return <div className="h-5 w-full animate-pulse rounded bg-slate-200" />;
}
