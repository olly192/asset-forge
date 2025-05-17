<script lang="ts">
    import type { FilterOption } from "$components/table/data";
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "$lib/components/ui/tooltip";
    import { ChevronRight, Circle } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import { goto } from "$app/navigation";
    import type { Component } from "svelte";
    import type { Writable } from "svelte/store";

    const { value, options }: { value: string | null, options: Writable<FilterOption[]> } = $props();
    const option = $derived($options.find((option) => option.value === value));
    const Icon = $derived(option?.icon);
    const parents: FilterOption[] = $derived.by(() => {
        let parentOptions = [];
        if (option) {
            let currentOption = option;
            while (currentOption.parent) {
                parentOptions.push(currentOption.parent);
                currentOption = currentOption.parent;
            }
            parentOptions.reverse();
        }
        return parentOptions;
    });

</script>

{#snippet renderIcon(IconElement: Component, option: FilterOption)}
    {#if IconElement}
        <IconElement class="stroke-{option.color || 'neutral'}-500 size-4" />
    {:else}
        <Circle class="fill-{option.color || 'neutral'}-500 stroke-{option.color || 'neutral'}-700 size-4" />
    {/if}
{/snippet}


{#if value && option}
    <div class="flex items-center">
        {#if parents.length > 0}
            {#each parents as parent}
                {@const ParentIcon = parent.icon}
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button variant="ghost" size="icon" onclick={() => goto(parent.url)}>
                                {@render renderIcon(ParentIcon, parent)}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent class="bg-muted">{parent.label}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <ChevronRight class="stroke-muted-foreground size-4" />
            {/each}
        {/if}
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
