<script lang="ts">
    import { signIn, signOut } from '$lib/auth-client';
    import type { LayoutProps } from "./$types"
    import { breadcrumbs, header } from "$lib/stores";

    let { data }: LayoutProps = $props();
    const user = data?.user

    $breadcrumbs = [{ label: "Dashboard", href: "/" }];
    $header = headerSnippet;
</script>

{#snippet headerSnippet()}
    <div class="flex flex-row justify-between items-center">
        <h1 class="text-4xl font-bold">Dashboard</h1>
    </div>
{/snippet}

<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
    <div class="grid auto-rows-min gap-4 md:grid-cols-3">
        <div class="bg-muted/50 aspect-video rounded-xl">
            {#if user}
                <p>Logged in as {user.name} ({user.email})</p>
                <button onclick={async () => { await signOut() }}>Log out</button>
            {:else}
                <button onclick={async () => { await signIn.oauth2({ providerId: "keycloak" }) }}>Log in</button>
            {/if}
        </div>
        <div class="bg-muted/50 aspect-video rounded-xl"></div>
        <div class="bg-muted/50 aspect-video rounded-xl"></div>
    </div>
    <div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min"></div>
</div>
