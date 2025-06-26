<script lang="ts">
    import { goto } from "$app/navigation";
    import Scanner from "$components/Scanner.svelte";
    import {
        AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
        AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
    } from "$lib/components/ui/alert-dialog";
    import { Badge } from "$lib/components/ui/badge";
    import { breadcrumbs, header } from "$lib/stores";

    $breadcrumbs = [{ label: "Scanner", href: "/scanner" }];
    $header = headerSnippet;

    let dialogOpen: boolean = $state(false);
    let scannedCode: string | null = $state(null);

    function onScan(code: string) {
        scannedCode = code;
        fetch(`/asset/get-id?assetId=${code}`)
            .then(response => response.json())
            .then(data => {
                if (data.id) {
                    goto(`/asset/${data.id}`);
                } else {
                    dialogOpen = true;
                }
            })
            .catch(error => {
                console.error("Error fetching asset:", error);
                dialogOpen = true;
            });
    }
</script>

{#snippet headerSnippet()}
    <div class="flex flex-row justify-between items-center">
        <h1 class="text-4xl font-bold">Scanner</h1>
    </div>
{/snippet}

<Scanner {onScan} />

<AlertDialog bind:open={dialogOpen}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle class="flex flex-col items-center gap-2 text-2xl">
                <span>Create New Asset?</span>
                <Badge variant="secondary" class="font-mono font-black text-2xl">{scannedCode}</Badge>
            </AlertDialogTitle>
            <AlertDialogDescription>
                An asset with this code does not exist.<br>
                Do you want to create a new asset?
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter class="flex flex-row justify-between">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onclick={() => goto(`/asset/new?code=${scannedCode}`)}>Create</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>