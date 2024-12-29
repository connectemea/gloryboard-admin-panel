import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { AuthContext } from '@/context/authContext'
import { useContext } from "react";

export default function DataTable({ data, columns }) {
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [sorting, setSorting] = React.useState([]);
    const { auth } = useContext(AuthContext);
    const role = auth.user.user_type;
    // console.log(JSON.stringify(data));
    const table = useReactTable({
        data,
        columns,
        state: {
        globalFilter,
        sorting,
    },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

return (
    <div className="w-full bg-teal-950/10 border text-teal-100 rounded-lg p-3 shadow-lg">
        {/* Global Search */}
        <div className="mb-4">
            <Input
                type="text"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                className="p-2 border rounded-md w-full sm:w-1/2 md:w-1/4"
            />
        </div>

        {/* Table Wrapper */}
        <div className="hidden md:block relative rounded-md border border-teal-800/20">
            <ScrollArea className=" h-[calc(100vh-300px)] rounded-md">
                <div className="min-w-full inline-block align-middle">
                    <table className="min-w-full divide-y">
                        <thead className="bg-teal-950/90 sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        // Get header width from meta if provided
                                        const width = header.column.columnDef.meta?.width || 'auto';
                                        return (
                                            <th
                                                key={header.id}
                                                onClick={() =>
                                                    header.column.getCanSort()
                                                        ? header.column.toggleSorting()
                                                        : undefined
                                                }
                                                className="px-4 py-3 text-left text-xs font-semibold text-teal-200 uppercase tracking-wider cursor-pointer"
                                                style={{ width }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="truncate">
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </div>
                                                    {header.column.getCanSort() && (
                                                        <span className="shrink-0">
                                                            {header.column.getIsSorted() === "asc" ? (
                                                                <ChevronUp size={16} />
                                                            ) : header.column.getIsSorted() === "desc" ? (
                                                                <ChevronDown size={16} />
                                                            ) : (
                                                                <ChevronUp size={16} className="opacity-50" />
                                                            )}
                                                        </span>
                                                    )}
                                                    {header.column.getCanFilter() ? (
                                                        <div className="shrink-0">
                                                            <Filter column={header.column} />
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y bg-black/40">
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-teal-800/10">
                                    {row.getVisibleCells().map((cell) => {
                                        // Get cell width from meta if provided
                                        const width = cell.column.columnDef.meta?.width || 'auto';
                                        return (
                                            <td
                                                key={cell.id}
                                                className="px-4 py-4 text-teal-200"
                                                style={{ width }}
                                            >
                                                <div className="truncate">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ScrollArea>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden">
            <ScrollArea className="h-[500px]">
                {table.getRowModel().rows.map((row) => (
                    <div
                        key={row.id}
                        className="mb-4 p-4 bg-teal-800/20 rounded-lg border border-teal-700"
                    >
                        {row.getVisibleCells().map((cell) => (
                            <div
                                key={cell.id}
                                className="flex justify-between text-teal-200 mb-2 gap-4"
                            >
                                <span className="font-semibold truncate">
                                    {flexRender(cell.column.columnDef.header, cell.getContext())}
                                </span>
                                <span className="truncate text-right">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </ScrollArea>
        </div>
    </div>
);
}

function Filter({ column }) {
    const columnFilterValue = column.getFilterValue();
    const { filterVariant } = column.columnDef.meta || {};

    if (filterVariant === "range") {
        return (
            <div>
                <div className="flex space-x-2">
                    <DebouncedInput
                        type="number"
                        value={columnFilterValue?.[0] ?? ""}
                        onChange={(value) =>
                            column.setFilterValue((old) => [value, old?.[1]])
                        }
                        placeholder="Min"
                        className="!h-6 !text-[12px]"
                    />
                    <DebouncedInput
                        type="number"
                        value={columnFilterValue?.[1] ?? ""}
                        onChange={(value) =>
                            column.setFilterValue((old) => [old?.[0], value])
                        }
                        placeholder="Max"
                        className="!h-6 !text-[12px]"
                    />
                </div>
            </div>
        );
    }

    if (filterVariant === "select") {
        const uniqueValues = Array.from(
            new Set(
                column.getFacetedRowModel().rows.map((row) => row.getValue(column.id))
            )
        );

        return (
            <Select
                onValueChange={(value) => column.setFilterValue(value)}
                defaultValue={columnFilterValue?.toString() || ""}
            >
                <SelectTrigger className="!h-6 !text-[12px]">
                    <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem className="text-xs" value={null}>
                        All
                    </SelectItem>
                    {uniqueValues.map((value) => (
                        <SelectItem className="text-xs" key={value} value={value}>
                            {value}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    if (filterVariant === "search") {
        return (
            <DebouncedInput
                className="!h-6 !text-[12px]"
                onChange={(value) => column.setFilterValue(value)}
                placeholder="Search"
                type="text"
                value={columnFilterValue ?? ""}
            />
        );
    }
}

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}) {
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <Input
            {...props}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}