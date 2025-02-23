import DataTable from '@/components/DataTable'
import EventModal from '@/components/modals/eventModal';
import DeleteModal from "@/components/common/DeleteModal";
import React from 'react'
import { useGetEvents } from '@/services/queries/eventsQueries';
import TableSkeleton from '@/components/skeleton/TableSkeleton';
import { useDeleteEvent } from '@/services/mutation/eventMutations';
import DownloadTicket from "@/components/tickets/DownloadTicket";
import EventViewModal from '@/components/modals/view/eventViewModal';
function Events() {

    const { data, isLoading, error } = useGetEvents();
    const { mutate: deleteEvent } = useDeleteEvent();



    if (isLoading) {
        return <TableSkeleton />;
    }

    if (error) {
        return <div className="px-6">Error fetching data</div>;
    }


    const columns = [
        { accessorKey: 'name', header: 'Name', cell: info => <strong>{info.getValue()}</strong>, enableSorting: false },
        {
            accessorKey: 'event_type.name', header: 'Type', enableSorting: false, meta: {
                filterVariant: "select",
            }
        },
        {
            accessorKey: 'event_category', header: 'Category', enableSorting: false, meta: {
                filterVariant: "select",
            }
        },
        {
            accessorKey: 'result_category', header: 'Result Category', enableSorting: false, meta: {
                filterVariant: "select",
            }
        },
        { accessorKey: 'min_participants', header: 'Min', enableSorting: false },
        { accessorKey: 'max_participants', header: 'Max', enableSorting: false },
        {
            accessorKey: "actions",
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <EventViewModal data={row.original} />
                    <DownloadTicket id={row.original._id} name={row.original.name} type={'event'}/>
                    <EventModal editMode={true} initialData={row.original} />
                    <DeleteModal
                        onDelete={() => {
                            deleteEvent(row.original._id);
                        }}
                    />
                </div>
            ),
        },

    ];

    return (
        <div className="px-4 flex flex-col ">
            <div className="flex justify-between pb-6">
                <h2 className="text-2xl font-bold">Events</h2>
                <EventModal />
            </div>
            <DataTable data={data} columns={columns} />
        </div>
    )
}

export default Events