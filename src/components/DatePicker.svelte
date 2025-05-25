<script lang="ts">
    import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover";
    import { CalendarIcon } from "lucide-svelte";
    import { DateFormatter, type DateValue, getLocalTimeZone, parseAbsoluteToLocal } from "@internationalized/date";
    import { cn } from "$lib/utils.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import { Calendar } from "$lib/components/ui/calendar/index.js";

    let { placeholder, value = $bindable() }: { placeholder?: string, value: Date | undefined } = $props();
    if (!placeholder) placeholder = "Pick a date";

    const df = new DateFormatter("en-GB", { dateStyle: "long" });

    let contentRef = $state<HTMLElement | null>(null);

    let calendarValue: DateValue | undefined = $state(value ? parseAbsoluteToLocal(value.toString()) : undefined);
    $effect(() => value = calendarValue?.toDate())
</script>

<Popover>
    <PopoverTrigger class={cn(
        buttonVariants({ variant: "outline", class: "w-48 justify-start text-left font-normal"}),
        !value && "text-muted-foreground"
    )}>
        <CalendarIcon />
        {calendarValue ? df.format(calendarValue.toDate(getLocalTimeZone())) : placeholder}
    </PopoverTrigger>
    <PopoverContent bind:ref={contentRef} class="w-auto p-0">
        <Calendar type="single" bind:value={calendarValue} />
    </PopoverContent>
</Popover>