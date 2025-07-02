import type { Session } from "@auth/sveltekit";
import type { ServerLoadEvent } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event: ServerLoadEvent) => {
    const session: Session | null = await event.locals.auth();
    return { session };
}
