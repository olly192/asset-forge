import type { Session } from "@auth/sveltekit";
import type { PageServerLoad } from './$types';
import { redirect, type ServerLoadEvent } from "@sveltejs/kit";
import { signOut } from "$lib/auth";

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
    const session: Session | null = await event.locals.auth();
    if (session) signOut(event);
    return redirect(307, "/auth/login");
};
