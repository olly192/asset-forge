import type { LayoutServerLoad } from './$types';
import { auth, providers } from "$lib/auth";

export const load: LayoutServerLoad = async ({ request }) => {
    const session = await auth.api.getSession(request);
    return { user: session?.user, providers };
};
