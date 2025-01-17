import DataTable from "@/components/DataTable";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useGetResults } from "@/services/queries/resultQueries";
import React, { useState, useEffect, useRef } from "react";
import DeleteModal from "@/components/common/DeleteModal";
import ResultModal from "@/components/modals/resultModal";
import { useDeleteResult } from "@/services/mutation/resultMutations ";
import ResultViewModal from "@/components/modals/view/resultViewModal";
import ResultAdd from "@/components/modals/resultAdd";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import autoAnimate from '@formkit/auto-animate'

function Results() {
    const [view, setView] = useState(true);
    const parent = useRef(null)

    useEffect(() => {
        parent.current && autoAnimate(parent.current)
    }, [parent])

    const { data, isLoading, error } = useGetResults();
    const { mutate: deleteResult } = useDeleteResult();
    if (isLoading) {
        return <TableSkeleton />;
    }

    if (error) {
        return <div className="px-6">Error fetching data</div>;
    }


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
                            deleteResult(row.original._id);
                        }}
                    />
                </div>
            ),
        },
    ];

    const handleViewChange = () => {
        setView(!view);
    }

    return (
        <div className="px-4 flex flex-col " ref={parent}>
            <div className="flex justify-between pb-6" ref={parent}>
                <h2 className="text-2xl font-bold">Results</h2>
                {/* <ResultModal eventsData={data} /> */}
                <Button onClick={handleViewChange} ref={parent} >
                    {view ? (
                        <>
                            <Plus className="mr-1" />  Result
                        </>
                    ) : (
                        <>
                            <Eye className="mr-1" />  Results
                        </>
                    )}
                </Button>

            </div>
            <div ref={parent}>
                {view ? (
                    <DataTable data={data} columns={columns} />
                ) : (
                    <ResultAdd eventsData={data} />
                )}
            </div>
        </div >
    );
}

export default Results;
