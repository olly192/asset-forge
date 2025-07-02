import type { Session } from "@auth/sveltekit";
import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/prisma";
import type { Location } from "@prisma/client"

export const POST: RequestHandler = async (event: RequestEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return error(403, "Unauthorized");

    const { locationId } = event.params;
    if (!locationId) return error(400, "Location ID is required");

    const location: Location | null = await prisma.location.findUnique({
        where: { id: locationId, deleted: null }
    });
    if (!location) return error(404, "Location not found");

    await prisma.location.update({
        where: { id: locationId },
        data: { deleted: new Date() }
    });

    return json({ locationId });
}
