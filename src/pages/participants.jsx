import React, { useContext, useState } from "react";
import DataTable from "@/components/DataTable";
import ParticipantModal from "@/components/modals/participantModal";
import { useGetParticipants } from "@/services/queries/participantQueries";
import DeleteModal from "@/components/common/DeleteModal";
import { useDeleteUser } from "@/services/mutation/userMutations";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { getConfigValue } from "@/utils/configUtils";
import { useGetConfig } from "@/services/queries/configQueries";
import { AuthContext } from "@/context/authContext";
import DownloadTicket from "@/components/tickets/DownloadTicket";
import SelectInput from "@/components/common/SelectInput";

function Participants() {
  const { data, isLoading, error } = useGetParticipants();
  const { mutate: deleteUser } = useDeleteUser();
  const [selectedGender, setSelectedGender] = useState("all");

  const { auth } = useContext(AuthContext);
  const { data: configs } = useGetConfig();

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <div className="px-6">Error fetching data</div>;
  }

  const filteredData = selectedGender === "all"
    ? data
    : data.filter(participant => participant.gender.toLowerCase() === selectedGender);

  const columns = [
    {
      accessorKey: "image",
      header: "Picture",
      cell: (info) => (
        <img
          src={info.getValue()}
          className="w-10 h-10 object-cover rounded-sm"
          alt=""
        />
      ),
      enableSorting: false,
    },
    { accessorKey: "userId", header: "User ID", enableSorting: false },
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => <strong>{info.getValue()}</strong>,
    },
    {
      accessorKey: "gender",
      header: "Gender",
      enableSorting: false,
    },
    {
      accessorKey: auth.user.user_type === "admin" ? "college" : "course",
      header: auth.user.user_type === "admin" ? "College" : "course",
      enableSorting: false,
      meta: {
        filterVariant: "select",
      },
    },
    { accessorKey: "year_of_study", header: "Year", enableSorting: false },
    // { accessorKey: "semster", header: "Year of Study", enableSorting: false },
    { accessorKey: "phoneNumber", header: "Phone", enableSorting: false },
    // { accessorKey: "total_score", header: "Total Score" },
  ];
  if (auth?.user.user_type === "admin") {
    columns.push({
      accessorKey: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <DownloadTicket id={row.original._id} name={row.original.name} />
        </div>
      ),
    });
  } else if (getConfigValue(configs, "participant ticket export") || getConfigValue(configs, "user registration")) {
    columns.push({
      accessorKey: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <DownloadTicket id={row.original._id} name={row.original.name} />
          {auth?.user.user_type !== "admin" &&
            getConfigValue(configs, "user registration") && (
              <>
                <ParticipantModal editMode={true} initialData={row.original} />
                <DeleteModal
                  onDelete={() => {
                    deleteUser(row.original._id);
                  }}
                />
              </>
            )}
        </div>
      ),
    },);
  }

  return (
    <div className="px-4 flex flex-col ">
      <div className="flex justify-between pb-6">
        <h2 className="text-2xl font-bold ">Participants</h2>
        <div className="flex gap-2">
          <SelectInput
            options={[
              { value: "all", label: "All" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
          />
          {auth?.user.user_type !== "admin" &&
            configs &&
            getConfigValue(configs, "user registration") ? (
            <ParticipantModal />

          ) : null}
        </div>
      </div>
      <DataTable data={filteredData} columns={columns} />
    </div>
  );
}

export default Participants;
