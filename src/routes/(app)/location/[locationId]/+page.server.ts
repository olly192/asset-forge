import type { PageServerLoad } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { Location } from "@prisma/client"

export const load: PageServerLoad = async ({ request, params }) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return;

    const { locationId } = params;
    if (!locationId) return fail(400, { message: "Location ID is required" });

    const location: Location | null = await prisma.location.findUnique({
        where: { id: locationId, deleted: null }
    });
    if (!location) return fail(404, { message: "Location not found" });

    const locations: Location[] = await prisma.location.findMany({ where: { deleted: null } })

    return { location, locations };
};
