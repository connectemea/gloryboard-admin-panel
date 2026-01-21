import React, { useCallback, useContext, useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import DataTableNoPage from "@/components/DataTableNoPage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";

function Participants() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedGender, setSelectedGender] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useGetParticipants(
    page,
    limit,
    selectedGender,
    search
  );
  const { mutate: deleteUser } = useDeleteUser();

  const { auth } = useContext(AuthContext);
  const { data: configs } = useGetConfig();

  const debouncedSearch = useCallback(
    debounce((value) => {
      setPage(1);
      setSearch(value);
    }, 1000), // Adjust the debounce delay as needed
    []
  );

  useEffect(() => {
    debouncedSearch(inputValue);
  }, [inputValue, debouncedSearch]);

  if (error) {
    return <div className="px-6">Error fetching data</div>;
  }

  if (isLoading) {
    return <TableSkeleton />;
  }

  const columns = [
    {
      accessorKey: "image",
      header: "Picture",
      cell: (info) => (
        <img
          src={info.getValue()}
          width={50}
          height={50}
          className="w-10 h-10 object-cover rounded-sm"
          alt=""
        />
      ),
      enableSorting: false
    },
    { accessorKey: "userId", header: "User ID", enableSorting: false },
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => <strong>{info.getValue()}</strong>
    },
    {
      accessorKey: "gender",
      header: "Gender",
      enableSorting: false
    },
    {
      accessorKey: auth.user.user_type === "admin" ? "college" : "course",
      header: auth.user.user_type === "admin" ? "College" : "course",
      enableSorting: false
    },
    { accessorKey: "year_of_study", header: "Year", enableSorting: false },
    // { accessorKey: "semster", header: "Year of Study", enableSorting: false },
    { accessorKey: "phoneNumber", header: "Phone", enableSorting: false }
    // { accessorKey: "total_score", header: "Total Score" },
  ];
  if (auth?.user.user_type === "admin") {
    columns.push({
      accessorKey: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <DownloadTicket
            id={row.original._id}
            name={row.original.name}
            type={"participant"}
          />
        </div>
      )
    });
  } else if (
    getConfigValue(configs, "participant ticket export") ||
    getConfigValue(configs, "user registration")
  ) {
    columns.push({
      accessorKey: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {getConfigValue(configs, "participant ticket export") && (
            <DownloadTicket
              id={row.original._id}
              name={row.original.name}
              type={"participant"}
            />
          )}
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
      )
    });
  }

  return (
    <div className="px-4 flex flex-col ">
      <div className="flex justify-between pb-6">
        <h2 className="text-2xl font-bold ">Participants</h2>
        <div className="flex gap-2">
          <Input
            type="text"
            className="w-48"
            placeholder="Search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <SelectInput
            options={[
              { value: null, label: "All" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" }
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

      <DataTableNoPage data={data.users} columns={columns} />
      <div className="flex justify-end items-center gap-2">
        <span className="text-sm text-gray-400">
          Page {page} of {data.totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page === 1}
          size="icon"
          varient="ghost"
          onClick={() => setPage(page - 1)}
        >
          {" "}
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          disabled={page === data.totalPages}
          size="icon"
          onClick={() => setPage(page + 1)}
        >
          <ChevronRight />
        </Button>
        <div>
          <SelectInput
            options={[
              { value: 5, label: "5" },
              { value: 10, label: "10" },
              { value: 20, label: "20" },
              { value: 50, label: "50" }
            ]}
            value={limit}
            onChange={(e) => {
              setLimit(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Participants;
