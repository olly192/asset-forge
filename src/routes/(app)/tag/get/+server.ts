import { prisma } from '$lib/prisma';
import type { Tag } from "@prisma/client";
import { auth } from '$lib/auth';
import { error, json } from "@sveltejs/kit"

export async function GET({ request }) {
    const session = await auth.api.getSession(request);
    if (!session?.user) return error(403, "Unauthorized");

    const tags: Tag[] = await prisma.tag.findMany({
        where: { deleted: null },
        orderBy: { name: "asc" }
    });

    return json({ tags });
}
