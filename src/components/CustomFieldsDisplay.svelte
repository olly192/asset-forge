<script lang="ts">
    import DatePicker from "$components/DatePicker.svelte";
    import CustomFieldSelect from "$components/select/CustomFieldSelect.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Switch } from "$lib/components/ui/switch";
    import { Textarea } from "$lib/components/ui/textarea";
    import type { CustomField, CustomFieldTypeValue } from "@prisma/client";

    let { id = $bindable(), endpoint }: { id: string, endpoint: string } = $props();

    let fields: CustomField[] = $state([])
    let values: Record<string, any> = $state({})

    async function fetchCustomFields() {
        const resp = await fetch(`${endpoint}?id=${id}`);
        const { customFields, customFieldValues } = await resp.json();
        fields = customFields || [];
        customFields.forEach((field: CustomField) => {
            const value = customFieldValues.find((val: CustomFieldTypeValue) => val.customFieldId === field.id);
            values[field.id] = value ? value.value : (field.options?.default || "");
        });
    }

    $effect(() => id && fetchCustomFields());
</script>

{#each fields as field}
    {#if field.type === "string"}
        <div class="space-y-2 my-2">
            <Label>{field.name}</Label>
            <Input
                bind:value={values[field.id]}
                placeholder={field.options.placeholder || ""} readonly
            />
        </div>

    {:else if field.type === "number"}
        <div class="space-y-2 my-2">
            <Label>{field.name}</Label>
            <Input
                bind:value={values[field.id]} type="number"
                placeholder={field.options.placeholder || ""} readonly
            />
        </div>

    {:else if field.type === "boolean"}
        <div class="flex flex-row items-center gap-4 my-2">
            <Label>{field.name}</Label>
            {#if values[field.id] !== undefined}
                <Switch bind:checked={values[field.id]} readonly />
            {/if}
        </div>

    {:else if field.type === "date"}
        <div class="flex flex-col gap-2 space-y-2 my-2">
            <Label>{field.name}</Label>
            <DatePicker
                bind:value={values[field.id]}
                placeholder={field.options.placeholder || ""} readonly
            />
        </div>

    {:else if field.type === "select"}
        <CustomFieldSelect
            name={field.id} label={field.name} options={field.options.options} allowNone
            bind:value={values[field.id]} readonly
        />

    {:else if field.type === "textarea"}
        <div class="space-y-2 my-2">
            <Label>{field.name}</Label>
            <Textarea
                bind:value={fields[field.id]}
                placeholder={field.options.placeholder || ""} readonly
            />
        </div>
    {/if}
{/each}