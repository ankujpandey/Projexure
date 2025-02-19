import { useAppSelector } from '@/app/redux';
import Header from '@/components/Header';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';
import { FilterOptions, useGetTasksQuery } from '@/state/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react'

type Props = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
    searchTerm: string;
    appliedFilters: FilterOptions;
}

const columns: GridColDef[] = [
    {
        field: "title",
        headerName: "Title",
        width: 100
    },
    {
        field: "description",
        headerName: "Description",
        width: 200
    },
    {
        field: "status",
        headerName: "Status",
        width: 130,
        renderCell: (params) => (
            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                params.value === "To Do"
                    ? "bg-blue-200 text-blue-800"
                    : params.value === "Under Review"
                        ? "bg-orange-200 text-orange-800"
                        : params.value === "Work In Progress"
                            ? "bg-green-200 text-green-800"
                            : params.value === "Completed"
                                ? "bg-gray-200 text-gray-800"
                                : "bg-red-200 text-red-800"
            }`}>
                {params.value}
            </span>
        )
    },
    {
        field: "priority",
        headerName: "Priority",
        width: 75
    },
    {
        field: "tags",
        headerName: "Tags",
        width: 130
    },
    {
        field: "startDate",
        headerName: "Start Date",
        width: 130
    },
    {
        field: "dueDate",
        headerName: "Due Date",
        width: 130
    },
    {
        field: "author",
        headerName: "Author",
        width: 150,
        renderCell: (params) => params?.value?.username || "Unknown"
    },
    {
        field: "assignee",
        headerName: "Assignee",
        width: 150,
        renderCell: (params) => params?.value?.username || "Unassigned"
    },
];

const TableView = ({ id, setIsModalNewTaskOpen, searchTerm, appliedFilters }: Props) => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const {
        data: tasks,
        isLoading,
        error,
    } = useGetTasksQuery(
        {
          projectId: Number(id),
          ...(searchTerm.length >= 3 && { taskTitle: searchTerm }),
          statuses: appliedFilters.statuses ?? [], 
          priorities: appliedFilters.priorities ?? [],
          // ...(appliedFilters.tags && { tags: appliedFilters.tags }),
          ...(appliedFilters.startDate && { startDate: appliedFilters.startDate }),
          ...(appliedFilters.endDate && { endDate: appliedFilters.endDate }),
        },
        {
          skip: searchTerm.length > 0 && searchTerm.length < 3,
        },
      );

    if(isLoading) return <div>Loading...</div>
    if(error) return <div>An error occurred while fetching tasks</div>

    return (
        <div className='h-[540px] w-full px-4 pb-10 mb-10 xl:px-6'>
            <div className="pt-5">
                <Header 
                    name="Table" 
                    buttonComponent={
                        <button 
                            className='flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600'
                            onClick={()=> setIsModalNewTaskOpen(true)}
                        >
                            Add Task
                        </button>
                    }
                    isSmalltext
                />
            </div>
            <DataGrid
                rows={tasks || []}
                columns={columns}
                className={dataGridClassNames}
                sx={dataGridSxStyles(isDarkMode)}
            />
        </div>
    )
}

export default TableView