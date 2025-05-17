<script lang="ts" generics="TData">
    import { Accordion } from "bits-ui";
    import type { Column, Table } from "@tanstack/table-core";
    import { Input } from "$lib/components/ui/input";
    import ViewOptions from "$components/table/ViewOptions.svelte";
    import FacetedFilter from "$components/table/FacetedFilter.svelte";
    import { Button } from "$lib/components/ui/button";
    import { FilterIcon, X } from "lucide-svelte";
    import type { Filter } from "$components/table/data";
    import Minus from "lucide-svelte/icons/minus";

    const { table, filters }: { table: Table<TData>, filters: Filter[]} = $props();

    const colsWithFilter = $derived(table.getAllColumns().filter((col: Column<TData>) => col.getIsFiltered()));

    function resetFilters() {
        table.resetColumnFilters();
        table.setGlobalFilter("");
    }

    let filtersVisible = $state();
</script>

<div class="w-full flex items-center justify-between gap-2">
    <Accordion.Root type="single" class="w-full" bind:value={filtersVisible}>
        <Accordion.Item value="filters">
            <div class="flex flex-row justify-between items-center gap-2">
                <Input
                    placeholder="Filter..."
                    oninput={e => table.setGlobalFilter(e.currentTarget.value)}
                    onchange={e => table.setGlobalFilter(e.currentTarget.value)}
                    class="h-8 w-[150px] lg:w-[250px]"
                />

                <div class="flex flex-row items-center gap-2">
                    {#if colsWithFilter.length || table.getState().globalFilter}
                        <Button onclick={resetFilters} variant="outline" size="sm">
                            <X class="size-4" /> Clear Filters
                        </Button>
                    {/if}

                    <Accordion.Trigger>
                        <Button variant="outline" size="sm">
                            {#if filtersVisible}
                                <Minus class="size-4" />
                            {:else}
                                <FilterIcon class="size-4" />
                            {/if}
                            Filters
                        </Button>
                    </Accordion.Trigger>

                    <ViewOptions {table} />
                </div>
            </div>
            <Accordion.Content class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                <div class="flex flex-wrap gap-2 pt-2">
                    {#each filters as filter}
                        <FacetedFilter {filter} {table} />
                    {/each}
                </div>
            </Accordion.Content>
        </Accordion.Item>
    </Accordion.Root>
</div>
