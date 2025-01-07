import DataTable from "@/components/DataTable";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useGetEventRegs } from "@/services/queries/eventRegQueries";
import React from "react";

function RegistrationCount() {
    const { data, isLoading, error } = useGetEventRegs();

    if (isLoading) {
        return <TableSkeleton />;
    }

    if (error) {
        return <div className="px-6">Error fetching data</div>;
    }


    const globalParticipantsSet = new Set();

    const collegeRegistrations = data.reduce((acc, reg) => {
        const college = reg.college;

        // Find the existing college in the accumulator
        let existingCollege = acc.find((item) => item.college === college);

        if (!existingCollege) {
            // If not found, create a new entry
            existingCollege = { college, totalReg: 0 };
            acc.push(existingCollege);
        }

        // Iterate through participants and count only those not in the global set
        reg.participants.forEach((participant) => {
            if (!globalParticipantsSet.has(participant._id)) {
                globalParticipantsSet.add(participant._id); // Mark participant as counted globally
                existingCollege.totalReg += 1; // Increment the count for the college
            }
        });

        return acc;
    }, []);


    const totalRegistrations = collegeRegistrations.reduce((total, reg) => total + reg.totalReg, 0);

    const columns = [
        {
            accessorKey: "college",
            header: "College Name",
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
            <h2 className="text-2xl font-bold pb-6">Registration Count</h2>
            <DataTable data={collegeRegistrations} columns={columns} />
            <div className='mt-4 flex justify-end px-4'>
                <span className='text-xl font-semibold opacity-75'>Total Registrations: {totalRegistrations}</span>
            </div>
        </div>
    );
}

export default RegistrationCount;
