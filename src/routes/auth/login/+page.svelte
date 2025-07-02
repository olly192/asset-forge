<script lang="ts">
    import LoginButton from "./LoginButton.svelte";
    import { page } from "$app/state";

    const providers: { id: string, name: string }[] = page.data.providerMap;
</script>

<img src="/logo/text-white.svg" alt="Logo" class="mx-auto h-16" />

<div class="flex flex-col space-y-2 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">Log In</h1>
    <p class="text-muted-foreground text-sm">Select an option below to log in to your account.</p>
</div>

<div class="grid gap-2">
    {#each providers as provider}
        <LoginButton providerId={provider.id} providerName={provider.name} />
    {/each}
</div>
