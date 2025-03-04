<script lang="ts">
    import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "$lib/components/ui/collapsible";
    import {
        SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
        SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem
    } from "$lib/components/ui/sidebar"
    import ChevronRight from "lucide-svelte/icons/chevron-right";

    let { items }: {
        items: {
            title: string;
            url: string;
            // this should be `Component` after lucide-svelte updates types
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            icon?: any;
            active?: boolean;
            items?: {
                title: string;
                url: string;
            }[];
        }[];
    } = $props();
</script>

<SidebarGroup>
    <SidebarMenu>
        {#each items as mainItem (mainItem.title)}
            {#if mainItem.items}
                <Collapsible open={mainItem.active} class="group/collapsible">
                    {#snippet child({ props })}
                        <SidebarMenuItem {...props}>
                            <CollapsibleTrigger>
                                {#snippet child({ props })}
                                    <SidebarMenuButton {...props}>
                                        {#snippet tooltipContent()}
                                            {mainItem.title}
                                        {/snippet}
                                        {#if mainItem.icon}
                                            <mainItem.icon/>
                                        {/if}
                                        <span>{mainItem.title}</span>
                                        <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                    </SidebarMenuButton>
                                {/snippet}
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                {#if mainItem.items}
                                    <SidebarMenuSub>
                                        {#each mainItem.items as subItem (subItem.title)}
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton>
                                                    {#snippet child({ props })}
                                                        <a href={subItem.url} {...props}>
                                                            <span>{subItem.title}</span>
                                                        </a>
                                                    {/snippet}
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        {/each}
                                    </SidebarMenuSub>
                                {/if}
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    {/snippet}
                </Collapsible>
            {:else}
                <SidebarMenuItem>
                    <SidebarMenuButton>
                        {#snippet tooltipContent()}
                            {mainItem.title}
                        {/snippet}
                        {#snippet child({ props })}
                            <a href={mainItem.url} {...props}>
                                <mainItem.icon />
                                <span>{mainItem.title}</span>
                            </a>
                        {/snippet}
                    </SidebarMenuButton>
                </SidebarMenuItem>

            {/if}
        {/each}
    </SidebarMenu>
</SidebarGroup>
