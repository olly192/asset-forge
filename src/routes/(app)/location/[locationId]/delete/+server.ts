import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { Location } from "@prisma/client"

export const POST: RequestHandler = async ({ request, params }: RequestEvent) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return error(403, "Unauthorized");

    const { locationId } = params;
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
