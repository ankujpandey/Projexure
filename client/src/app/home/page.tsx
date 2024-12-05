'use client'
import { Priority, Task, useGetProjectsQuery, useGetTasksQuery } from '@/state/api'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../redux';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import Header from '@/components/Header';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { colors } from '@mui/material';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';
import { skipToken } from '@reduxjs/toolkit/query';

const CustomToolbar = () => (
    <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarExport />
    </GridToolbarContainer>
)

const taskColumns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width: 200 },
    { field: "priority", headerName: "Priority", width: 200 },
    { field: "dueDate", headerName: "Due Date", width: 200 },
];

const COLORS = ["#FF8042", "#808080", "#00C49F", "#0088FE", "#FFBB28"];

const HomePage = () => {
    const {data: projects, isLoading: isProjectsLoading} = useGetProjectsQuery();
    const [projectID, setProjectID] = useState<number | undefined>(undefined);
    const [project, setProject] = useState<object | undefined>(undefined);
    const {data: tasks, isLoading: tasksLoading, isError: tasksError, refetch: refetchTasks} = useGetTasksQuery(projectID !== undefined ? { projectId: projectID } : skipToken);

    const isDarkMode = useAppSelector((state)=> state.global.isDarkMode);

    useEffect(() => {
        if (projects && projectID === undefined) {
            setProjectID(projects[0].id);
            setProject(projects[0]);
        }
        if(projectID && projectID !== undefined){
            refetchTasks();
        }
    }, [projects, projectID, refetchTasks]);
    

    if(tasksLoading || isProjectsLoading) return <div>Loding...</div>;
    if(tasksError || !tasks || !projects) return <div>Error fetching data.</div>

    const priorityCount = tasks.reduce(
        (acc: Record<string, number>, task: Task) => {
            const { priority } = task;
            acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
            return acc;
        },
        {},
    );

    const taskDistribution = Object.keys(priorityCount).map((key) => ({
        name: key,
        count: priorityCount[key],
    }));

    const statusCount = tasks.reduce(
        (acc: Record<string, number>, task: Task) => {
            const status = task.status === "To Do" ? "To Do" : task.status === "Work In Progress" ? "Work In Progress" : task.status === "Under Review" ? "Under Review" : task.status === "Completed" ? "Completed" : "Not Assigned";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        },
        {},
    )

    const projectStatus = Object.keys(statusCount).map((key) => ({
        name: key,
        count: statusCount[key],
    }));

    const handleViewModeChange = async (e: any) => {
        // console.log("(e.target.value)----------", e.target.value)
        setProjectID(e.target.value);
        // console.log("projectID----------", projectID)
    }

    console.log("tasks----------", tasks)

    const chartColors = isDarkMode
        ? {
            bar: "#8884d8",
            barGrid: "#303030",
            pieFill: "#4A90E2",
            text: "#FFFFFF",
        }
        : {
            bar: "#8884d8",
            barGrid: "#E0E0E0",
            pieFill: "#82ca9d",
            text: "#000000",
        };

    return (
        <div className='container mx-auto h-full w-[100%] bg-gray-100 bg-transparent p-8'>
            <Header 
                name="projectID Mangement Dashboard" 
                buttonComponent={
                    <select 
                        className='focus:shadow-outline block w-[40%] rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white'
                        value={projectID}
                        onChange={handleViewModeChange}
                    >

                        {projects && projects?.map((projectID) => (
                            <option key={projectID.id} value={projectID.id}>{projectID.name}</option>
                        ))}
                    </select>
                }
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
                    <h3 className="mb-4 text-lg font-semibold dark:text-white">
                        Task Priority Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={taskDistribution}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={chartColors.barGrid}
                            />
                            <XAxis dataKey="name" stroke={chartColors.text} />
                            <YAxis stroke={chartColors.text} />
                            <Tooltip 
                                contentStyle={{
                                    width: "min-content",
                                    height: "min-content"
                                }}
                            />
                            <Legend />
                            <Bar dataKey="count" fill={chartColors.bar}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
                    <h3 className="mb-4 text-lg font-semibold dark:text-white">
                        project Status
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                                {console.log("projectStatus---",projectStatus)}
                            <Pie dataKey="count" data={projectStatus} fill='#82ca9d' label>
                                {projectStatus.map((entry, index)=> (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={COLORS[index % COLORS.length]} 
                                    />
                                ))

                                }
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
                    <h3 className="mb-4 text-lg font-semibold dark:text-white">
                        Your Tasks
                    </h3>
                    <div style={{height:400, width: "100%"}}>
                        <DataGrid
                            rows={tasks}
                            columns={taskColumns}
                            checkboxSelection
                            loading={tasksLoading}
                            slots={{
                                toolbar: CustomToolbar,
                            }}
                            getRowClassName={()=> "data-grid-row"}
                            getCellClassName={()=> "data-grid-cell"}
                            className={dataGridClassNames}
                            sx={dataGridSxStyles(isDarkMode)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage