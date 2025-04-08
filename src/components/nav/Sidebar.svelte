<script lang="ts">
    import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarRail } from "$lib/components/ui/sidebar";
    import SidebarBrand from "$components/nav/SidebarBrand.svelte";
    import SidebarItems from "$components/nav/SidebarItems.svelte";
    import SidebarUser from "$components/nav/SidebarUser.svelte";

    const { showItems = true } = $props();
</script>

<Sidebar collapsible="icon">
    <SidebarHeader>
        <SidebarBrand />
    </SidebarHeader>
    <SidebarContent>
        {#if showItems}
            <SidebarItems />
        {/if}
    </SidebarContent>
    <SidebarFooter>
        <SidebarUser />
    </SidebarFooter>
    <SidebarRail />
</Sidebar>