<script lang="ts">
    import { type CalendarCell, type CalendarEvent, getMonthCellEvents } from "$components/calendar/calendar";
    import { startOfDay, isToday } from "date-fns";
    import { cn } from "$lib/utils";
    import CalendarMonthEvent from "$components/calendar/CalendarMonthEvent.svelte";

    let { cell, events, positions }: {
        cell: CalendarCell, events: CalendarEvent[], positions: Record<string, number>
    } = $props();

    const MAX_VISIBLE_EVENTS = 3;

    const cellEvents = $derived(getMonthCellEvents(cell.date, events, positions))

    const isMonday = $derived(cell.date.getDay() === 1)
</script>

<div class={cn("flex flex-col gap-1 border-l border-t py-1.5 lg:py-2", isMonday && "border-l-0")}>
    <span class={cn(
        "h-6 px-1 text-xs font-semibold lg:px-2",
        !cell.currentMonth && "opacity-20",
        isToday(cell.date) && "flex w-6 translate-x-1 items-center justify-center rounded-full bg-primary-600 px-0 font-bold text-white"
    )}>
        {cell.day}
    </span>

    <div class={cn("flex h-6 gap-1 px-2 lg:h-[94px] lg:flex-col lg:gap-2 lg:px-0", !cell.currentMonth && "opacity-50")}>
        {#each [0, 1, 2] as position}
            <div class="flex-1">
                {#if cellEvents[position]}
                    <CalendarMonthEvent event={cellEvents[position]} cellDate={startOfDay(cell.date)} />
                {/if}
            </div>
        {/each}
    </div>

    {#if cellEvents.length > MAX_VISIBLE_EVENTS}
        <p class={cn("h-4.5 px-1.5 text-xs font-semibold text-t-quaternary", !cell.currentMonth && "opacity-50")}>
            <span class="sm:hidden">+{cellEvents.length - MAX_VISIBLE_EVENTS}</span>
            <span class="hidden sm:inline"> {cellEvents.length - MAX_VISIBLE_EVENTS} more...</span>
        </p>
    {/if}
</div>

<style lang="postcss">
    /* div.calendar-day { */
    /*     @apply size-full flex flex-col; */
    /*     @apply border-t; */
    /*     span.calendar-date { */
    /*         @apply ml-2 mt-1; */
    /*         @apply text-xs; */
    /*     } */
    /* } */
</style>