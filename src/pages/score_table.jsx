import DataTable from "@/components/DataTable";
import LeaderBoard from "@/components/LeaderBoard";
import CollegeResultViewModal from "@/components/modals/view/CollegeResultViewModal";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
// import { DepartmentOptionsContext } from "@/context/departmentContext";
import { useGetResults } from "@/services/queries/resultQueries";
import { useResultByGroup } from "@/services/queries/scoreboardQueries";
import { useContext } from "react";
import { toast } from "sonner";

function ScoreTable() {

    // const { data: departmentOptions } = useContext(DepartmentOptionsContext);
    // const { data, isLoading, error } = useGetResults();

    const { data, isLoading, error } = useResultByGroup();

    // console.log(data)



    if (isLoading) {
        return <TableSkeleton />;
    }

    if (error) {
        return <div className="px-6">Error fetching data</div>;
    }




    // function getTeamName(courseName) {
    //     // Iterate through each team in the data object
    //     // for (const team in departmentOptions) {
    //     //     // Check if the courseName exists in the team's list of courses
    //     //     if (departmentOptions[team].includes(courseName)) {
    //     //         return team; // Return the team name if found
    //     //     }
    //     // }
    //     return "Team not found"; // Return this if the courseName is not found
    // }

    // const TableData = data?.map((item) => {
    //     // Start with the event name
    //     const row = { event_name: item.event.name };
    
    //     // Iterate through `winningRegistrations` to add team points dynamically
    //     item.winningRegistrations?.forEach((reg) => {
    //         const teamName = getTeamName(reg.eventRegistration.participants[0].user.department);
    
    //         // Add score if the teamName already exists, otherwise initialize it
    //         row[teamName] = (row[teamName] || 0) + (reg.eventRegistration.score || 0);
    //     });
    
    //     return row;
    // });



    const total = (data) => {
        const total = data?.reduce((acc, item) => acc + item.score, 0);
        return total
    }



    const columns = [
        {
            accessorKey: "college",
            header: "College Name",
            cell: ({ row }) => (<strong>{row.original?.college}</strong>),
            enableSorting: false,
        },
        {
            accessorKey: "result",
            header: "results",
            enableSorting: false,
            cell: ({ row }) => (<div><CollegeResultViewModal data={row.original}  /></div>),
        },
        {
            accessorKey: "total_score",
            header: "Total Score",
            enableSorting: false,
            cell: ({ row }) => (total(row.original?.events)||0),
        }
    ];

    return (
        <div>
            {/* <LeaderBoard data={TableData} /> */}
            <DataTable data={data} columns={columns} />
        </div>
    )
}

export default ScoreTable;