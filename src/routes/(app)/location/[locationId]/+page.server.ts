import type { Session } from "@auth/sveltekit";
import type { PageServerLoad } from "./$types.js";
import { fail, type ServerLoadEvent } from "@sveltejs/kit";
import { prisma } from "$lib/prisma";
import type { Location } from "@prisma/client"

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return;

    const { locationId } = event.params;
    if (!locationId) return fail(400, { message: "Location ID is required" });

    const location: Location | null = await prisma.location.findUnique({
        where: { id: locationId, deleted: null }
    });
    if (!location) return fail(404, { message: "Location not found" });

    const locations: Location[] = await prisma.location.findMany({ where: { deleted: null } })

    return { location, locations };
};
