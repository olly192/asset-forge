<script lang="ts">
    import type { FilterOption } from "$components/table/data";
    import { Circle } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import { goto } from "$app/navigation";
    import type { Component } from "svelte";
    const { option }: { option: FilterOption } = $props();
    const Icon = $derived(option.icon);
</script>

{#snippet renderIcon(IconElement: Component, option: FilterOption)}
    {#if IconElement}
        <IconElement class="stroke-{option.color || 'neutral'}-500 size-4" />
    {:else}
        <Circle class="fill-{option.color || 'neutral'}-500 stroke-{option.color || 'neutral'}-700 size-4" />
    {/if}
{/snippet}


{#if option}
    <div class="flex items-center">
        {#if option.url}
            <Button variant="ghost" size="sm" onclick={() => goto(option.url)}>
                {@render renderIcon(Icon, option)}
                <span>{option.label}</span>
            </Button>
        {:else}
            <div class="inline-flex justify-center items-center gap-2 whitespace-nowrap font-medium h-8 px-3 text-xs">
                {@render renderIcon(Icon, option)}
                <span>{option.label}</span>
            </div>
        {/if}
    </div>
{/if}
