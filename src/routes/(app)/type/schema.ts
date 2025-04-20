import * as v from "valibot";

export const assetTypeSchema = v.object({
    name: v.pipe(
        v.string("Name is required"),
        v.nonEmpty("Name is required"),
        v.minLength(2, "Name must be at least 2 characters"),
        v.maxLength(64, "Name cannot be longer than 64 characters"),
    ),
    description: v.optional(v.string()),
    category: v.optional(v.string())
});

export type AssetTypeSchema = typeof assetTypeSchema;
