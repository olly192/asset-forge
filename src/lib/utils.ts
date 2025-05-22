import { icons } from "$components/icons";
import { type ClassValue, clsx } from "clsx";
import type { Component } from "svelte";
import { twMerge } from "tailwind-merge";
import type { AssetType, Category, Location, Tag } from "@prisma/client";
import type { Color, FilterOption } from "$components/table/data";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function nameToIcon(name: string): Component | undefined {
	return icons.find((icon: { name: string, component: Component }) => icon.name === name)?.component;
}

export function categoriesToFilter(categories: Category[]): FilterOption[] {
	if (!categories) return [];
	const filters: FilterOption[] = categories.map((category: Category) => ({
		value: category.id,
		label: category.name,
		icon: category.icon && nameToIcon(category.icon),
		color: category.color as Color,
		url: `/category/${category.id}/edit`
	}))

	filters.forEach((filter: FilterOption) => {
		const category: Category | undefined = categories.find((c: Category) => c.id === filter.value);
		if (!category?.parentId) return;
		filter.parent = filters.find((f: FilterOption) => category.parentId === f.value);
	})

	return filters;
}

export function locationsToFilter(locations: Location[]): FilterOption[] {
	if (!locations) return [];
	const filters: FilterOption[] =  locations.map((location: Location) => ({
		value: location.id,
		label: location.name,
		icon: location.icon && nameToIcon(location.icon),
		color: location.color as Color,
		url: `/location/${location.id}/edit`,
	}))

	filters.forEach((filter: FilterOption) => {
		const location: Location | undefined = locations.find((l: Location) => l.id === filter.value);
		if (!location?.parentId) return;
		filter.parent = filters.find((f: FilterOption) => location.parentId === f.value);
	})

	return filters;
}

export function tagsToFilter(tags: Tag[]): FilterOption[] {
	if (!tags) return [];
	return tags.map((tag: Tag) => ({
		value: tag.id,
		label: tag.name,
		color: tag.color as Color,
		url: `/tag/${tag.id}/edit`
	}))
}

export function assetTypeToFilter(types: AssetType[]): FilterOption[] {
	if (!types) return [];
	return types.map((type: AssetType) => ({
		value: type.id,
		label: type.name,
		url: `/type/${type.id}/edit`
	}))
}

export function assetTypeToBrandFilter(types: AssetType[]): FilterOption[] {
	if (!types) return [];
	let brands: FilterOption[] = [{ value: "", label: "None" }];
	types.forEach((type: AssetType) => {
		if (type.brand && !brands.find((brand: FilterOption) => brand.value === type.brand)) {
			brands.push({ value: type.brand, label: type.brand });
		}
	})
	return brands;
}
