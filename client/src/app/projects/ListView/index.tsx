import Header from '@/components/Header';
import TaskCard from '@/components/TackCard';
import { FilterOptions, Task, useGetTasksQuery } from '@/state/api';
import { ClassNames } from '@emotion/react';
import React from 'react'

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  searchTerm: string;
  appliedFilters: FilterOptions;
}

const ListView = ({ id, setIsModalNewTaskOpen, searchTerm, appliedFilters }: Props) => {
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
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header 
          name="List"
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
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {tasks?.map((task: Task) => <TaskCard key={task.id} task={task} />)}
      </div>
    </div>
  );
}

export default ListView