<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Check, Copy } from "lucide-svelte";

    const { value }: { value: string } = $props();

    let copied = $state(false);
    function copyId() {
        navigator.clipboard.writeText(value);
        copied = true;
        setTimeout(() => copied = false, 3000);
    }
</script>

<div class="flex flex-row items-center gap-2">
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
