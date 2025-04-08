<script lang="ts">
    import Sidebar from "$components/nav/Sidebar.svelte";
    import { Separator } from "$lib/components/ui/separator";
    import {
        Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink
    } from "$lib/components/ui/breadcrumb";
    import { SidebarProvider, SidebarInset, SidebarTrigger } from "$lib/components/ui/sidebar";
    import { breadcrumbs, header } from "$lib/stores";
    import { goto } from "$app/navigation"

    let { children } = $props();
    $breadcrumbs = [];
    $header = headerSnippet;
</script>

{#snippet headerSnippet()}
    <div class="flex flex-row justify-start items-center">
        <h1 class="text-4xl font-bold">Asset Forge</h1>
    </div>
{/snippet}

<SidebarProvider>
    <Sidebar />
    <SidebarInset>
        <header>
            <div class="breadcrumb">
                <SidebarTrigger class="-ml-1" />
                <Separator orientation="vertical" class="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {#each $breadcrumbs as breadcrumb, index}
                            {#if index === $breadcrumbs.length - 1}
                                <BreadcrumbItem class="hidden md:block">
                                    {breadcrumb.label}
                                </BreadcrumbItem>
                            {:else}
                                <BreadcrumbItem class="hidden md:block">
                                    {#if breadcrumb.href}
                                        <BreadcrumbLink onclick={() => goto(breadcrumb.href)} class="cursor-pointer">
                                            {breadcrumb.label}
                                        </BreadcrumbLink>
                                    {:else}
                                        <BreadcrumbItem class="hidden md:block">
                                            {breadcrumb.label}
                                        </BreadcrumbItem>
                                    {/if}
                                </BreadcrumbItem>
                                <BreadcrumbSeparator class="hidden md:block" />
                            {/if}
                        {/each}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div>
                {#if header}
                    {@render $header?.()}
                {/if}
            </div>
        </header>

        {@render children?.()}
    </SidebarInset>
</SidebarProvider>

<style lang="postcss">
    header {
        @apply flex flex-col shrink-0;
        @apply transition-all ease-linear;
        @apply group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12;

        > div {
            @apply w-full p-4;
            @apply border-b border-b-border;
        }

        .breadcrumb {
            @apply h-16 flex items-center gap-2;
        }
    }
</style>
