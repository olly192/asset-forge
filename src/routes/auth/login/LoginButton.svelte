<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { signIn } from "@auth/sveltekit/client";
    import {
        SiApple, SiAuth0, SiAuthentik, SiDiscord, SiGithub, SiGoogle, SiKeycloak
    } from "@icons-pack/svelte-simple-icons";

    let { providerId, providerName }: { providerId: string, providerName: string} = $props();

    const ProviderIcon = {
        apple: SiApple,
        auth0: SiAuth0,
        authentik: SiAuthentik,
        discord: SiDiscord,
        github: SiGithub,
        google: SiGoogle,
        keycloak: SiKeycloak
    }[providerId]
</script>

<Button variant="outline" onclick={() => signIn(providerId)}>
    <ProviderIcon />
    {providerName}
</Button>
