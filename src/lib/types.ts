import type { Asset, AssetType, Category, Location, Tag } from "@prisma/client";

export type AssetWithTags = Asset & { tags: string[] };
export type UnmappedAssetWithTags = Asset & { tags: { id: string }[] };
export type FullAsset = Asset & {
    location: Location | null;
    tags: Tag[];
    type: AssetType & { category: Category | null };
};
