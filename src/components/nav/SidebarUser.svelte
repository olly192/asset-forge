<script lang="ts">
    import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/ui/avatar";
    import {
        DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator,
        DropdownMenuGroup, DropdownMenuItem
    } from "$lib/components/ui/dropdown-menu";
    import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "$lib/components/ui/sidebar";
    import { Skeleton } from "$lib/components/ui/skeleton"
    import { useSidebar } from "$lib/components/ui/sidebar";
    import { ChevronsUpDown, LogOut, Settings, User } from "lucide-svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    const user = page.data?.user
    const sidebar = useSidebar();
</script>

<SidebarMenu>
    <SidebarMenuItem>
        {#if user}
            <DropdownMenu>
                <DropdownMenuTrigger>
                    {#snippet child({ props })}
                        <SidebarMenuButton
                            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full px-2"
                            size="lg" {...props}
                        >
                            <Avatar class="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.image} alt={user.name}/>
                                <AvatarFallback class="rounded-lg">{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div class="grid flex-1 text-left text-sm leading-tight">
                                <span class="truncate font-semibold">{user.name}</span>
                                <span class="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDown class="ml-auto size-4"/>
                        </SidebarMenuButton>
                    {/snippet}
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
                    side={sidebar.isMobile ? "bottom" : "right"} align="end" sideOffset={4}
                >
                    <DropdownMenuLabel class="p-0 font-normal">
                        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar class="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.image} alt={user.name}/>
                                <AvatarFallback class="rounded-lg">{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div class="grid flex-1 text-left text-sm leading-tight">
                                <span class="truncate font-semibold">{user.name}</span>
                                <span class="truncate text-xs">{user.email}</span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onclick={() => goto("/account")}>
                            <User/> Account
                        </DropdownMenuItem>
                        <DropdownMenuItem onclick={() => goto("/settings")}>
                            <Settings/> Settings
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onclick={() => goto("/auth/logout")}>
                        <LogOut/> Log out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        {:else}
            <Skeleton class="w-full h-12" />
        {/if}
    </SidebarMenuItem>
</SidebarMenu>

<style lang="postcss">
</style>