<script lang="ts" generics="TData">
    import type { Column, Row, Table } from "@tanstack/table-core";
    import { Button } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import { Badge } from "$lib/components/ui/badge";
    import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover";
    import Check from "lucide-svelte/icons/check";
    import {
        Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator
    } from "$lib/components/ui/command";
    import { cn } from "$lib/utils";
    import type { Filter } from "$components/table/data";
    import { PlusCircle, Circle } from "lucide-svelte";

    const { filter, table }: { filter: Filter, table: Table<TData> } = $props();
    const { options } = filter;

    const column: Column<TData> | undefined = table.getColumn(filter.id);
    if (!column) throw new Error(`Column with id "${filter.id}" not found.`);

    let filters: string[] = $derived(column.getFilterValue() as string[] ?? []);

    function handleSelect(currentValue: string) {
        if (!column) return;
        if (filters.includes(currentValue)) {
            column.setFilterValue(filters.filter((v) => v !== currentValue));
        } else {
            column.setFilterValue([...filters, currentValue]);
        }
    }

    // TODO: fix filter counts showing 0 when filter is applied
    const filteredData = $derived(table.getFilteredRowModel().rows);
    const counts = $derived(filteredData.reduce<{ [index: string]: number }>(
        (acc, row: Row<TData>) => {
            const value: string | undefined = row.getValue(filter.id);
            if (!value) return acc;
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {}
    ));
</script>

<Popover>
    <PopoverTrigger>
        <Button variant="outline" size="sm" class="h-8 border-dashed">
            <PlusCircle class="mr-2 h-4 w-4" />
            <span class="text-sm">{filter.label}</span>

            {#if filters.length > 0}
                <Separator orientation="vertical" class="mx-2 h-4" />
                <Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
                    {filters.length}
                </Badge>
                <div class="hidden space-x-1 lg:flex">
                    {#if filters.length > 2}
                        <Badge variant="secondary" class="rounded-sm px-1 font-normal">
                            {filters.length} Selected
                        </Badge>
                    {:else}
                        {#each filters as option}
                            <Badge variant="secondary" class="rounded-sm px-1 font-normal">
                                {$options.filter(o => o.value === option)[0].label}
                            </Badge>
                        {/each}
                    {/if}
                </div>
            {/if}
        </Button>
    </PopoverTrigger>
    <PopoverContent class="w-64 p-0" align="start" side="bottom">
        <Command>
            <CommandInput placeholder={filter.label} />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {#each $options as option}
                        {@const Icon = option.icon}
                        <CommandItem value={option.value} onSelect={() => handleSelect(option.value)}>
                            <div class={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                                filters.includes(option.value) ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground [&_svg]:invisible"
                            )}>
                                <Check class="size-4" />
                            </div>
                            {#if option.icon}
                                <Icon class="stroke-{option.color || 'neutral'}-500 mr-2 h-4 w-4" />
                            {:else}
                                <Circle class="fill-{option.color || 'neutral'}-500 stroke-{option.color || 'neutral'}-700 size-4" />
                            {/if}
                            <span>{option.label}</span>
                            <span class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                                {counts[option.value] ?? 0}
                            </span>
                        </CommandItem>
                    {/each}
                </CommandGroup>
                {#if filters.length > 0}
                    <CommandSeparator />
                    <CommandItem class="justify-center text-center" onSelect={() => column.setFilterValue([])}>
                        Clear filters
                    </CommandItem>
                {/if}
            </CommandList>
        </Command>
    </PopoverContent>
</Popover>