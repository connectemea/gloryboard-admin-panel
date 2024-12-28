import React from "react";
import { Skeleton } from "../ui/skeleton";

function TableSkeleton() {
    return (
        <div className="px-6">
            <Skeleton className="w-[160px] h-[30px] rounded-md" />
            <Skeleton className="w-full h-[300px] rounded-md mt-2 p-3" />
        </div>
    );
}

export default TableSkeleton;
