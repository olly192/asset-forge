<script lang="ts">
    import { tick } from "svelte";
    import { fieldTypes } from "../../routes/(app)/field/schema.js";
    import { cn } from "$lib/utils.js";
    import { Check, ChevronDown, Circle } from "lucide-svelte";
    import {
        Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList
    } from "$lib/components/ui/command/index.js";
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form/index.js";
    import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover/index.js";
    import { Button } from "$lib/components/ui/button/index.js";

    let { form, name, value = $bindable(), label } = $props();

    let open = $state(false);
    let triggerRef = $state<HTMLButtonElement>(null!);
    let selectedType = $derived(fieldTypes.find(type => type.value === value));

    function selectFieldType(id: string) {
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
                                {#if selectedType}
                                    {@const TypeIcon = selectedType.icon}
                                    <TypeIcon class="stroke-{selectedType.color}-500 size-4" />
                                    <span>{selectedType.label}</span>
                                {:else}
                                    <Circle class="stroke-neutral-700 size-4" />
                                    <span class="opacity-60">Select a field type</span>
                                {/if}
                            </div>
                            <ChevronDown class="size-4 shrink-0 opacity-30" />
                        </Button>
                    {/snippet}
                </PopoverTrigger>
                <input hidden bind:value name="type" />
                <PopoverContent class="w-full min-w-64 p-0" align="start">
                    <Command class="w-full">
                        <CommandInput placeholder="Search field types..." />
                        <CommandList>
                            <CommandEmpty>No field types found.</CommandEmpty>
                            <CommandGroup>
                                {#each fieldTypes as fieldType}
                                    {@const TypeIcon = fieldType.icon}
                                    <CommandItem onSelect={() => selectFieldType(fieldType.value)} class="justify-between">
                                        <div class="flex flex-row gap-2">
                                            <TypeIcon class="stroke-{fieldType.color}-500 size-4" />
                                            {fieldType.label}
                                        </div>
                                        <Check class={cn("size-4", value !== fieldType.value && "text-transparent")} />
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