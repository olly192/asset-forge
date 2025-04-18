<script lang="ts">
    import { Button } from "$lib/components/ui/button"
    import { Plus, Minus } from "lucide-svelte"
    import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "$lib/components/ui/collapsible"
    import type { TreeElement } from "$components/tree/tree"
    import type { Snippet } from "svelte"

    let { tree, actions }: { tree: TreeElement[], actions: Snippet<[{ id: string }]> } = $props();
</script>

<div class="tree-view">
    {#each tree as item}
        {@render Tree(item)}
    {/each}
</div>

{#snippet Tree({ id, name, children, icon: Icon, color }: TreeElement)}
    {#if !children || children.length === 0}
        <div class="tree-item">
            <div>
                <Icon class="stroke-{color || 'neutral'}-500 size-4 ml-2" />
                {name}
            </div>
            <div>
                {@render actions({ id })}
            </div>
        </div>
    {:else}
        <Collapsible
            open={true} class="group/collapsible
            [&[data-state=open]>div>div>button>svg.tree-expand]:hidden
            [&[data-state=closed]>div>div>button>svg.tree-collapse]:hidden"
        >
            <CollapsibleTrigger>
                {#snippet child({ props })}
                    <div class="tree-item">
                        <div>
                            <Button {...props} variant="ghost" size="icon-sm">
                                <Plus class="tree-expand size-4" />
                                <Minus class="tree-collapse size-4" />
                            </Button>
                            <Icon class="stroke-{color || 'neutral'}-500 size-4 ml-1" />
                            {name}
                        </div>
                        <div>
                            {@render actions({ id })}
                        </div>
                    </div>
                {/snippet}
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div class="tree-content">
                    {#each children as child}
                        {@render Tree(child)}
                    {/each}
                </div>
            </CollapsibleContent>
        </Collapsible>
    {/if}
{/snippet}

<style lang="postcss">
    .tree-view {
        @apply flex flex-col;
        .tree-item {
            @apply w-full flex flex-row justify-between items-center p-1;
            @apply rounded-lg text-sm font-medium whitespace-nowrap;
            @apply focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-1;
            @apply hover:bg-accent/50 hover:text-accent-foreground transition-colors;
            div {
                @apply flex flex-row items-center gap-2;
            }
        }
        .tree-content {
            @apply flex flex-col ml-5 pl-4;
            @apply border-l border-l-border;
        }
    }
</style>