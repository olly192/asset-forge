import type { Asset } from "@prisma/client";

export type AssetWithTags = Asset & { tags: string[] };
export type UnmappedAssetWithTags = Asset & { tags: { id: string }[] };