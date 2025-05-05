<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Color } from "$components/table/data";
    import { Button } from "$lib/components/ui/button";
    import { nameToIcon } from "$lib/utils";
    import type { Location } from "@prisma/client";
    import { CornerDownRight } from "lucide-svelte";

    const { id, items, url }: {
        id: string,
        items: { id: string, parentId: string, icon: string, color: Color, name: string }[],
        url: (id: string) => string
    } = $props();

    let itemPointer = items.find(item => item.id === id);
    let itemChain = $state<Location[]>([itemPointer]);
    while (itemPointer.parentId !== null) {
        itemPointer = items.find(item => item.id === itemPointer.parentId);
        itemChain.push(itemPointer);
    }
    itemChain = itemChain.reverse();
</script>

<div class="flex flex-col justify-start gap-1">
    {#each itemChain as item, index}
        {@const LocationIcon = nameToIcon(item.icon)}
        <div class="flex flex-row items-center gap-1">
            {#if index !== 0}
                <CornerDownRight class="stroke-neutral-500 size-5 mb-1" style="margin-left: {(index-1)*2.25 + 1}rem" />
            {/if}
            <Button variant="outline" size="sm" onclick={() => goto(url(item.id))}>
                <LocationIcon class="stroke-{item.color}-500 size-4" />
                <span>{item.name}</span>
            </Button>
        </div>
    {/each}
</div>
