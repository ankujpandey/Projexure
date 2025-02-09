import React, { useEffect, useState } from "react";
import { Status, Priority } from "../../state/api";

type FilterOptions = {
    statuses: string[];
    priorities: string[];
    tags: string | null;
    startDate: string | null;
    endDate: string | null;
};

type Props = {
    onApplyFilters: (filters: FilterOptions) => void; // Callback to send filters to the parent
    isOpen: boolean; // Controlled visibility of the dropdown
    onClose: () => void; // Callback to close the dropdown
    initialFilters: FilterOptions;
};

const FilterDropdown = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters,
}: Props) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleCheckboxChange = (
    category: "statuses" | "priorities",
    value: string,
  ) => {
    setFilters((prev) => {
      const selected = new Set(prev[category]);
      selected.has(value) ? selected.delete(value) : selected.add(value);
      return { ...prev, [category]: Array.from(selected) };
    });
  };

  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
      const isoValue = value ? new Date(value).toISOString() : "";
      setFilters((prev) => ({ ...prev, [field]: isoValue }));
    };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-12 z-10 mt-2 w-80 max-w-full rounded-md border border-gray-200 bg-white p-4 shadow-lg"
      style={{ top: "100%" }}
    >
      {/* Status Filter */}
      <h4 className="mb-2 font-bold">Status</h4>
      {Object.values(Status).map((status) => (
        <label key={status} className="mb-1 block cursor-pointer text-sm">
          <input
            type="checkbox"
            value={status}
            className="mr-2"
            checked={filters.statuses.includes(status)}
            onChange={() => handleCheckboxChange("statuses", status)}
          />
          {status}
        </label>
      ))}

      {/* Priority Filter */}
      <h4 className="mb-2 mt-4 font-bold">Priority</h4>
      {Object.values(Priority).map((priority) => (
        <label key={priority} className="mb-1 block cursor-pointer text-sm">
          <input
            type="checkbox"
            value={priority}
            className="mr-2"
            checked={filters.priorities.includes(priority)}
            onChange={() => handleCheckboxChange("priorities", priority)}
          />
          {priority}
        </label>
      ))}

      {/* Date Filters */}
      <h4 className="mb-2 mt-4 font-bold">Start Date</h4>
      <input
        type="date"
        className="w-full rounded-md border p-2"
        value={filters.startDate ? filters.startDate.split("T")[0] : ""}
        onChange={(e) => handleDateChange("startDate", e.target.value)}
        onFocus={(e) => e.target.showPicker()}
      />

      <h4 className="mb-2 mt-4 font-bold">End Date</h4>
      <input
        type="date"
        className="w-full rounded-md border p-2"
        value={filters.endDate ? filters.endDate.split("T")[0] : ""}
        onChange={(e) => handleDateChange("endDate", e.target.value)}
        onFocus={(e) => e.target.showPicker()}
      />

      {/* Apply Filters Button */}
      <button
        onClick={handleApply}
        className="mt-4 w-full rounded-md bg-blue-500 p-2 text-white"
      >
        Apply Filters
      </button>
    </div>
  );
};
    
export default FilterDropdown;