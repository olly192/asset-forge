import { Archive, ArchiveX } from "lucide-svelte";
import { writable, type Writable } from "svelte/store";

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

export const colors: Color[] = [
    "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky",
    "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"
];

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

export const archivedFilter: Writable<FilterOption[]> = writable([
    { value: "true", label: "True", icon: Archive, color: "red" },
    { value: "false", label: "False", icon: ArchiveX, color: "green" }
])
