<script lang="ts">
    import Sidebar from "$components/nav/Sidebar.svelte";
    import { Separator } from "$lib/components/ui/separator";
    import {
        Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink
    } from "$lib/components/ui/breadcrumb";
    import { SidebarProvider, SidebarInset, SidebarTrigger } from "$lib/components/ui/sidebar";
    import { breadcrumbs, header } from "$lib/stores";

    let { children } = $props();
    $breadcrumbs = [];
    $header = headerSnippet;
</script>

{#snippet headerSnippet()}
    <div class="flex flex-row justify-start items-center">
        <h1 class="text-4xl font-bold">Asset Forge</h1>
    </div>
{/snippet}

<SidebarProvider class="overflow-x-hidden">
    <Sidebar />
    <SidebarInset class="overflow-x-hidden">
        <header>
            <div class="breadcrumb">
                <SidebarTrigger class="-ml-1" />
                <Separator orientation="vertical" class="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {#each $breadcrumbs as breadcrumb, index}
                            {#if index === $breadcrumbs.length - 1}
                                <BreadcrumbItem>
                                    {breadcrumb.label}
                                </BreadcrumbItem>
                            {:else}
                                <BreadcrumbItem>
                                    {#if breadcrumb.href}
                                        <BreadcrumbLink>
                                            <a href={breadcrumb.href}>{breadcrumb.label}</a>
                                        </BreadcrumbLink>
                                    {:else}
                                        <BreadcrumbItem>
                                            {breadcrumb.label}
                                        </BreadcrumbItem>
                                    {/if}
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
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
