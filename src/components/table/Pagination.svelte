<script lang="ts" generics="TData">
    import type { Table } from "@tanstack/table-core";
    import { Button } from "$lib/components/ui/button";
    import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-svelte";
    import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";

    const { table }: { table: Table<TData> } = $props();

    const pageSizes = ["10", "20", "30", "40", "50"];
    let pageSize = $state("10");
</script>

<div class="flex items-center justify-end space-x-2 pt-4">
    <div class="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
    <div class="flex flex-row items-center gap-2">
        <div class="flex items-center space-x-2">
            <p class="text-sm font-medium">Rows per page</p>
            <Select type="single" bind:value={pageSize} onValueChange={() => table.setPageSize(Number(pageSize))}>
                <SelectTrigger class="w-[180px]">
                    {pageSize ?? "Select page size"}
                </SelectTrigger>
                <SelectContent>
                    {#each pageSizes as pageSize}
                        <SelectItem value={pageSize} label={pageSize}>{pageSize}</SelectItem>
                    {/each}
                </SelectContent>
            </Select>
        </div>
        <div class="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <Button variant="outline" size="icon" onclick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronsLeft />
        </Button>
        <Button variant="outline" size="icon" onclick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft />
        </Button>
        <Button variant="outline" size="icon" onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight />
        </Button>
        <Button variant="outline" size="icon" onclick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
            <ChevronsRight />
        </Button>
    </div>
</div>
