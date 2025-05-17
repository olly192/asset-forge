<script lang="ts">
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button"
    import { Plus, RotateCw, Trash, Archive, Pen, ArchiveRestore, Circle, Eye } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import type { Tag } from "@prisma/client";
    import { onMount } from "svelte";
    import {
        AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
        AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
    } from "$lib/components/ui/alert-dialog";
    import { toast } from "svelte-sonner";

    $breadcrumbs = [{ label: "Tags", href: "/tag" }];
    $header = headerSnippet;

    let tags: Tag[] = $state([]);

    let refreshing: boolean = $state(false);
    async function refreshData() {
        refreshing = true;
        const resp = await fetch("/tag/get");
        const newData: { tags: Tag[] } = await resp.json();
        tags = newData.tags;
        refreshing = false;
    }

    let deleteDialogOpen: boolean = $state(false);
    let targetTag: Tag | null = $state(null);

    async function archiveTag(id: string) {
        let tag = tags.find(tag => tag.id === id) ?? null
        if (!tag) return;
        await fetch(`/tag/${tag.id}/archive`, { method: "POST" });
        await refreshData();
        toast.success("Tag archived successfully");
    }

    async function restoreTag(id: string) {
        let tag = tags.find(tag => tag.id === id) ?? null
        if (!tag) return;
        await fetch(`/tag/${tag.id}/restore`, { method: "POST" });
        await refreshData();
        toast.success("Tag restored successfully");
    }

    function openDeleteDialog(id: string) {
        targetTag = tags.find(tag => tag.id === id) ?? null;
        if (!targetTag) return;
        deleteDialogOpen = true;
    }

    async function deleteTag() {
        if (!targetTag) return;
        await fetch(`/tag/${targetTag.id}/delete`, { method: "POST" });
        await refreshData();
        deleteDialogOpen = false;
        toast.success("Tag deleted successfully");
    }

    onMount(() => refreshData());
</script>

{#snippet headerSnippet()}
    <div class="header">
        <h1>Tags</h1>
        <div>
            <Button onclick={() => goto("/tag/create")} class="size-9 md:w-min">
                <Plus />
                <span class="hidden md:block">Create Tag</span>
            </Button>
            <Button variant="outline" size="icon" onclick={refreshData} disabled={refreshing}>
                <RotateCw class={refreshing ? "animate-spin": ""} />
            </Button>
        </div>
    </div>
{/snippet}

<AlertDialog bind:open={deleteDialogOpen}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this tag?</AlertDialogDescription>
        </AlertDialogHeader>
        {#if targetTag}
            {@const color = targetTag?.color || "neutral"}
            <div class="flex flex-row items-center gap-2">
                <Circle class="size-4 mr-2 fill-{color}-500 stroke-{color}-700" />
                {targetTag.name}
            </div>
        {/if}
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onclick={deleteTag}>Delete</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>

<main class="h-full flex flex-col p-8">
    {#each tags as tag}
        {@const color = tag.color || "neutral"}
        <div class="tag-item">
            <div>
                {#if tag.archived}
                    <Circle class="size-4 stroke-neutral-500" />
                {:else}
                    <Circle class="size-4 fill-{color}-500 stroke-{color}-700" />
                {/if}
                {tag.name}
            </div>
            <div>
                <Button variant="ghost" size="icon-sm" onclick={() => goto(`/tag/${tag.id}`)}>
                    <Eye class="size-4"/>
                    <span class="sr-only">View Tag</span>
                </Button>
                <Button variant="ghost" size="icon-sm" onclick={() => goto(`/tag/${tag.id}/edit`)}>
                    <Pen class="size-4"/>
                    <span class="sr-only">Edit Tag</span>
                </Button>
                {#if tag.archived}
                    <Button variant="ghost" size="icon-sm" onclick={() => restoreTag(tag.id)}>
                        <ArchiveRestore />
                        <span class="sr-only">Restore Tag</span>
                    </Button>
                {:else}
                    <Button variant="ghost" size="icon-sm" onclick={() => archiveTag(tag.id)}>
                        <Archive />
                        <span class="sr-only">Archive Tag</span>
                    </Button>
                {/if}
                <Button variant="ghost" size="icon-sm" onclick={() => openDeleteDialog(tag.id)}>
                    <Trash />
                    <span class="sr-only">Delete Tag</span>
                </Button>
            </div>
        </div>
    {/each}
</main>

<style lang="postcss">
    .tag-item {
        @apply w-full flex flex-row justify-between items-center p-1 pl-3;
        @apply rounded-lg text-sm font-medium whitespace-nowrap;
        @apply hover:bg-accent/50 hover:text-accent-foreground transition-colors;
        div {
            @apply flex flex-row items-center gap-2;
        }
    }
</style>
