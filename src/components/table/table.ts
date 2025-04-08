import {
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel,
    type ColumnDef,
    type ColumnFiltersState, type GlobalFilterTableState, type PaginationState,
    type RowSelectionState, type SortingState, type VisibilityState
} from "@tanstack/table-core";
import { createSvelteTable, FlexRender } from "$lib/components/ui/data-table";

export function createTable<TData>(data: TData[], columns: ColumnDef<TData>[],) {
    let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
    let sorting = $state<SortingState>([]);
    let columnFilters = $state<ColumnFiltersState>([]);
    let rowSelection = $state<RowSelectionState>({});
    let columnVisibility = $state<VisibilityState>({});
    let globalFilter = $state<GlobalFilterTableState>();

    return createSvelteTable({
        get data() { return data; },
        columns,
        state: {
            get pagination() { return pagination; },
            get sorting() { return sorting; },
            get columnVisibility() { return columnVisibility; },
            get rowSelection() { return rowSelection; },
            get columnFilters() { return columnFilters; },
            get globalFilter() { return globalFilter; }
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: "auto",
        onPaginationChange: fn => pagination = typeof fn === "function" ? fn(pagination) : fn,
        onSortingChange: fn => sorting = typeof fn === "function" ? fn(sorting) : fn,
        onColumnFiltersChange: fn => columnFilters = typeof fn === "function" ? fn(columnFilters) : fn,
        onColumnVisibilityChange: fn => columnVisibility = typeof fn === "function" ? fn(columnVisibility) : fn,
        onRowSelectionChange: fn => rowSelection = typeof fn === "function" ? fn(rowSelection) : fn,
        onGlobalFilterChange: fn => globalFilter = typeof fn === "function" ? fn(globalFilter) : fn
    });
}