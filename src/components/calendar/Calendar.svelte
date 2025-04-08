<script lang="ts">
    import type { CalendarEvent } from "$components/calendar/calendar";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import {
        Cable, ChevronLeft, ChevronRight, Columns3, Computer, Grid3x3, Laptop, List, Phone, Server
    } from "lucide-svelte";
    import CalendarFilter from "$components/calendar/CalendarFilter.svelte";
    import CalendarMonth from "$components/calendar/CalendarMonth.svelte";

    let { events }: { events: CalendarEvent[] } = $props();

    let view: "day" | "week" | "month" = $state("month");


    let categories = [
        { id: "test-category-a", name: "Test Category A", icon: Cable },
        { id: "test-category-b", name: "Test Category B", icon: Phone },
        { id: "test-category-c", name: "Test Category C", icon: Computer },
        { id: "test-category-d", name: "Test Category D", icon: Laptop },
        { id: "test-category-e", name: "Test Category E", icon: Server },
    ]

    let assets = [
        { id: "test1", name: "Test 1", category: "test-category-a" },
        { id: "test2", name: "Test 2", category: "test-category-a" },
        { id: "test3", name: "Test 3", category: "test-category-b" },
        { id: "test4", name: "Test 4", category: "test-category-b" },
        { id: "test5", name: "Test 5", category: "test-category-c" },
        { id: "test6", name: "Test 6", category: "test-category-c" },
        { id: "test7", name: "Test 7", category: "test-category-d" },
        { id: "test8", name: "Test 8", category: "test-category-d" },
        { id: "test9", name: "Test 9", category: "test-category-e" },
        { id: "test10", name: "Test 10", category: "test-category-e" },
    ]

    let selectedAssetIds: string[] = $state([]);

    let filteredEvents: CalendarEvent[] = $derived(events.filter(
        event => selectedAssetIds.length === 0 || event.assetIds.some(id => selectedAssetIds.includes(id))
    ));
</script>

<div class="calendar-container">
    <div class="calendar-header">
        <button class="calendar-today">
            <span class="calendar-today-month">MAR</span>
            <span class="calendar-today-day">17</span>
        </button>
        <div class="calendar-month">
            <span>March 2025</span>
            <Badge variant="outline">10 Events</Badge>
        </div>
        <div class="calendar-buttons">
            <CalendarFilter {assets} {categories} {selectedAssetIds} />
            <div class="calendar-views">
                <Button
                    size="icon" class="rounded-r-none"
                    variant={ view === "day" ? "secondary" : "outline"} onclick={() => view = "day"}
                >
                    <List />
                </Button>
                <Button
                    size="icon" class="rounded-none border-x-0"
                    variant={ view === "week" ? "secondary" : "outline"} onclick={() => view = "week"}
                >
                    <Columns3 />
                </Button>
                <Button
                    size="icon" class="rounded-l-none"
                    variant={ view === "month" ? "secondary" : "outline"} onclick={() => view = "month"}
                >
                    <Grid3x3 />
                </Button>
            </div>
        </div>
        <div class="calendar-controls">
            <Button variant="outline" size="icon-sm">
                <ChevronLeft />
            </Button>
            <span>Mar 1, 2025 - Mar 31, 2025</span>
            <Button variant="outline" size="icon-sm">
                <ChevronRight />
            </Button>
        </div>
    </div>
    {#if view === "day"}
        <p>Day View</p>
    {:else if view === "week"}
        <p>Week View</p>
    {:else}
        <CalendarMonth events={filteredEvents} month={3} year={2025} />
    {/if}
</div>

<style lang="postcss">
    .calendar-container {
        @apply size-full flex flex-col;
        @apply bg-card text-card-foreground rounded-xl border shadow;

        .calendar-header {
            @apply w-full h-28 p-4 grid grid-cols-[5rem,1fr,1fr] grid-rows-2 gap-x-4;
            @apply border-b border-b-border;

            .calendar-today, .calendar-buttons {
                @apply row-span-2;
            }

            .calendar-today {
                @apply size-20 grid grid-rows-[2rem_1fr] items-center;
                @apply border rounded-xl overflow-hidden;
                span {
                    @apply size-full flex justify-center items-center;
                }
                .calendar-today-month {
                    @apply bg-primary text-lg font-bold;
                }
                .calendar-today-day {
                    @apply text-2xl font-bold;
                }
            }
            .calendar-month, .calendar-controls {
                @apply flex flex-row items-center gap-2;
            }

            .calendar-month > span {
                @apply text-xl font-bold;
            }

            .calendar-controls > span {
                @apply text-muted-foreground;
            }

            .calendar-buttons {
                @apply flex flex-col justify-center items-end gap-2;
                .calendar-views {
                    @apply flex flex-row items-center;
                }
            }
        }
    }
</style>