import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, genericOAuth } from "better-auth/plugins";
import { prisma } from "./prisma";
import type { SocialProviders } from "better-auth/social-providers";
import { ac, roles } from "$lib/permissions";

export let providers: string[] = [];
let socialProviders: SocialProviders = {};

if (process.env.AUTH_APPLE_CLIENT_ID && process.env.AUTH_APPLE_CLIENT_SECRET) {
    socialProviders.apple = {
        clientId: process.env.AUTH_APPLE_CLIENT_ID,
        clientSecret: process.env.AUTH_APPLE_CLIENT_SECRET
    };
    if (process.env.AUTH_APPLE_APP_BUNDLE_IDENTIFIER) {
        socialProviders.apple.appBundleIdentifier = process.env.AUTH_APPLE_APP_BUNDLE_IDENTIFIER;
    }
    providers.push("apple");
}

if (process.env.AUTH_DISCORD_CLIENT_ID && process.env.AUTH_DISCORD_CLIENT_SECRET) {
    socialProviders.discord = {
        clientId: process.env.AUTH_DISCORD_CLIENT_ID,
        clientSecret: process.env.AUTH_DISCORD_CLIENT_SECRET
    };
    providers.push("discord");
}

if (process.env.AUTH_FACEBOOK_CLIENT_ID && process.env.AUTH_FACEBOOK_CLIENT_SECRET) {
    socialProviders.facebook = {
        clientId: process.env.AUTH_FACEBOOK_CLIENT_ID,
        clientSecret: process.env.AUTH_FACEBOOK_CLIENT_SECRET
    };
    providers.push("facebook");
}

if (process.env.AUTH_GITHUB_CLIENT_ID && process.env.AUTH_GITHUB_CLIENT_SECRET) {
    socialProviders.github = {
        clientId: process.env.AUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET
    };
    providers.push("github");
}

if (process.env.AUTH_GOOGLE_CLIENT_ID && process.env.AUTH_GOOGLE_CLIENT_SECRET) {
    socialProviders.google = {
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET
    };
    providers.push("google");
}

let genericOauthProviders = [];

if (process.env.AUTH_KEYCLOAK_ID && process.env.AUTH_KEYCLOAK_SECRET && process.env.AUTH_KEYCLOAK_DISCOVERY) {
    genericOauthProviders.push({
        providerId: "keycloak",
        clientId: process.env.AUTH_KEYCLOAK_ID,
        clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
        discoveryUrl: process.env.AUTH_KEYCLOAK_DISCOVERY,
        scopes: ["openid", "email", "profile"]
    });
    providers.push("keycloak");
}

export const auth = betterAuth({
    secret: process.env.AUTH_SECRET,
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: { enabled: true },
    socialProviders,
    plugins: [
        genericOAuth({ config: genericOauthProviders }),
        admin({ ac, roles })
    ]
});
