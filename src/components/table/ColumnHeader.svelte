<script lang="ts" generics="TData">
    import type { Snippet } from "svelte";
    import type { Header, Table } from "@tanstack/table-core";
    import { Button } from "$lib/components/ui/button";
    import {
        DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
    } from "$lib/components/ui/dropdown-menu";
    import { ArrowDown, ArrowUp, EyeOff } from "lucide-svelte";
    import ArrowUpDown from "lucide-svelte/icons/arrow-up-down";
    import X from "lucide-svelte/icons/x";

    const { table, header, children }: {
        table: Table<TData>, header: Header<TData, any>, children: Snippet
    } = $props();

    const column = $derived(table.getColumn(header.id))
</script>

{#if column && column.getCanSort()}
    <div class="flex items-center">
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ghost" class="data-[state=open]:bg-accent -ml-3 h-8" size="sm">
                    {@render children()}
                    {#if column.getIsSorted() === "desc"}
                        <ArrowDown class="h-4 w-4" />
                    {:else if column.getIsSorted() === "asc"}
                        <ArrowUp class="h-4 w-4" />
                    {:else}
                        <ArrowUpDown class="h-4 w-4" />
                    {/if}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem onclick={() => column.toggleSorting(false)}>
                    <ArrowUp class="text-muted-foreground/70" />
                    Asc
                </DropdownMenuItem>
                <DropdownMenuItem onclick={() => column.toggleSorting(true)}>
                    <ArrowDown class="text-muted-foreground/70" />
                    Desc
                </DropdownMenuItem>
                {#if column.getIsSorted()}
                    <DropdownMenuItem onclick={() => column.clearSorting()}>
                        <X class="text-muted-foreground/70" />
                        Clear
                    </DropdownMenuItem>
                {/if}
                <DropdownMenuSeparator />
                <DropdownMenuItem onclick={() => column.toggleVisibility(false)}>
                    <EyeOff class="text-muted-foreground/70" />
                    Hide
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
{:else}
    {@render children()}
{/if}