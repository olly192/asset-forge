<script lang="ts">
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Circle, Edit } from "lucide-svelte";
    import { Textarea } from "$lib/components/ui/textarea"
    import { goto } from "$app/navigation";
    import type { PageProps } from './$types';
    import { Label } from "$lib/components/ui/label";
    import type { FullAsset } from "$lib/types";
    import { nameToIcon } from "$lib/utils";
    import { Badge } from "$lib/components/ui/badge";

    let { data }: PageProps = $props();
    const { asset }: { asset: FullAsset } = data;

    $breadcrumbs = [
        { label: "Assets", href: "/asset" },
        { label: asset.name, href: `/asset/${asset.id}` }
    ];
    $header = headerSnippet;
</script>

{#snippet headerSnippet()}
    <div class="header">
        <h1>{asset.name}</h1>
        <Button onclick={() => goto(`/asset/${asset.id}/edit`)}>
            <Edit /> Edit
        </Button>
    </div>
{/snippet}

<main class="w-full max-w-lg m-8">
    <Card>
        <CardHeader>
            <CardTitle>New Category</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2">
            <div class="space-y-2">
                <Label>Asset Name</Label>
                <Input value={asset.name} readonly />
            </div>

            <div class="space-y-2">
                <Label>Description</Label>
                <Textarea value={asset.description} readonly />
            </div>

            <div class="flex flex-col items-start gap-2">
                <Label>Category</Label>
                {#if asset.category}
                    {@const CategoryIcon = nameToIcon(asset.category.icon)}
                    <Button variant="outline" size="sm" onclick={() => goto(`/category/${asset.category.id}/edit`)}>
                        <CategoryIcon class="stroke-{asset.category.color}-500 size-4" />
                        <span>{asset.category.name}</span>
                    </Button>
                {:else}
                    <Button variant="outline" size="sm" disabled>
                        <Circle class="stroke-neutral-700 size-4" />
                        <span class="opacity-60">No Category</span>
                    </Button>
                {/if}
            </div>

            <div class="flex flex-col items-start gap-2">
                <Label>Location</Label>
                {#if asset.location}
                    {@const LocationIcon = nameToIcon(asset.location.icon)}
                    <Button variant="outline" size="sm" onclick={() => goto(`/location/${asset.location.id}/edit`)}>
                        <LocationIcon class="stroke-{asset.location.color}-500 size-4" />
                        <span>{asset.location.name}</span>
                    </Button>
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
                </div>
            </div>
        </CardContent>
    </Card>
</main>

