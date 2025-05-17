<script lang="ts">
    import type { FilterOption } from "$components/table/data";
    import { Button } from "$lib/components/ui/button";
    import { goto } from "$app/navigation";
    import type { Writable } from "svelte/store";

    const { value, options }: { value: string | null, options: Writable<FilterOption[]> } = $props();
    const option = $derived($options.find((option) => option.value === value));
</script>

{#if value && option}
    {#if option.url}
        <Button variant="ghost" size="sm" onclick={() => goto(option.url)}>
            <span>{option.label}</span>
        </Button>
    {:else}
        <div class="inline-flex justify-center items-center gap-2 whitespace-nowrap font-medium h-8 px-3 text-xs">
            <span>{option.label}</span>
        </div>
    {/if}
{/if}
