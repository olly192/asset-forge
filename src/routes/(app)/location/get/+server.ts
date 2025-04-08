import { prisma } from '$lib/prisma';
import type { Location } from "@prisma/client";
import { auth } from '$lib/auth';
import { error, json } from "@sveltejs/kit"

export async function GET({ request }) {
    const session = await auth.api.getSession(request);
    if (!session?.user) return error(403, "Unauthorized");

    const locations: Location[] = await prisma.location.findMany({ where: { deleted: null } });

    return json({ locations });
}
