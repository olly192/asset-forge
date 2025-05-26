import type { OptionalSchema } from "valibot";
import * as v from "valibot";
import type { FullCustomField } from "../field/columns";

const typeMap: Record<string, OptionalSchema<any, any>> = {
    string: v.optional(v.string()),
    number: v.optional(v.number()),
    boolean: v.optional(v.boolean()),
    date: v.optional(v.pipe(v.string(), v.isoTimestamp())),
    select: v.optional(v.pipe(v.string(), v.uuid())),
    textarea: v.optional(v.string())
}

export const assetTypeSchema = (customFields: FullCustomField[]) => {
    const mappedCustomFields: Record<string, OptionalSchema<any, any>> = {};
    customFields.forEach((field: FullCustomField) => mappedCustomFields[field.id] = typeMap[field.type]);

    return v.object({
        name: v.pipe(
            v.string("Name is required"),
            v.nonEmpty("Name is required"),
            v.minLength(2, "Name must be at least 2 characters"),
            v.maxLength(64, "Name cannot be longer than 64 characters"),
        ),
        displayName: v.optional(v.string()),
        description: v.optional(v.string()),
        brand: v.optional(v.string()),
        value: v.optional(v.number()),
        category: v.optional(v.string()),
        customFields: v.object(mappedCustomFields),
        images: v.optional(v.array(v.string()))
    });
}

export type AssetTypeSchema = typeof assetTypeSchema;
