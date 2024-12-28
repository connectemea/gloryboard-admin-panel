import DataTable from "@/components/DataTable";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useGetResults } from "@/services/queries/resultQueries";
import React from "react";
import DeleteModal from "@/components/common/DeleteModal";
import ResultModal from "@/components/modals/resultModal";
import { useDeleteResult } from "@/services/mutation/resultMutations ";
import ResultViewModal from "@/components/modals/view/resultViewModal";

function Results() {
    const { data, isLoading, error } = useGetResults();
    const { mutate: deleteResult } = useDeleteResult();
    if (isLoading) {
        return <TableSkeleton />;
    }

    if (error) {
        return <div className="px-6">Error fetching data</div>;
    }

    // console.log(data)
   

    const columns = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (<strong>{row.original.event?.name}</strong>),
            enableSorting: false,
        },
        {
            accessorKey: "actions",
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <ResultViewModal data={row.original} />
                    <ResultModal editMode={true} initialData={row.original} />
                    <DeleteModal
                        onDelete={() => {
                            console.log(row.original._id);
                            deleteResult(row.original._id);
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="px-4 flex flex-col ">
            <div className="flex justify-between pb-6">
                <h2 className="text-2xl font-bold">Results</h2>
                <ResultModal eventsData={data} />
            </div>
            <DataTable data={data} columns={columns} />
        </div>
    );
}

export default Results;
