import type { PageServerLoad } from './$types';
import { redirect } from "@sveltejs/kit";
import { auth } from "$lib/auth";

export const load: PageServerLoad = async ({ request }) => {
    const session = await auth.api.getSession(request);
    if (session) await auth.api.signOut(request);
    return redirect(307, "/auth/login");
};
