import type { Session } from "@auth/sveltekit"
import type { LayoutServerLoad } from './$types';
import type { ServerLoadEvent } from "@sveltejs/kit";

export const load: LayoutServerLoad = async (event: ServerLoadEvent) => {
    const session: Session | null = await event.locals.auth();
    return { session };
}
