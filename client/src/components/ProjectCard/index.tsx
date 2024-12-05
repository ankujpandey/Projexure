import { Project } from '@/state/api'
import { format } from 'date-fns'
import React from 'react'

type Props = {
    project: Project
}

const ProjectCard = ({project}: Props) => {
    
  const formattedStartDate = project.startDate ? format(new Date(project.startDate), "P") : ""
  const formattedDueDate = project.endDate ? format(new Date(project.endDate), "P") : ""

  return (
    <div className="rounded-lg my-3 border bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-lg dark:bg-dark-secondary dark:text-white">
      <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">{project.name}</h3>
      <p className="mb-6 text-gray-600 dark:text-gray-300">{project.description}</p>
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-300">
        <p>
          <strong className="text-gray-700 dark:text-gray-300">Start Date:</strong>{" "}
          {formattedStartDate}
        </p>
        <p>
          <strong className="text-gray-700 dark:text-gray-300">End Date:</strong>{" "}
          {formattedDueDate}
        </p>
      </div>
    </div>
  );
}

export default ProjectCard