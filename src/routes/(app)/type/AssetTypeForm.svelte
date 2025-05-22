<script lang="ts">
    import CategorySelect from "$components/select/CategorySelect.svelte";
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea";
    import type { Infer, SuperForm } from "sveltekit-superforms";
    import type { AssetTypeSchema } from "./schema";

    let { form = $bindable() }: { form: SuperForm<Infer<AssetTypeSchema>> } = $props();

    const { form: formData, enhance, allErrors } = form;
</script>

<form method="POST" use:enhance>
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
</form>
