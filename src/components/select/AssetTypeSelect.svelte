<script lang="ts">
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Circle, Check, ChevronDown, RotateCw } from "lucide-svelte"
    import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover"
    import { Button } from "$lib/components/ui/button"
    import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "$lib/components/ui/command"
    import { onMount, tick } from "svelte"
    import { cn, nameToIcon } from "$lib/utils"
    import type { AssetType, Category } from "@prisma/client";
    import type { SuperForm } from "sveltekit-superforms";

    let { form, name, value = $bindable(), label, exclude, allowIndividual = false }: {
        form: SuperForm<any>, name: string, value: string, label: string, exclude?: string, allowIndividual?: boolean
    } = $props();

    let assetTypes: AssetType[] = $state([]);
    let categories: Category[] = $state([]);

    let refreshing: boolean = $state(false);
    async function refreshData() {
        refreshing = true;
        const resp = await fetch("/type/get");
        const newData: { assetTypes: AssetType[], categories: Category[] } = await resp.json();
        assetTypes = newData.assetTypes.filter(t => t.id !== exclude).filter(t => allowIndividual || !t.individualType);
        categories = newData.categories;
        refreshing = false;
    }
    onMount(() => refreshData());

    let open = $state(false);
    let triggerRef = $state<HTMLButtonElement>(null!);
    const selectedAssetType = $derived(assetTypes.find(t => t.id === value));

    function selectAssetType(assetType: AssetType) {
        value = assetType.id
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
                                    {#if selectedAssetType}
                                        {@const category = categories.find(c => c.id === selectedAssetType.categoryId)}
                                        {@const CategoryIcon = category ? nameToIcon(category.icon) : Circle}
                                        <CategoryIcon class="stroke-{category ? category.color : 'neutral'}-500 size-4" />
                                        <span>{selectedAssetType.name}</span>
                                    {:else}
                                        <Circle class="stroke-neutral-700 size-4" />
                                        <span class="opacity-60">Select an asset type</span>
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
                <PopoverContent class="w-full min-w-64 p-0" align="start">
                    <Command class="w-full">
                        <CommandInput placeholder="Search asset types..." />
                        <CommandList>
                            <CommandEmpty>No asset types found.</CommandEmpty>
                            <CommandGroup>
                                {#each assetTypes as assetType}
                                    {@const category = categories.find(c => c.id === assetType.categoryId)}
                                    {@const CategoryIcon = category ? nameToIcon(category.icon) : Circle}
                                    <CommandItem onSelect={() => selectAssetType(assetType)} class="justify-between">
                                        <div class="flex flex-row items-center gap-2">
                                            <CategoryIcon class="stroke-{category ? category.color : 'neutral'}-500 size-4" />
                                            {assetType.name}
                                        </div>
                                        <Check class={cn("size-4", value !== assetType.id && "text-transparent")} />
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
