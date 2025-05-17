import type { ColumnDef, Row } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import CheckboxCell from "$components/table/cell/CheckboxCell.svelte";
import IconCell from "$components/table/cell/IconCell.svelte";
import IdCell from "$components/table/cell/IdCell.svelte";
import TagsCell from "$components/table/cell/TagsCell.svelte";
import type { Filter, FilterOption } from "$components/table/data";
import type { Asset, AssetType, Category, Location, Tag } from "@prisma/client";
import { assetTypeToFilter, categoriesToFilter, locationsToFilter, tagsToFilter } from "$lib/utils";
import type { Component } from "svelte";
import type { AssetWithTags } from "$lib/types";
import { get, type Writable, writable } from "svelte/store";
import { Archive, ArchiveX } from "lucide-svelte";
import ButtonCell from "$components/table/cell/ButtonCell.svelte"

export type Data = {
    assets: AssetWithTags[];
    categories: Category[];
    locations: Location[];
    tags: Tag[];
    assetTypes: AssetType[];
};

export function generateTable(data: Writable<Data>, actionsComponent: Component<any>, refreshData: Function) {
    const { assets, categories, locations, tags, assetTypes } = get(data);
    const categoryOptions: Writable<FilterOption[]> = writable(categoriesToFilter(categories));
    const locationOptions: Writable<FilterOption[]> = writable(locationsToFilter(locations));
    const tagOptions: Writable<FilterOption[]> = writable(tagsToFilter(tags));
    const typeOptions: Writable<FilterOption[]> = writable(assetTypeToFilter(assetTypes));
    const archivedFilter: Writable<FilterOption[]> = writable([
        { value: "true", label: "True", icon: Archive, color: "red" },
        { value: "false", label: "False", icon: ArchiveX, color: "green" }
    ])
    data.subscribe(() => {
        tagOptions.set(tagsToFilter(get(data).tags));
        categoryOptions.set(categoriesToFilter(get(data).categories));
        locationOptions.set(locationsToFilter(get(data).locations));
        typeOptions.set(assetTypeToFilter(get(data).assetTypes));
    });

    const filters: Filter[] = [
        { id: "type", label: "Type", options: typeOptions },
        { id: "category", label: "Category", options: categoryOptions },
        { id: "tags", label: "Tags", options: tagOptions },
        { id: "location", label: "Location", options: locationOptions },
        { id: "archived", label: "Archived", options: archivedFilter, default: ["false"] }
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
            cell: ({ getValue }) => {
                return renderComponent(IdCell, { value: getValue() as string });
            },
            sortingFn: ({ original: a }: Row<any>, { original: b }: Row<any>) => a.assetId.localeCompare(b.assetId)
        },
        {
            id: "type",
            accessorKey: "typeId",
            header: "Asset Type",
            cell: ({ row }) => {
                return renderComponent(ButtonCell, { value: row.original.typeId, options: typeOptions });
            }
        },
        {
            id: "category",
            accessorKey: "typeId",
            header: "Category",
            cell: ({ row }) => {
                const assetType: AssetType | undefined = get(data).assetTypes.find((type: AssetType) => type.id === row.original.typeId);
                if (!assetType) return "";
                return renderComponent(IconCell, { value: assetType.categoryId, options: categoryOptions });
            },
            filterFn: (row, _, filterValue) => {
                const assetType: AssetType | undefined = get(data).assetTypes.find((type: AssetType) => type.id === row.original.typeId);
                if (!assetType) return false;
                return filterValue.length === 0 || filterValue.includes(assetType.categoryId);
            }
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

    return { columns, filters, data: assets };
}
