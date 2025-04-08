<script lang="ts">
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button"
    import { Plus, RotateCw, Box, Trash, Archive, Pen, ArchiveRestore } from "lucide-svelte"
    import { goto } from "$app/navigation"
    import type { TreeElement } from "$components/tree/tree"
    import TreeView from "$components/tree/TreeView.svelte"
    import type { Category } from "@prisma/client"
    import { onMount } from "svelte"
    import type { Color } from "$components/table/data"
    import { nameToIcon } from "$lib/utils"
    import {
        AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
        AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
    } from "$lib/components/ui/alert-dialog"
    import { toast } from "svelte-sonner"

    $breadcrumbs = [{ label: "Categories", href: "/category" }];
    $header = headerSnippet;

    let categories: Category[] = $state([]);

    let refreshing: boolean = $state(false);
    async function refreshData() {
        refreshing = true;
        const resp = await fetch("/category/get");
        const newData: { categories: Category[] } = await resp.json();
        categories = newData.categories;
        refreshing = false;
    }

    function mapCategories(categories: Category[], parentId: string | null = null): TreeElement[] {
        return categories.filter(category => category.parentId === parentId).map(category => ({
            id: category.id,
            name: category.name,
            icon: nameToIcon(category.icon) || Box,
            color: (category.archived ? "neutral" : category.color) as Color,
            children: mapCategories(categories, category.id)
        }));
    }

    let tree: TreeElement[] = $derived(mapCategories(categories));

    let deleteDialogOpen: boolean = $state(false);
    let targetCategory: Category | null = $state(null);

    async function archiveCategory(id: string) {
        let category = categories.find(category => category.id === id) ?? null
        if (!category) return;
        await fetch(`/category/${category.id}/archive`, { method: "POST" });
        await refreshData();
        toast.success("Category archived successfully");
    }

    async function restoreCategory(id: string) {
        let category = categories.find(category => category.id === id) ?? null
        if (!category) return;
        await fetch(`/category/${category.id}/restore`, { method: "POST" });
        await refreshData();
        toast.success("Category restored successfully");
    }

    function openDeleteDialog(id: string) {
        targetCategory = categories.find(category => category.id === id) ?? null;
        if (!targetCategory) return;
        deleteDialogOpen = true;
    }

    async function deleteCategory() {
        if (!targetCategory) return;
        await fetch(`/category/${targetCategory.id}/delete`, { method: "POST" });
        await refreshData();
        deleteDialogOpen = false;
        toast.success("Category deleted successfully");
    }

    onMount(() => refreshData());
    $inspect(tree);
</script>

{#snippet headerSnippet()}
    <div class="header">
        <h1>Categories</h1>
        <div>
            <Button onclick={() => goto("/category/create")} class="size-9 md:w-min">
                <Plus />
                <span class="hidden md:block">Create Category</span>
            </Button>
            <Button variant="outline" size="icon" onclick={refreshData} disabled={refreshing}>
                <RotateCw class={refreshing ? "animate-spin": ""} />
            </Button>
        </div>
    </div>
{/snippet}

{#snippet treeActions({ id }: { id: string })}
    <Button variant="ghost" size="icon-sm" onclick={() => goto(`/category/${id}/edit`)}>
        <Pen class="size-4"/>
        <span class="sr-only">Edit Category</span>
    </Button>
    {#if categories.find(category => category.id === id)?.archived}
        <Button variant="ghost" size="icon-sm" onclick={() => restoreCategory(id)}>
            <ArchiveRestore />
            <span class="sr-only">Restore Category</span>
        </Button>
    {:else}
        <Button variant="ghost" size="icon-sm" onclick={() => archiveCategory(id)}>
            <Archive />
            <span class="sr-only">Archive Category</span>
        </Button>
    {/if}
    <Button variant="ghost" size="icon-sm" onclick={() => openDeleteDialog(id)}>
        <Trash />
        <span class="sr-only">Delete Category</span>
    </Button>
{/snippet}

<AlertDialog bind:open={deleteDialogOpen}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this category?</AlertDialogDescription>
        </AlertDialogHeader>
        {#if targetCategory}
            {@const TargetCategoryIcon = nameToIcon(targetCategory.icon) || Box}
            <div class="flex flex-row items-center gap-2">
                <TargetCategoryIcon class="stroke-{targetCategory.color || 'neutral'}-500 size-5" />
                {targetCategory.name}
            </div>
        {/if}
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onclick={deleteCategory}>Delete</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>

<main class="h-full p-8 space-y-4">
    <TreeView {tree} actions={treeActions} />
</main>
