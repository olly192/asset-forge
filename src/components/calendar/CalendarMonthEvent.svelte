<script lang="ts">
    import type { CalendarEventPos } from "$components/calendar/calendar";
    import { format, isSameDay, startOfDay, parseISO, endOfDay } from "date-fns";
    import { cn } from "$lib/utils";

    let { event, cellDate }: { event: CalendarEventPos, cellDate: Date } = $props();

    let defaultClass = "mx-1 flex size-auto h-6 select-none items-center justify-between gap-1.5 truncate whitespace-nowrap rounded-md border px-2 text-xs";
    let multiDayPosition = {
        first: "relative z-10 mr-0 w-[calc(100%_+_1px)] rounded-r-none border-r-0 [&>span]:mr-2.5",
        middle: "relative z-10 mx-0 w-[calc(100%_+_1px)] rounded-none border-x-0",
        last: "ml-0 rounded-l-none border-l-0",
        none: ""
    };

    const itemStart = startOfDay(parseISO(event.start));
    const itemEnd = endOfDay(parseISO(event.end));

    let position: "first" | "middle" | "last" | "none" = "middle";
    if (isSameDay(itemStart, itemEnd)) {
        position = "none";
    } else if (isSameDay(cellDate, itemStart)) {
        position = "first";
    } else if (isSameDay(cellDate, itemEnd)) {
        position = "last";
    }

    const renderBadgeText = ["first", "none"].includes(position);

    const eventBadgeClasses = cn(defaultClass, multiDayPosition[position]);
</script>

<div role="button" tabIndex={0} class={eventBadgeClasses}>
    <div class="flex items-center gap-1.5 truncate">
        {#if renderBadgeText}
            <p class="flex-1 truncate font-semibold">
                {event.title}
            </p>
        {/if}
    </div>

    {#if renderBadgeText}
        <span>{format(new Date(event.start), "HH:mm")}</span>
    {/if}
</div>