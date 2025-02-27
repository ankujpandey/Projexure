// import { useAppSelector } from '@/app/redux';
// import Modal from '@/components/Modal';
// import { textFieldSxStyle } from '@/lib/utils';
// import { useCreateProjectMutation } from '@/state/api';
// import { TextField } from '@mui/material';
// import { ThemeProvider, createTheme } from '@mui/material/styles'
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
// import { formatISO, parseISO } from 'date-fns';
// import { format, parse } from 'date-fns';
// import React, { useState } from 'react'

// type Props = {
//     isOpen: boolean;
//     onClose: () => void;
// }

// const ModalNewProject = ({isOpen, onClose}: Props) => {
//     const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

//     const [createProject, {isLoading}] = useCreateProjectMutation();
//     const [projectName, setProjectName] = useState("");
//     const [description, setDescription] = useState("");
//     const [startDate, setStartDate] = useState("");
//     const [endDate, setEndDate] = useState("");

//     const theme = createTheme({
//         palette: {
//             mode: isDarkMode ? 'dark' : 'light',
//         },
//     });

//     const handleSubmit = async () => {
//         if(!projectName || !startDate || !endDate) return;

//         const formattedStartDate = formatISO(new Date(startDate),{representation: 'complete'})
//         const formattedEndDate = formatISO(new Date(endDate),{representation: 'complete'})

//         let resp = await createProject({
//             name: projectName,
//             description,
//             startDate: formattedStartDate,
//             endDate: formattedEndDate
//         });

//         if(resp.data){
//             setProjectName('');
//             setDescription('');
//             setStartDate('');
//             setEndDate('');
//         }
//         console.log("resp-------------", resp)
//     }

//     const isFormValid = () => {
//         return projectName && description && startDate && endDate;
//     }

//     const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:foucus:outline-none"

//     return (
        
//         <Modal 
//             isOpen={isOpen}
//             onClose={onClose}
//             name='Create New Project'
//         >
//             <form 
//                 className='mt-4 space-y-4 px-4 pb-4'
//                 onSubmit={(e)=>{
//                     e.preventDefault();
//                     handleSubmit();
//                 }}
//             >
//                 <TextField 
//                     // id="outlined-basic" 
//                     label="Project Name" 
//                     variant="outlined" 
//                     className={inputStyles}
//                     sx={textFieldSxStyle(isDarkMode)}
//                     type='text'
//                     value={projectName}
//                     onChange={(e)=> setProjectName(e.target.value)}
//                     size='small'
//                 />
//                 <TextField 
//                     // id="outlined-multiline-static"
//                     label="Description"
//                     multiline
//                     rows={3}
//                     className={inputStyles}
//                     sx={textFieldSxStyle(isDarkMode)}
//                     type='text'
//                     value={description}
//                     onChange={(e)=> setDescription(e.target.value)}
//                     size='small'
//                 />
//                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2">
//                     <ThemeProvider theme={theme}>
//                         <LocalizationProvider dateAdapter={AdapterDateFns}>
//                             <DatePicker 
//                                 label="Start Date" 
//                                 format="dd-MM-yyyy"
//                                 className={inputStyles}
//                                 sx={textFieldSxStyle(isDarkMode)}
//                                 value={startDate ? parseISO(startDate) : null}
//                                 onChange={(newDate: Date | null) => {
//                                     if(newDate){
//                                         const formattedDate = format(newDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
//                                         setStartDate(formattedDate);
//                                     }
//                                 }}
//                                 slotProps={{
//                                     textField: { size: "small" },
//                                 }}
//                             />
//                             <DatePicker 
//                                 label="End Date" 
//                                 format="dd-MM-yyyy"
//                                 className={inputStyles}
//                                 sx={textFieldSxStyle(isDarkMode)}
//                                 value={endDate ? parseISO(endDate) : null}
//                                 onChange={(newDate: Date | null) => {
//                                     if(newDate){
//                                         const formattedDate = format(newDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
//                                         setEndDate(formattedDate);
//                                     }
//                                 }}
//                                 slotProps={{
//                                     textField: { size: "small" },
//                                 }}
//                             />
//                         </LocalizationProvider>
//                     </ThemeProvider>
//                 </div>
//                 <button className={`mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus-offset-2 ${
//                     !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
//                 }`}
//                 disabled={!isFormValid() || isLoading}
//                 type='submit'
//                 >
//                     {isLoading ? "Creating..." : "Create Project"}
//                 </button>
//             </form>
//         </Modal>
//     )
// }

// export default ModalNewProject

import { useAppSelector } from '@/app/redux';
import Modal from '@/components/Modal';
import { textFieldSxStyle } from '@/lib/utils';
import { Project, useCreateProjectMutation, useUpdateProjectMutation } from '@/state/api';
import { TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { formatISO, parseISO } from 'date-fns';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';


type Props = {
    isOpen: boolean;
    onClose: () => void;
    project?: Project | null;
  };
  
  const ModalNewProject = ({ isOpen, onClose, project = null }: Props) => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const router = useRouter();
    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
    const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
  
    // Initialize form state if editing an existing project
    useEffect(() => {
      if (project) {
        setProjectName(project.name);
        setDescription(project.description || "");
        setStartDate(project.startDate || "");
        setEndDate(project.endDate || "");
      } else {
        setProjectName("");
        setDescription("");
        setStartDate("");
        setEndDate("");
      }
    }, [project]);
  
    const theme = createTheme({
      palette: {
        mode: isDarkMode ? 'dark' : 'light',
      },
    });
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!projectName || !startDate || !endDate) return;
  
      // Format the dates to ISO strings
      const formattedStartDate = formatISO(new Date(startDate), { representation: 'complete' });
      const formattedEndDate = formatISO(new Date(endDate), { representation: 'complete' });
  
      let response;
      if (project && project.id) {
        // Update mode
        response = await updateProject({
          id: Number(project.id),
          project: {
            name: projectName,
            description,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
        });
      } else {
        // Create mode
        response = await createProject({
          name: projectName,
          description,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });
      }
  
      if (response && response.data) {
        // Optionally reset form state
        setProjectName("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        onClose();
        router.push(`/projects/${response?.data?.id}`)
      }
    };
  
    const isFormValid = () => {
      return projectName !== "" && startDate !== "" && endDate !== "";
    };
  
    const inputStyles =
      "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white";
  
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        name={project && project.id ? "Edit Project" : "Create New Project"}
      >
        <form className="mt-4 space-y-4 px-4 pb-4" onSubmit={handleSubmit}>
          <TextField
            label="Project Name"
            variant="outlined"
            className={inputStyles}
            sx={textFieldSxStyle(isDarkMode)}
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            size="small"
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            variant="outlined"
            className={inputStyles}
            sx={textFieldSxStyle(isDarkMode)}
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  format="dd-MM-yyyy"
                  className={inputStyles}
                  sx={textFieldSxStyle(isDarkMode)}
                  value={startDate ? parseISO(startDate) : null}
                  onChange={(newDate: Date | null) => {
                    if (newDate) {
                      const formatted = format(newDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
                      setStartDate(formatted);
                    }
                  }}
                  slotProps={{ textField: { size: "small" } }}
                />
                <DatePicker
                  label="End Date"
                  format="dd-MM-yyyy"
                  className={inputStyles}
                  sx={textFieldSxStyle(isDarkMode)}
                  value={endDate ? parseISO(endDate) : null}
                  onChange={(newDate: Date | null) => {
                    if (newDate) {
                      const formatted = format(newDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX");
                      setEndDate(formatted);
                    }
                  }}
                  slotProps={{ textField: { size: "small" } }}
                />
              </LocalizationProvider>
            </ThemeProvider>
          </div>
          <button
           className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isCreating ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isCreating || isUpdating}
          type="submit"
          >
            {project && project.id
              ? isUpdating
                ? "Updating..."
                : "Update Project"
              : isCreating
              ? "Creating..."
              : "Create Project"}
          </button>
        </form>
      </Modal>
    );
  };
  
  export default ModalNewProject;
  