<script lang="ts">
    import CustomFields from "$components/CustomFields.svelte";
    import ImageUploader from "$components/ImageUploader.svelte";
    import CategorySelect from "$components/select/CategorySelect.svelte";
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea";
    import type { Infer, SuperForm } from "sveltekit-superforms";
    import type { AssetTypeSchema } from "./schema";

    let { form = $bindable() }: { form: SuperForm<Infer<AssetTypeSchema>> } = $props();

    const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
    <Card>
        <CardHeader>
            <CardTitle>Asset Type Details</CardTitle>
        </CardHeader>
        <CardContent>
            <FormField {form} name="name">
                <FormControl>
                    {#snippet children({ props })}
                        <FormLabel>Name</FormLabel>
                        <Input {...props} bind:value={$formData.name} placeholder="Type Name" />
                    {/snippet}
                </FormControl>
                <FormFieldErrors />
            </FormField>

            <FormField {form} name="displayName">
                <FormControl>
                    {#snippet children({ props })}
                        <FormLabel>Display Name</FormLabel>
                        <Input
                            {...props} bind:value={$formData.displayName}
                            bind:placeholder={$formData.name}
                        />
                    {/snippet}
                </FormControl>
                <FormFieldErrors />
            </FormField>

            <FormField {form} name="description">
                <FormControl>
                    {#snippet children({ props })}
                        <FormLabel>Description</FormLabel>
                        <Textarea {...props} bind:value={$formData.description} placeholder="Description" />
                    {/snippet}
                </FormControl>
                <FormFieldErrors />
            </FormField>

            <FormField {form} name="brand">
                <FormControl>
                    {#snippet children({ props })}
                        <FormLabel>Brand</FormLabel>
                        <Input {...props} bind:value={$formData.brand} placeholder="Brand Name" />
                    {/snippet}
                </FormControl>
                <FormFieldErrors />
            </FormField>

            <FormField {form} name="value">
                <FormControl>
                    {#snippet children({ props })}
                        <FormLabel>Value</FormLabel>
                        <Input {...props} bind:value={$formData.value} placeholder="Value" type="number" step="0.01" />
                    {/snippet}
                </FormControl>
                <FormFieldErrors />
            </FormField>

            <CategorySelect {form} name="category" label="Category" bind:value={$formData.category} allowNone />
        </CardContent>
    </Card>

    <Card>
        <CardHeader>
            <CardTitle>Custom Fields</CardTitle>
        </CardHeader>
        <CardContent>
            <CustomFields {form} bind:category={$formData.category} />
        </CardContent>
    </Card>

    <ImageUploader bind:value={$formData.images} />
</form>

<style lang="postcss">
    form {
        @apply w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 p-8;
    }
</style>
