import type { Color } from "$components/table/data"

export type TreeElement = {
    id: string;
    name: string;
    icon: any;
    color: Color;
    children?: TreeElement[];
}