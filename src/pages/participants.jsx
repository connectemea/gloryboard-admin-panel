import React, { useContext } from "react";
import DataTable from "@/components/DataTable";
import ParticipantModal from "@/components/modals/participantModal";
import { useGetParticipants } from "@/services/queries/participantQueries";
import DeleteModal from "@/components/common/DeleteModal";
import { useDeleteUser } from "@/services/mutation/userMutations";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { getConfigValue } from "@/utils/configUtils";
import { Avatar } from "@/components/ui/avatar";
import { useGetConfig } from "@/services/queries/configQueries";
import { AuthContext } from "@/context/authContext";
import DownloadTicket from "@/components/tickets/DownloadTicket";

function Participants() {

  const { data, isLoading, error } = useGetParticipants();
  const { mutate: deleteUser } = useDeleteUser();


  const { auth } = useContext(AuthContext);
  const { data: configs } = useGetConfig();


  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <div className="px-6">Error fetching data</div>;
  }


  const columns = [
    {
      accessorKey: "image",
      header: "Picture",
      cell: (info) => <img src={info.getValue()} className="w-10 h-10 object-cover rounded-sm" alt="" />,
      enableSorting: false,
    },
    { accessorKey: "userId", header: "User ID", enableSorting: false },
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => <strong>{info.getValue()}</strong>,
    },
    { accessorKey: "college", header: "College", enableSorting: false },
    { accessorKey: "year_of_study", header: "Year", enableSorting: false, },
    // { accessorKey: "semster", header: "Year of Study", enableSorting: false },
    { accessorKey: "phoneNumber", header: "Phone", enableSorting: false, },
    // { accessorKey: "total_score", header: "Total Score" },
    {
      accessorKey: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex space-x-2">

          <DownloadTicket id={row.original._id} name={row.original.name} />

          <ParticipantModal editMode={true} initialData={row.original} />
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
        <h2 className="text-2xl font-bold">Participants</h2>
        {auth?.user.user_type === 'admin' || (configs && getConfigValue(configs, 'user_registration')) ? (
    <ParticipantModal />
) : null}

      </div>
      <DataTable data={data} columns={columns} />
    </div>
  );
}

export default Participants;
