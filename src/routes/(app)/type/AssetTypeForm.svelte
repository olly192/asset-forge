<script lang="ts">
    import { page } from "$app/state";
    import DatePicker from "$components/DatePicker.svelte";
    import ImageUploader from "$components/ImageUploader.svelte";
    import CategorySelect from "$components/select/CategorySelect.svelte";
    import CustomFieldSelect from "$components/select/CustomFieldSelect.svelte";
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Switch } from "$lib/components/ui/switch";
    import { Textarea } from "$lib/components/ui/textarea";
    import type { Infer, SuperForm } from "sveltekit-superforms";
    import type { FullCustomField } from "../field/columns";
    import type { AssetTypeSchema } from "./schema";

    let { form = $bindable() }: { form: SuperForm<Infer<AssetTypeSchema>> } = $props();

    const { form: formData, enhance, allErrors } = form;

    let customFields = $derived(page.data.customFields.filter((field: FullCustomField) => {
        return !field.categoryLimit || $formData.category === field.categoryLimit.id
    }));
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
            {#each customFields as field}
                {#if field.type === "string"}
                    <FormField {form} name={field.id}>
                        <FormControl>
                            {#snippet children({ props })}
                                <FormLabel>{field.name}</FormLabel>
                                <Input
                                    {...props} bind:value={$formData.customFields[field.id]}
                                    placeholder={field.options.placeholder || ""}
                                />
                            {/snippet}
                        </FormControl>
                        <FormFieldErrors />
                    </FormField>

                {:else if field.type === "number"}
                    <FormField {form} name={field.id}>
                        <FormControl>
                            {#snippet children({ props })}
                                <FormLabel>{field.name}</FormLabel>
                                <Input
                                    {...props} bind:value={$formData.customFields[field.id]} type="number"
                                    step={field.options.step} placeholder={field.options.placeholder || ""}
                                />
                            {/snippet}
                        </FormControl>
                        <FormFieldErrors />
                    </FormField>

                {:else if field.type === "boolean"}
                    <FormField {form} name={field.id}>
                        <FormControl>
                            {#snippet children({ props })}
                                <div class="flex flex-row items-center gap-4 mt-2">
                                    <FormLabel>{field.name}</FormLabel>
                                    {#if $formData.customFields[field.id] !== undefined}
                                        <Switch {...props} bind:checked={$formData.customFields[field.id]} />
                                    {/if}
                                </div>
                            {/snippet}
                        </FormControl>
                        <FormFieldErrors />
                    </FormField>

                {:else if field.type === "date"}
                    <FormField {form} name={field.id}>
                        <FormControl>
                            {#snippet children({ props })}
                                <div class="flex flex-col gap-2">
                                    <FormLabel>{field.name}</FormLabel>
                                    <DatePicker
                                        {...props} bind:value={$formData.customFields[field.id]}
                                        placeholder={field.options.placeholder || ""}
                                    />
                                </div>
                            {/snippet}
                        </FormControl>
                        <FormFieldErrors />
                    </FormField>

                {:else if field.type === "select"}
                    <CustomFieldSelect
                        {form} name={field.id} label={field.name} options={field.options.options} allowNone
                        bind:value={$formData.customFields[field.id]}
                    />

                {:else if field.type === "textarea"}
                    <FormField {form} name={field.id}>
                        <FormControl>
                            {#snippet children({ props })}
                                <FormLabel>{field.name}</FormLabel>
                                <Textarea
                                    {...props} bind:value={$formData.customFields[field.id]}
                                    placeholder={field.options.placeholder || ""}
                                />
                            {/snippet}
                        </FormControl>
                        <FormFieldErrors />
                    </FormField>
                {/if}
            {/each}
        </CardContent>
    </Card>

    <ImageUploader bind:value={$formData.images} />
</form>

<style lang="postcss">
    form {
        @apply w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 p-8;
    }
</style>
