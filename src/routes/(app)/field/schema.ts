import { colors, type FilterOption } from "$components/table/data";
import { Calendar, ChevronDown, Hash, Text, TextCursorInput, ToggleRight } from "lucide-svelte";
import * as v from "valibot";

export const fieldTypes: FilterOption[] = [
    { value: "string", label: "String", icon: TextCursorInput, color: "red" },
    { value: "number", label: "Number", icon: Hash, color: "blue" },
    { value: "boolean", label: "Boolean", icon: ToggleRight, color: "green" },
    { value: "date", label: "Date", icon: Calendar, color: "cyan" },
    { value: "select", label: "Select", icon: ChevronDown, color: "purple" },
    { value: "textarea", label: "Textarea", icon: Text, color: "yellow" }
];

export type FieldTypeKey = (typeof fieldTypes)[number]["value"];

export const customFieldSchema = v.object({
    name: v.pipe(
        v.string("Name is required"),
        v.nonEmpty("Name is required"),
        v.minLength(2, "Name must be at least 2 characters"),
        v.maxLength(64, "Name cannot be longer than 64 characters"),
    ),
    description: v.optional(v.string()),
    options: v.variant("type", [
        v.object({
            type: v.literal("string"),
            placeholder: v.string(),
            default: v.optional(v.string())
        }),
        v.object({
            type: v.literal("string"),
            placeholder: v.string(),
            default: v.optional(v.string())
        }),
        v.object({
            type: v.literal("number"),
            placeholder: v.string(),
            step: v.string(),
            default: v.optional(v.number())
        }),
        v.object({
            type: v.literal("boolean"),
            default: v.boolean()
        }),
        v.object({
            type: v.literal("date"),
            placeholder: v.string(),
            default: v.optional(v.date())
        }),
        v.object({
            type: v.literal("select"),
            placeholder: v.string(),
            default: v.optional(v.string()),
            options: v.array(
                v.object({
                    label: v.string("Label is required"),
                    value: v.string("Value is required"),
                    color: v.optional(v.picklist(colors, "Color is required")),
                    icon: v.optional(v.string("Icon is required"))
                })
            )
        }),
        v.object({
            type: v.literal("textarea"),
            placeholder: v.string(),
            default: v.optional(v.string())
        })
    ]),
    perInstance: v.optional(v.boolean()),
    categoryLimit: v.optional(v.string()),
    tagLimit: v.optional(v.array(v.string()))
});

export type CustomFieldSchema = typeof customFieldSchema;
