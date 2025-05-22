<script lang="ts">
    import { v4 as uuidv4 } from 'uuid';
    import ColorSelect from "$components/select/ColorSelect.svelte";
    import IconSelect from "$components/select/IconSelect.svelte";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { ArrowDown, ArrowUp, Circle, Plus, Trash } from "lucide-svelte";

    type CustomSelectOption = {
        label: string;
        value: string;
        color?: string;
        icon?: string;
    }
    let { value = $bindable() }: { value: CustomSelectOption[] } = $props();

    let options = $state([
        { label: "Option 1", value: uuidv4(), icon: "Circle", color: "red" },
        { label: "Option 2", value: uuidv4(), icon: "Circle", color: "red" },
        { label: "Option 3", value: uuidv4(), icon: "Circle", color: "red" }
    ]);
    if (value) options = value;

    $effect(() => value = options)

    const addOption = () => options.push({
        label: `Option ${options.length + 1}`, value: uuidv4(), icon: "Circle", color: "red"
    });

    function moveOptionUp(id) {
        const index = options.findIndex(option => option.value === id);
        if (index > 0) {
            const temp = options[index];
            options[index] = options[index - 1];
            options[index - 1] = temp;
        }
    }

    function moveOptionDown(id) {
        const index = options.findIndex(option => option.value === id);
        if (index < options.length - 1) {
            const temp = options[index];
            options[index] = options[index + 1];
            options[index + 1] = temp;
        }
    }

    const deleteOption = (id) => options = options.filter(option => option.value !== id);

    $inspect("value", value)
</script>

{#snippet iconTrigger(value, SelectedIcon, color, props)}
    <Button variant="outline" class="justify-between px-3" {...props} role="combobox">
        <SelectedIcon class="stroke-{color ? color + '-500' : 'white'} size-4" />
    </Button>
{/snippet}

{#snippet colorTrigger(value, name, props)}
    <Button variant="outline" class="justify-between px-3" {...props} role="combobox">
        <Circle class="fill-{value || 'neutral'}-500 stroke-{value || 'neutral'}-700 size-4" />
    </Button>
{/snippet}

<div class="flex flex-row justify-between items-center">
    <Label>Options</Label>
    <Button size="sm" variant="secondary" onclick={addOption}>
        <Plus class="size-4" /> Add Option
    </Button>
</div>

<div class="flex flex-col gap-2">
    {#each options as option, i}
        <div class="flex flex-row items-center gap-2">
            <IconSelect bind:value={option.icon} color={option.color} trigger={iconTrigger} />
            <ColorSelect bind:value={option.color} trigger={colorTrigger} />
            <Input bind:value={option.label} placeholder="Option Label" />
            <Button
                size="sm" class="size-8" variant="outline"
                onclick={() => moveOptionUp(option.value)} disabled={i === 0}
            >
                <ArrowUp class="size-4" />
            </Button>
            <Button
                size="sm" class="size-8" variant="outline"
                onclick={() => moveOptionDown(option.value)} disabled={i === options.length - 1}
            >
                <ArrowDown class="size-4" />
            </Button>
            <Button size="sm" class="size-8" variant="outline" onclick={() => deleteOption(option.value)}>
                <Trash class="size-4" />
            </Button>
        </div>
    {/each}
</div>
