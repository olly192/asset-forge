<script lang="ts">
    import {
        DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
    } from "$lib/components/ui/dropdown-menu";
    import { Button } from "$lib/components/ui/button";
    import type { CustomField } from "@prisma/client";
    import { Archive, ArchiveRestore, Ellipsis, Pen, Trash } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import type { Writable } from "svelte/store";
    import type { Data } from "./columns";
    import { toast } from "svelte-sonner";
    import {
        AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
        AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
    } from "$lib/components/ui/alert-dialog";

    const { row, data, refreshData }: { row: CustomField, data: Writable<Data>, refreshData: Function } = $props();

    let deleteDialogOpen: boolean = $state(false);

    async function archiveField() {
        await fetch(`/field/${row.id}/archive`, { method: "POST" });
        await refreshData();
        toast.success("Custom field archived successfully");
    }

    async function restoreField() {
        await fetch(`/field/${row.id}/restore`, { method: "POST" });
        await refreshData();
        toast.success("Custom field restored successfully");
    }

    async function deleteField() {
        await fetch(`/field/${row.id}/delete`, { method: "POST" });
        await refreshData();
        deleteDialogOpen = false;
        toast.success("Custom field deleted successfully");
    }
</script>

<div class="flex flex-row gap-2">
    <Button variant="ghost" size="icon-sm" onclick={() => goto(`/field/${row.id}/edit`)}>
        <Pen class="size-4"/>
        <span class="sr-only">Edit Custom Field</span>
    </Button>

    <DropdownMenu>
        <DropdownMenuTrigger>
            <Button variant="ghost" size="icon-sm" class="data-[state=open]:bg-muted">
                <Ellipsis class="size-4"/>
                <span class="sr-only">Open Menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-48" align="end">
            <DropdownMenuItem onclick={() => goto(`/field/${row.id}/edit`)}>
                <Pen /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            {#if row.archived}
                <DropdownMenuItem onclick={restoreField}>
                    <ArchiveRestore /> Restore
                </DropdownMenuItem>
            {:else}
                <DropdownMenuItem onclick={archiveField}>
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
            <AlertDialogTitle>Delete Custom Field?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this custom field?</AlertDialogDescription>
        </AlertDialogHeader>
        <div class="flex flex-row items-center gap-2">
            {row.name}
        </div>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onclick={deleteField}>Delete</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
