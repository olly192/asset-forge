import type { FullCustomField } from "$lib/types";
import { typeMap } from "$lib/utils";
import type { OptionalSchema } from "valibot";
import * as v from "valibot";

export function assetTypeSchema(customFields: FullCustomField[]) {
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
