import { TextField } from '@mui/material';
export const dataGridClassNames = 
"border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200";

export const dataGridSxStyles = (isDarkMode: boolean) => {
    return {
        "& .MuiDataGrid-columnHeaders": {
            color: `${isDarkMode ? "#e5e7eb" : ""}`,
            '& [role="row"] > *': {
                backgroundColor: `${isDarkMode ? "#1d1f21" : "white"}`,
                borderColor: `${isDarkMode ? "#2d3135" : ""}`,
            },
        },
        "& .MuiIconbutton-root": {
            color: `${isDarkMode ? "#a3a3a3" : ""}`,
        },
        "& .MuiTablePagination-root": {
            color: `${isDarkMode ? "#a3a3a3" : ""}`,
        },
        "& .MuiTablePagination-selectIcon": {
            color: `${isDarkMode ? "#a3a3a3" : ""}`,
        },
        "& .MuiDataGrid-cell": {
            border: "none",
        },
        "& .MuiDataGrid-row": {
            borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "e5e7eb"}`,
        },
        "& .MuiDataGrid-withBorderColor": {
            borderColor: `${isDarkMode ? "#2d3135" : "e5e7eb"}`,
        },
    };
};

export const textFieldSxStyle = (isDarkMode: boolean) => {
    return {
        '.MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: `${isDarkMode ? "gray" : "" }`, // Outline color
            },
            '&:hover fieldset': {
                borderColor: `${isDarkMode ? "gray" : "" }`, // Hover outline color
            },
            '&.Mui-focused fieldset': {
                borderColor:  `${isDarkMode ? "white" : "" }`, // Focused outline color
            },
        },
        '.MuiInputBase-input': {
            color: `${isDarkMode ? "white" : "" }`, // Text color
        },
        '.MuiInputLabel-root': {
            color: `${isDarkMode ? "white" : "" }`, // Label color in dark mode
            '&.Mui-focused': {
                color: `${isDarkMode ? "white" : "" }`, // Focused outline color
            },
        },
        "& .MuiSelect-icon": {
            color: isDarkMode ? "white" : "", // Arrow color
        },
        
    }
}

export function stringToColor(string: string): string {
    let hash = 0;
    let i: number;
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    let color = '#';
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}