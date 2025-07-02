import { prisma } from '$lib/prisma';
import type { Session } from "@auth/sveltekit";
import type { Category } from "@prisma/client";
import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event: RequestEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return error(403, "Unauthorized");

    const categories: Category[] = await prisma.category.findMany({
        orderBy: { name: "asc" },
        where: { deleted: null }
    });

    return json({ categories });
}
