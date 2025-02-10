import { useAppSelector } from '@/app/redux';
import Modal from '@/components/Modal';
import { textFieldSxStyle } from '@/lib/utils';
import { Priority, Status, useCreateTaskMutation } from '@/state/api';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { formatISO, parseISO } from 'date-fns';
import { format, parse } from 'date-fns';
import React, { useState } from 'react'

type Props = {
    isOpen: boolean;
    onClose: () => void;
    id?: string | null;
}

const ModalNewTask = ({ isOpen, onClose, id = null }: Props) => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const [createTask, {isLoading}] = useCreateTaskMutation();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<Status>(Status.ToDo);
    const [priority, setPriority] = useState<Priority>(Priority.Backlog);
    const [tags, setTags] = useState("");
    const [startDate, setStartDate] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [authorUserId, setAuthorUserId] = useState("");
    const [assignedUserId, setAssignedUserId] = useState("");
    const [projectId, setProjectId] = useState("");

    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
        },
    });

    const handleSubmit = async () => {
        if(!title || !authorUserId || (id !== null || projectId )) return;

        const formattedStartDate = startDate ? formatISO(new Date(startDate),{representation: 'complete'}) : "";
        const formattedDueDate = dueDate ? formatISO(new Date(dueDate),{representation: 'complete'}) : "";

        let resp = await createTask({
            title,
            description,
            status,
            priority,
            tags,
            startDate: formattedStartDate,
            dueDate: formattedDueDate,
            authorUserId: parseInt(authorUserId),
            assignedUserId: parseInt(assignedUserId),
            projectId: id !== null ? Number(id) : Number(projectId),
        });


        console.log("title---------",title)
        console.log("description---------",description)
        console.log("status---------",status)
        console.log("priority---------",priority)
        console.log("tags---------",tags)
        console.log("startDate---------",startDate)
        console.log("dueDate---------",dueDate)
        console.log("authorUserId---------",authorUserId)
        console.log("assignedUserId---------",assignedUserId)
        console.log("id---------",id)

        if(resp.data){
          setTitle("");
          setDescription("");
          setStatus(Status.ToDo);
          setPriority(Priority.Backlog);
          setTags("");
          setStartDate("");
          setDueDate("");
          setAuthorUserId("");
          setAssignedUserId("");
          onClose();
        }
        // console.log("resp-------------", resp)
    }

    const isFormValid = () => {
        return title && authorUserId && (id !== null || projectId );
    }

    const selectStyles = "w-full rounded border-gray-300 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

    const inputStyles = "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:foucus:outline-none"

    return (
      <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
        <form
          className="mt-4 space-y-4 px-4 pb-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TextField
            // id="outlined-basic"
            label="Title"
            variant="outlined"
            className={inputStyles}
            sx={textFieldSxStyle(isDarkMode)}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="small"
          />
          <TextField
            // id="outlined-multiline-static"
            label="Description"
            multiline
            rows={3}
            className={inputStyles}
            sx={textFieldSxStyle(isDarkMode)}
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2">
            <FormControl sx={textFieldSxStyle(isDarkMode)} size="small">
              <InputLabel id="status">Status</InputLabel>
              <Select
                labelId="status"
                className={selectStyles}
                value={status}
                label="Status"
                onChange={async (e) =>{
                  const enumKey = Object.keys(Status).find((key) => Status[key as keyof typeof Status] === e.target.value); //to access keys of enums from value
                  setStatus(Status[enumKey as keyof typeof Status])
                }

                }              
              >
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value={Status.ToDo}>To Do</MenuItem>
                <MenuItem value={Status.WorkInProgress}>
                  Work In Progress
                </MenuItem>
                <MenuItem value={Status.UnderReview}>Under Review</MenuItem>
                <MenuItem value={Status.Completed}>Completed</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={textFieldSxStyle(isDarkMode)} size="small">
              <InputLabel id="priority">Priority</InputLabel>
              <Select
                labelId="priority"
                className={selectStyles}
                value={priority}
                label="Priority"
                onChange={(e) =>
                  setPriority(Priority[e.target.value as keyof typeof Priority])
                }
              >
                <MenuItem value="">Select Priority</MenuItem>
                <MenuItem value={Priority.Urgent}>Urgent</MenuItem>
                <MenuItem value={Priority.High}>High</MenuItem>
                <MenuItem value={Priority.Medium}>Medium</MenuItem>
                <MenuItem value={Priority.Low}>Low</MenuItem>
                <MenuItem value={Priority.Backlog}>Backlog</MenuItem>
              </Select>
            </FormControl>
          </div>
          <TextField
            // id="outlined-basic"
            label="Tags (comma separeted)"
            variant="outlined"
            className={inputStyles}
            sx={textFieldSxStyle(isDarkMode)}
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            size="small"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-2">
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
                      const formattedDate = format(
                        newDate,
                        "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                      );
                      setStartDate(formattedDate);
                    }
                  }}
                  slotProps={{
                    textField: { size: "small" },
                  }}
                />
                <DatePicker
                  label="End Date"
                  format="dd-MM-yyyy"
                  className={inputStyles}
                  sx={textFieldSxStyle(isDarkMode)}
                  value={dueDate ? parseISO(dueDate) : null}
                  onChange={(newDate: Date | null) => {
                    if (newDate) {
                      const formattedDate = format(
                        newDate,
                        "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
                      );
                      setDueDate(formattedDate);
                    }
                  }}
                  slotProps={{
                    textField: { size: "small" },
                  }}
                />
              </LocalizationProvider>
            </ThemeProvider>
          </div>
          <TextField
            // id="outlined-basic"
            label="Author User ID"
            variant="outlined"
            className={inputStyles}
            sx={textFieldSxStyle(isDarkMode)}
            type="text"
            value={authorUserId}
            onChange={(e) => setAuthorUserId(e.target.value)}
            size="small"
          />
          <TextField
            // id="outlined-basic"
            label="Assigned User ID"
            variant="outlined"
            className={inputStyles}
            sx={textFieldSxStyle(isDarkMode)}
            type="text"
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            size="small"
          />
          {id === null && (
            <TextField
              // id="outlined-basic"
              label="Project ID"
              variant="outlined"
              className={inputStyles}
              sx={textFieldSxStyle(isDarkMode)}
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              size="small"
            />
          )}
          <button
            className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={!isFormValid() || isLoading}
            type="submit"
          >
            {isLoading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </Modal>
    );
}

export default ModalNewTask