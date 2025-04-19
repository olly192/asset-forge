<script lang="ts">
    import {
        DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub,
        DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuTrigger, DropdownMenuCheckboxItem
    } from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
    import { Archive, Boxes, Ellipsis, Eye, Pen, Trash } from "lucide-svelte";
    import type { Asset } from "@prisma/client";
    import { goto } from "$app/navigation";
    import type { Writable } from "svelte/store";
    import type { Data } from "./columns";
    import { nameToIcon } from "$lib/utils"

    const { row, data }: { row: Asset, data: Writable<Data> } = $props();
    let { categories, locations, tags } = $derived($data);

    function setCategory(categoryId: string) {
        row.categoryId = row.categoryId === categoryId ? null : categoryId
        fetch(`/asset/${row.id}/update`, {
            method: "POST",
            body: JSON.stringify({ categoryId }),
            headers: { "Content-Type": "application/json" }
        })
    }
</script>

<div class="flex flex-row gap-2">
    <Button variant="ghost" size="icon-sm" onclick={() => goto(`/asset/${row.id}`)}>
        <Eye class="size-4"/>
        <span class="sr-only">View Asset</span>
    </Button>

    <Button variant="ghost" size="icon-sm" onclick={() => goto(`/asset/${row.id}/edit`)}>
        <Pen class="size-4"/>
        <span class="sr-only">Edit Asset</span>
    </Button>

    <DropdownMenu>
        <DropdownMenuTrigger>
            <Button variant="ghost" size="icon-sm" class="data-[state=open]:bg-muted">
                <Ellipsis class="size-4"/>
                <span class="sr-only">Open Menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-48" align="end">
            <DropdownMenuItem onclick={() => goto(`/asset/${row.id}`)}>
                <Eye /> View
            </DropdownMenuItem>
            <DropdownMenuItem onclick={() => goto(`/asset/${row.id}/edit`)}>
                <Pen /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <Boxes /> Set Category
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    {#each categories as category}
                        {@const Icon = nameToIcon(category.icon)}
                        <DropdownMenuCheckboxItem
                            value={category.id} checked={row.categoryId === category.id}
                            onclick={() => setCategory(category.id)}
                        >
                            <Icon class="size-4 mr-2 stroke-{category.color || 'neutral'}-500" />
                            {category.name}
                        </DropdownMenuCheckboxItem>
                    {/each}
                </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>
                <Archive /> Archive
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Trash /> Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</div>
