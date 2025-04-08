<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { SiApple, SiDiscord, SiFacebook, SiGithub, SiGoogle, SiKeycloak } from "@icons-pack/svelte-simple-icons";
    import { LoaderCircle } from "lucide-svelte";
    import { signIn } from "$lib/auth-client.js";
    import { page } from "$app/state";

    let { provider, loading = $bindable() } = $props();

    const providers: Record<string, {name: string, icon: any, oauth?: boolean}> = {
        keycloak: { name: "Keycloak", icon: SiKeycloak, oauth: true },
        apple: { name: "Apple", icon: SiApple },
        discord: { name: "Discord", icon: SiDiscord },
        facebook: { name: "Facebook", icon: SiFacebook },
        github: { name: "GitHub", icon: SiGithub },
        google: { name: "Google", icon: SiGoogle }
    }
    let providerData = providers[provider];
    if (!providerData) throw new Error(`Unknown provider: ${provider}`);

    async function login() {
        let callbackURL = "/" + (page.url.searchParams.get("redirect") ?? "");
        loading = true;
        if (providerData.oauth) await signIn.oauth2({ providerId: provider, callbackURL });
        else await signIn.social({ provider, callbackURL });
        loading = false;
    }
</script>

<Button variant="outline" type="button" onclick={login} disabled={loading}>
    {#if loading}
        <LoaderCircle class="size-4 animate-spin" />
    {:else}
        <providerData.icon />
    {/if}
    {providerData.name}
</Button>
