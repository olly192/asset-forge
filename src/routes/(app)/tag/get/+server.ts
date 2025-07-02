import { prisma } from '$lib/prisma';
import type { Session } from "@auth/sveltekit";
import type { Tag } from "@prisma/client";
import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event: RequestEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return error(403, "Unauthorized");

    const tags: Tag[] = await prisma.tag.findMany({
        where: { deleted: null },
        orderBy: { name: "asc" }
    });

    return json({ tags });
}
