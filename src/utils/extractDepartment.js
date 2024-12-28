

const getDepartmentListForRep = (data, auth) => {
    // Find the matching department list
    for (const departmentGroup in data) {
        const departmentList = data[departmentGroup];
        if (departmentList.includes(auth.user.department)) {
            // Return the department list in key-value format (value and label)
            return departmentList.map((department) => ({
                value: department,
                label: department,
            }));
        }
    }

    return null; // Return null if no match is found
};

const getDepartmentListAll = (data) => {
    const departmentOptions = data
        ? Object.values(data)
            .flat() // Flatten the nested arrays into a single array
            .map((department) => ({
                value: department,
                label: department,
            }))
        : [];
    
    return departmentOptions

};



export default { getDepartmentListForRep , getDepartmentListAll }
