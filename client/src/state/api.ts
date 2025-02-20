import { getTeams } from './../../../server/src/controllers/teamController';
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Project {
    id: number;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

export enum Status {
    ToDo = "To Do",
    WorkInProgress = "Work In Progress",
    UnderReview = "Under Review",
    Completed = "Completed",
}

export enum Priority {
    Urgent = "Urgent",
    High = "High",
    Medium = "Medium",
    Low = "Low",
    Backlog = "Backlog",
}

export interface User {
    userId?: number;
    username: string;
    email: string;
    profilePictureUrl?: string;
    cognitoId?: string;
    teamId?: number;
}

export interface Attachment {
    id: number;
    fileURL: string;
    fileName: string;
    taskId: string;
    uploadedById: number;
}

export interface Task {
    id: number;
    title: string; 
    description?: string; 
    status?: Status; 
    priority?: Priority; 
    tags?: string; 
    startDate?: string; 
    dueDate?: string; 
    points?: number; 
    projectId: number; 
    authorUserId: number; 
    assignedUserId?: number; 

    author?: User;
    assignee?: User;
    comments?: Comment[];
    attachments?: Attachment[];
}

export interface Comment {
    id: number;
    text: string;
    taskId: number;
    userId: number;
    cognitoId: string;
    username: string;
    profilePictureUrl: string;
    teamId: number;
    created: string;
}

export interface SearchResults {
    tasks?: Task[];
    projects?: Project[];
    users?: User[];
}


export interface Team {
    teamId: number;
    teamName: string;
    productOwnerUserId?: number;
    projectManagerUserId?: number;
}

export interface FilterOptions {
    statuses: string[];
    priorities: string[];
    tags: string | null;
    startDate: string | null;
    endDate: string | null;
}

export const api = createApi({
    baseQuery: fetchBaseQuery({baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL}),
    reducerPath: "api",
    tagTypes: ["Projects", "Tasks", "Users", "Teams"],
    endpoints: (build) => ({
        getProjects: build.query<Project[], void>({
            query: () => "projects",
            providesTags: ["Projects"],
        }),
        createProject: build.mutation<Project, Partial<Project>>({
            query: (project) => ({
                url: "projects",
                method: "POST",
                body: project
            }),
            invalidatesTags: ["Projects"]
        }),
        getTasks: build.query<Task[], { projectId: number; taskTitle?: string, statuses?: string[], priorities?: string[], startDate?: string , endDate?: string  }>({
            query: ({ projectId, taskTitle, statuses, priorities, startDate, endDate }) => {
                let url = `tasks?projectId=${projectId}`;
            
                if (taskTitle) url += `&taskName=${encodeURIComponent(taskTitle)}`;
                if (statuses && statuses.length > 0) url += `&statuses=${statuses.join(",")}`;
                if (priorities && priorities.length > 0) url += `&priorities=${priorities.join(",")}`;
                if (startDate) url += `&startDate=${startDate}`;
                if (endDate) url += `&endDate=${endDate}`;
                return url;
            },
            providesTags: (result) =>
                result
                    ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
                    : [{ type: "Tasks" as const }],
        }),
        createTask: build.mutation<Task, Partial<Task>>({
            query: (task) => ({
                url: "tasks",
                method: "POST",
                body: task
            }),
            invalidatesTags: ["Tasks"],
        }),
        getTasksByUser: build.query<Task[], number>({
            query: (userId) => `tasks/user/${userId}`,
            providesTags: (result, error, userId) => 
                result
                    ? result.map(({ id })=> ({type: "Tasks", id}))
                    : [{type: "Tasks", id: userId}],
        }),
        updateTaskStatus: build.mutation<Task, { taskId: number, status: string }>({
            query: ({ taskId, status }) => ({
                url: `tasks/${taskId}/status`,
                method: "PATCH",
                body: { status }
            }),
            invalidatesTags: (result, error, { taskId }) => [
                { type: "Tasks", id: taskId },
            ],
        }),
        updateTask: build.mutation<Task, Partial<Task> & Pick<Task, 'id'>>({
            query: ({ id, ...patch }) => ({
                url: `tasks/update/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Tasks', id }],
        }),
        deleteTask: build.mutation<void, {taskId: number}>({
            query: ({taskId}) => ({
                url: `tasks/${taskId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Tasks"],
        }),
        addComment: build.mutation<Comment, { taskId: number, userId: number, text: string }>({
            query: ({ taskId, userId, text }) => ({
                url: `tasks/${taskId}/${userId}/comments`,
                method: "POST",
                body: { text }
            }),
            invalidatesTags: (result, error, { taskId }) => [
                { type: "Tasks", id: taskId },
            ],
        }),
        getUsers: build.query<User[], void>({
            query: () => "users",
            providesTags: ["Users"],
        }),
        getTeams: build.query<Team[], void>({
            query: () => "teams",
            providesTags: ["Teams"]
        }),
        search: build.query<SearchResults, string>({
            query: (query) => `search?query=${query}`,
        })
    }),
});

export const {
    useGetProjectsQuery,
    useCreateProjectMutation,
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskStatusMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useAddCommentMutation,
    useSearchQuery,
    useGetUsersQuery,
    useGetTeamsQuery,
    useGetTasksByUserQuery,
} = api;