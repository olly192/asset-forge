<script lang="ts">
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Circle, Check, ChevronDown, Search } from "lucide-svelte"
    import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover"
    import { Button } from "$lib/components/ui/button"
    import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "$lib/components/ui/command"
    import { tick } from "svelte"
    import { cn } from "$lib/utils"
    import { icons } from "$components/icons"

    let { form, name, value = $bindable(), label, color, trigger } = $props();

    let open = $state(false);
    let triggerRef = $state<HTMLButtonElement>(null!);
    if (!trigger) trigger = defaultTrigger

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
</script>

{#snippet defaultTrigger(value, SelectedIcon, color, props)}
    <Button variant="outline" class="w-full justify-between px-3" {...props} role="combobox">
        <div class="flex flex-row items-center gap-2">
            <SelectedIcon class="stroke-{color ? color + '-500' : 'white'} size-4" />
            {#if value}
                <span>{value}</span>
            {:else}
                <span class="opacity-60">Select an icon</span>
            {/if}
        </div>
        <ChevronDown class="size-4 shrink-0 opacity-30" />
    </Button>
{/snippet}

{#snippet popoverContent()}
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

{#if form && name}
    <FormField {form} {name}>
        <Popover bind:open>
            <FormControl>
                {#snippet children({ props })}
                    {#if label}
                        <FormLabel>{label}</FormLabel>
                    {/if}
                    <PopoverTrigger bind:ref={triggerRef}>
                        {#snippet child({ props })}
                            {@render trigger(value, SelectedIconComponent, color, props)}
                        {/snippet}
                    </PopoverTrigger>
                    <input hidden bind:value {name} />
                    {@render popoverContent()}
                {/snippet}
            </FormControl>
        </Popover>
        <FormFieldErrors />
    </FormField>
{:else}
    <Popover bind:open>
        {#if label}
            <FormLabel>{label}</FormLabel>
        {/if}
        <PopoverTrigger bind:ref={triggerRef}>
            {#snippet child({ props })}
                {@render trigger(value, SelectedIconComponent, color, props)}
            {/snippet}
        </PopoverTrigger>
        {@render popoverContent()}
    </Popover>
{/if}
