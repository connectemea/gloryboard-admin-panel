import DataTable from "@/components/DataTable";
import DeleteModal from "@/components/common/DeleteModal";
import EventRegModal from "@/components/modals/eventRegModal";
import EventRegViewModal from "@/components/modals/view/eventRegViewModal";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Button } from "@/components/ui/button";
import { useDeleteEventReg } from "@/services/mutation/eventRegMutations";
import { useGetConfig } from "@/services/queries/configQueries";
import { getConfigValue } from "@/utils/configUtils";
import { useGetEventRegs } from "@/services/queries/eventRegQueries";
import { Users2 } from "lucide-react";
import React, { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import DownloadTickets from "@/components/tickets/DownloadAllTickets";
import DownloadAllTickets from "@/components/tickets/DownloadAllTickets";

function EventRegistration() {
    const { data, isLoading, error } = useGetEventRegs();
    const { mutate: deleteEventReg } = useDeleteEventReg();

    const { auth } = useContext(AuthContext);
    const { data: configs } = useGetConfig();

    if (isLoading) {
        return <TableSkeleton />;
    }

    if (error) {
        return <div className="px-6">Error fetching data</div>;
    }

    // console.log(data)

    const columns = [
        {
            accessorKey: "group_name",
            header: "Registred By",
            cell: ({ row }) => (
                <strong>
                    {/* {console.log(row.original.participants[0])} */}
                    {!row.original.event?.event_type.is_group == true ? (
                        row.original.participants[0]?.name
                    ) : (
                        <div className="flex items-center gap-2">
                            {row.original.participants[0].name} & team
                        </div>
                    )}
                </strong>
            ),
            enableSorting: false,
        },
        {
            accessorKey: "department", header: "Department",
            cell: ({ row }) => (
                <strong>
                    {!row.original.event?.event_type.is_group == true ? (row.original.participants[0]?.department
                    ) : (
                        <div className="flex items-center gap-2">
                            {row.original.group_name} <Users2 size={16} className="" />
                        </div>
                    )}
                </strong>
            ), enableSorting: false,
        },
        {
            accessorKey: "event.name", header: "Event", enableSorting: false, meta: {
                filterVariant: "select",
            },
        },
        {
            accessorKey: "actions",
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <EventRegViewModal data={row.original} />
                    {/* <EventRegModal editMode={true} initialData={row.original} /> */}
                    {auth?.user.user_type !== 'admin' && (
                        <DeleteModal
                            onDelete={() => {
                                console.log(row.original._id);
                                deleteEventReg(row.original._id);
                            }}
                        />
                    )}
                </div>
            ),
        },
    ];



    return (
        <div className="px-4 flex flex-col ">
            <div className="flex justify-between pb-6">
                <h2 className="text-2xl font-bold">Event Registration</h2>
                <div className="flex gap-2">
                    {(configs && getConfigValue(configs, 'hall_ticket_export')) ? (
                        <DownloadAllTickets />
                    ) : null}
                    {auth?.user.user_type !== 'admin' && (
                        <EventRegModal />
                    )}
                </div>
            </div>
            <DataTable data={data} columns={columns} />
        </div>
    );
}

export default EventRegistration;
