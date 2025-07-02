import type { ColumnDef, Row } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import CheckboxCell from "$components/table/cell/CheckboxCell.svelte";
import IconCell from "$components/table/cell/IconCell.svelte";
import { archivedFilter, type Filter, type FilterOption } from "$components/table/data";
import type { AssetType, Category } from "@prisma/client";
import { assetTypeToBrandFilter, categoriesToFilter } from "$lib/utils";
import { Shapes, Triangle } from "lucide-svelte";
import type { Component } from "svelte";
import { get, type Writable, writable } from "svelte/store";

export type Data = {
    assetTypes: AssetType[];
    categories: Category[];
};

const individualFilter: Writable<FilterOption[]> = writable([
    { value: "true", label: "True", icon: Triangle, color: "red" },
    { value: "false", label: "False", icon: Shapes, color: "green" }
])

export function generateTable(data: Writable<Data>, actionsComponent: Component<any>, refreshData: Function) {
    const { assetTypes, categories } = get(data);
    const categoryOptions: Writable<FilterOption[]> = writable(categoriesToFilter(categories));
    const assetTypeFilter: Writable<FilterOption[]> = writable(assetTypeToBrandFilter(assetTypes));
    data.subscribe(() => {
        categoryOptions.set(categoriesToFilter(get(data).categories));
        assetTypeFilter.set(assetTypeToBrandFilter(get(data).assetTypes));
    });

    const filters: Filter[] = [
        { id: "category", label: "Category", options: categoryOptions },
        { id: "archived", label: "Archived", options: archivedFilter, default: ["false"] },
        { id: "individual", label: "Individual Type", options: individualFilter, default: ["false"] },
        { id: "brand", label: "Brand", options: assetTypeFilter }
    ]

    const columns: ColumnDef<AssetType>[] = [
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
            header: "Name",
            cell: ({ row }) => row.original.displayName || row.original.name
        },
        {
            id: "brand",
            accessorKey: "brand",
            header: "Brand",
            filterFn: (row: Row<AssetType>, _: string, value: string[]): boolean => {
                return value.length === 0 || (
                    row.original.brand === null ? value.includes("") : value.includes(row.original.brand)
                );
            }
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
            id: "value",
            accessorKey: "value",
            header: "Value",
            cell: ({ row }) => {
                return row.original.value && `£${row.original.value.toFixed(2)}`;
            }
        },
        // TODO: Finish asset instance list
        // {
        //     id: "assets",
        //     accessorKey: "assets",
        //     header: "Assets",
        //     cell: ({ row }) => {
        //         return renderComponent(IconCell, { value: row.original.locationId, options: locationOptions });
        //     },
        //     filterFn: "arrIncludesSome"
        // },
        {
            id: "individual",
            accessorKey: "individualType",
            header: "Individual Type",
            cell: ({ row }) => {
                return renderComponent(CheckboxCell, { checked: row.original.individualType, disabled: true });
            },
            filterFn: (row, _, filterValue) => {
                return filterValue.length === 0 || filterValue.includes(row.original.individualType.toString())
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

    return { columns, filters, data: assetTypes };
}
