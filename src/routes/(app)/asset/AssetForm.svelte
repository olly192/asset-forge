<script lang="ts">
    import { page } from "$app/state";
    import CustomFields from "$components/CustomFields.svelte";
    import CustomFieldsDisplay from "$components/CustomFieldsDisplay.svelte";
    import ImageGallery from "$components/ImageGallery.svelte";
    import ImageUploader from "$components/ImageUploader.svelte";
    import NestedItems from "$components/NestedItems.svelte";
    import AssetTypeSelect from "$components/select/AssetTypeSelect.svelte";
    import CategorySelect from "$components/select/CategorySelect.svelte";
    import LocationSelect from "$components/select/LocationSelect.svelte";
    import TagSelect from "$components/select/TagSelect.svelte";
    import { Button } from "$lib/components/ui/button";
    import { Checkbox } from "$lib/components/ui/checkbox";
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

    let assetType = $derived(page.data.assetTypes?.find((type: AssetType) => type.id === $formData.typeId));
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

                <FormField {form} name="individualType">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel class="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50 has-[[aria-checked=true]]:border-red-900 has-[[aria-checked=true]]:bg-red-950">
                                <Checkbox
                                    {...props} bind:checked={$formData.individualType}
                                    class="data-[state=checked]:border-red-700 data-[state=checked]:bg-red-700"
                                />
                                <div class="flex flex-col gap-1.5">
                                    <p class="text-sm font-medium leading-none">Individual Type</p>
                                    <p class="text-muted-foreground font-normal text-sm">
                                        This asset is the only instance of its type.
                                    </p>
                                </div>
                            </FormLabel>
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors />
                </FormField>

                {#if !$formData.individualType}
                    <AssetTypeSelect {form} name="type" label="Asset Type" bind:value={$formData.typeId} />
                {/if}
            </form>
        </CardContent>
    </Card>

    <Card>
        <CardHeader>
            <CardTitle>Custom Fields</CardTitle>
        </CardHeader>
        <CardContent>
            {#if $formData.individualType}
                <CustomFields {form} bind:category={$formData.type.category} bind:tags={$formData.tags} />
            {:else if assetType?.categoryId}
                <CustomFields {form} bind:category={assetType.categoryId} bind:tags={$formData.tags} />
            {/if}
        </CardContent>
    </Card>

    {#if $formData.individualType}
        <ImageUploader bind:value={$formData.type.images} />
    {:else}
        <Card>
            <CardHeader>
                <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
                {#if assetType?.images}
                    <ImageGallery value={assetType.images} />
                {/if}
            </CardContent>
        </Card>
    {/if}

    <Card>
        <CardHeader>
            <CardTitle>Asset Type Details</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2">
            {#if $formData.individualType}
                <FormField {form} name="type.name">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Name</FormLabel>
                            <Input {...props} bind:value={$formData.type.name} placeholder="Type Name" />
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors />
                </FormField>

                <FormField {form} name="type.displayName">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Display Name</FormLabel>
                            <Input
                                {...props} bind:value={$formData.type.displayName}
                                bind:placeholder={$formData.type.name}
                            />
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors />
                </FormField>

                <FormField {form} name="type.description">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Description</FormLabel>
                            <Textarea {...props} bind:value={$formData.type.description} placeholder="Description" />
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors />
                </FormField>

                <FormField {form} name="type.brand">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Brand</FormLabel>
                            <Input {...props} bind:value={$formData.type.brand} placeholder="Brand Name" />
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors />
                </FormField>

                <FormField {form} name="type.value">
                    <FormControl>
                        {#snippet children({ props })}
                            <FormLabel>Value</FormLabel>
                            <Input
                                {...props} bind:value={$formData.type.value} placeholder="Value"
                                type="number" step="0.01"
                            />
                        {/snippet}
                    </FormControl>
                    <FormFieldErrors />
                </FormField>

                <CategorySelect
                    {form} name="type.category" label="Category"
                    bind:value={$formData.type.category} allowNone
                />
            {:else}
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
            {/if}
        </CardContent>
    </Card>

    <Card>
        <CardHeader>
            <CardTitle>Asset Type Custom Fields</CardTitle>
        </CardHeader>
        <CardContent>
            {#if $formData.individualType}
                <CustomFields {form} bind:category={$formData.type.category} customFieldSet="typeCustomFields" />
            {:else if assetType?.id}
                <CustomFieldsDisplay bind:id={assetType.id} endpoint="/type/get" />
            {/if}
        </CardContent>
    </Card>
</main>
