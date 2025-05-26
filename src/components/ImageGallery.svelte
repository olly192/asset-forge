<script lang="ts">
    import { Dialog, DialogContent } from "$lib/components/ui/dialog";

    let { value }: { value: string[] } = $props();

    let viewerTarget: string | undefined = $state();
    let viewerOpen: boolean = $state(false);

    function viewImage(image: string) {
        viewerTarget = image;
        viewerOpen = true;
    }
</script>

<div class="image-gallery">
    {#each value as image, index (image)}
        <button onclick={() => viewImage(image)}>
            <img src={`/img/${image}`} alt="Uploaded image" />
        </button>
    {/each}
</div>


<Dialog bind:open={viewerOpen}>
    <DialogContent class="max-w-2xl p-0 rounded-2xl overflow-hidden">
        {#if viewerTarget}
            <img src={`/img/${viewerTarget}`} alt="Image preview" class="size-full aspect-square object-contain" />
        {/if}
    </DialogContent>
</Dialog>

<style lang="postcss">
    div.image-gallery {
        @apply grid grid-cols-3 gap-2;
        button {
            @apply w-full aspect-square overflow-hidden rounded-lg bg-muted;
            img {
                @apply size-full object-cover rounded-lg z-20;
            }
        }
        > :first-child {
            @apply col-span-full;
        }
    }
</style>
