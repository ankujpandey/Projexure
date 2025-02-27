'use client';

import React, { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/navigation';
import { STATIC_SIDEBAR_LINKS, STATIC_PRIORITY_LINKS } from '@/lib/sidebarLinks';
import { useGetProjectsQuery } from '@/state/api';
import { Briefcase, Search } from 'lucide-react';

interface LinkItem {
  label: string;
  href: string;
  icon?: React.FC<any>;
}

export default function GlobalSearch() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedResults, setGroupedResults] = useState<{
    sidebar: LinkItem[];
    projects: LinkItem[];
    priorities: LinkItem[];
  }>({ sidebar: [], projects: [], priorities: [] });

  // Fetch projects dynamically
  const { data: projects = [] } = useGetProjectsQuery();

  // Memoize projectLinks to avoid creating a new array on every render
  const projectLinks = useMemo(() => {
    return projects.map((p: any) => ({
      label: p.name,
      href: `/projects/${p.id}`,
    }));
  }, [projects]);

  const debouncedSetSearchTerm = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value);
      }, 500),
    []
  );

  // Whenever inputValue changes, call the debounced function
  useEffect(() => {
    debouncedSetSearchTerm(inputValue);
  }, [inputValue, debouncedSetSearchTerm]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [debouncedSetSearchTerm]);

  // Filter results when searchTerm changes
  useEffect(() => {
    if (!searchTerm) {
      setGroupedResults({ sidebar: [], projects: [], priorities: [] });
      return;
    }
    const lowerTerm = searchTerm.toLowerCase();

    const sidebarResults = STATIC_SIDEBAR_LINKS.filter((item) =>
      item.label.toLowerCase().includes(lowerTerm)
    );
    const projectResults = projectLinks.filter((item) =>
      item.label.toLowerCase().includes(lowerTerm)
    );
    const priorityResults = STATIC_PRIORITY_LINKS.filter((item) =>
      item.label.toLowerCase().includes(lowerTerm)
    );

    setGroupedResults({
      sidebar: sidebarResults,
      projects: projectResults,
      priorities: priorityResults,
    });
  }, [searchTerm, projectLinks]);

  const handleSelect = (href: string) => {
    router.push(href);
    setSearchTerm('');
    setInputValue('');
    setGroupedResults({ sidebar: [], projects: [], priorities: [] });
  };

  const hasResults =
    groupedResults.sidebar.length > 0 ||
    groupedResults.projects.length > 0 ||
    groupedResults.priorities.length > 0;

  return (
    <div className="relative w-[200px]">
      <div className="relative flex h-min">
        <Search className="absolute left-[4px] top-1/2 mr-2 h-5 -translate-y-1/2 transform cursor-pointer dark:text-white" />
        <input
          className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:border-transparent focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white"
          type="search"
          placeholder="search..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      {hasResults && (
        <div className="absolute left-0 z-50 mt-2 min-w-[200px] w-auto rounded-md border bg-white shadow-lg dark:bg-dark-secondary">
          {groupedResults.sidebar.length > 0 && (
            <div>
              <h3 className="px-3 pt-2 text-sm font-semibold text-gray-400">
                Sidebar
              </h3>
              {groupedResults.sidebar.map((item) => (
                <div
                  key={item.href}
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                  onClick={() => handleSelect(item.href)}
                >
                  {item.icon && (
                    <item.icon className="mr-2 inline-block h-5 w-5 text-gray-500 dark:text-white" />
                  )}
                  {item.label}
                </div>
              ))}
            </div>
          )}
          {groupedResults.projects.length > 0 && (
            <div>
              <h3 className="px-3 pt-2 text-sm font-semibold text-gray-400">
                Projects
              </h3>
              {groupedResults.projects.map((item) => (
                <div
                  key={item.href}
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                  onClick={() => handleSelect(item.href)}
                >
                  <Briefcase className="mr-2 inline-block h-5 w-5 text-gray-500 dark:text-white" />
                  {item.label}
                </div>
              ))}
            </div>
          )}
          {groupedResults.priorities.length > 0 && (
            <div>
              <h3 className="px-3 pt-2 text-sm font-semibold text-gray-400">
                Priority
              </h3>
              {groupedResults.priorities.map((item) => (
                <div
                  key={item.href}
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                  onClick={() => handleSelect(item.href)}
                >
                  {item.icon && (
                    <item.icon className="mr-2 inline-block h-5 w-5 text-gray-500 dark:text-white" />
                  )}
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
