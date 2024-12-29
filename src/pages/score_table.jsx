import DataTable from "@/components/DataTable";
import LeaderBoard from "@/components/LeaderBoard";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
// import { DepartmentOptionsContext } from "@/context/departmentContext";
import { useGetResults } from "@/services/queries/resultQueries";
import { useContext } from "react";

function ScoreTable() {

    // const { data: departmentOptions } = useContext(DepartmentOptionsContext);
    const { data, isLoading, error } = useGetResults();

    if (isLoading) {
        return <TableSkeleton />;
    }

    if (error) {
        return <div className="px-6">Error fetching data</div>;
    }




    function getTeamName(courseName) {
        // Iterate through each team in the data object
        // for (const team in departmentOptions) {
        //     // Check if the courseName exists in the team's list of courses
        //     if (departmentOptions[team].includes(courseName)) {
        //         return team; // Return the team name if found
        //     }
        // }
        return "Team not found"; // Return this if the courseName is not found
    }

    const TableData = data?.map((item) => {
        // Start with the event name
        const row = { event_name: item.event.name };
    
        // Iterate through `winningRegistrations` to add team points dynamically
        item.winningRegistrations?.forEach((reg) => {
            const teamName = getTeamName(reg.eventRegistration.participants[0].user.department);
    
            // Add score if the teamName already exists, otherwise initialize it
            row[teamName] = (row[teamName] || 0) + (reg.eventRegistration.score || 0);
        });
    
        return row;
    });

    console.log(data)

    console.log(TableData)


    const columns = [
        {
            accessorKey: "event",
            header: "Event Name",
            cell: ({ row }) => (<strong>{row.original.event_name}</strong>),
            enableSorting: false,
        },
        ...["Science", "arts", "Commerce", "BVoc"].map((team) => ({
            accessorKey: team,
            header: team.charAt(0).toUpperCase() + team.slice(1), // Capitalize team names
            cell: ({ row }) => <strong>{row.original[team] || 0}</strong>,
            enableSorting: false, // Default to 0 if no points
        })),
    ];

    return (
        <div>
            <LeaderBoard data={TableData} />
            <DataTable data={TableData} columns={columns} />
        </div>
    )
}

export default ScoreTable;