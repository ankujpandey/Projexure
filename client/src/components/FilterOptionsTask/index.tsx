import React, { useEffect, useState } from "react";
import { Status, Priority } from "../../state/api";
import { ThemeProvider } from "@emotion/react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { textFieldSxStyle } from "@/lib/utils";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { useAppSelector } from "@/app/redux";
import { createTheme } from "@mui/material";

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
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const theme = createTheme({
    palette: {
        mode: isDarkMode ? 'dark' : 'light',
    },
});

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

  const handleDateChange = (field: "startDate" | "endDate", value: Date | null) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value ? value.toISOString() : null,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const clearFilters = () => {
    setFilters({
      statuses: [],
      priorities: [],
      tags: "",
      startDate: null, 
      endDate: null,
    });
  };

  if (!isOpen) return null;

  const selectStyles = "w-full rounded border-gray-300 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";
  
  const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:foucus:outline-none"


  return (
    <div
      className="w-120 absolute right-12 z-10 mt-2 max-w-full rounded-md border border-gray-200 bg-white p-4 shadow-lg dark:bg-dark-secondary"
      style={{ top: "100%" }}
    >
      {/* Filters Grid Layout */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Status Filter */}
        <div>
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
        </div>

        {/* Priority Filter */}
        <div>
          <h4 className="mb-2 font-bold">Priority</h4>
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
        </div>
      </div>

      {/* Date Filters (Horizontally in Large Screens) */}
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              format="dd-MM-yyyy"
              className={inputStyles}
              sx={textFieldSxStyle(isDarkMode)}
              value={filters.startDate ? new Date(filters.startDate) : null}
              onChange={(date) => handleDateChange("startDate", date)}
              slotProps={{
                textField: { size: "small" },
              }}
            />
            <DatePicker
              label="End Date"
              format="dd-MM-yyyy"
              className={inputStyles}
              sx={textFieldSxStyle(isDarkMode)}
              value={filters.endDate ? new Date(filters.endDate) : null}
              onChange={(date) => handleDateChange("endDate", date)}
              slotProps={{
                textField: { size: "small" },
              }}
            />
          </LocalizationProvider>
        </ThemeProvider>
      </div>

      <div className="mt-4 flex justify-center space-x-2">
        <button
          className="w-1/3 rounded-md bg-gray-500 p-2 text-white"
          onClick={clearFilters}
        >
          Clear {/* Filters */}
        </button>

        {/* Apply Filters Button */}
        <button
          onClick={handleApply}
          className="w-1/3 rounded-md bg-blue-500 p-2 text-white"
        >
          Apply {/* Filters */}
        </button>
      </div>
    </div>
  );
};
    
export default FilterDropdown;