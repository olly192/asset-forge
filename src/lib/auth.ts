import { env } from "$env/dynamic/private";
import { SvelteKitAuth } from "@auth/sveltekit";
import Apple from "@auth/sveltekit/providers/apple"
import Auth0 from "@auth/sveltekit/providers/auth0"
import Authentik from "@auth/sveltekit/providers/authentik";
import Discord from "@auth/sveltekit/providers/discord"
import GitHub from "@auth/sveltekit/providers/github"
import Google from "@auth/sveltekit/providers/google"
import Keycloak from "@auth/sveltekit/providers/keycloak";
import type { Provider } from "@auth/sveltekit/providers";

const providers: Provider[] = [];

if (env.AUTH_APPLE_ID && env.AUTH_APPLE_SECRET) {
    providers.push(Apple);
}

if (env.AUTH_AUTH0_ID && env.AUTH_AUTH0_SECRET) {
    providers.push(Auth0);
}

if (env.AUTH_AUTHENTIK_ID && env.AUTH_AUTHENTIK_SECRET && env.AUTH_AUTHENTIK_ISSUER) {
    providers.push(Authentik);
}

if (env.AUTH_DISCORD_ID && env.AUTH_DISCORD_SECRET) {
    providers.push(Discord);
}

if (env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET) {
    providers.push(GitHub);
}

if (env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET) {
    providers.push(Google);
}

if (env.AUTH_KEYCLOAK_ID && env.AUTH_KEYCLOAK_SECRET && env.AUTH_KEYCLOAK_ISSUER) {
    providers.push(Keycloak);
}

export const providerMap: { id: string, name: string }[] = providers.map((provider: Provider) => {
    if (typeof provider === "function") {
        const providerData = provider();
        return { id: providerData.id, name: providerData.name };
    } else {
        return { id: provider.id, name: provider.name };
    }
})

export const { handle, signIn, signOut } = SvelteKitAuth({
    providers,
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout"
    },
    trustHost: env.AUTH_TRUST_HOST === "true"
})
