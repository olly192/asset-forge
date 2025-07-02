import { prisma } from '$lib/prisma';
import type { Session } from "@auth/sveltekit";
import type { Category, CustomFieldAssetValue, Location, Tag } from "@prisma/client";
import type { AssetWithTags, AssetWithTagsAndType, FullCustomField, UnmappedAssetWithTags } from "$lib/types";
import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event: RequestEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return error(403, "Unauthorized");

    const assetId: string | null = event.url.searchParams.get("id");
    if (assetId) {
        const asset: AssetWithTagsAndType | null = await prisma.asset.findUnique({
            where: { id: assetId, deleted: null },
            include: { type: true, tags: true }
        });
        if (!asset) return error(404, "Asset not found");

        let assetCustomFields: FullCustomField[] = await prisma.customField.findMany({
            where: { deleted: null, archived: false, perInstance: true },
            orderBy: { name: "asc" },
            include: { tagLimit: true, categoryLimit: true }
        })
        const tags: string[] = asset.tags.map((tag: Tag) => tag.id);
        assetCustomFields = assetCustomFields.filter((field: FullCustomField) => (
            (
                !field.categoryLimit
                || field.categoryLimitId === (asset.type?.categoryId || null)
            ) && (
                !field.perInstance
                || field.tagLimit.length === 0
                || field.tagLimit.some((tag: Tag) => tags.includes(tag.id))
            )
        ));
        const assetCustomFieldValues: CustomFieldAssetValue[] = await prisma.customFieldAssetValue.findMany({
            where: { assetId }
        })
        return json({ asset, customFields: assetCustomFields, customFieldValues: assetCustomFieldValues });
    }

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
