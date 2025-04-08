import { writable, type Writable } from "svelte/store";
import type { Snippet } from "svelte";

type Breadcrumb = {
    label: string;
    href?: string;
}

export const breadcrumbs: Writable<Breadcrumb[]> = writable<Breadcrumb[]>([]);
export let header: Writable<Snippet> = writable<Snippet>();
