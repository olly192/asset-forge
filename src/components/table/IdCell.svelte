<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { cn } from "$lib/utils";
    import { Check, Copy } from "lucide-svelte";

    const { value, class: className }: { value: string, class?: string } = $props();

    let copied = $state(false);
    function copyId() {
        navigator.clipboard.writeText(value);
        copied = true;
        setTimeout(() => copied = false, 3000);
    }
</script>

<div class={cn("flex flex-row items-center gap-2", className)}>
    <span class="font-mono">{value}</span>
    <Button onclick={copyId} size="icon-sm" variant="ghost">
        <span class="sr-only">Copy</span>
        {#if copied}
            <Check class="size-4" />
        {:else}
            <Copy class="size-4 text-muted-foreground hover:text-foreground" />
        {/if}
    </Button>
</div>
