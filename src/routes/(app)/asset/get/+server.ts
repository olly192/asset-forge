import { prisma } from '$lib/prisma';
import type { Category, Location, Tag } from "@prisma/client";
import { auth } from '$lib/auth';
import type { AssetWithTags, UnmappedAssetWithTags } from '$lib/types';
import { error, json } from "@sveltejs/kit"

export async function GET({ request }) {
    const session = await auth.api.getSession(request);
    if (!session?.user) return error(403, "Unauthorized");

    const unmappedAssets: UnmappedAssetWithTags[] = await prisma.asset.findMany({
        where: { deleted: null },
        include: { tags: { select: { id: true } } },
        orderBy: { assetId: "asc" }
    });
    const categories: Category[] = await prisma.category.findMany({
        orderBy: { name: "asc" },
        where: { deleted: null }
    });
    const locations: Location[] = await prisma.location.findMany({
        orderBy: { name: "asc" },
        where: { deleted: null }
    });
    const tags: Tag[] = await prisma.tag.findMany({
        orderBy: { name: "asc" },
        where: { deleted: null }
    });
    const assetTypes = await prisma.assetType.findMany({
        orderBy: { name: "asc" },
        where: { deleted: null }
    });

    const assets: AssetWithTags[] = unmappedAssets.map((asset: UnmappedAssetWithTags) => ({
        ...asset, tags: asset.tags.map((tag: { id: string }) => tag.id
    )}));

    return json({ assets, categories, locations, tags, assetTypes });
}
