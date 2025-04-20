import * as v from "valibot";

export const categorySchema = v.object({
    name: v.pipe(
        v.string("Name is required"),
        v.nonEmpty("Name is required"),
        v.minLength(2, "Name must be at least 2 characters"),
        v.maxLength(64, "Name cannot be longer than 64 characters"),
    ),
    description: v.optional(v.string()),
    icon: v.pipe(
        v.string("Icon is required"),
        v.nonEmpty("Icon is required")
    ),
    color: v.pipe(
        v.string("Color is required"),
        v.nonEmpty("Color is required")
    ),
    parent: v.optional(v.string())
});

export type CategorySchema = typeof categorySchema;
