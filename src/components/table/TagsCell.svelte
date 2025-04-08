<script lang="ts">
    import type { FilterOption } from "$components/table/data";
    import { Circle } from "lucide-svelte";
    import { Badge } from "$lib/components/ui/badge";
    import { goto } from "$app/navigation";

    const { value, options }: { value: string[], options: FilterOption[] } = $props();
    const tags = options.filter((option) => value.includes(option.value));
    // TODO: Limit display to 2/3 tags
</script>

{#if tags}
    <div class="flex flex-row gap-2">
        {#each tags.slice(0, 3) as tag}
            {#if tag.url}
                <Badge
                    variant="outline" onclick={() => goto(tag.url)}
                    class="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-full p-1.5 pr-2"
                >
                    <Circle class="fill-{tag.color || 'neutral'}-500 stroke-{tag.color || 'neutral'}-700 mr-2 size-4" />
                    <span>{tag.label}</span>
                </Badge>
            {:else}
                <Badge variant="outline" class="rounded-full p-1.5 pr-2">
                    <Circle class="fill-{tag.color || 'neutral'}-500 stroke-{tag.color || 'neutral'}-700 mr-2 size-4" />
                    <span>{tag.label}</span>
                </Badge>
            {/if}
        {/each}
        {#if tags.length > 3}
            <Badge variant="outline" class="rounded-full p-1.5 pr-2">
                <span>+{tags.length - 3} more</span>
            </Badge>
        {/if}
    </div>
{/if}
