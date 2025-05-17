<script lang="ts">
    import type { Filter } from "$components/table/data";
    import DataTable from "$components/table/DataTable.svelte";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/form";
    import type { Asset } from "@prisma/client";
    import type { ColumnDef } from "@tanstack/table-core";
    import { Boxes, Map, Package, RotateCw, Tag, Users } from "lucide-svelte";
    import { onMount } from "svelte";
    import { writable, type Writable } from "svelte/store";
    import type { LayoutProps } from "./$types"
    import { breadcrumbs, header } from "$lib/stores";
    import { type Data, generateTable } from "./asset/columns";
    import RowActions from "./asset/RowActions.svelte";

    let pageData: LayoutProps = $props();
    const user = pageData.data?.user;
    const itemCounts = pageData.data.itemCounts;

    $breadcrumbs = [{ label: "Dashboard", href: "/" }];
    $header = headerSnippet;

    let data: Writable<Data> = writable({ assets: [], categories: [], locations: [], tags: [], assetTypes: [] });
    let tableData: {
        data: Asset[], columns: ColumnDef<Asset>[], filters: Filter[]
    } = $state(generateTable(data, RowActions, refreshData));

    let refreshing: boolean = $state(false);
    async function refreshData() {
        refreshing = true;
        const resp = await fetch("/asset/get");
        data.set(await resp.json());
        tableData = generateTable(data, RowActions, refreshData);
        refreshing = false;
    }
    onMount(() => refreshData());
</script>

{#snippet headerSnippet()}
    <div class="flex flex-row justify-between items-center">
        <h1 class="text-4xl font-bold">Dashboard</h1>
    </div>
{/snippet}

<div class="grid grid-cols-5 gap-4 p-4">
    <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0">
            <CardTitle class="text-xl font-medium">Total Assets</CardTitle>
            <Package class="text-muted-foreground size-8" />
        </CardHeader>
        <CardContent>
            <div class="text-6xl font-bold">{itemCounts.asset}</div>
            <p class="text-muted-foreground text-xs">+ {itemCounts.assetArchived} archived</p>
        </CardContent>
    </Card>
    <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0">
            <CardTitle class="text-xl font-medium">Locations</CardTitle>
            <Map class="text-muted-foreground size-8" />
        </CardHeader>
        <CardContent>
            <div class="text-6xl font-bold">{itemCounts.location}</div>
            <p class="text-muted-foreground text-xs">+ {itemCounts.locationArchived} archived</p>
        </CardContent>
    </Card>
    <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0">
            <CardTitle class="text-xl font-medium">Tags</CardTitle>
            <Tag class="text-muted-foreground size-8" />
        </CardHeader>
        <CardContent>
            <div class="text-6xl font-bold">{itemCounts.tag}</div>
            <p class="text-muted-foreground text-xs">+ {itemCounts.tagArchived} archived</p>
        </CardContent>
    </Card>
    <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0">
            <CardTitle class="text-xl font-medium">Categories</CardTitle>
            <Boxes class="text-muted-foreground size-8" />
        </CardHeader>
        <CardContent>
            <div class="text-6xl font-bold">{itemCounts.category}</div>
            <p class="text-muted-foreground text-xs">+ {itemCounts.categoryArchived} archived</p>
        </CardContent>
    </Card>
    <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0">
            <CardTitle class="text-xl font-medium">Users</CardTitle>
            <Users class="text-muted-foreground size-8" />
        </CardHeader>
        <CardContent>
            <div class="text-6xl font-bold">{itemCounts.user}</div>
            <p class="text-muted-foreground text-xs">
                with {itemCounts.admin} administrator{itemCounts.admin !== 1 ? "s" : ""}
            </p>
        </CardContent>
    </Card>
    <Card class="col-span-full">
        <CardHeader class="flex flex-row items-center justify-between space-y-0">
            <CardTitle class="text-xl font-medium">Assets List</CardTitle>
            <Button variant="outline" size="icon" onclick={refreshData} disabled={refreshing}>
                <RotateCw class={refreshing ? "animate-spin": ""} />
            </Button>
        </CardHeader>
        <CardContent>
            <DataTable data={tableData} />
        </CardContent>
    </Card>
</div>
