import { providerMap, signIn } from "$lib/auth";
import type { Session } from "@auth/sveltekit";
import { redirect, type ServerLoadEvent } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
    const session: Session | null = await event.locals.auth();
    if (session) return redirect(307, "/");

    return { providerMap };
}

export const actions: Actions = { default: signIn };
