import type { FullCustomField } from "$lib/types";
import { typeMap } from "$lib/utils";
import type { OptionalSchema } from "valibot";
import * as v from "valibot";
import { staticAssetTypeSchema } from "../type/schema";

export function assetSchema(customFields: FullCustomField[], typeCustomFields: FullCustomField[]) {
    const mappedCustomFields: Record<string, OptionalSchema<any, any>> = {};
    customFields.forEach((field: FullCustomField) => mappedCustomFields[field.id] = typeMap[field.type]);
    const mappedTypeCustomFields: Record<string, OptionalSchema<any, any>> = {};
    typeCustomFields.forEach((field: FullCustomField) => mappedTypeCustomFields[field.id] = typeMap[field.type]);

    const sharedFields = {
        assetId: v.pipe(
            v.string("Asset ID is required"),
            v.nonEmpty("Asset ID is required"),
            v.minLength(2, "Asset ID must be at least 2 characters"),
            v.maxLength(64, "Asset ID cannot be longer than 64 characters"),
        ),
        notes: v.optional(v.string()),
        location: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        customFields: v.object(mappedCustomFields)
    };

    return v.variant("individualType", [
        v.object({
            individualType: v.literal(true),
            ...sharedFields,
            type: staticAssetTypeSchema,
            typeCustomFields: v.object(mappedTypeCustomFields)
        }),
        v.object({
            individualType: v.literal(false),
            ...sharedFields,
            typeId: v.pipe(
                v.string("Type is required"),
                v.nonEmpty("Type is required")
            )
        })
    ]);
}

export type AssetSchema = typeof assetSchema;
