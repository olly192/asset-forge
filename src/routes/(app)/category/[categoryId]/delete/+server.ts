import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { Category } from "@prisma/client"

export const POST: RequestHandler = async ({ request, params }: RequestEvent) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return error(403, "Unauthorized");

    const { categoryId } = params;
    if (!categoryId) return error(400, "Category ID is required");

    const category: Category | null = await prisma.category.findUnique({
        where: { id: categoryId, deleted: null }
    });
    if (!category) return error(404, "Category not found");

    await prisma.category.update({
        where: { id: categoryId },
        data: { deleted: new Date() }
    });

    return json({ categoryId });
}
