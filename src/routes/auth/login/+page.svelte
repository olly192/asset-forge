<script lang="ts">
    import LoginButton from "./LoginButton.svelte";
    import { page } from "$app/state";

    const providers: string[] = page.data.providers;
    let loading = $state(false);
</script>

<img src="/logo/text-white.svg" alt="Logo" class="mx-auto h-16" />

<div class="flex flex-col space-y-2 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">Log In</h1>
    <p class="text-muted-foreground text-sm">Select an option below to log in to your account.</p>
</div>

<div class="grid gap-2">
    <!-- <div class="relative"> -->
    <!--     <div class="absolute inset-0 flex items-center"> -->
    <!--         <span class="w-full border-t"></span> -->
    <!--     </div> -->
    <!--     <div class="relative flex justify-center text-xs uppercase"> -->
    <!--         <span class="bg-background text-muted-foreground px-2"> or continue with </span> -->
    <!--     </div> -->
    <!-- </div> -->
    {#if providers.includes("keycloak")}
        <LoginButton provider="keycloak" bind:loading />
    {/if}
    {#if providers.includes("apple")}
        <LoginButton provider="apple" bind:loading />
    {/if}
    {#if providers.includes("discord")}
        <LoginButton provider="discord" bind:loading />
    {/if}
    {#if providers.includes("facebook")}
        <LoginButton provider="facebook" bind:loading />
    {/if}
    {#if providers.includes("github")}
        <LoginButton provider="github" bind:loading />
    {/if}
    {#if providers.includes("google")}
        <LoginButton provider="google" bind:loading />
    {/if}
</div>
