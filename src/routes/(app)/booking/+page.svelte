<script lang="ts">
    import { breadcrumbs, header } from "$lib/stores";
    import { Button } from "$lib/components/ui/button";
    import { Plus } from "lucide-svelte";
    import Calendar from "$components/calendar/Calendar.svelte";
    import { events } from "./events";

    $breadcrumbs = [
        { label: "Bookings", href: "/booking" }
    ];
    $header = headerSnippet
</script>

{#snippet headerSnippet()}
    <div class="flex flex-row justify-between items-center">
        <h1 class="text-4xl font-bold">Bookings</h1>
        <Button>
            <Plus /> Create Booking
        </Button>
    </div>
{/snippet}

<main class="h-full p-8">
    <Calendar {events} />
</main>

