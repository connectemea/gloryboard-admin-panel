import DeleteModal from "@/components/common/DeleteModal";
import DataTable from "@/components/DataTable";
import RepModal from "@/components/modals/repModal";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useDeleteUser } from "@/services/mutation/userMutations";
import { useGetUsers } from "@/services/queries/userQueries";
import React from "react";

function Rep() {
    const { data, isLoading, error } = useGetUsers();
    const { mutate: deleteUser } = useDeleteUser();

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
            accessorKey: "department",
            header: "Department",
            enableSorting: false,
            meta: {
                filterVariant: "select",
            },
        },
        {
            accessorKey: "year_of_study",
            header: "Year",
            enableSorting: false,
            meta: {
                filterVariant: "select",
            },
        },
        { accessorKey: "number", header: "Phone No", enableSorting: false },
        {
            accessorKey: "actions",
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <RepModal editMode={true} initialData={row.original} />
                    <DeleteModal
                        onDelete={() => {
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
                <h2 className="text-2xl font-bold">Rep</h2>
                <RepModal />
            </div>
            <DataTable data={data} columns={columns} />
        </div>
    );
}

export default Rep;
