<script lang="ts">
    import { Badge } from "$lib/components/ui/badge";
    import { FormControl, FormField, FormFieldErrors, FormLabel } from "$lib/components/ui/form";
    import { Circle, Check, RotateCw, Plus, X } from "lucide-svelte";
    import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover"
    import { Button } from "$lib/components/ui/button"
    import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "$lib/components/ui/command"
    import { onMount, tick } from "svelte"
    import { cn } from "$lib/utils"
    import type { Tag } from "@prisma/client";

    let { form, name, value = $bindable(), label, exclude } = $props();

    if (value === undefined) value = [];

    let tags: Tag[] = $state([]);

    let refreshing: boolean = $state(false);
    async function refreshData() {
        refreshing = true;
        const resp = await fetch("/tag/get");
        const newData: { tags: Tag[] } = await resp.json();
        tags = newData.tags.filter(c => c.id !== exclude);
        refreshing = false;
    }
    onMount(() => refreshData());

    let open = $state(false);
    let triggerRef = $state<HTMLButtonElement>(null);
    const selectedTags = $derived(tags.filter(tag => value.includes(tag.id)));

    function addTag(tag: Tag) {
        value = [...value, tag.id];
        open = false;
        tick().then(() => triggerRef.focus());
    }

    function removeTag(tag: Tag) {
        value = value.filter(id => id !== tag.id);
        open = false;
        tick().then(() => triggerRef.focus());
    }

    function toggleTag(tag: Tag) {
        if (value.includes(tag.id)) removeTag(tag);
        else addTag(tag);
    }
</script>

<FormField {form} {name}>
    <Popover bind:open>
        <FormControl>
            {#snippet children({ props })}
                <FormLabel>{label}</FormLabel>
                <div class="flex flex-row gap-2">
                    <div class="tag-list">
                        {#each selectedTags as tag}
                            <Badge
                                variant="outline" onclick={() => removeTag(tag)}
                                class="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-full p-1.5 pr-3 group"
                            >
                                <Circle class="fill-{tag.color || 'neutral'}-500 stroke-{tag.color || 'neutral'}-700 mr-2 size-4 group-hover:hidden" />
                                <X class="size-4 mr-2 hidden group-hover:block" />
                                <span>{tag.name}</span>
                            </Badge>
                        {/each}
                        {#if value.length === 0}
                            <span class="text-muted-foreground text-sm">No tags found.</span>
                        {/if}
                    </div>
                    <PopoverTrigger bind:ref={triggerRef}>
                        {#snippet child({ props })}
                            <div class="flex flex-row items-center gap-2">
                                <Button variant="outline" size="icon" {...props} role="combobox">
                                    <Plus class="size-4 shrink-0" />
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
                            <CommandInput placeholder="Search tags..." />
                            <CommandList>
                                <CommandEmpty>No tags found.</CommandEmpty>
                                <CommandGroup>
                                    {#each tags as tag}
                                        <CommandItem onSelect={() => toggleTag(tag)} class="justify-between">
                                            <div class="flex flex-row gap-2">
                                                <Circle class="fill-{tag.color || 'neutral'}-500 stroke-{tag.color || 'neutral'}-700 size-4" />
                                                {tag.name}
                                            </div>
                                            <Check class={cn("size-4", !value.includes(tag.id) && "text-transparent")} />
                                        </CommandItem>
                                    {/each}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </div>
            {/snippet}
        </FormControl>
    </Popover>
    <FormFieldErrors />
</FormField>

<style lang="postcss">
    .tag-list {
        @apply w-full flex flex-row items-center gap-2;
    }
</style>
