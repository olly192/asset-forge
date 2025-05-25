<script lang="ts">
    import type { Color } from "$components/table/data";
    import { tick } from "svelte";
    import type { SuperForm } from "sveltekit-superforms";
    import { cn, nameToIcon } from "$lib/utils.js";
    import { Check, ChevronDown, Circle } from "lucide-svelte";
    import {
        Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
    } from "$lib/components/ui/command/index.js";
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form/index.js";
    import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover/index.js";
    import { Button } from "$lib/components/ui/button/index.js";

    let { form, name, value = $bindable(), label, options, allowNone = false }: {
        form: SuperForm<any>, name: string, value?: string, label?: string, options: Option[], allowNone?: boolean
    } = $props();

    type Option = {
        icon: string;
        color: Color;
        label: string;
        value: string;
    }

    let open = $state(false);
    let triggerRef = $state<HTMLButtonElement>(null!);
    let selectedOption = $derived(options.find(option => option.value === value));

    function select(id: string) {
        value = id
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
                        <Button variant="outline" class="w-full justify-between px-3" {...props} role="combobox">
                            <div class="flex flex-row items-center gap-2">
                                {#if selectedOption}
                                    {@const Icon = nameToIcon(selectedOption.icon)}
                                    <Icon class="stroke-{selectedOption.color}-500 size-4" />
                                    <span>{selectedOption.label}</span>
                                {:else}
                                    <Circle class="stroke-neutral-700 size-4" />
                                    <span class="opacity-60">Select an option</span>
                                {/if}
                            </div>
                            <ChevronDown class="size-4 shrink-0 opacity-30" />
                        </Button>
                    {/snippet}
                </PopoverTrigger>
                <input hidden bind:value name={name} />
                <PopoverContent class="w-full min-w-64 p-0" align="start">
                    <Command class="w-full">
                        <CommandInput placeholder="Search options..." />
                        <CommandList>
                            <CommandEmpty>No options found.</CommandEmpty>
                            <CommandGroup>
                                {#if allowNone}
                                    <CommandItem onSelect={() => select(undefined)} class="justify-between">
                                        <div class="flex flex-row gap-2">
                                            None
                                        </div>
                                        <Check class={cn("size-4", value !== undefined && "text-transparent")} />
                                    </CommandItem>
                                {/if}
                                {#each options as option}
                                    {@const Icon = nameToIcon(option.icon)}
                                    <CommandItem onSelect={() => select(option.value)} class="justify-between">
                                        <div class="flex flex-row gap-2">
                                            <Icon class="stroke-{option.color}-500 size-4" />
                                            {option.label}
                                        </div>
                                        <Check class={cn("size-4", value !== option.value && "text-transparent")} />
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