import { prisma } from '$lib/prisma';
import type { FullCustomField } from "$lib/types";
import type { Session } from "@auth/sveltekit";
import type { Category, Tag } from "@prisma/client";
import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event: RequestEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return error(403, "Unauthorized");

    const customFields: FullCustomField[] = await prisma.customField.findMany({
        orderBy: { name: "asc" },
        where: { deleted: null },
        include: {
            tagLimit: true,
            categoryLimit: true
        }
    });

    const categories: Category[] = await prisma.category.findMany({ where: { deleted: null } });
    const tags: Tag[] = await prisma.tag.findMany({ where: { deleted: null } });

    return json({ customFields, categories, tags });
}
