import { SvelteKitAuth } from "@auth/sveltekit";
import Apple from "@auth/sveltekit/providers/apple"
import Auth0 from "@auth/sveltekit/providers/auth0"
import Authentik from "@auth/sveltekit/providers/authentik";
import Discord from "@auth/sveltekit/providers/discord"
import GitHub from "@auth/sveltekit/providers/github"
import Google from "@auth/sveltekit/providers/google"
import Keycloak from "@auth/sveltekit/providers/keycloak";
import type { Provider } from "@auth/sveltekit/providers";

const providers: Provider[] = [Keycloak];

if (process.env.AUTH_APPLE_ID && process.env.AUTH_APPLE_SECRET) {
    providers.push(Apple);
}

if (process.env.AUTH_AUTH0_ID && process.env.AUTH_AUTH0_SECRET) {
    providers.push(Auth0);
}

if (process.env.AUTH_AUTHENTIK_ID && process.env.AUTH_AUTHENTIK_SECRET && process.env.AUTH_AUTHENTIK_ISSUER) {
    providers.push(Authentik);
}

if (process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET) {
    providers.push(Discord);
}

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
    providers.push(GitHub);
}

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
    providers.push(Google);
}

if (process.env.AUTH_KEYCLOAK_ID && process.env.AUTH_KEYCLOAK_SECRET && process.env.AUTH_KEYCLOAK_ISSUER) {
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
    }
})
