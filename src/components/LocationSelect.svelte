<script lang="ts">
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Circle, Check, ChevronDown, RotateCw } from "lucide-svelte"
    import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover"
    import { Button } from "$lib/components/ui/button"
    import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "$lib/components/ui/command"
    import { onMount, tick } from "svelte"
    import { cn, nameToIcon } from "$lib/utils"
    import type { Location } from "@prisma/client"

    let { form, name, value = $bindable(), label, exclude } = $props();

    let locations: Location[] = $state([]);

    let refreshing: boolean = $state(false);
    async function refreshData() {
        refreshing = true;
        const resp = await fetch("/location/get");
        const newData: { locations: Location[] } = await resp.json();
        locations = newData.locations.filter(c => c.id !== exclude);
        refreshing = false;
    }
    onMount(() => refreshData());

    let open = $state(false);
    let triggerRef = $state<HTMLButtonElement>(null!);
    const selectedLocation = $derived(locations.find(c => c.id === value));

    function selectLocation(location: Location) {
        value = location.id
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
                                    {#if selectedLocation}
                                        {@const LocationIcon = nameToIcon(selectedLocation.icon)}
                                        <LocationIcon class="stroke-{selectedLocation.color}-500 size-4" />
                                        <span>{selectedLocation.name}</span>
                                    {:else}
                                        <Circle class="stroke-neutral-700 size-4" />
                                        <span class="opacity-60">Select a location</span>
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
                        <CommandInput placeholder="Search locations..." />
                        <CommandList>
                            <CommandEmpty>No color found.</CommandEmpty>
                            <CommandGroup>
                                {#each locations as location}
                                    {@const LocationIcon = nameToIcon(location.icon)}
                                    <CommandItem onSelect={() => selectLocation(location)} class="justify-between">
                                        <div class="flex flex-row gap-2">
                                            <LocationIcon class="stroke-{location.color}-500 size-4" />
                                            {location.name}
                                        </div>
                                        <Check class={cn("size-4", value !== location.id && "text-transparent")} />
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
