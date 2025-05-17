<script lang="ts">
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button"
    import { Plus, RotateCw, Box, Trash, Archive, Pen, ArchiveRestore, Eye } from "lucide-svelte";
    import { goto } from "$app/navigation"
    import type { TreeElement } from "$components/tree/tree"
    import TreeView from "$components/tree/TreeView.svelte"
    import type { Location } from "@prisma/client"
    import { onMount } from "svelte"
    import type { Color } from "$components/table/data"
    import { nameToIcon } from "$lib/utils"
    import {
        AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
        AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
    } from "$lib/components/ui/alert-dialog"
    import { toast } from "svelte-sonner"

    $breadcrumbs = [{ label: "Locations", href: "/locations" }];
    $header = headerSnippet;

    let locations: Location[] = $state([]);

    let refreshing: boolean = $state(false);
    async function refreshData() {
        refreshing = true;
        const resp = await fetch("/location/get");
        const newData: { locations: Location[] } = await resp.json();
        locations = newData.locations;
        refreshing = false;
    }

    function mapLocations(locations: Location[], parentId: string | null = null): TreeElement[] {
        return locations.filter(location => location.parentId === parentId).map(location => ({
            id: location.id,
            name: location.name,
            icon: nameToIcon(location.icon) || Box,
            color: (location.archived ? "neutral" : location.color) as Color,
            children: mapLocations(locations, location.id)
        }));
    }

    let tree: TreeElement[] = $derived(mapLocations(locations));

    let deleteDialogOpen: boolean = $state(false);
    let targetLocation: Location | null = $state(null);

    async function archiveLocation(id: string) {
        let location = locations.find(location => location.id === id) ?? null
        if (!location) return;
        await fetch(`/location/${location.id}/archive`, { method: "POST" });
        await refreshData();
        toast.success("Location archived successfully");
    }

    async function restoreLocation(id: string) {
        let location = locations.find(location => location.id === id) ?? null
        if (!location) return;
        await fetch(`/location/${location.id}/restore`, { method: "POST" });
        await refreshData();
        toast.success("Location restored successfully");
    }

    function openDeleteDialog(id: string) {
        targetLocation = locations.find(location => location.id === id) ?? null;
        if (!targetLocation) return;
        deleteDialogOpen = true;
    }

    async function deleteLocation() {
        if (!targetLocation) return;
        await fetch(`/location/${targetLocation.id}/delete`, { method: "POST" });
        await refreshData();
        deleteDialogOpen = false;
        toast.success("Location deleted successfully");
    }

    onMount(() => refreshData());
</script>

{#snippet headerSnippet()}
    <div class="header">
        <h1>Locations</h1>
        <div>
            <Button onclick={() => goto("/location/create")} class="size-9 md:w-min">
                <Plus />
                <span class="hidden md:block">Create Location</span>
            </Button>
            <Button variant="outline" size="icon" onclick={refreshData} disabled={refreshing}>
                <RotateCw class={refreshing ? "animate-spin": ""} />
            </Button>
        </div>
    </div>
{/snippet}

{#snippet treeActions({ id })}
    <Button variant="ghost" size="icon-sm" onclick={() => goto(`/location/${id}`)}>
        <Eye class="size-4"/>
        <span class="sr-only">View Location</span>
    </Button>
    <Button variant="ghost" size="icon-sm" onclick={() => goto(`/location/${id}/edit`)}>
        <Pen class="size-4"/>
        <span class="sr-only">Edit Location</span>
    </Button>
    {#if locations.find(location => location.id === id)?.archived}
        <Button variant="ghost" size="icon-sm" onclick={() => restoreLocation(id)}>
            <ArchiveRestore />
            <span class="sr-only">Restore Location</span>
        </Button>
    {:else}
        <Button variant="ghost" size="icon-sm" onclick={() => archiveLocation(id)}>
            <Archive />
            <span class="sr-only">Archive Location</span>
        </Button>
    {/if}
    <Button variant="ghost" size="icon-sm" onclick={() => openDeleteDialog(id)}>
        <Trash />
        <span class="sr-only">Delete Location</span>
    </Button>
{/snippet}

<AlertDialog bind:open={deleteDialogOpen}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Delete Location?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this location?</AlertDialogDescription>
        </AlertDialogHeader>
        {#if targetLocation}
            {@const TargetLocationIcon = nameToIcon(targetLocation.icon) || Box}
            <div class="flex flex-row items-center gap-2">
                <TargetLocationIcon class="stroke-{targetLocation.color || 'neutral'}-500 size-5" />
                {targetLocation.name}
            </div>
        {/if}
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onclick={deleteLocation}>Delete</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>

<main class="h-full p-8 space-y-4">
    <TreeView {tree} actions={treeActions} />
</main>

