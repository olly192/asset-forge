import type { Session } from "@auth/sveltekit";
import type { LayoutServerLoad } from './$types';
import { redirect, type ServerLoadEvent } from "@sveltejs/kit";

export const load: LayoutServerLoad = async (event: ServerLoadEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return redirect(307, "/auth/login");
    return { user: session?.user };
};
