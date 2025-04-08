import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Category, Location, Tag } from "@prisma/client";
import type { Color, FilterOption } from "$components/table/data";
import * as icons from "lucide-svelte";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const nameToIcon = (name: string) => icons[name];

export function categoriesToFilter(categories: Category[]): FilterOption[] {
	if (!categories) return [];
	return categories.map((category: Category) => ({
		value: category.id,
		label: category.name,
		icon: category.icon && nameToIcon(category.icon),
		color: category.color as Color,
		url: `/category/${category.id}`
	}))
}

export function locationsToFilter(locations: Location[]): FilterOption[] {
	if (!locations) return [];
	return locations.map((location: Location) => ({
		value: location.id,
		label: location.name,
		icon: location.icon && nameToIcon(location.icon),
		color: location.color as Color,
		url: `/location/${location.id}`
	}))
}

export function tagsToFilter(tags: Tag[]): FilterOption[] {
	if (!tags) return [];
	return tags.map((tag: Tag) => ({
		value: tag.id,
		label: tag.name,
		color: tag.color as Color,
		url: `/tag/${tag.id}`
	}))
}

