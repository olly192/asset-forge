<script lang="ts">
    import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "$lib/components/ui/collapsible";
    import {
        SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton,
        SidebarMenuSubItem
    } from "$lib/components/ui/sidebar";
    import { Boxes, Package, ScanSearch, Settings, Tag, ChevronRight, ChartPie, Map, PencilRuler } from "lucide-svelte";
    import { goto } from "$app/navigation";

    const nav = [
        { title: "Dashboard", url: "/", icon: ChartPie },
        { title: "Assets", url: "/asset", icon: Package },
        { title: "Asset Types", url: "/type", icon: PencilRuler },
        { title: "Categories", url: "/category", icon: Boxes },
        { title: "Tags", url: "/tag", icon: Tag },
        { title: "Locations", url: "/location", icon: Map },
        // { title: "Bookings", url: "/booking", icon: Calendar },
        { title: "Scanner", url: "/scanner", icon: ScanSearch },
        {
            title: "Workspace Settings",
            url: "#",
            icon: Settings,
            active: true,
            children: [
                { title: "General", url: "/settings" },
                { title: "Users", url: "/settings/users" },
                { title: "Custom Fields", url: "/field" },
                { title: "Authentication", url: "/settings/auth" }
            ]
        }
    ];
</script>

<SidebarGroup>
    <SidebarMenu>
        {#each nav as item (item.title)}
            {@const Icon = item.icon}
            {#if item.children}
                <Collapsible open={item.active} class="group/collapsible">
                    {#snippet child({ props })}
                        <SidebarMenuItem {...props}>
                            <CollapsibleTrigger>
                                {#snippet child({ props })}
                                    <SidebarMenuButton {...props}>
                                        {#snippet tooltipContent()}
                                            {item.title}
                                        {/snippet}
                                        {#if item.icon}
                                            <Icon />
                                        {/if}
                                        <span>{item.title}</span>
                                        <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                    </SidebarMenuButton>
                                {/snippet}
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {#each item.children as childItem (childItem.title)}
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton onclick={() => goto(childItem.url)}>
                                                {childItem.title}
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    {/each}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    {/snippet}
                </Collapsible>
            {:else}
                <SidebarMenuItem>
                    <SidebarMenuButton onclick={() => goto(item.url)}>
                        {#snippet tooltipContent()}
                            {item.title}
                        {/snippet}
                        <Icon />
                        <span>{item.title}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            {/if}
        {/each}
    </SidebarMenu>
</SidebarGroup>
