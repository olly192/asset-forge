<script lang="ts">
    import { calculateMonthEventPositions, type CalendarEvent, getCalendarCells } from "$components/calendar/calendar";
    import CalendarDay from "$components/calendar/CalendarDay.svelte";

    let { events, month, year }: { events: CalendarEvent[], month: number, year: number } = $props();

    let selectedDate = new Date();

    const cells = $derived(getCalendarCells(selectedDate));
    const positions = $derived(calculateMonthEventPositions(events, selectedDate));
</script>

<div class="calendar">
    <span class="calendar-day">Mon</span>
    <span class="calendar-day">Tue</span>
    <span class="calendar-day">Wed</span>
    <span class="calendar-day">Thu</span>
    <span class="calendar-day">Fri</span>
    <span class="calendar-day">Sat</span>
    <span class="calendar-day">Sun</span>
    {#each cells as cell}
        <CalendarDay {events} {cell} {positions} />
    {/each}
</div>


<style lang="postcss">
    .calendar {
        @apply h-full grid grid-cols-7 grid-rows-[2rem,repeat(6,1fr)];
        span.calendar-day {
            @apply flex flex-row justify-center items-center;
            @apply text-muted-foreground text-sm;
            &:not(:first-child) {
                @apply border-l;
            }
        }
    }
</style>