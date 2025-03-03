import { SvelteKitAuth } from "@auth/sveltekit";
import Keycloak from "@auth/sveltekit/providers/keycloak";
import { env } from "$env/dynamic/private";
import type { OAuthConfig } from "@auth/sveltekit/providers";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "$lib/prisma"

const providers: OAuthConfig<any>[] = [];

if (env.AUTH_KEYCLOAK_ID) {
    providers.push(Keycloak({
        clientId: env.AUTH_KEYCLOAK_ID,
        clientSecret: env.AUTH_KEYCLOAK_SECRET,
        issuer: env.AUTH_KEYCLOAK_ISSUER
    }));
}

export const { handle, signIn, signOut } = SvelteKitAuth({
    adapter: PrismaAdapter(prisma),
    providers,
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
    },
    secret: env.AUTH_SECRET
});
