<script lang="ts">
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Circle, Check, ChevronDown } from "lucide-svelte"
    import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover"
    import { Button } from "$lib/components/ui/button"
    import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "$lib/components/ui/command"
    import { tick } from "svelte"
    import { cn } from "$lib/utils"

    let { form, name, value = $bindable(), label, trigger } = $props();

    if (!trigger) trigger = defaultTrigger

    const colors: { name: string; value: string }[] = [
        { name: "Red", value: "red" },
        { name: "Orange", value: "orange" },
        { name: "Amber", value: "amber" },
        { name: "Yellow", value: "yellow" },
        { name: "Lime", value: "lime" },
        { name: "Green", value: "green" },
        { name: "Emerald", value: "emerald" },
        { name: "Teal", value: "teal" },
        { name: "Cyan", value: "cyan" },
        { name: "Sky", value: "sky" },
        { name: "Blue", value: "blue" },
        { name: "Indigo", value: "indigo" },
        { name: "Violet", value: "violet" },
        { name: "Purple", value: "purple" },
        { name: "Fuchsia", value: "fuchsia" },
        { name: "Pink", value: "pink" },
        { name: "Rose", value: "rose" },
    ]

    let open = $state(false);
    let triggerRef = $state<HTMLButtonElement>(null!);
    const selectedValue = $derived(colors.find(c => c.value === value)?.name);

    function selectColor(color: { name: string; value: string }) {
        value = color.value
        open = false;
        tick().then(() => triggerRef.focus());
    }
</script>

{#snippet defaultTrigger(value, name, props)}
    <Button variant="outline" class="w-full justify-between px-3" {...props} role="combobox">
        <div class="flex flex-row items-center gap-2">
            <Circle class="fill-{value || 'neutral'}-500 stroke-{value || 'neutral'}-700 size-4" />
            {#if label}
                <span>{name}</span>
            {:else}
                <span class="opacity-60">Select a color</span>
            {/if}
        </div>
        <ChevronDown class="size-4 shrink-0 opacity-30" />
    </Button>
{/snippet}

{#snippet popoverContent()}
    <PopoverContent class="w-full p-0" align="start">
        <Command class="w-full">
            <CommandInput placeholder="Search colors..." />
            <CommandList>
                <CommandEmpty>No color found.</CommandEmpty>
                <CommandGroup>
                    {#each colors as color}
                        <CommandItem onSelect={() => selectColor(color)} class="justify-between">
                            <div class="flex flex-row gap-2">
                                <Circle class="fill-{color.value}-500 stroke-{color.value}-700 size-4" />
                                {color.name}
                            </div>
                            <Check class={cn("size-4", value !== color.value && "text-transparent")} />
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
                            {@render trigger(value, selectedValue, props)}
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
                {@render trigger(value, selectedValue, props)}
            {/snippet}
        </PopoverTrigger>
        {@render popoverContent()}
    </Popover>
{/if}
