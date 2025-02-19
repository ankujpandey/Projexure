'use client'
import { useAppSelector } from '@/app/redux'
import Header from '@/components/Header'
import ModalNewTask from '@/components/ModalNewTask'
import TaskCard from '@/components/TackCard'
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils'
import { Priority, Task, useGetTasksByUserQuery } from '@/state/api'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { divide } from 'lodash'
import React, { useState } from 'react'

type Props = {
  priority: Priority
}

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span
        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
          params.value === "To Do"
            ? "bg-blue-200 text-blue-800"
            : params.value === "Under Review"
              ? "bg-orange-200 text-orange-800"
              : params.value === "Work In Progress"
                ? "bg-green-200 text-green-800"
                : params.value === "Completed"
                  ? "bg-gray-200 text-gray-800"
                  : "bg-red-200 text-red-800"
        }`}
      >
        {params.value}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params?.value?.username || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params?.value?.username || "Unassigned",
  },
];

const ReusablePriorityPage = ({priority}: Props) => {
  const [view, setView] = useState("list");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  const userId = 1;
  const {data: tasks, isLoading, isError: isTasksError} = useGetTasksByUserQuery(userId, {
    skip: userId === null
  });

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const filteredTasks = tasks?.filter((task: Task)=> task.priority === priority );

  // if(isLoading) return <div>Loading...</div>;
  if(isTasksError || !tasks) return <div>Error fetching tasks</div>;

  return (
    <div className="m-5 p-4">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header
        name="Priority Page"
        buttonComponent={
          <button
            className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add Task
          </button>
        }
      />
      <div className="mb-4 flex justify-start">
        <button
          className={`px-4 py-2 ${
            view === "list" ? "bg-gray-300 dark:bg-slate-400" : "bg-white dark:bg-slate-700"
          } rounded-l-md dark:text-neutral-500`}
          onClick={() => setView("list")}
        >
          List
        </button>

        <button
          className={`px-4 py-2 ${
            view === "table" ? "bg-gray-300 dark:bg-slate-400" : "bg-white dark:bg-slate-700"
          } rounded-r-md dark:text-neutral-500`}
          onClick={() => setView("table")}
        >
          Table
        </button>
      </div>
      {isLoading ? (
        <div>Loading Tasks...</div>
      ) : view === "list" ? (
        <div className="grid grid-cols-1 gap-2">
          {filteredTasks?.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        view === "table" &&
        filteredTasks && (
          <div className="w-full">
            <DataGrid
              rows={filteredTasks}
              columns={columns}
              checkboxSelection
              getRowId={(row) => row.id}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        )
      )}
    </div>
  );
}

export default ReusablePriorityPage