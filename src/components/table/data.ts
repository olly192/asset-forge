import type { Writable } from "svelte/store";

export const labels = [
    {
        value: "bug",
        label: "Bug"
    },
    {
        value: "feature",
        label: "Feature"
    },
    {
        value: "documentation",
        label: "Documentation"
    }
];

// tailwind css color names
export type Color = "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky"
    | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose";

export type FilterOption = {
    value: string;
    label: string;
    icon?: any;
    color?: Color;
    url?: string;
    parent?: FilterOption;
}

export type Filter = {
    id: string;
    label: string;
    options: Writable<FilterOption[]>;
    default?: string[];
}
