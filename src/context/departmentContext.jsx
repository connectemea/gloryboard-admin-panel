import { useGetDepartments } from "@/services/queries/departmentQueries";
import React, { createContext, useContext } from "react"; // Import your custom hook for fetching departments
import { AuthContext } from "./authContext";

// Create the context
export const DepartmentOptionsContext = createContext();

// Provider component
export const DepartmentOptionsProvider = ({ children }) => {
    // Fetch the department data using the custom hook
    const { data, isLoading, error } = useGetDepartments();

    // Transform the data into the desired format (only if data is available)
    // const departmentOptions = data
    //     ? Object.values(data)
    //         .flat() // Flatten the nested arrays into a single array
    //         .map((department) => ({
    //             value: department,
    //             label: department,
    //         }))
    //     : [];

    // console.log(auth);

    return (
        <DepartmentOptionsContext.Provider
            value={{ data, isLoading, error }}
        >
            {children}
        </DepartmentOptionsContext.Provider>
    );
};

// Custom hook for consuming the context
export const useDepartmentOptions = () => {
    const context = useContext(DepartmentOptionsContext);
    if (!context) {
        throw new Error(
            "useDepartmentOptions must be used within a DepartmentOptionsProvider"
        );
    }
    return context;
};
