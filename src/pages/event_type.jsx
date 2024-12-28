import DataTable from "@/components/DataTable";
import DeleteModal from "@/components/common/DeleteModal";
import EventTypeModal from "@/components/modals/eventTypeModal";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useDeleteEventType } from "@/services/mutation/eventTypeMutations";
import { useGetEventTypes } from "@/services/queries/eventTypeQueries";
import { Check, CheckCircle } from "lucide-react";
import React from "react";

function EventType() {

    const { data, isLoading, error } = useGetEventTypes();
    const { mutate: deleteEventType } = useDeleteEventType();

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
            cell: (info) => <strong>{info.getValue()}</strong>,
            enableSorting: false,
        },
        {
            accessorKey: "is_group",
            header: "Group Item",
            enableSorting: false,
            cell: ({ row }) =>
                row.original.is_group ? <CheckCircle size={16} /> : null,
        },
        {
            accessorKey: "is_onstage",
            header: "On Stage",
            enableSorting: false,
            cell: ({ row }) =>
                row.original.is_onstage ? <CheckCircle size={16} /> : null,
        },
        { accessorKey: "participant_count", header: "Participants Count" },
        { accessorKey: "helper_count", header: "Helpers Count" },
        {
            accessorKey: "scores",
            header: "scores",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <span className="bg-yellow-600 p-1 rounded-full w-7 h-7 flex justify-center items-center text-white/70 ">
                        {row.original.scores.first}
                    </span>
                    <span className="bg-gray-400 p-1  rounded-full w-7 h-7 flex justify-center items-center text-white/70">
                        {row.original.scores.second}
                    </span>
                    <span className="bg-amber-800 p-1  rounded-full w-7 h-7 flex justify-center items-center text-white/70">
                        {row.original.scores.third}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "actions",
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <EventTypeModal editMode={true} initialData={row.original} />
                    <DeleteModal
                        onDelete={() => {
                            console.log(row.original._id);
                            deleteEventType(row.original._id);
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="px-4 flex flex-col ">
            <div className="flex justify-between pb-6">
                <h2 className="text-2xl font-bold">Event Type</h2>
                <EventTypeModal />
            </div>
            <DataTable data={data} columns={columns} />
        </div>
    );
}

export default EventType;
