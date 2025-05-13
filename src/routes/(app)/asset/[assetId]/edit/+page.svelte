<script lang="ts">
    import { page } from "$app/state";
    import AssetTypeSelect from "$components/AssetTypeSelect.svelte";
    import LocationSelect from "$components/LocationSelect.svelte";
    import IdCell from "$components/table/IdCell.svelte";
    import TagSelect from "$components/TagSelect.svelte";
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import type { AssetType } from "@prisma/client";
    import { Save } from "lucide-svelte";
    import { Textarea } from "$lib/components/ui/textarea"
    import { goto } from "$app/navigation";
    import { toast } from "svelte-sonner";
    import { type Infer, superForm, type SuperValidated } from "sveltekit-superforms";
    import { valibotClient } from "sveltekit-superforms/adapters";
    import { assetSchema, type AssetSchema } from "../../schema";

    let { data }: { data: { form: SuperValidated<Infer<AssetSchema>>, assetTypes: AssetType[] } } = $props();

    const form = superForm(data.form, {
        validators: valibotClient(assetSchema),
        dataType: "json",
        onUpdated: ({ form }) => {
            if (form.valid) {
                goto("/asset");
                toast.success("Asset updated successfully.");
            }
        }
    });

    const { form: formData, enhance, allErrors } = form;
    let assetType = $derived(data.assetTypes?.find(t => t.id === $formData.type));

    $effect(() => {
        $breadcrumbs = [
            { label: "Assets", href: "/asset" },
            { label: `${assetType?.name} (${$formData.assetId})`, href: `/asset/${page.params.assetId}` },
            { label: "Edit Asset" }
        ];
    });

    $header = headerSnippet;

    $inspect("tags", $formData.tags)
</script>

{#snippet headerSnippet()}
    <div class="header">
        <h1 class="flex flex-row items-center gap-4">
            <span>{assetType?.name}</span>
            <IdCell bind:value={$formData.assetId} class="bg-muted/50 p-1 pl-3 rounded-lg text-xl font-medium" />
        </h1>
        <div>
            <Button onclick={() => form.submit()} disabled={$allErrors.length > 0}>
                <Save /> Save
            </Button>
        </div>
    </div>
{/snippet}

<main class="w-full p-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
    <Card>
        <CardHeader>
            <CardTitle>Edit Asset</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2">
            <form method="POST" use:enhance>
                <FormField {form} name="assetId">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Asset ID</FormLabel>
                            <Input {...props} bind:value={$formData.assetId} placeholder="Asset ID" />
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors />
                </FormField>

                <FormField {form} name="notes">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Notes</FormLabel>
                            <Textarea {...props} bind:value={$formData.notes} placeholder="Asset Notes" />
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors />
                </FormField>

                <LocationSelect {form} name="location" label="Location" bind:value={$formData.location} />
                <TagSelect {form} name="tags" label="Tags" bind:value={$formData.tags} />
                <AssetTypeSelect {form} name="type" label="Asset Type" bind:value={$formData.type} />
            </form>
        </CardContent>
    </Card>
    <!-- <Card> -->
    <!--     <CardHeader> -->
    <!--         <CardTitle>Asset Type</CardTitle> -->
    <!--     </CardHeader> -->
    <!--     <CardContent class="space-y-2"> -->
    <!--         <div class="space-y-2"> -->
    <!--             <Label>Name</Label> -->
    <!--             <Input value={asset.type.name} readonly /> -->
    <!--         </div> -->

    <!--         <div class="space-y-2"> -->
    <!--             <Label>Description</Label> -->
    <!--             <Textarea value={asset.type.description} placeholder="Asset Description" readonly /> -->
    <!--         </div> -->

    <!--         <div class="flex flex-col items-start gap-2"> -->
    <!--             <Label>Category</Label> -->
    <!--             {#if asset.type.category} -->
    <!--                 <NestedItems -->
    <!--                         id={asset.type.category.id} items={categories} -->
    <!--                         url={id => `/category/${id}/edit`} -->
    <!--                 /> -->
    <!--             {:else} -->
    <!--                 <Button variant="outline" size="sm" disabled> -->
    <!--                     <Circle class="stroke-neutral-700 size-4" /> -->
    <!--                     <span class="opacity-60">No Category</span> -->
    <!--                 </Button> -->
    <!--             {/if} -->
    <!--         </div> -->
    <!--     </CardContent> -->
    <!-- </Card> -->
</main>

