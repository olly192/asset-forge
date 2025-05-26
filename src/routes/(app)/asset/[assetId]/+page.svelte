<script lang="ts">
    import ImageGallery from "$components/ImageGallery.svelte";
    import NestedItems from "$components/NestedItems.svelte";
    import IdCell from "$components/table/cell/IdCell.svelte";
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import type { Category, Location } from "@prisma/client";
    import { Circle, Pencil, PencilRuler } from "lucide-svelte";
    import { Textarea } from "$lib/components/ui/textarea"
    import { goto } from "$app/navigation";
    import { Label } from "$lib/components/ui/label";
    import type { FullAsset } from "$lib/types";
    import { Badge } from "$lib/components/ui/badge";

    let { data }: { data: { asset: FullAsset, locations: Location[], categories: Category[] } } = $props();
    const { asset, locations, categories }: { asset: FullAsset, locations: Location[], categories: Category[] } = data;

    $breadcrumbs = [
        { label: "Assets", href: "/asset" },
        { label: `${asset.type.name} (${asset.assetId})`, href: `/asset/${asset.id}` }
    ];
    $header = headerSnippet;
</script>

{#snippet headerSnippet()}
    <div class="header">
        <h1 class="flex flex-row items-center gap-4">
            <span>{asset.type.name}</span>
            <IdCell value={asset.assetId} class="bg-muted/50 p-1 pl-3 rounded-lg text-xl font-medium" />
        </h1>
        <div>
            <Button onclick={() => goto(`/asset/${asset.id}/edit`)}>
                <Pencil /> Edit Instance
            </Button>
            <Button onclick={() => goto(`/type/${asset.typeId}/edit`)} variant="secondary">
                <PencilRuler /> Edit Type
            </Button>
        </div>
    </div>
{/snippet}

<main class="w-full p-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
    <Card>
        <CardHeader>
            <CardTitle>Asset Details</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2">
            <div class="space-y-2">
                <Label>Asset ID</Label>
                <Input value={asset.assetId} readonly />
            </div>

            <div class="space-y-2">
                <Label>Notes</Label>
                <Textarea value={asset.notes} placeholder="Asset Notes" readonly />
            </div>

            <div class="flex flex-col items-start gap-2">
                <Label>Location</Label>
                {#if asset.location}
                    <NestedItems
                        id={asset.location.id} items={locations}
                        url={id => `/location/${id}/edit`}
                    />
                {:else}
                    <Button variant="outline" size="sm" disabled>
                        <Circle class="stroke-neutral-700 size-4" />
                        <span class="opacity-60">No Location</span>
                    </Button>
                {/if}
            </div>

            <div class="space-y-2">
                <Label>Tags</Label>
                <div class="flex flex-row gap-2">
                    {#each asset.tags as tag}
                        <Badge
                            variant="outline" onclick={() => goto(`/tag/${tag.id}/edit`)}
                            class="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-full p-1.5 pr-3"
                        >
                            <Circle class="fill-{tag.color || 'neutral'}-500 stroke-{tag.color || 'neutral'}-700 mr-2 size-4" />
                            <span>{tag.name}</span>
                        </Badge>
                    {/each}
                    {#if asset.tags.length === 0}
                        <Button variant="ghost" disabled>
                            <Circle class="stroke-neutral-500 size-4" /> No Tags Assigned
                        </Button>
                    {/if}
                </div>
            </div>
        </CardContent>
    </Card>

    <Card>
        <CardHeader>
            <CardTitle>Asset Type</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2">
            <div class="space-y-2">
                <Label>Name</Label>
                <Input value={asset.type.name} readonly />
            </div>

            <div class="space-y-2">
                <Label>Description</Label>
                <Textarea value={asset.type.description} placeholder="Asset Description" readonly />
            </div>

            <div class="flex flex-col items-start gap-2">
                <Label>Category</Label>
                {#if asset.type.category}
                    <NestedItems
                        id={asset.type.category.id} items={categories}
                        url={id => `/category/${id}/edit`}
                    />
                {:else}
                    <Button variant="outline" size="sm" disabled>
                        <Circle class="stroke-neutral-700 size-4" />
                        <span class="opacity-60">No Category</span>
                    </Button>
                {/if}
            </div>
        </CardContent>
    </Card>

    <Card>
        <CardHeader>
            <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2">
            <ImageGallery value={asset.type.images} />
        </CardContent>
    </Card>
</main>

