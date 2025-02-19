import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { Input } from "./ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { AuthContext } from '@/context/authContext';
import { useContext } from "react";
import bee from '@/assets/bee.gif';


export default function DataTable({ data, columns, disableSearch = false }) {
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const { auth } = useContext(AuthContext);
    const role = auth.user.user_type;
    const table = useReactTable({
        data,
        columns,
        onPaginationChange: setPagination,
        state: {
            globalFilter,
            sorting,
            pagination,
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="w-full bg-[#0D1E26]/10 border text-gray-100 rounded-lg p-3 shadow-lg overflow-auto mb-6">
            {/* Global Search */}
            {!disableSearch && (
                <div className="mb-4">
                    <Input
                        type="text"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search..."
                        className="p-2 border rounded-md w-full sm:w-1/2 md:w-1/4"
                    />
                </div>
            )}

            {/* Table Wrapper */}
            <div className="hidden md:block relative rounded-md border bg-background/50 border-[#0D1E26]/20 overflow-x-auto">
                <div className="h-[calc(100vh-250px)] rounded-md overflow-auto">
                    <div className="w-full inline-block align-middle max-w-[1440px]">
                        <table className="min-w-full divide-y h-full relative">
                            <thead className="bg-[#0D1E26] sticky top-0 z-10">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            const width = header.column.columnDef.meta?.width || 'auto';
                                            return (
                                                <th
                                                    key={header.id}
                                                    onClick={() =>
                                                        header.column.getCanSort()
                                                            ? header.column.toggleSorting()
                                                            : undefined
                                                    }
                                                    className="px-4 py-3 text-left text-xs font-semibold text-white-200 uppercase tracking-wider cursor-pointer"
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
                                {table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={table.getHeaderGroups()[0].headers.length}
                                            className="px-4 py-4 text-center text-gray-200 font-semibold"
                                        >
                                            <img src={bee} alt="bee" className="mx-auto" />
                                            No data available.
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map((row) => (
                                        <tr key={row.id} className="hover:bg-[#0D1E26]/10">
                                            {row.getVisibleCells().map((cell) => {
                                                const width = cell.column.columnDef.meta?.width || 'auto';
                                                return (
                                                    <td
                                                        key={cell.id}
                                                        className="px-4 py-4 text-gray-200"
                                                        style={{ width }}
                                                    >
                                                        <div className="truncate max-w-[400px]">
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center px-4 py-2">
                        <button
                            onClick={() => table.firstPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="text-white disabled:!text-gray-500 cursor-pointer hover:text-[#0CA5EA] transition-all ease-in-out disabled:cursor-not-allowed"
                        >
                            <ChevronsLeft size={16} />
                        </button>
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="text-white disabled:!text-gray-500 cursor-pointer hover:text-[#0CA5EA] transition-all ease-in-out disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-muted-foreground text-xs" >
                            Page {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()}
                        </span>
                        <button
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="text-white !p-0 disabled:!text-gray-500 cursor-pointer hover:text-[#0CA5EA] transition-all ease-in-out disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={16} />
                        </button>
                        <button
                            onClick={() => table.lastPage()}
                            disabled={!table.getCanNextPage()}
                            className="text-white disabled:!text-gray-500 cursor-pointer hover:text-[#0CA5EA] transition-all ease-in-out disabled:cursor-not-allowed"
                        >
                            <ChevronsRight size={16} />
                        </button>
                        <select
                            className="!text-white bg-[black] text-xs px-2 py-[2px] rounded-md cursor-pointer border"
                            value={table.getState().pagination.pageSize}
                            onChange={(e) =>
                                table.setPageSize(Number(e.target.value))
                            }
                        >
                            {[2, 10, 20, 30, 40, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden overflow-auto">
                <ScrollArea className="h-[540px] w-fit min-w-full">
                    {table.getRowModel().rows.map((row) => (
                        <div
                            key={row.id}
                            className="mb-4 w-full p-4 bg-[#0D1E26]/20 rounded-lg border border-[#0D1E26]"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <div
                                    key={cell.id}
                                    className="flex justify-between text-white-200 mb-2 gap-4"
                                >
                                    <span className="font-semibold truncate max-w-[300px]">
                                        {flexRender(
                                            cell.column.columnDef.header,
                                            cell.getContext()
                                        )}
                                    </span>
                                    <span className="truncate text-right max-w-[360px]">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </ScrollArea>
                <div className="flex justify-between items-center p-4 select-none">
                    <button
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="text-white disabled:!text-gray-500 cursor-pointer hover:text-[#0CA5EA] transition-all ease-in-out disabled:cursor-not-allowed"
                    >
                        <ChevronsLeft size={16} />
                    </button>
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="text-white disabled:!text-gray-500 cursor-pointer hover:text-[#0CA5EA] transition-all ease-in-out"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-muted-foreground text-xs" >
                        Page {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </span>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="text-white disabled:!text-gray-500 cursor-pointer hover:text-[#0CA5EA] transition-all ease-in-out disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={16} />
                    </button>
                    <button
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                        className="text-white disabled:!text-gray-500 cursor-pointer hover:text-[#0CA5EA] transition-all ease-in-out disabled:cursor-not-allowed"
                    >
                        <ChevronsRight size={16} />
                    </button>
                    <Select
                        className="!text-white bg-[#0CA5EA] px-2 py-[2px] rounded-md cursor-pointer border"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) =>
                            table.setPageSize(Number(e.target.value))
                        }
                    >
                        <SelectContent className="max-w-[250px] truncate">
                            {[2, 10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={pageSize}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                </div>
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
                className=" truncate"
                onValueChange={(value) => column.setFilterValue(value)}
                defaultValue={columnFilterValue?.toString() || ""}
            >
                <SelectTrigger className="!h-6 !text-[12px] max-w-[200px] truncate">
                    <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="max-w-[250px] truncate">
                    <SelectItem className="text-xs max-w-[250px] truncate" value={null} key={0}>
                        All
                    </SelectItem>
                    {uniqueValues.map((value, index) => (
                        <SelectItem className="text-xs max-w-[250px] truncate" key={index + 1} value={value}>
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