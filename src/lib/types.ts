import type { Asset, AssetType, Category, Location, Prisma, Tag } from "@prisma/client";

export type AssetWithTags = Asset & { tags: string[] };

export type UnmappedAssetWithTags = Asset & { tags: { id: string }[] };

export type AssetWithType = Asset & { type: AssetType | null };

export type AssetWithTagsAndType = Prisma.AssetGetPayload<{ include: { type: true, tags: true } }>;

export type FullAsset = Asset & {
    location: Location | null;
    tags: Tag[];
    type: AssetType & { category: Category | null };
};

export type FullAssetType = AssetType & {
    category: Category | null
    assets: Asset[]
};

export type FullCustomField = Prisma.CustomFieldGetPayload<{ include: { tagLimit: true, categoryLimit: true } }>;
