'use client'
import React, { useEffect, useState } from 'react'
import ProjectHeader from "@/app/projects/ProjectHeader"
import BoardView from '../BoardView';
import ListView from '../ListView';
import Timeline from '../TimelineView';
import TableView from '../TableView';
import ModalNewTask from '@/components/ModalNewTask';
import { useSearchQuery } from '@/state/api';
import { debounce } from 'lodash';


type Props = {
    params: { id: string };
};

const Project = ({params}: Props) => {
    const {id} = params;
    const [activeTab, setActiveTab] = useState("Board");
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = debounce(
        (value: string) => {
            setSearchTerm(value);
        },
        500,
    );

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

            <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} handleSearch={handleSearch} />
            {activeTab === "Board" && (
                <BoardView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} searchTerm={searchTerm} />
            )}

            {activeTab === "List" && (
                <ListView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} searchTerm={searchTerm} />
            )}

            {activeTab === "Timeline" && (
                <Timeline id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} searchTerm={searchTerm} />
            )}

            {activeTab === "Table" && (
                <TableView id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} searchTerm={searchTerm} />
            )}
        </div>
    );
}

export default Project
