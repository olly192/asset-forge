<script lang="ts">
    import DatePicker from "$components/DatePicker.svelte";
    import CategorySelect from "$components/select/CategorySelect.svelte";
    import CustomFieldSelect from "$components/select/CustomFieldSelect.svelte";
    import FieldTypeSelect from "$components/select/FieldTypeSelect.svelte";
    import TagSelect from "$components/select/TagSelect.svelte";
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { Switch } from "$lib/components/ui/switch";
    import { Textarea } from "$lib/components/ui/textarea";
    import type { Infer, SuperForm } from "sveltekit-superforms";
    import SelectCreator from "$components/SelectCreator.svelte";
    import { type CustomFieldSchema } from "./schema";

    let { form = $bindable() }: { form: SuperForm<Infer<CustomFieldSchema>> } = $props();

    const { form: formData, enhance, allErrors } = form;

    $effect(() => {
        if ($formData.options.type === "boolean" && $formData.options.default === undefined) {
            $formData.options.default = false;
        }
    });
</script>

<form method="POST" use:enhance>
    <FormField {form} name="name">
        <FormControl>
            {#snippet children({ props })}
                <FormLabel>Field Name</FormLabel>
                <Input {...props} bind:value={$formData.name} placeholder="Name" />
            {/snippet}
        </FormControl>
        <FormFieldErrors />
    </FormField>

    <FormField {form} name="description">
        <FormControl>
            {#snippet children({ props })}
                <FormLabel>Field Description</FormLabel>
                <Textarea {...props} bind:value={$formData.description} placeholder="Description" />
            {/snippet}
        </FormControl>
        <FormFieldErrors />
    </FormField>

    <FieldTypeSelect {form} name="type" label="Field Type" bind:value={$formData.options.type} />

    {#if $formData.options.type === "string"}
        <div class="type-options">
            <FormField {form} name="options.placeholder">
                <FormControl>
                    {#snippet children({ props })}
                        <FormLabel>Field Placeholder</FormLabel>
                        <Input {...props} bind:value={$formData.options.placeholder} placeholder="Placeholder" />
                    {/snippet}
                </FormControl>
                <FormFieldErrors />
            </FormField>
            <FormField {form} name="options.default">
                <FormControl>
                    {#snippet children({ props })}
                        <FormLabel>Default Value</FormLabel>
                        <Input {...props} bind:value={$formData.options.default} placeholder="No default" />
                    {/snippet}
                </FormControl>
                <FormFieldErrors />
            </FormField>
        </div>

    {:else if $formData.options.type === "number"}
        <div class="type-options">
            <FormField {form} name="options.placeholder">
                <FormControl>
                    {#snippet children({ props })}
                        <FormLabel>Field Placeholder</FormLabel>
                        <Input {...props} bind:value={$formData.options.placeholder} placeholder="Placeholder" />
                    {/snippet}
                </FormControl>
                <FormFieldErrors />
            </FormField>
            <FormField {form} name="options.step">
                <FormControl>
                    {#snippet children({ props })}
                        <FormLabel>Step</FormLabel>
                        <Input {...props} bind:value={$formData.options.step} placeholder="Input step" type="string" />
                    {/snippet}
                </FormControl>
                <FormFieldErrors />
            </FormField>
            <FormField {form} name="options.default">
                <FormControl>
                    {#snippet children({ props })}
                        <FormLabel>Default Value</FormLabel>
                        <Input
                            {...props} bind:value={$formData.options.default} placeholder="No default"
                            type="number" step={$formData.options.step}
                        />
                    {/snippet}
                </FormControl>
                <FormFieldErrors />
            </FormField>
        </div>

    {:else if $formData.options.type === "boolean"}
        <div class="type-options">
            <FormField {form} name="options.default">
                <FormControl>
                    {#snippet children({ props })}
                        <div class="flex flex-row items-center gap-4 mt-2">
                            <FormLabel>Default Value</FormLabel>
                            {#if $formData.options.default !== undefined}
                                <Switch {...props} bind:checked={$formData.options.default} placeholder="Default" />
                            {/if}
                        </div>
                    {/snippet}
                </FormControl>
                <FormFieldErrors />
            </FormField>
        </div>

    {:else if $formData.options.type === "date"}
        <div class="type-options">
            <FormField {form} name="options.placeholder">
                <FormControl>
                    {#snippet children({ props })}
                        <FormLabel>Field Placeholder</FormLabel>
                        <Input {...props} bind:value={$formData.options.placeholder} placeholder="Placeholder" />
                    {/snippet}
                </FormControl>
                <FormFieldErrors />
            </FormField>
            <FormField {form} name="options.default">
                <FormControl>
                    {#snippet children({ props })}
                        <div class="flex flex-col gap-2">
                            <FormLabel>Default Value</FormLabel>
                            <DatePicker {...props} bind:value={$formData.options.default} placeholder="Default Date" />
                        </div>
                    {/snippet}
                </FormControl>
                <FormFieldErrors />
            </FormField>
        </div>
    {:else if $formData.options.type === "select"}
        <div class="type-options">
            <FormField {form} name="options.placeholder">
                <FormControl>
                    {#snippet children({ props })}
                        <FormLabel>Field Placeholder</FormLabel>
                        <Input {...props} bind:value={$formData.options.placeholder} placeholder="Placeholder" />
                    {/snippet}
                </FormControl>
                <FormFieldErrors />
            </FormField>

            <SelectCreator bind:value={$formData.options.options} />

            <CustomFieldSelect {form} name="options.default" label="Default Value"
                bind:value={$formData.options.default} options={$formData.options.options} allowNone
            />
        </div>

    {:else if $formData.options.type === "textarea"}
        <div class="type-options">
            <FormField {form} name="options.placeholder">
                <FormControl>
                    {#snippet children({ props })}
                        <FormLabel>Field Placeholder</FormLabel>
                        <Input {...props} bind:value={$formData.options.placeholder} placeholder="Placeholder" />
                    {/snippet}
                </FormControl>
                <FormFieldErrors />
            </FormField>
            <FormField {form} name="options.default">
                <FormControl>
                    {#snippet children({ props })}
                        <FormLabel>Default Value</FormLabel>
                        <Textarea {...props} bind:value={$formData.options.default} placeholder="No default" />
                    {/snippet}
                </FormControl>
                <FormFieldErrors />
            </FormField>
        </div>

    {:else}
        <div class="aspect-video border border-border border-dashed rounded-md flex justify-center items-center">
            <span class="text-muted-foreground">Select a field type to view field options.</span>
        </div>
    {/if}

    <FormField {form} name="perInstance">
        <FormControl>
            {#snippet children({ props })}
                <div class="flex flex-row items-center gap-4 mt-4">
                    <FormLabel>Per Instance</FormLabel>
                    <Switch {...props} bind:checked={$formData.perInstance} placeholder="Per Instance" />
                </div>
            {/snippet}
        </FormControl>
        <FormFieldErrors />
    </FormField>

    <CategorySelect
        {form} name="categoryLimit" label="Limit to Category" bind:value={$formData.categoryLimit} allowNone
    />
    <TagSelect {form} name="tagLimit" label="Limit to Tags" bind:value={$formData.tagLimit} />
</form>

<style lang="postcss">
    .type-options {
        @apply flex flex-col gap-2 p-4;
        @apply border border-border rounded-md;
    }
</style>
