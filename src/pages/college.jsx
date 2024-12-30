import DeleteModal from "@/components/common/DeleteModal";
import DataTable from "@/components/DataTable";
import CollegeModal from "@/components/modals/collegeModal";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useDeleteCollege  } from '@/services/mutation/collegeMutations'
import { useGetUsers } from "@/services/queries/userQueries";
import React from "react";

function College() {
    const { data, isLoading, error } = useGetUsers();
    const { mutate: deleteUser } = useDeleteCollege();

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
        { accessorKey: "phoneNumber", header: "Phone No", enableSorting: false },
        { accessorKey: "email", header: "Email" , enableSorting: false},
        {
            accessorKey: "actions",
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <CollegeModal editMode={true} initialData={row.original} />
                    <DeleteModal
                        onDelete={() => {
                            console.log(row.original._id);
                            deleteUser(row.original._id);
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="px-4 flex flex-col ">
            <div className="flex justify-between pb-6">
                <h2 className="text-2xl font-bold">College</h2>
                <CollegeModal />
            </div>
            <DataTable data={data} columns={columns} />
        </div>
    );
}

export default College;
