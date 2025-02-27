'use client'
import React, { useEffect, useState } from 'react'
import ProjectHeader from "@/app/projects/ProjectHeader"
import BoardView from '../BoardView';
import ListView from '../ListView';
import Timeline from '../TimelineView';
import TableView from '../TableView';
import ModalNewTask from '@/components/ModalNewTask';
import { FilterOptions, useGetProjectQuery } from '@/state/api';
import { debounce } from 'lodash';


type Props = {
    params: { id: string };
};

const Project = ({params}: Props) => {
    const {id} = params;
    const [activeTab, setActiveTab] = useState("Board");
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [appliedFilters, setAppliedFilters] = useState<FilterOptions>({
        statuses: [],
        priorities: [],
        tags: null,
        startDate: null,
        endDate: null,
    });

    const handleSearch = debounce(
        (value: string) => {
            setSearchTerm(value);
        },
        500,
    );

    const handleApplyFilters = (filters: FilterOptions) => {
        setAppliedFilters(filters);
        // Optionally, trigger any data fetch or update logic here.
    };

    // console.log("appliedFilters--------------------", appliedFilters)

    useEffect(()=>{
        return handleSearch.cancel;
    }, [handleSearch.cancel])
    
    return (
        <div>
            <ModalNewTask 
                isOpen={isModalNewTaskOpen}
                onClose={()=> setIsModalNewTaskOpen(false)}
                id={id}
            />

            <ProjectHeader id={id} activeTab={activeTab} setActiveTab={setActiveTab} handleSearch={handleSearch} onApplyFilters={handleApplyFilters} appliedFilters={appliedFilters} />
            
            {activeTab === "Board" && (
                <BoardView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} searchTerm={searchTerm} appliedFilters={appliedFilters} />
            )}

            {activeTab === "List" && (
                <ListView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} searchTerm={searchTerm} appliedFilters={appliedFilters} />
            )}

            {activeTab === "Timeline" && (
                <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} searchTerm={searchTerm} appliedFilters={appliedFilters} />
            )}

            {activeTab === "Table" && (
                <TableView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} searchTerm={searchTerm} appliedFilters={appliedFilters} />
            )}
        </div>
    );
}

export default Project
