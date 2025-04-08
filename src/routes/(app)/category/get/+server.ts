import { prisma } from '$lib/prisma';
import type { Category } from "@prisma/client";
import { auth } from '$lib/auth';
import { error, json } from "@sveltejs/kit"

export async function GET({ request }) {
    const session = await auth.api.getSession(request);
    if (!session?.user) return error(403, "Unauthorized");

    const categories: Category[] = await prisma.category.findMany({ where: { deleted: null } });

    return json({ categories });
}
