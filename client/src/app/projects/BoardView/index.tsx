import { Comment, useDeleteTaskMutation, useGetTasksQuery, useUpdateTaskStatusMutation } from '@/state/api';
import React, { useState } from 'react'
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend';
import {Task as TaskType, FilterOptions} from "@/state/api"
import { EditIcon, EllipsisVertical, MessageSquareMore, Plus, Trash } from 'lucide-react';
import {format} from "date-fns";
import Image from 'next/image';
import ModalNewTask from '@/components/ModalNewTask';
import ModalComments from '@/components/ModalComments';
import ModalConfirm from '@/components/ModalConfirm';

type BoardProps = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
    searchTerm: string;
    appliedFilters: FilterOptions;
}

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const BoardView = ({ id, setIsModalNewTaskOpen, searchTerm, appliedFilters }: BoardProps) => {
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

    const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
    const [isModalNewCommentOpen, setIsModalNewCommentOpen] = useState(false);

    const handleCommentAdded = (newComment: Comment) => {
      if (!selectedTask) return;
    
      setSelectedTask((prev) => {
        if (!prev) return prev;
    
        return {
          ...prev,
          comments: [...(prev.comments ?? []), newComment] as Comment[],
        };
      });
    };

    // console.log("isModalNewCommentOpen---------------",isModalNewCommentOpen)

    const [updateTaskStatus] = useUpdateTaskStatusMutation();

    const moveTask = (taskId: number, toStatus: string) => {
        updateTaskStatus({ taskId, status: toStatus });
    };

    if(isLoading) return <div>Loading...</div>
    if(error) return <div>An error occurred while fetching tasks</div>

    return (
        <DndProvider backend={HTML5Backend}>
            <ModalComments 
                isOpen={isModalNewCommentOpen}
                onClose={() => {
                    setIsModalNewCommentOpen(false);
                    setSelectedTask(null);
                }}                
                task={selectedTask}
                onCommentAdded={handleCommentAdded}
            />
            <div className="grid gird-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
                {taskStatus.map((status, index)=>(
                    <TaskColumn
                        key={index}
                        status={status}
                        tasks={tasks || []}
                        moveTask={moveTask}
                        setIsModalNewTaskOpen={setIsModalNewTaskOpen}
                        setSelectedTask={setSelectedTask}
                        setIsModalNewCommentOpen={setIsModalNewCommentOpen}
                    />
                ))}
            </div>
        </DndProvider>
    );
};

type TaskColumnProps = {
    status: string;
    tasks: TaskType[];
    moveTask: (taskId: number, toStatus: string) => void;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
    setSelectedTask: (task: TaskType | null) => void;
    setIsModalNewCommentOpen: (isOpen: boolean) => void;
};
const TaskColumn = ({
    status,
    tasks,
    moveTask,
    setIsModalNewTaskOpen,
    setSelectedTask,
    setIsModalNewCommentOpen
}: TaskColumnProps) => {
    const [{isOver}, drop] = useDrop(()=>({
        accept: "task",
        drop: (item: {id: number}) => moveTask(item.id, status),
        collect: (monitor: any) => ({
            isOver: !!monitor.isOver()
        })
    }));

    const tasksCount = tasks.filter((task)=> task.status === status).length;

    const statusColor: any = {
        "To Do": "#2563EB",
        "Work In Progress": "#059669",
        "Under Review": "#D97706",
        Completed: "#000000",
    };

    return (
        <div ref={(instance)=>{
            drop(instance);
        }}
        className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
        >
            <div className="mb-3 flex w-full">
                <div className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`} 
                    style={{backgroundColor: statusColor[status]}}
                />
                <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
                    <h3 className="flex items-center text-lg font-semibold dark:text-white">
                        {status}{" "}
                    
                        <span className='ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary'
                            style={{width: "1.5rem", height: "1.5rem"}}
                        >
                            {tasksCount}
                        </span>
                    </h3> 
                    <div className="flex items-center gap-1">
                        <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
                            <EllipsisVertical size={26} />
                        </button>
                        <button className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
                            onClick={()=> setIsModalNewTaskOpen(true)}
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>
            {tasks
                .filter((task)=> task.status === status)
                .map((task)=>(
                    <Task key={task.id} task={task} setSelectedTask={setSelectedTask} setIsModalNewCommentOpen={setIsModalNewCommentOpen} />
                ))
            }
        </div>
    );
}

type TaskProps = {
    task: TaskType
    setSelectedTask: (task: TaskType | null) => void;
    setIsModalNewCommentOpen: (isOpen: boolean) => void;
}

const Task = ({task, setSelectedTask, setIsModalNewCommentOpen}: TaskProps) => {
    const [{isDragging}, drag] = useDrag(()=>({
        type: "task",
        item: {id: task.id},
        collect: (monitor: any) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    const [deleteTask] = useDeleteTaskMutation();
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const handleEdit = () => {
      setIsDialogOpen(true)
      setIsMenuOpen(false)
    }
  
    const handleDelete = () => {
      setIsDeleteDialogOpen(true);
    }

    const handleConfirmDelete = () => {
      deleteTask({taskId: task.id})
        .unwrap()
        .then(() => {
          setIsDeleteDialogOpen(false);
          setIsMenuOpen(false);
        })
        .catch((error) => {
          // Handle error if necessary
          console.error('Failed to delete task:', error);
        });
    };

    const taskTagsSplit = task.tags ? task.tags.split(",") : [];

    const formattedStartDate = task.startDate ? format(new Date(task.startDate), "P") : ""
    const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), "P") : ""

    const numberOfComments = (task.comments && task.comments.length) || 0;

    const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
        <div
            className={`rounded-full px-2 py-1 text-xs font-semibold ${
                priority === "Urgent"
                    ? "bg-red-200 text-red-700"
                    : priority === "High"
                        ? "bg-orange-200 text-orange-700"
                        : priority === "Medium"
                            ? "bg-yellow-200 text-yellow-700"
                            : priority === "Low"
                                ? "bg-green-200 text-green-700"
                                : "bg-gray-200 text-gray-700"
            }`}
        >
            {priority}
        </div>
    );

    return (
      <div
        ref={(instance) => {
          drag(instance);
        }}
        className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
      >
        <ModalNewTask
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          id={null}
          task={task}
        />
        {task.attachments && task.attachments.length > 0 && (
          <Image
            src={`/${task.attachments[0].fileURL}`}
            alt={task.attachments[0].fileName}
            width={400}
            height={200}
            className="h-auto w-full rounded-t-md"
          />
        )}
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              {task.priority && <PriorityTag priority={task.priority} />}
              <div className="flex gap-2">
                {taskTagsSplit.map((tag) => (
                  <div
                    key={tag}
                    className="rounded-full bg-blue-200 px-2 py-1 text-xs dark:text-gray-600"
                  >
                    {" "}
                    {tag}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <button
                className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                  console.log("isMenuOpen--------", isMenuOpen);
                }}
              >
                <EllipsisVertical size={26} />
              </button>
              {isMenuOpen && (
                <div
                  className="z-8 absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-lg dark:bg-dark-secondary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <button
                      onClick={handleEdit}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                    >
                      <EditIcon size={15} /> Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Trash size={16} /> Delete
                    </button>
                  </div>
                </div>
              )}
              <ModalConfirm
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                  setIsDeleteDialogOpen(false);
                  setIsMenuOpen(false);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Task"
                message={`Are you sure you want to delete "${task.title}"?`}
                confirmText="Yes, Delete it!"
                cancelText="No"
              />
            </div>
          </div>
          <div className="my-3 flex justify-between">
            <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
            {typeof task.points === "number" && (
              <div className="text-xs font-semibold dark:text-white">
                {task.points} pts
              </div>
            )}
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-neutral-500">
            {formattedStartDate && <span> {formattedStartDate} - </span>}
            {formattedDueDate && <span>{formattedDueDate}</span>}
          </div>
          <p className="text-sm text-gray-600 dark:text-neutral-500">
            {task.description}
          </p>
          <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

          {/* Users */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex -space-x-[6px] overflow-hidden">
              {task.assignee && (
                <Image
                  key={`assignee-${task.assignee.userId}`}
                  src={`/${task.assignee.profilePictureUrl!}`}
                  alt={task.assignee.username}
                  width={30}
                  height={30}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                />
              )}
              {task.author && (
                <Image
                  key={`author-${task.author.userId}`}
                  src={`/${task.author.profilePictureUrl!}`}
                  alt={task.author.username}
                  width={30}
                  height={30}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
                />
              )}
            </div>
            <button
              className="flex items-center text-gray-500 dark:text-neutral-500"
              onClick={() => {
                setSelectedTask(task);
                setIsModalNewCommentOpen(true);
              }}
            >
              <MessageSquareMore size={20} />
              <span className="ml-1 text-sm dark:text-neutral-400">
                {numberOfComments}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
}

export default BoardView;