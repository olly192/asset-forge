import SetIconCell from "$components/table/cell/SetIconCell.svelte";
import type { ColumnDef, Row } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import CheckboxCell from "$components/table/cell/CheckboxCell.svelte";
import { archivedFilter, type Filter, type FilterOption } from "$components/table/data";
import type { CustomField } from "@prisma/client";
import type { Component } from "svelte";
import { get, type Writable, writable } from "svelte/store";
import { HelpCircle } from "lucide-svelte";
import { fieldTypes } from "./schema";

export type Data = {
    customFields: CustomField[];
};

export function generateTable(data: Writable<Data>, actionsComponent: Component<any>, refreshData: Function) {
    const { customFields } = get(data);

    const filters: Filter[] = [
        { id: "type", label: "Field Type", options: writable(fieldTypes) },
        { id: "archived", label: "Archived", options: archivedFilter, default: ["false"] }
    ];

    const columns: ColumnDef<CustomField>[] = [
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
            filterFn: (row: Row<CustomField>, _: string, value: string[]): boolean => {
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
