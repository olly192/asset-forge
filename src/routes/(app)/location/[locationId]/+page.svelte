<script lang="ts">
    import NestedItems from "$components/NestedItems.svelte";
    import type { Filter } from "$components/table/data";
    import DataTable from "$components/table/DataTable.svelte";
    import { Label } from "$lib/components/ui/label";
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import type { Asset, Location } from "@prisma/client";
    import type { ColumnDef } from "@tanstack/table-core";
    import { Pencil, RotateCw } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import { nameToIcon } from "$lib/utils";
    import { onMount } from "svelte";
    import { writable, type Writable } from "svelte/store";
    import { type Data, generateTable } from "../../asset/columns";
    import RowActions from "../../asset/RowActions.svelte";

    $header = headerSnippet

    let pageData: { data: { location: Location, locations: Location[] } } = $props();
    let { location, locations }: { location: Location, locations: Location[] } = pageData.data;

    $breadcrumbs = [
        { label: "Locations", href: "/location" },
        { label: location.name },
        { label: "Edit Location" }
    ];

    let data: Writable<Data> = writable({ assets: [], categories: [], tags: [], assetTypes: [] });
    let tableData: {
        data: Asset[], columns: ColumnDef<Asset>[], filters: Filter[]
    } = $state(generateTable(data, RowActions, refreshData));

    let filterLocations = [];
    function addChildLocations(location: Location) {
        filterLocations.push(location.id);
        locations.forEach((l: Location) => l.parentId === location.id && addChildLocations(l));
    }
    addChildLocations(location);

    let refreshing: boolean = $state(false);
    async function refreshData() {
        refreshing = true;
        const resp = await fetch("/asset/get");
        data.set(await resp.json());
        data.update((data: Data) => ({
            ...data,
            assets: data.assets.filter(asset => filterLocations.includes(asset.locationId))
        }))
        tableData = generateTable(data, RowActions, refreshData);
        refreshing = false;
    }
    onMount(() => refreshData());
</script>

{#snippet headerSnippet()}
    {@const Icon = nameToIcon(location.icon)}
    <div class="header">
        <h1 class="flex flex-row items-center gap-4">
            <Icon class="size-8 stroke-{location.color ? location.color + '-500' : 'white'}" />
            {location.name}
        </h1>
        <Button onclick={() => goto(`/location/${location.id}/edit`)}>
            <Pencil /> Edit Location
        </Button>
    </div>
{/snippet}

<main class="w-full p-8 grid grid-cols-1 lg:grid-cols-[32rem_1fr] gap-8">
    <Card>
        <CardHeader>
            <CardTitle>Location Details</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
            <div class="space-y-2">
                <Label>Name</Label>
                <Input value={location.name} readonly />
            </div>

            <div class="flex flex-col items-start gap-2">
                <Label>Parent Locations</Label>
                <NestedItems
                    id={location.id} items={locations}
                    url={id => `/location/${id}/edit`}
                />
            </div>
        </CardContent>
    </Card>

    <Card class="overflow-x-hidden">
        <CardHeader class="flex flex-row justify-between items-center space-y-0">
            <CardTitle>Assets</CardTitle>
            <Button variant="outline" size="icon" onclick={refreshData} disabled={refreshing}>
                <RotateCw class={refreshing ? "animate-spin": ""} />
            </Button>
        </CardHeader>
        <CardContent class="w-full max-w-full">
            <DataTable data={tableData} />
        </CardContent>
    </Card>
</main>
