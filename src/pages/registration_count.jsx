import DataTable from '@/components/DataTable';
import TableSkeleton from '@/components/skeleton/TableSkeleton';
import { useGetEventRegs } from '@/services/queries/eventRegQueries';
import React from 'react'

function RegistrationCount() {

    const { data, isLoading, error } = useGetEventRegs();

    if (isLoading) {
        return <TableSkeleton />;
    }

    if (error) {
        return <div className="px-6">Error fetching data</div>;
    }

    const totalRegistrations = data?.length;

    const collegeRegistrations = data?.reduce((acc, reg) => {
        const college = reg?.college;
        const existingCollege = acc.find(item => item.college === college);
        if (existingCollege) {
            existingCollege.totalReg += 1;
        } else {
            acc.push({ college, totalReg: 1 });
        }
        return acc;
    }, []);
    
    
    const columns = [
        {
            accessorKey: "college",
            header: "College Name",
            cell: (info) => (<strong>{info.getValue()}</strong>),
            enableSorting: false,
        },
        {
            accessorKey: "totalReg",
            header: "Total Registrations",
            enableSorting: true,
        },
    ]

    return (
        <div className='px-4 ' >
            <h2 className="text-2xl font-bold pb-6">Registration Count</h2>
            <DataTable data={collegeRegistrations} columns={columns} />
            <div className='mt-4 flex justify-end px-4'>
                <span className='text-xl font-semibold opacity-75'>Total Registrations: {totalRegistrations}</span>
            </div>
        </div>
    )
}

export default RegistrationCount