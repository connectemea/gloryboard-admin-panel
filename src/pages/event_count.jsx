import DataTable from "@/components/DataTable";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useGetEventRegs } from "@/services/queries/eventRegQueries";
import React from "react";

function EventCount() {
    const { data, isLoading, error } = useGetEventRegs();

    if (isLoading) {
        return <TableSkeleton />;
    }

    if (error) {
        return <div className="px-6">Error fetching data</div>;
    }


    const eventRegistrations = data.reduce((acc, item) => {
        const eventName = item.event?.name;
        if (eventName) {
            // Find the event in the accumulator
            let existingEvent = acc.find(event => event.event === eventName);

            if (existingEvent) {
                existingEvent.totalReg += 1; // Increment the totalReg count
            } else {
                acc.push({ event: eventName, totalReg: 1 }); // Add new event
            }
        }
        return acc;
    }, []);



    const totalRegistrations = eventRegistrations?.reduce((total, reg) => total + reg.totalReg, 0);


    const columns = [
        {
            accessorKey: "event",
            header: "Event Name",
            cell: (info) => <strong>{info.getValue()}</strong>,
            enableSorting: false,
        },
        {
            accessorKey: "totalReg",
            header: "Total Registrations",
            enableSorting: true,
        },
    ];

    return (
        <div className="px-4 ">
            <div className="flex justify-between items-center pb-6">
                <h2 className="text-2xl font-bold">Events Registrations Count</h2> <span className='text-xl font-semibold opacity-75'>Total Registrations: {totalRegistrations}</span>
            </div>
            <DataTable data={eventRegistrations} columns={columns} />
        </div>
    );
}

export default EventCount;
