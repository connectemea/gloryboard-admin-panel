import { useGetConfig } from "@/services/queries/configQueries";
import { useUpdateConfig } from "@/services/mutation/configMutations";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import React from "react";
import { Switch } from "@/components/ui/switch";

function Settings() {
    const { data, isLoading, error } = useGetConfig();
    const { mutate: updateConfig } = useUpdateConfig();

    if (isLoading) {
        return <TableSkeleton />;
    }

    if (error) {
        return <div className="px-6">Error fetching data</div>;
    }

    return (
        <div className="px-4 flex flex-col ">
            <div className="flex justify-between pb-6">
                <h2 className="text-2xl font-bold">Settings</h2>
            </div>
            <div className="flex flex-col gap-2 border rounded-md p-6 max-w-[800px] mx-auto w-full">
                {data.map((config) => (
                    <div key={config._id} className="flex justify-between items-center py-4 border-b">
                        <div>
                            <h3 className="text-lg font-semibold">{config.key}</h3>
                        </div>
                        <Switch
                            checked={config.value}
                            onCheckedChange={() => updateConfig({ _id: config._id, value: !config.value })}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Settings;
