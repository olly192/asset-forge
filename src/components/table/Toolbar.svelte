<script lang="ts" generics="TData">
    import type { Column, Table } from "@tanstack/table-core";
    import { Input } from "$lib/components/ui/input";
    import ViewOptions from "$components/table/ViewOptions.svelte";
    import FacetedFilter from "$components/table/FacetedFilter.svelte";
    import { Button } from "$lib/components/ui/button";
    import { X } from "lucide-svelte";
    import type { Filter } from "$components/table/data";

    const { table, filters }: { table: Table<TData>, filters: Filter[]} = $props();

    const colsWithFilter = $derived(table.getAllColumns().filter((col: Column<TData>) => col.getIsFiltered()));

    function resetFilters() {
        table.resetColumnFilters();
        table.setGlobalFilter("");
    }
</script>

<div class="flex items-center justify-between">
    <div class="flex flex-1 items-center space-x-2">
        <Input
            placeholder="Filter..."
            oninput={e => table.setGlobalFilter(e.currentTarget.value)}
            onchange={e => table.setGlobalFilter(e.currentTarget.value)}
            class="h-8 w-[150px] lg:w-[250px]"
        />

        {#each filters as filter}
            <FacetedFilter {filter} {table} />
        {/each}

        {#if colsWithFilter.length || table.getState().globalFilter}
            <Button onclick={resetFilters} variant="outline" size="sm">
                <X class="size-4" /> Clear Filters
            </Button>
        {/if}
    </div>

    <ViewOptions {table} />
</div>
