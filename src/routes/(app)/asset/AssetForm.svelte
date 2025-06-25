<script lang="ts">
    import { page } from "$app/state";
    import CustomFields from "$components/CustomFields.svelte";
    import ImageGallery from "$components/ImageGallery.svelte";
    import NestedItems from "$components/NestedItems.svelte";
    import AssetTypeSelect from "$components/select/AssetTypeSelect.svelte";
    import LocationSelect from "$components/select/LocationSelect.svelte";
    import TagSelect from "$components/select/TagSelect.svelte";
    import { Button } from "$lib/components/ui/button";
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Textarea } from "$lib/components/ui/textarea";
    import type { AssetType } from "@prisma/client";
    import { Circle } from "lucide-svelte";
    import type { Infer, SuperForm } from "sveltekit-superforms";
    import type { AssetSchema } from "./schema";

    let { form = $bindable() }: { form: SuperForm<Infer<AssetSchema>> } = $props();

    const { form: formData, enhance } = form;

    let assetType = $derived(page.data.assetTypes?.find((type: AssetType) => type.id === $formData.type));

    $inspect("typeCustomFields", $formData.typeCustomFields);
</script>

<main class="w-full p-8 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
    <Card>
        <CardHeader>
            <CardTitle>Asset Details</CardTitle>
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

    <Card>
        <CardHeader>
            <CardTitle>Custom Fields</CardTitle>
        </CardHeader>
        <CardContent>
            <CustomFields {form} bind:category={assetType.categoryId} bind:tags={$formData.tags} />
        </CardContent>
    </Card>

    <Card>
        <CardHeader>
            <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2">
            <ImageGallery value={assetType.images} />
        </CardContent>
    </Card>

    <Card>
        <CardHeader>
            <CardTitle>Asset Type</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2">
            <div class="space-y-2">
                <Label>Name</Label>
                <Input value={assetType?.name} readonly />
            </div>

            <div class="space-y-2">
                <Label>Description</Label>
                <Textarea value={assetType?.description} placeholder="Asset Description" readonly />
            </div>

            <div class="flex flex-col items-start gap-2">
                <Label>Category</Label>
                {#if assetType?.categoryId}
                    <NestedItems
                        id={assetType.categoryId} items={page.data.categories}
                        url={id => `/category/${id}/edit`}
                    />
                {:else}
                    <Button variant="outline" size="sm" disabled>
                        <Circle class="stroke-neutral-700 size-4" />
                        <span class="opacity-60">No Category</span>
                    </Button>
                {/if}
            </div>
        </CardContent>
    </Card>

    <Card>
        <CardHeader>
            <CardTitle>Asset Type Custom Fields</CardTitle>
        </CardHeader>
        <CardContent>
            <CustomFields {form} bind:category={assetType.categoryId} customFieldSet="typeCustomFields" readonly />
        </CardContent>
    </Card>
</main>
