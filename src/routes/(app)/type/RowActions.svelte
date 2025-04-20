<script lang="ts">
    import {
        DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub,
        DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuTrigger, DropdownMenuCheckboxItem
    } from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
    import type { AssetType } from "@prisma/client";
    import { Archive, ArchiveRestore, Boxes, Ellipsis, Eye, Pen, Trash } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import type { Writable } from "svelte/store";
    import type { Data } from "./columns";
    import { nameToIcon } from "$lib/utils";
    import { toast } from "svelte-sonner";
    import {
        AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
        AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
    } from "$lib/components/ui/alert-dialog";

    const { row, data, refreshData }: { row: AssetType, data: Writable<Data>, refreshData: Function } = $props();
    let { categories } = $derived($data);

    async function setCategory(categoryId: string) {
        row.categoryId = row.categoryId === categoryId ? null : categoryId
        const resp = await fetch(`/type/${row.id}/update`, {
            method: "POST",
            body: JSON.stringify({ categoryId }),
            headers: { "Content-Type": "application/json" }
        })
        if (resp.ok) toast.success("Category updated successfully.");
    }

    let deleteDialogOpen: boolean = $state(false);

    async function archiveType() {
        await fetch(`/type/${row.id}/archive`, { method: "POST" });
        await refreshData();
        toast.success("Asset type archived successfully");
    }

    async function restoreType() {
        await fetch(`/type/${row.id}/restore`, { method: "POST" });
        await refreshData();
        toast.success("Asset type restored successfully");
    }

    async function deleteType() {
        await fetch(`/type/${row.id}/delete`, { method: "POST" });
        await refreshData();
        deleteDialogOpen = false;
        toast.success("Asset type deleted successfully");
    }
</script>

<div class="flex flex-row gap-2">
    <Button variant="ghost" size="icon-sm" onclick={() => goto(`/type/${row.id}`)}>
        <Eye class="size-4"/>
        <span class="sr-only">View Asset Type</span>
    </Button>

    <Button variant="ghost" size="icon-sm" onclick={() => goto(`/type/${row.id}/edit`)}>
        <Pen class="size-4"/>
        <span class="sr-only">Edit Asset Type</span>
    </Button>

    <DropdownMenu>
        <DropdownMenuTrigger>
            <Button variant="ghost" size="icon-sm" class="data-[state=open]:bg-muted">
                <Ellipsis class="size-4"/>
                <span class="sr-only">Open Menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-48" align="end">
            <DropdownMenuItem onclick={() => goto(`/type/${row.id}`)}>
                <Eye /> View
            </DropdownMenuItem>
            <DropdownMenuItem onclick={() => goto(`/type/${row.id}/edit`)}>
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
                            checked={row.categoryId === category.id}
                            onclick={() => setCategory(category.id)}
                        >
                            <Icon class="size-4 mr-2 stroke-{category.color || 'neutral'}-500" />
                            {category.name}
                        </DropdownMenuCheckboxItem>
                    {/each}
                </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator/>
            {#if row.archived}
                <DropdownMenuItem onclick={restoreType}>
                    <ArchiveRestore /> Restore
                </DropdownMenuItem>
            {:else}
                <DropdownMenuItem onclick={archiveType}>
                    <Archive /> Archive
                </DropdownMenuItem>
            {/if}
            <DropdownMenuItem onclick={() => deleteDialogOpen = true}>
                <Trash /> Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</div>

<AlertDialog bind:open={deleteDialogOpen}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Delete Asset Type?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this asset type?</AlertDialogDescription>
        </AlertDialogHeader>
        <div class="flex flex-row items-center gap-2">
            {row.name}
        </div>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onclick={deleteType}>Delete</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
