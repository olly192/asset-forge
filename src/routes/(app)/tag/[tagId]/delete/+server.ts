import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { Tag } from "@prisma/client"

export const POST: RequestHandler = async ({ request, params }: RequestEvent) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return error(403, "Unauthorized");

    const { tagId } = params;
    if (!tagId) return error(400, "Tag ID is required");

    const tag: Tag | null = await prisma.tag.findUnique({
        where: { id: tagId, deleted: null }
    });
    if (!tag) return error(404, "Tag not found");

    await prisma.tag.update({
        where: { id: tagId },
        data: { deleted: new Date() }
    });

    return json({ tagId });
}
