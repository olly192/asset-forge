import { prisma } from '$lib/prisma';
import { auth } from '$lib/auth';
import type { FullCustomField } from "$lib/types";
import type { Category, Tag } from "@prisma/client";
import { error, json } from "@sveltejs/kit"

export async function GET({ request }) {
    const session = await auth.api.getSession(request);
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
