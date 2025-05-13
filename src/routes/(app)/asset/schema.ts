import * as v from "valibot";

export const assetSchema = v.object({
    assetId: v.pipe(
        v.string("Asset ID is required"),
        v.nonEmpty("Asset ID is required"),
        v.minLength(2, "Asset ID must be at least 2 characters"),
        v.maxLength(64, "Asset ID cannot be longer than 64 characters"),
    ),
    notes: v.optional(v.string()),
    type: v.pipe(
        v.string("Type is required"),
        v.nonEmpty("Type is required")
    ),
    location: v.optional(v.string()),
    tags: v.optional(v.array(v.string()))
});

export type AssetSchema = typeof assetSchema;
