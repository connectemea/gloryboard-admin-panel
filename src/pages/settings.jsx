import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useGetResults } from "@/services/queries/resultQueries";
import React from "react";
import { Switch } from "@/components/ui/switch"

function Settings() {
    const { data, isLoading, error } = useGetResults();
    if (isLoading) {
        return <TableSkeleton />;
    }

    if (error) {
        return <div className="px-6">Error fetching data</div>;
    }

    const configs = [
        {
            name: "Ticket Export",
            description: "Export tickets for all participants",
            active: true,
        },
        {
            name: "user Registration",
            description: "Enable user registration",
            active: false,
        }
    ];

    return (
        <div className="px-4 flex flex-col ">
            <div className="flex justify-between pb-6">
                <h2 className="text-2xl font-bold">Settings</h2>
            </div>
            <div className="flex flex-col gap-2 border rounded-md p-6 max-w-[800px] mx-auto w-full">
                {configs.map((config) => (
                    <div className="flex justify-between items-center py-4 border-b">
                        <div>
                            <h3 className="text-lg font-semibold">{config.name}</h3>
                            <p className="text-sm text-gray-500">{config.description}</p>
                        </div>
                        <Switch checked={config.active}
                            onChange={() => console.log("Switched")}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Settings;
