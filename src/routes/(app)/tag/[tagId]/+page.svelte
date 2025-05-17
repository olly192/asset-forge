<script lang="ts">
    import type { Filter } from "$components/table/data";
    import DataTable from "$components/table/DataTable.svelte";
    import { Label } from "$lib/components/ui/label";
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import type { Asset, Tag } from "@prisma/client";
    import type { ColumnDef } from "@tanstack/table-core";
    import { onMount } from "svelte";
    import { writable, type Writable } from "svelte/store";
    import { type Data, generateTable } from "../../asset/columns";
    import RowActions from "../../asset/RowActions.svelte";
    import { Circle, Pencil, RotateCw } from "lucide-svelte";
    import { Textarea } from "$lib/components/ui/textarea";
    import { goto } from "$app/navigation";

    $header = headerSnippet;

    let pageData: { data: { tag: Tag, tags: Tag[] } } = $props();
    let { tag, tags } = pageData.data;

    $breadcrumbs = [
        { label: "Tags", href: "/tag" },
        { label: tag.name },
        { label: "Edit Tag" }
    ];

    let data: Writable<Data> = writable({ assets: [], categories: [], locations: [], tags: [], assetTypes: [] });
    let tableData: {
        data: Asset[], columns: ColumnDef<Asset>[], filters: Filter[]
    } = $state(generateTable(data, RowActions, refreshData));
    tableData.filters.find((f: Filter) => f.id === "tags").default = [tag.id]

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
    <div class="header">
        <h1 class="flex flex-row items-center gap-4">
            <Circle class="size-8 fill-{tag.color || 'neutral'}-500 stroke-{tag.color || 'neutral'}-700" />
            {tag.name}
        </h1>
        <Button onclick={() => goto(`/tag/${tag.id}/edit`)}>
            <Pencil /> Edit Tag
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
                <Input value={tag.name} readonly />
            </div>

            <div class="space-y-2">
                <Label>Description</Label>
                <Textarea value={tag.description} placeholder="Tag Description" readonly />
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
