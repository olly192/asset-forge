<script lang="ts">
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/form";
    import { Plus, RotateCw } from "lucide-svelte";
    import DataTable from "$components/table/DataTable.svelte";
    import { goto } from "$app/navigation";
    import { type Data, generateTable } from "./columns.js";
    import RowActions from "./RowActions.svelte";
    import type { CustomField } from "@prisma/client";
    import type { ColumnDef } from "@tanstack/table-core";
    import type { Filter } from "$components/table/data";
    import { onMount } from "svelte";
    import { writable, type Writable } from "svelte/store";

    $breadcrumbs = [{ label: "Custom Fields", href: "/field" }];
    $header = headerSnippet;

    let data: Writable<Data> = writable({ customFields: [] });
    let tableData: {
        data: CustomField[], columns: ColumnDef<CustomField>[], filters: Filter[]
    } = $state(generateTable(data, RowActions, refreshData));

    let refreshing: boolean = $state(false);
    async function refreshData() {
        refreshing = true;
        const resp = await fetch("/field/get");
        data.set(await resp.json());
        tableData = generateTable(data, RowActions, refreshData);
        refreshing = false;
    }
    onMount(() => refreshData());
</script>

{#snippet headerSnippet()}
    <div class="flex flex-row justify-between items-center">
        <h1 class="text-4xl font-bold">Custom Fields</h1>
        <div class="flex items-center space-x-2">
            <Button onclick={() => goto("/field/create")} class="size-9 md:w-min">
                <Plus />
                <span class="hidden md:block">Create Custom Field</span>
            </Button>
            <Button variant="outline" size="icon" onclick={refreshData} disabled={refreshing}>
                <RotateCw class={refreshing ? "animate-spin": ""} />
            </Button>
        </div>
    </div>
{/snippet}

<div class="p-8">
    <DataTable data={tableData} />
</div>
