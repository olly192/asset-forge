<script lang="ts">
    import { labels } from "$components/table/data";
    import { Badge } from "$lib/components/ui/badge";

    const { value, labelValue }: { value: string; labelValue: string } = $props();
    const label = labels.find((label) => label.value === labelValue);
</script>

<div class="flex space-x-2">
    {#if label}
        <Badge variant="outline">{label.label}</Badge>
    {/if}
    <span class="max-w-[500px] truncate font-medium">
        {value}
    </span>
</div>
