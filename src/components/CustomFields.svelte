<script lang="ts">
    import { page } from "$app/state";
    import DatePicker from "$components/DatePicker.svelte";
    import CustomFieldSelect from "$components/select/CustomFieldSelect.svelte";
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { Switch } from "$lib/components/ui/switch";
    import { Textarea } from "$lib/components/ui/textarea";
    import type { FullCustomField } from "$lib/types";
    import type { Infer, SuperForm } from "sveltekit-superforms";

    let {
        form = $bindable(),
        category = $bindable(),
        tags = $bindable(),
        readonly = false,
        customFieldSet = "customFields"
    }: {
        form: SuperForm<Infer<any>>,
        category?: string,
        tags: string[],
        readonly?: boolean,
        customFieldSet?: string
    } = $props();

    const { form: formData } = form;

    let customFields = $derived(page.data[customFieldSet].filter((field: FullCustomField) => {
        return (
            (!field.categoryLimit || field.categoryLimitId === category) &&
            (!field.perInstance || field.tagLimit.length === 0 || field.tagLimit.some(tag => tags.includes(tag.id)))
        )
    }));
</script>

{#each customFields as field}
    {#if field.type === "string"}
        <FormField {form} name={field.id}>
            <FormControl>
                {#snippet children({ props })}
                    <FormLabel>{field.name}</FormLabel>
                    <Input
                        {...props} bind:value={$formData[customFieldSet][field.id]}
                        placeholder={field.options.placeholder || ""} {readonly}
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
                        {...props} bind:value={$formData[customFieldSet][field.id]} type="number"
                        step={field.options.step} placeholder={field.options.placeholder || ""} {readonly}
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
                        {#if $formData[customFieldSet][field.id] !== undefined}
                            <Switch {...props} bind:checked={$formData[customFieldSet][field.id]} {readonly} />
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
                            {...props} bind:value={$formData[customFieldSet][field.id]}
                            placeholder={field.options.placeholder || ""} {readonly}
                        />
                    </div>
                {/snippet}
            </FormControl>
            <FormFieldErrors />
        </FormField>

    {:else if field.type === "select"}
        <CustomFieldSelect
            {form} name={field.id} label={field.name} options={field.options.options} allowNone
            bind:value={$formData[customFieldSet][field.id]} {readonly}
        />

    {:else if field.type === "textarea"}
        <FormField {form} name={field.id}>
            <FormControl>
                {#snippet children({ props })}
                    <FormLabel>{field.name}</FormLabel>
                    <Textarea
                        {...props} bind:value={$formData[customFieldSet][field.id]}
                        placeholder={field.options.placeholder || ""} {readonly}
                    />
                {/snippet}
            </FormControl>
            <FormFieldErrors />
        </FormField>
    {/if}
{/each}