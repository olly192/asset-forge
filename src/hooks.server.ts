import { svelteKitHandler } from "better-auth/svelte-kit";
import { auth } from "$lib/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    return svelteKitHandler({ event, resolve, auth });
}
