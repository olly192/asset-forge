import type { Session } from "@auth/sveltekit";
import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/prisma";
import type { Category } from "@prisma/client"

export const POST: RequestHandler = async (event: RequestEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return error(403, "Unauthorized");

    const { categoryId } = event.params;
    if (!categoryId) return error(400, "Category ID is required");

    const category: Category | null = await prisma.category.findUnique({
        where: { id: categoryId, deleted: null }
    });
    if (!category) return error(404, "Category not found");

    await prisma.category.update({
        where: { id: categoryId },
        data: { archived: false }
    });

    return json({ categoryId });
}
