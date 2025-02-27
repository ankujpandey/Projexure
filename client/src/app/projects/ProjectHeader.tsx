import Header from '@/components/Header';
import { Clock, EditIcon, Filter, Grid3X3, List, PlusSquare, Settings2, Share2, SmilePlus, Table, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import ModalNewProject from './ModalNewProject';
import FilterDropdown from '@/components/FilterOptionsTask';
import { FilterOptions, useDeleteProjectMutation, useGetProjectQuery } from '@/state/api';
import Project from './[id]/page';
import ModalConfirm from '@/components/ModalConfirm';

type Props = {
    id: string;
    activeTab: string;
    setActiveTab: (tabName: string) => void;
    handleSearch: (value: string) => void;
    onApplyFilters?: (filters: FilterOptions) => void;
    appliedFilters: FilterOptions;
    // isDeleted: boolean,
    // setIsDeleted: (isDeleted: boolean) => void;
};

const ProjectHeader = ({id, /* isDeleted, setIsDeleted, */ activeTab, setActiveTab, handleSearch, onApplyFilters = () => {}, appliedFilters}: Props) => {
    const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isDeleted, setIsDeleted] = useState(false);
    const {data: project, isLoading} = useGetProjectQuery({id});
    const [deleteProject] = useDeleteProjectMutation();

    const handleEdit = () => {
        setIsDialogOpen(true)
        setIsMenuOpen(false)
    }
    
    const handleDelete = () => {
        setIsDeleteDialogOpen(true);
    }

    const handleConfirmDelete = () => {
        deleteProject({id})
        .unwrap()
        .then(() => {
            setIsDeleteDialogOpen(false);
            setIsMenuOpen(false);
            setIsDeleted(true);
            setActiveTab("");
        })
        .catch((error) => {
            // Handle error if necessary
            console.error('Failed to delete project:', error);
        });
    };

    console.log("prject------------", project);

    const isFilterActive =
    appliedFilters.statuses.length > 0 ||
    appliedFilters.priorities.length > 0 ||
    !!appliedFilters.tags ||
    !!appliedFilters.startDate ||
    !!appliedFilters.endDate;

    if(isLoading) return <div></div>;

    if (isDeleted) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen text-center">
                <ModalNewProject 
                    isOpen={isModalNewProjectOpen}
                    onClose={()=> setIsModalNewProjectOpen(false)}
                />
                <h2 className='text-xl'>Project Deleted</h2>
                <p className='py-2'>Please select another project or create a new one.</p>
                <button 
                    className='flex items-center rounded-md bg-blue-primary px-3 py-2 text-white'
                    onClick={()=>setIsModalNewProjectOpen(true)}
                >
                    <PlusSquare className='mr-2 h-5 w-5' />
                    <span className='font-medium'>New Boards</span>
                </button>
            </div>
        );
    }

    return (
        <div className="px-4 xl:px-6">
            <ModalNewProject 
                isOpen={isModalNewProjectOpen}
                onClose={()=> setIsModalNewProjectOpen(false)}
            />
            <ModalNewProject 
                isOpen={isDialogOpen}
                onClose={()=> setIsDialogOpen(false)}
                project={project}
            />
            <ModalConfirm
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setIsMenuOpen(false);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Project"
                message={`Deleting project will delete all the tasks and thier attahments. Do you still want to delete "${project?.name}"?`}
                confirmText="Yes, Delete it!"
                cancelText="No"
            />
            <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
                <Header name={`${project?.name ? project.name : "Product Design Development" }`}
                    settings={
                        <div className='relative'>
                            <button 
                                onClick={()=>{setIsMenuOpen(!isMenuOpen)}}
                            >
                                <Settings2 className='ms-1 h-6 w-6' style={{marginBottom: "-3px"}} />
                            </button>{}

                            {isMenuOpen && (
                                <div
                                    className="z-10 absolute left-0 mt-1 w-48 rounded-md border bg-white shadow-lg dark:bg-dark-secondary"
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
                        </div>
                    }
                    buttonComponent={
                        <button 
                            className='flex items-center rounded-md bg-blue-primary px-3 py-2 text-white'
                            onClick={()=>setIsModalNewProjectOpen(true)}
                        >
                            <PlusSquare className='mr-2 h-5 w-5' />
                            <span className='font-medium'>New Boards</span>
                        </button>
                    }
                    description={
                        <span className='text-base'>{project?.description}</span>
                    }
                />
            </div>

            {/* TABS */}
            <div className="relative flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark md:items-center">
                <div className="flex flex-1 gap-2 md:gap-4">
                    <TabButton
                        name="Board"
                        icon={<Grid3X3 className="h-5 w-5" />}
                        setActiveTab={setActiveTab}
                        activeTab={activeTab}
                    />
                    <TabButton
                        name="List"
                        icon={<List className="h-5 w-5" />}
                        setActiveTab={setActiveTab}
                        activeTab={activeTab}
                    />
                    <TabButton
                        name="Timeline"
                        icon={<Clock className="h-5 w-5" />}
                        setActiveTab={setActiveTab}
                        activeTab={activeTab}
                    />
                    <TabButton
                        name="Table"
                        icon={<Table className="h-5 w-5" />}
                        setActiveTab={setActiveTab}
                        activeTab={activeTab}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        className={`text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300 ${
                            isFilterActive ? "ring-2 ring-blue-500 shadow-lg" : ""
                        }`}
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                    >
                        <Filter className={`h-5 w-5 ${isFilterOpen ? "text-blue-500" : ""}`}/>
                    </button>
                    {/* FilterDropdown Component */}
                    <FilterDropdown 
                        isOpen={isFilterOpen}
                        onClose={() => setIsFilterOpen(false)}
                        onApplyFilters={onApplyFilters}
                        initialFilters={appliedFilters}
                    />       
                    
                    <button className='text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300'>
                        <Share2 className='h-5 w-5'/>
                    </button>
                    <div className="relative">
                        <input type="text" placeholder='Search Task'
                            className='rounded-md border py-1 pl-10 pr-4 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white'
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <Grid3X3 className='absolute left-3 h-4 w-4 text-gray-400 dark:text-neutral-500' style={{top: "0.45rem"}} />
                    </div>
                </div>
            </div>
        </div>
    );
}

type TabButtonProps = {
    name: string;
    icon: React.ReactNode;
    setActiveTab: (tabName: string) => void;
    activeTab: string;
}

const TabButton = ({name, icon, setActiveTab, activeTab}: TabButtonProps) => {
    const isActive = activeTab === name;

    return (
      <button
        className={`relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[9px] after:left-0 after:h-[1px] after:w-full hover:text-blue-600 dark:text-neutral-500 dark:hover:text-white sm:px-2 lg:px-4 
            ${isActive ? "text-blue-600 after:bg-blue-600 dark:text-white" : ""}`}
        onClick={() => setActiveTab(name)}
      >
        {icon}
        {name}
      </button>
    );
}

export default ProjectHeader
