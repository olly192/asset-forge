<script lang="ts">
    import {
        DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub,
        DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuTrigger, DropdownMenuCheckboxItem
    } from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
    import { Archive, ArchiveRestore, Circle, Ellipsis, Eye, Map, Pen, Tag, Trash } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import type { Writable } from "svelte/store";
    import type { Data } from "./columns";
    import { nameToIcon } from "$lib/utils";
    import { toast } from "svelte-sonner";
    import type { AssetWithTags } from "$lib/types";
    import {
        AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
        AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
    } from "$lib/components/ui/alert-dialog";

    const { row, data, refreshData }: { row: AssetWithTags, data: Writable<Data>, refreshData: Function } = $props();
    let { locations, tags } = $derived($data);

    async function setLocation(locationId: string) {
        row.locationId = row.locationId === locationId ? null : locationId
        const resp = await fetch(`/asset/${row.id}/update`, {
            method: "POST",
            body: JSON.stringify({ locationId }),
            headers: { "Content-Type": "application/json" }
        })
        if (resp.ok) toast.success("Location updated successfully.");
    }

    async function toggleTag(tagId: string) {
        row.tags = row.tags.includes(tagId) ? row.tags.filter(id => id !== tagId) : [...row.tags, tagId];
        const resp = await fetch(`/asset/${row.id}/update`, {
            method: "POST",
            body: JSON.stringify({ tagIds: row.tags }),
            headers: { "Content-Type": "application/json" }
        })
        if (resp.ok) toast.success("Tags updated successfully.");
    }

    let deleteDialogOpen: boolean = $state(false);

    async function archiveAsset() {
        await fetch(`/asset/${row.id}/archive`, { method: "POST" });
        await refreshData();
        toast.success("Asset archived successfully");
    }

    async function restoreAsset() {
        await fetch(`/asset/${row.id}/restore`, { method: "POST" });
        await refreshData();
        toast.success("Asset restored successfully");
    }

    async function deleteAsset() {
        await fetch(`/asset/${row.id}/delete`, { method: "POST" });
        await refreshData();
        deleteDialogOpen = false;
        toast.success("Asset deleted successfully");
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
                    <Map /> Set Location
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    {#each locations as location}
                        {@const Icon = nameToIcon(location.icon)}
                        <DropdownMenuCheckboxItem
                            checked={row.locationId === location.id}
                            onclick={() => setLocation(location.id)}
                        >
                            <Icon class="size-4 mr-2 stroke-{location.color || 'neutral'}-500" />
                            {location.name}
                        </DropdownMenuCheckboxItem>
                    {/each}
                </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <Tag /> Set Tags
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    {#each tags as tag}
                        {@const color = tag.color || 'neutral'}
                        <DropdownMenuCheckboxItem checked={row.tags.includes(tag.id)} onclick={() => toggleTag(tag.id)}>
                            <Circle class="size-4 mr-2 fill-{color}-500 stroke-{color}-700" />
                            {tag.name}
                        </DropdownMenuCheckboxItem>
                    {/each}
                </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator/>
            {#if row.archived}
                <DropdownMenuItem onclick={restoreAsset}>
                    <ArchiveRestore /> Restore
                </DropdownMenuItem>
            {:else}
                <DropdownMenuItem onclick={archiveAsset}>
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
            <AlertDialogTitle>Delete Asset?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this asset?</AlertDialogDescription>
        </AlertDialogHeader>
        <div class="flex flex-row items-center gap-2">
            {row.assetId}
        </div>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onclick={deleteAsset}>Delete</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
