import { createAuthClient } from "better-auth/svelte";
import { adminClient, genericOAuthClient } from "better-auth/client/plugins";
import { goto } from "$app/navigation"
import { ac, roles } from "$lib/permissions";

export const authClient = createAuthClient({
    plugins: [
        genericOAuthClient(),
        adminClient({ ac, roles })
    ]
});

export const signOut = async (): Promise<any> => await authClient.signOut({
    fetchOptions: { onSuccess: (): Promise<void> => goto("/auth/login") }
});

export const { signIn, signUp, useSession } = authClient;
