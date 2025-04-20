import * as v from "valibot";

export const assetSchema = v.object({
    name: v.pipe(
        v.string("Name is required"),
        v.nonEmpty("Name is required"),
        v.minLength(2, "Name must be at least 2 characters"),
        v.maxLength(64, "Name cannot be longer than 64 characters"),
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
