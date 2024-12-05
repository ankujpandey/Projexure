'use client'
import Header from '@/components/Header';
import ProjectCard from '@/components/ProjectCard';
import TaskCard from '@/components/TackCard';
import UserCard from '@/components/UserCard';
import { useSearchQuery } from '@/state/api';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react'

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const {
        data: searchResults,
        isLoading,
        isError,
    } = useSearchQuery(searchTerm, {
        skip: searchTerm.length < 3,
    });

    const handleSearch = debounce(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(event.target.value);
        },
        500,
    );

    useEffect(()=>{
        return handleSearch.cancel;
    }, [handleSearch.cancel])


    return (
        <div className='p-8'>
            <Header name='Search'/>
            <div>
                <input 
                    type="text" 
                    placeholder='Search...' 
                    className='w-1/2 rounded border p-3 shadow dark:bg-gray-700 dark:text-white dark:placeholder-white'
                    onChange={handleSearch}
                />
            </div>
            <div className='p-5'>
                {isLoading && <p>Loading...</p>}
                {isError && <p>Error occured while fetching search results.</p>}
                {!isLoading && !isError && searchResults && (
                    <div>
                        {searchResults.tasks && searchResults.tasks?.length > 0 && (
                            <h2 className='font-bold text-base mb-3 dark:text-gray-100'>Tasks</h2>
                        )}
                        {searchResults.tasks?.map((task)=> (
                            <TaskCard key={task.id} task={task} />
                        )) }

                        {searchResults.projects && searchResults.projects?.length > 0 && (
                            <h2 className='font-bold text-base mb-3 dark:text-gray-100'>Projects</h2>
                        )}
                        {searchResults.projects?.map((project)=> (
                            <ProjectCard key={project.id} project={project} />
                        )) }

                        {searchResults.users && searchResults.users?.length > 0 && (
                            <h2 className='font-bold text-base mb-3 dark:text-gray-100'>Users</h2>
                        )}
                        {searchResults.users?.map((user)=> (
                            <UserCard key={user.userId} user={user} />
                        )) }
                    </div>
                )}
            </div>
        </div>
    )
}

export default Search