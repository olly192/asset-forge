<script lang="ts">
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Circle, Check, ChevronDown, RotateCw } from "lucide-svelte"
    import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover"
    import { Button } from "$lib/components/ui/button"
    import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "$lib/components/ui/command"
    import { onMount, tick } from "svelte"
    import { cn, nameToIcon } from "$lib/utils"
    import type { Category } from "@prisma/client"

    let { form, name, value = $bindable(), label, exclude } = $props();

    let categories: Category[] = $state([]);

    let refreshing: boolean = $state(false);
    async function refreshData() {
        refreshing = true;
        const resp = await fetch("/category/get");
        const newData: { categories: Category[] } = await resp.json();
        categories = newData.categories.filter(c => c.id !== exclude);
        refreshing = false;
    }
    onMount(() => refreshData());

    let open = $state(false);
    let triggerRef = $state<HTMLButtonElement>(null!);
    const selectedCategory = $derived(categories.find(c => c.id === value));

    function selectCategory(category: Category) {
        value = category.id
        open = false;
        tick().then(() => triggerRef.focus());
    }
</script>

<FormField {form} {name}>
    <Popover bind:open>
        <FormControl>
            {#snippet children({ props })}
                <FormLabel>{label}</FormLabel>
                <PopoverTrigger bind:ref={triggerRef}>
                    {#snippet child({ props })}
                        <div class="flex flex-row gap-2">
                            <Button variant="outline" class="w-full justify-between px-3" {...props} role="combobox">
                                <div class="flex flex-row items-center gap-2">
                                    {#if selectedCategory}
                                        {@const CategoryIcon = nameToIcon(selectedCategory.icon)}
                                        <CategoryIcon class="stroke-{selectedCategory.color}-500 size-4" />
                                        <span>{selectedCategory.name}</span>
                                    {:else}
                                        <Circle class="stroke-neutral-700 size-4" />
                                        <span class="opacity-60">Select a category</span>
                                    {/if}
                                </div>
                                <ChevronDown class="size-4 shrink-0 opacity-30" />
                            </Button>
                            <Button variant="outline" size="icon" onclick={refreshData} disabled={refreshing}>
                                <RotateCw class={refreshing ? "animate-spin": ""} />
                            </Button>
                        </div>
                    {/snippet}
                </PopoverTrigger>
                <input hidden bind:value {name} />
                <PopoverContent class="w-full p-0" align="start">
                    <Command class="w-full">
                        <CommandInput placeholder="Search categories..." />
                        <CommandList>
                            <CommandEmpty>No color found.</CommandEmpty>
                            <CommandGroup>
                                {#each categories as category}
                                    {@const CategoryIcon = nameToIcon(category.icon)}
                                    <CommandItem onSelect={() => selectCategory(category)} class="justify-between">
                                        <div class="flex flex-row gap-2">
                                            <CategoryIcon class="stroke-{category.color}-500 size-4" />
                                            {category.name}
                                        </div>
                                        <Check class={cn("size-4", value !== category.id && "text-transparent")} />
                                    </CommandItem>
                                {/each}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            {/snippet}
        </FormControl>
    </Popover>
    <FormFieldErrors />
</FormField>
