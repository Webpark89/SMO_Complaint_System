import React, { useState, useEffect, useMemo } from "react";
import { Search, RotateCcw, Filter, Download, Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type AdvancedFilterValues = Record<string, string | undefined>;

export type FilterFieldConfig = {
  key: string;
  label: string;
  type: "text" | "select" | "daterange" | "grouped-multi-select" | "selectrange";
  placeholder?: string;
  options?: { value: string; label: string; code?: string }[];
  groupedOptions?: {
    groupLabel: string;
    items: { value: string; label: string }[];
  }[];
};

interface GroupedMultiSelectFieldProps {
  field: FilterFieldConfig;
  value: string;
  onChange: (value: string) => void;
}

export function GroupedMultiSelectField({
  field,
  value,
  onChange,
}: GroupedMultiSelectFieldProps) {
  const [open, setOpen] = useState(false);

  const currentSelected = useMemo(() => {
    return value ? value.split(",") : [];
  }, [value]);

  const [localSelected, setLocalSelected] = useState<string[]>(currentSelected);

  useEffect(() => {
    if (open) {
      setLocalSelected(currentSelected);
    }
  }, [open, currentSelected]);

  const handleToggle = (itemVal: string) => {
    setLocalSelected((prev) =>
      prev.includes(itemVal)
        ? prev.filter((v) => v !== itemVal)
        : [...prev, itemVal]
    );
  };

  const handleSelectAll = () => {
    if (!field.groupedOptions) return;
    const allVals = field.groupedOptions.flatMap((g) => g.items.map((i) => i.value));
    setLocalSelected(allVals);
  };

  const handleClearSelection = () => {
    setLocalSelected([]);
  };

  const handleApply = () => {
    onChange(localSelected.join(","));
    setOpen(false);
  };

  const handleCancel = () => {
    setLocalSelected([]);
    onChange("");
    setOpen(false);
  };

  const triggerLabel = useMemo(() => {
    if (currentSelected.length === 0) {
      return field.placeholder || "เลือก...";
    }
    return `เลือก ${currentSelected.length} รายการ`;
  }, [currentSelected, field.placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-left font-normal bg-white border-slate-200 h-9 px-3 text-slate-700 hover:bg-slate-50 hover:text-slate-800"
        >
          <span className="truncate">{triggerLabel}</span>
          <ChevronDown className="ml-auto h-4 w-4 opacity-50 text-slate-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <div className="flex justify-between items-center p-3 border-b bg-slate-50/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="h-7 px-2 text-xs text-slate-600 hover:text-slate-900"
          >
            เลือกทั้งหมด
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSelection}
            className="h-7 px-2 text-xs text-slate-600 hover:text-slate-900"
          >
            ล้างการเลือก
          </Button>
        </div>

        <ScrollArea className="h-64 p-3">
          <div className="space-y-4">
            {field.groupedOptions?.map((group) => (
              <div key={group.groupLabel} className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                  {group.groupLabel}
                </div>
                <div className="space-y-1 pl-1">
                  {group.items.map((item) => {
                    const isChecked = localSelected.includes(item.value);
                    return (
                      <div
                        key={item.value}
                        className="flex items-center space-x-2 py-1 px-2 rounded hover:bg-slate-50 cursor-pointer"
                        onClick={() => handleToggle(item.value)}
                      >
                        <Checkbox
                          checked={isChecked}
                          id={`chk-${item.value}`}
                          className="border-slate-300 data-[state=checked]:bg-[#C9A84C] data-[state=checked]:border-[#C9A84C] pointer-events-none"
                        />
                        <label
                          className="text-sm font-medium text-slate-600 leading-none cursor-pointer flex-1 select-none pointer-events-none"
                        >
                          {item.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2 p-3 border-t bg-slate-50/50">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="flex-1 text-xs text-slate-600 border-slate-300 hover:bg-slate-50 h-8"
          >
            ล้างตัวกรอง
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            className="flex-1 text-xs bg-[#1B2B4B] text-white hover:bg-[#1B2B4B]/90 h-8"
          >
            ตกลง
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export interface AdvancedFilterProps {
  fields: FilterFieldConfig[];
  onApply: (values: AdvancedFilterValues) => void;
  onReset?: () => void;
  onExport?: (values: AdvancedFilterValues) => void;
  resultCount?: number;
  totalCount?: number;
  isLoading?: boolean;
}

export function AdvancedFilter({
  fields,
  onApply,
  onReset,
  onExport,
  resultCount,
  totalCount,
  isLoading,
}: AdvancedFilterProps) {
  const [values, setValues] = useState<AdvancedFilterValues>({});

  const handleTextChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSelectChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val === "all" ? "" : val }));
  };

  const handleReset = () => {
    setValues({});
    onApply({});
    if (onReset) onReset();
  };

  const handleApply = () => {
    onApply(values);
  };

  const handleExport = () => {
    if (onExport) {
      onExport(values);
    }
  };

  return (
    <Card className="border-[var(--border)] bg-white shadow-soft mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
          <div className="flex items-center gap-2 text-[#1B2B4B]">
            <Filter className="h-5 w-5 text-[#C9A84C]" />
            <h3 className="font-semibold text-lg">ตัวกรองขั้นสูง</h3>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isLoading}
              className="text-slate-600 border-slate-300 hover:bg-slate-50"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> ล้างตัวกรอง
            </Button>
            <Button
              onClick={handleApply}
              disabled={isLoading}
              size="sm"
              className="bg-[#1B2B4B] text-white hover:bg-[#C9A84C] transition-colors duration-200 shadow-sm"
            >
              <Search className="mr-2 h-4 w-4" /> ค้นหา
            </Button>
            {onExport && (
              <Button
                onClick={handleExport}
                disabled={isLoading}
                size="sm"
                className="bg-[#C9A84C] text-white hover:bg-[#1B2B4B] transition-colors duration-200 shadow-sm"
              >
                <Download className="mr-2 h-4 w-4" /> ส่งออก (Export)
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                {field.label}
              </Label>

              {field.type === "text" && (
                <Input
                  placeholder={field.placeholder}
                  value={values[field.key] || ""}
                  onChange={(e) => handleTextChange(field.key, e.target.value)}
                  className="bg-white border-slate-200 h-9"
                />
              )}

              {field.type === "select" && (
                <Select
                  value={values[field.key] || "all"}
                  onValueChange={(val) => handleSelectChange(field.key, val)}
                >
                  <SelectTrigger className="bg-white border-slate-200 h-9">
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    {field.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "grouped-multi-select" && (
                <GroupedMultiSelectField
                  field={field}
                  value={values[field.key] || ""}
                  onChange={(val) => handleTextChange(field.key, val)}
                />
              )}

              {field.type === "selectrange" && (
                <div className="flex items-center gap-2">
                  <Select
                    value={values[`${field.key}_from`] || "all"}
                    onValueChange={(val) => handleSelectChange(`${field.key}_from`, val)}
                  >
                    <SelectTrigger className="bg-white border-slate-200 h-9">
                      <SelectValue placeholder="เริ่มต้น" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-slate-400 text-sm">ถึง</span>
                  <Select
                    value={values[`${field.key}_to`] || "all"}
                    onValueChange={(val) => handleSelectChange(`${field.key}_to`, val)}
                  >
                    <SelectTrigger className="bg-white border-slate-200 h-9">
                      <SelectValue placeholder="สิ้นสุด" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      {field.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {field.type === "daterange" && (
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white border-slate-200 h-9 px-3",
                          !values[`${field.key}_from`] && "text-muted-foreground"
                        )}
                      >
                        {values[`${field.key}_from`] ? (
                          format(parseISO(values[`${field.key}_from`] as string), "dd/MM/yyyy")
                        ) : (
                          <span className="text-sm">dd/mm/yyyy</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-slate-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={values[`${field.key}_from`] ? parseISO(values[`${field.key}_from`] as string) : undefined}
                        onSelect={(date) =>
                          handleTextChange(
                            `${field.key}_from`,
                            date ? format(date, "yyyy-MM-dd") : ""
                          )
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <span className="text-slate-400 text-sm">ถึง</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white border-slate-200 h-9 px-3",
                          !values[`${field.key}_to`] && "text-muted-foreground"
                        )}
                      >
                        {values[`${field.key}_to`] ? (
                          format(parseISO(values[`${field.key}_to`] as string), "dd/MM/yyyy")
                        ) : (
                          <span className="text-sm">dd/mm/yyyy</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-slate-400" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={values[`${field.key}_to`] ? parseISO(values[`${field.key}_to`] as string) : undefined}
                        onSelect={(date) =>
                          handleTextChange(
                            `${field.key}_to`,
                            date ? format(date, "yyyy-MM-dd") : ""
                          )
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          ))}
        </div>

        {(resultCount !== undefined || totalCount !== undefined) && (
          <div className="mt-6 pt-4 border-t flex justify-end">
            <span className="text-sm text-slate-500 font-medium">
              แสดง {resultCount ?? 0} จาก {totalCount ?? 0} รายการ
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
