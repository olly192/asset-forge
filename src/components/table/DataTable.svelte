<script lang="ts" generics="TData">
    import {
        getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel,
        type ColumnDef, type ColumnFiltersState, type GlobalFilterTableState, type PaginationState,
        type RowSelectionState, type SortingState, type VisibilityState
    } from "@tanstack/table-core";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
    import { createSvelteTable, FlexRender } from "$lib/components/ui/data-table";
    import type { Filter } from "$components/table/data";
    import Toolbar from "$components/table/Toolbar.svelte";
    import Pagination from "$components/table/Pagination.svelte";
    import ColumnHeader from "$components/table/ColumnHeader.svelte";

    let { data = $bindable() }: { data: { data: TData[], columns: ColumnDef<TData>[], filters: Filter[] } } = $props();

    let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
    let sorting = $state<SortingState>([]);
    let columnFilters = $state<ColumnFiltersState>([]);
    let rowSelection = $state<RowSelectionState>({});
    let columnVisibility = $state<VisibilityState>({});
    let globalFilter = $state<GlobalFilterTableState>();

    const table = createSvelteTable({
        get data() { return data.data; },
        columns: data.columns,
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
        onPaginationChange: f => pagination = typeof f === "function" ? f(pagination) : f,
        onSortingChange: f => sorting = typeof f === "function" ? f(sorting) : f,
        onColumnFiltersChange: f => columnFilters = typeof f === "function" ? f(columnFilters) : f,
        onColumnVisibilityChange: f => columnVisibility = typeof f === "function" ? f(columnVisibility) : f,
        onRowSelectionChange: f => rowSelection = typeof f === "function" ? f(rowSelection) : f,
        onGlobalFilterChange: f => globalFilter = typeof f === "function" ? f(globalFilter) : f
    });
</script>

<div class="space-y-4">
    <Toolbar {table} filters={data.filters} />
    <div class="rounded-md border">
        <Table>
            <TableHeader>
                {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                    <TableRow>
                        {#each headerGroup.headers as header (header.id)}
                            <TableHead class="[&:has([role=checkbox])]:pl-3">
                                {#if !header.isPlaceholder}
                                    <ColumnHeader {table} {header}>
                                        <FlexRender
                                            content={header.column.columnDef.header} context={header.getContext()}
                                        />
                                    </ColumnHeader>
                                {/if}
                            </TableHead>
                        {/each}
                    </TableRow>
                {/each}
            </TableHeader>
            <TableBody>
                {#each table.getRowModel().rows as row (row.id)}
                    <TableRow data-state={row.getIsSelected() && "selected"}>
                        {#each row.getVisibleCells() as cell (cell.id)}
                            <TableCell class="[&:has([role=checkbox])]:pl-3">
                                <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
                            </TableCell>
                        {/each}
                    </TableRow>
                {:else}
                    <TableRow>
                        <TableCell colspan={data.columns.length} class="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                {/each}
            </TableBody>
        </Table>
    </div>
    <Pagination {table} />
</div>
