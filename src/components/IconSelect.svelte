<script lang="ts">
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Circle, Check, ChevronDown } from "lucide-svelte"
    import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover"
    import { Button } from "$lib/components/ui/button"
    import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "$lib/components/ui/command"
    import { tick } from "svelte"
    import { cn } from "$lib/utils"
    import { icons } from "$components/icons"
    import Search from "lucide-svelte/icons/search"


    let { form, name, value = $bindable(), label, color } = $props();

    let open = $state(false);
    let triggerRef = $state<HTMLButtonElement>(null!);

    function selectIcon(icon: string) {
        value = icon
        open = false;
        tick().then(() => triggerRef.focus());
    }

    let SelectedIconComponent = $derived(icons.find(icon => icon.name === value)?.component || Circle);
    let searchQuery = $state("");
    let filteredIcons = $derived(
        searchQuery.length >= 2 ? icons.filter(icon => icon.name.toLowerCase().includes(searchQuery.toLowerCase())) : []
    );
    $inspect(searchQuery);
    $inspect(filteredIcons.length);
</script>

<FormField {form} {name}>
    <Popover bind:open>
        <FormControl>
            {#snippet children({ props })}
                <FormLabel>{label}</FormLabel>
                <PopoverTrigger bind:ref={triggerRef}>
                    {#snippet child({ props })}
                        <Button variant="outline" class="w-full justify-between px-3" {...props} role="combobox">
                            <div class="flex flex-row items-center gap-2">
                                <SelectedIconComponent class="stroke-{color ? color + '-500' : 'white'} size-4" />
                                {#if value}
                                    <span>{value}</span>
                                {:else}
                                    <span class="opacity-60">Select an icon</span>
                                {/if}
                            </div>
                            <ChevronDown class="size-4 shrink-0 opacity-30" />
                        </Button>
                    {/snippet}
                </PopoverTrigger>
                <input hidden bind:value {name} />
                <PopoverContent class="w-full p-0" align="start">
                    <Command class="w-full">
                        <div class="flex items-center border-b px-3">
                            <Search class="mr-2 size-4 shrink-0 opacity-50" />
                            <input
                                class="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-base outline-none md:text-sm"
                                bind:value={searchQuery} placeholder="Search icons..."
                            />
                        </div>
                        <CommandEmpty forceMount={filteredIcons.length === 0}>Search for an icon.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {#each filteredIcons as icon}
                                    {@const IconComponent = icon.component}
                                    <CommandItem onSelect={() => selectIcon(icon.name)} class="justify-between">
                                        <div class="flex flex-row gap-2">
                                            <IconComponent class="stroke-{color ? color + '-500' : 'white'} size-4" />
                                            {icon.name}
                                        </div>
                                        <Check class={cn("size-4", value !== icon && "text-transparent")} />
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
