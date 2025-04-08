<script lang="ts" generics="TData">
    import type { Table } from "@tanstack/table-core";
    import {
        DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator,
        DropdownMenuTrigger
    } from "$lib/components/ui/dropdown-menu";
    import { SlidersVertical } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";

    const { table }: { table: Table<TData> } = $props();
</script>

<DropdownMenu>
    <DropdownMenuTrigger>
        <Button variant="outline" size="sm" class="ml-auto hidden h-8 lg:flex">
            <SlidersVertical class="size-4" /> Columns
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {#each table.getAllColumns().filter((col) => col.getCanHide()) as column}
            <DropdownMenuCheckboxItem
                checked={column.getIsVisible()} onclick={() => column.toggleVisibility()} class="capitalize"
            >
                {column.id}
            </DropdownMenuCheckboxItem>
        {/each}
    </DropdownMenuContent>
</DropdownMenu>