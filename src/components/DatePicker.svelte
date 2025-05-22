<script lang="ts">
    import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover";
    import { CalendarIcon } from "lucide-svelte";
    import { DateFormatter, type DateValue, getLocalTimeZone } from "@internationalized/date";
    import { cn } from "$lib/utils.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import { Calendar } from "$lib/components/ui/calendar/index.js";

    let { placeholder, value = $bindable() }: { placeholder?: string, value: DateValue | undefined } = $props();
    if (!placeholder) placeholder = "Pick a date";

    const df = new DateFormatter("en-GB", { dateStyle: "long" });

    let contentRef = $state<HTMLElement | null>(null);
</script>

<Popover>
    <PopoverTrigger class={cn(
        buttonVariants({ variant: "outline", class: "w-48 justify-start text-left font-normal"}),
        !value && "text-muted-foreground"
    )}>
        <CalendarIcon />
        {value ? df.format(value.toDate(getLocalTimeZone())) : placeholder}
    </PopoverTrigger>
    <PopoverContent bind:ref={contentRef} class="w-auto p-0">
        <Calendar type="single" bind:value />
    </PopoverContent>
</Popover>