<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Dialog, DialogContent } from "$lib/components/ui/dialog";
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "$lib/components/ui/tooltip";
    import { LoaderCircle, Replace, Trash, Upload } from "lucide-svelte";
    import { flip } from 'svelte/animate';

    let { value = $bindable() }: { value: string[] } = $props();
    if (!value) value = [];

    import { draggable, droppable, type DragDropState } from '@thisux/sveltednd';

    function handleDrop(state: DragDropState) {
        const { draggedItem, sourceContainer, targetContainer } = state;
        if (!targetContainer || sourceContainer === targetContainer) return;
        value = value.filter(card => card !== draggedItem);
        value.splice(parseInt(targetContainer), 0, draggedItem);
    }

    const removeImage = (img: string) => value = value.filter(i => i !== img);

    let fileUploader: HTMLInputElement;
    let uploadLoading = $state(false);
    let uploadTarget: string | undefined = $state();
    let viewerTarget: string | undefined = $state();
    let viewerOpen: boolean = $state(false);

    function openUploadDialog(replace?: string) {
        if (uploadLoading) return;
        uploadTarget = replace;
        fileUploader.click();
    }

    async function uploadFile() {
        if (!fileUploader) return;
        if (!fileUploader.files || fileUploader.files.length !== 1) return;
        uploadLoading = true;
        const file = fileUploader.files[0];
        const form = new FormData();
        form.append("image", file);

        const resp = await fetch("/img/upload", {
            method: "POST",
            body: form,
            headers: { "Accept": "application/json" }
        })

        if (!resp.ok) {
            uploadLoading = false;
            toast.error("Image upload failed.");
            return;
        }

        const { data } = await resp.json();
        const id = JSON.parse(data)[0];
        value = uploadTarget ? value.map(img => img === uploadTarget ? id : img) : [...value, id];
        uploadLoading = false;
    }

    function viewImage(image: string) {
        viewerTarget = image;
        viewerOpen = true;
    }
</script>

<Card>
    <CardHeader class="flex flex-row justify-between items-center space-y-0">
        <CardTitle>Images</CardTitle>
        <Button variant="outline" size="sm" onclick={() => openUploadDialog()} disabled={uploadLoading}>
            {#if uploadLoading}
                <LoaderCircle class="size-4 animate-spin" />
            {:else}
                <Upload class="size-4" />
            {/if}
            Upload
        </Button>
    </CardHeader>
    <CardContent>
        <input bind:this={fileUploader} type="file" accept="image/*" class="hidden" onchange={uploadFile} />
        <div class="image-gallery">
            {#each value as image, index (image)}
                <div
                    use:droppable={{ container: index.toString(), callbacks: { onDrop: handleDrop } }}
                    animate:flip={{ duration: 300 }}
                >
                    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
                    <div
                        use:draggable={{ container: index.toString(), dragData: image, interactive: [".interactive"] }}
                        class="group" onclick={() => viewImage(image)}
                    >
                        <img src={`/img/${image}`} alt="Uploaded image" />
                        <div class="interactive -bottom-16 group-hover:bottom-0">
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button
                                            variant="outline" size="icon" disabled={uploadLoading}
                                            onclick={() => openUploadDialog(image)}
                                        >
                                            {#if uploadLoading}
                                                <LoaderCircle class="size-4 animate-spin" />
                                            {:else}
                                                <Replace class="size-4" />
                                            {/if}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent class="bg-muted">Replace image</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button variant="outline" size="icon" onclick={() => removeImage(image)}>
                                            <Trash class="size-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent class="bg-muted">Remove image</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </CardContent>
</Card>

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
        > div {
            @apply relative w-full aspect-square overflow-hidden;
            @apply rounded-lg transition-all duration-300 ease-in-out;
            > div {
                @apply relative size-full cursor-move bg-muted rounded-lg;
                @apply hover:shadow-lg active:scale-95;
                @apply transition-all duration-300 ease-in-out;
                > img {
                    @apply absolute inset-0 size-full object-cover rounded-lg z-20;
                }
                > div {
                    @apply absolute right-0 p-2 z-30;
                    @apply flex justify-center items-center gap-2;
                    @apply transition-all duration-300 ease-in-out;
                }
            }
        }
        > div:first-child {
            @apply col-span-full;
        }
    }
</style>
