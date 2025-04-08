<script lang="ts" generics="TData">
    import {
        DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem,
        DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
        DropdownMenuTrigger
    } from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
    import { Ellipsis } from "lucide-svelte";
    import { labels } from "$components/table/data";

    const { row }: { row: TData } = $props();
</script>

<DropdownMenu>
    <DropdownMenuTrigger>
        <Button variant="ghost" class="data-[state=open]:bg-muted flex h-8 w-8 p-0">
            <Ellipsis class="h-4 w-4"/>
            <span class="sr-only">Open Menu</span>
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-[160px]" align="end">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator/>
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={row.label}>
                    {#each labels as label}
                        <DropdownMenuRadioItem value={label.value}>
                            {label.label}
                        </DropdownMenuRadioItem>
                    {/each}
                </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator/>
        <DropdownMenuItem>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
    </DropdownMenuContent>
</DropdownMenu>