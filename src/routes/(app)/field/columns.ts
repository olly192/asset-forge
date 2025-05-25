import IconCell from "$components/table/cell/IconCell.svelte";
import SetIconCell from "$components/table/cell/SetIconCell.svelte";
import TagsCell from "$components/table/cell/TagsCell.svelte";
import { categoriesToFilter, tagsToFilter } from "$lib/utils";
import type { ColumnDef, Row } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import CheckboxCell from "$components/table/cell/CheckboxCell.svelte";
import { archivedFilter, type Filter, type FilterOption } from "$components/table/data";
import type { Category, CustomField, Tag } from "@prisma/client";
import type { Component } from "svelte";
import { get, type Writable, writable } from "svelte/store";
import { HelpCircle, Package, PencilRuler } from "lucide-svelte";
import { fieldTypes } from "./schema";

export type FullCustomField = CustomField & {
    tagLimit: Tag[];
    categoryLimit?: Category;
}

export type Data = {
    customFields: FullCustomField[];
    categories: Category[];
    tags: Tag[];
};

export function generateTable(data: Writable<Data>, actionsComponent: Component<any>, refreshData: Function) {
    const { customFields, categories, tags } = get(data);
    const categoryOptions: Writable<FilterOption[]> = writable(categoriesToFilter(categories));
    const tagOptions: Writable<FilterOption[]> = writable(tagsToFilter(tags));
    const perInstanceOptions: Writable<FilterOption[]> = writable([
        { value: "true", label: "True", icon: Package, color: "yellow" },
        { value: "false", label: "False", icon: PencilRuler, color: "blue" }
    ]);
    data.subscribe(() => {
        tagOptions.set(tagsToFilter(get(data).tags));
        categoryOptions.set(categoriesToFilter(get(data).categories));
    });

    const filters: Filter[] = [
        { id: "type", label: "Field Type", options: writable(fieldTypes) },
        { id: "perInstance", label: "Per Instance", options: perInstanceOptions },
        { id: "category", label: "Category", options: categoryOptions },
        { id: "tags", label: "Tags", options: tagOptions },
        { id: "archived", label: "Archived", options: archivedFilter, default: ["false"] }
    ];

    const columns: ColumnDef<FullCustomField>[] = [
        {
            id: "select",
            header: ({ table }) => {
                return renderComponent(CheckboxCell, {
                    checked: table.getIsAllPageRowsSelected(),
                    indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
                    onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
                    "aria-label": "Select all"
                });
            },
            cell: ({ row }) => {
                return renderComponent(CheckboxCell, {
                    checked: row.getIsSelected(),
                    onCheckedChange: (value) => row.toggleSelected(!!value),
                    "aria-label": "Select row"
                });
            },
            enableSorting: false,
            enableHiding: false
        },
        {
            id: "name",
            accessorKey: "name",
            header: "Name"
        },
        {
            id: "type",
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => {
                let option: FilterOption = fieldTypes.find(
                    (option: FilterOption) => option.value === row.original.type
                ) || { value: "", label: "Unknown", icon: HelpCircle, color: "orange" };
                return renderComponent(SetIconCell, { option });
            },
            filterFn: (row: Row<FullCustomField>, _: string, value: string[]): boolean => {
                return value.length === 0 || value.includes(row.original.type);
            }
        },
        {
            id: "perInstance",
            accessorKey: "perInstance",
            header: "Per Instance",
            cell: ({ row }) => {
                return renderComponent(CheckboxCell, { checked: row.original.perInstance, disabled: true });
            },
            filterFn: (row, _, filterValue) => {
                return filterValue.length === 0 || filterValue.includes(row.original.perInstance.toString())
            }
        },
        {
            id: "category",
            accessorKey: "typeId",
            header: "Category",
            cell: ({ row }) => {
                return row.original.categoryLimit ? renderComponent(IconCell, {
                    value: row.original.categoryLimit.id, options: categoryOptions
                }) : "";
            },
            filterFn: (row, _, filterValue) => {
                return (filterValue.length === 0) || (
                    (row.original.categoryLimit !== null) && filterValue.includes(row.original.categoryLimit?.id)
                );
            }
        },
        {
            id: "tags",
            accessorKey: "tagLimit",
            header: "Tags",
            cell: ({ row }) => {
                return renderComponent(TagsCell, {
                    value: row.original.tagLimit.map((tag: Tag) => tag.id), options: tagOptions
                });
            },
            filterFn: (row, _, filterValue) => {
                const tagIds: string[] = row.original.tagLimit.map((tag: Tag) => tag.id);
                return filterValue.length === 0 || filterValue.some((id: string) => tagIds.includes(id));
            }
        },
        {
            id: "archived",
            accessorKey: "archived",
            header: "Archived",
            cell: ({ row }) => {
                return renderComponent(CheckboxCell, { checked: row.original.archived, disabled: true });
            },
            filterFn: (row, _, filterValue) => {
                return filterValue.length === 0 || filterValue.includes(row.original.archived.toString())
            }
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                if (row.original) return renderComponent(actionsComponent, { row: row.original, data, refreshData });
                return "";
            }
        }
    ];

    return { columns, filters, data: customFields };
}
