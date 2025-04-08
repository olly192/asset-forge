import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import CheckboxCell from "$components/table/CheckboxCell.svelte";
import IconCell from "$components/table/IconCell.svelte";
import IdCell from "$components/table/IdCell.svelte";
import TagsCell from "$components/table/TagsCell.svelte";
import type { Filter, FilterOption } from "$components/table/data";
import type { Asset, Category, Location, Tag } from "@prisma/client";
import { categoriesToFilter, locationsToFilter, tagsToFilter } from "$lib/utils";
import type { Component } from "svelte";
import type { AssetWithTags } from "$lib/types";

export type Data = {
    assets: AssetWithTags[];
    categories: Category[];
    locations: Location[];
    tags: Tag[];
};

export function generateTable(data: Data, actionsComponent: Component<{ row: any }>) {
    const categoryOptions: FilterOption[] = categoriesToFilter(data.categories);
    const locationOptions: FilterOption[] = locationsToFilter(data.locations);
    const tagOptions: FilterOption[] = tagsToFilter(data.tags);

    const filters: Filter[] = [
        { id: "category", label: "Category", options: categoryOptions },
        { id: "location", label: "Location", options: locationOptions },
        { id: "tags", label: "Tags", options: tagOptions }
    ]

    const columns: ColumnDef<Asset>[] = [
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
            id: "ID",
            accessorKey: "assetId",
            header: "Asset ID",
            enableSorting: false,
            cell: ({ getValue }) => {
                return renderComponent(IdCell, { value: getValue() as string });
            }
        },
        {
            id: "name",
            accessorKey: "name",
            header: "Name"
        },
        {
            id: "category",
            accessorKey: "categoryId",
            header: "Category",
            cell: ({ row }) => {
                return renderComponent(IconCell, { value: row.original.categoryId, options: categoryOptions });
            },
            filterFn: "arrIncludesSome"
        },
        {
            id: "tags",
            accessorKey: "tags",
            header: "Tags",
            cell: ({ row }) => {
                return renderComponent(TagsCell, { value: (row.original as AssetWithTags).tags, options: tagOptions });
            },
            filterFn: "arrIncludesSome"
        },
        {
            id: "location",
            accessorKey: "locationId",
            header: "Location",
            cell: ({ row }) => {
                return renderComponent(IconCell, { value: row.original.locationId, options: locationOptions });
            },
            filterFn: "arrIncludesSome"
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                if (row.original) return renderComponent(actionsComponent, { row: row.original });
                return "";
            }
        }
    ];

    return { columns, filters, data: data.assets };
}
