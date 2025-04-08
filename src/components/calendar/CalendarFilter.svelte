<script lang="ts">
    import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover";
    import { Button } from "$lib/components/ui/button";
    import {
        Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
    } from "$lib/components/ui/command";
    import { Check, ChevronDown, X } from "lucide-svelte";
    import { Badge } from "$lib/components/ui/badge";

    let { assets, categories, selectedAssetIds }: {
        assets: { id: string, name: string, category: string }[],
        categories: { id: string, name: string, icon: any }[],
        selectedAssetIds: string[]
    } = $props();

    let selectedAssets = $derived(assets.filter(asset => selectedAssetIds.includes(asset.id)));
    let assetSelectorOpen: boolean = $state(false);

    function clickAsset(id: string) {
        selectedAssetIds = selectedAssetIds.includes(id)
            ? selectedAssetIds.filter(assetId => assetId !== id)
            : [...selectedAssetIds, id]
    }
</script>

<div class="calendar-filter">
    <Popover>
        <PopoverTrigger>
            {#snippet child({ props })}
                <Button
                    variant="outline" class="flex flex-row justify-between w-64" role="combobox"
                    aria-expanded={assetSelectorOpen} {...props}
                >
                    <span>
                        {#if selectedAssetIds.length === 0}
                            Filter Assets
                        {:else if selectedAssetIds.length === 1}
                            <Badge variant="outline" class="font-mono mr-1 -ml-2">{selectedAssets[0].id}</Badge>
                            {selectedAssets[0].name}
                        {:else}
                            {selectedAssets.length} Assets Selected
                        {/if}
                    </span>
                    <ChevronDown class="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            {/snippet}
        </PopoverTrigger>
        <PopoverContent class="w-64 p-0">
            <Command>
                <CommandInput placeholder="Search Assets" />
                <CommandList>
                    <CommandEmpty>No assets found.</CommandEmpty>
                    {#each categories as category}
                        <CommandGroup>
                            {#snippet headingSnippet()}
                                <category.icon class="size-3" />
                                {category.name}
                            {/snippet}

                            {#each assets.filter(asset => asset.category === category.id) as asset}
                                <CommandItem
                                    value={asset.id} onclick={() => clickAsset(asset.id)} class="group w-full"
                                >
                                    <Badge
                                        variant="outline" class="font-mono group-aria-selected:border-muted-foreground"
                                    >
                                        {asset.id}
                                    </Badge>
                                    {asset.name}

                                    {#if selectedAssetIds.includes(asset.id)}
                                        <Check class="ml-auto mr-1 size-4" />
                                    {/if}
                                </CommandItem>
                            {/each}
                        </CommandGroup>
                    {/each}
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
    <Button variant="outline" size="icon" onclick={() => selectedAssetIds = []}>
        <X />
    </Button>
</div>

<style lang="postcss">
    .calendar-filter {
        @apply flex flex-row items-center gap-2;
    }
</style>