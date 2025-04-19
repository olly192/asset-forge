<script lang="ts">
    import type { FilterOption } from "$components/table/data";
    import Circle from "lucide-svelte/icons/circle";
    import { Button } from "$lib/components/ui/button";
    import { goto } from "$app/navigation";
    import type { Writable } from "svelte/store";

    const { value, options }: { value: string | null, options: Writable<FilterOption[]> } = $props();
    const option = $options.find((option) => option.value === value);
    const Icon = option?.icon;
</script>

{#if value && option}
    {#if option.url}
        <Button variant="ghost" size="sm" onclick={() => goto(option.url)}>
            {#if Icon}
                <Icon class="stroke-{option.color || 'neutral'}-500 size-4" />
            {:else}
                <Circle class="fill-{option.color || 'neutral'}-500 stroke-{option.color || 'neutral'}-700 size-4" />
            {/if}
            <span>{option.label}</span>
        </Button>
    {:else}
        <div class="inline-flex justify-center items-center gap-2 whitespace-nowrap font-medium h-8 px-3 text-xs">
            {#if Icon}
                <Icon class="stroke-{option.color || 'neutral'}-500 size-4" />
            {:else}
                <Circle class="fill-{option.color || 'neutral'}-500 stroke-{option.color || 'neutral'}-700 size-4" />
            {/if}
            <span>{option.label}</span>
        </div>
    {/if}
{/if}
