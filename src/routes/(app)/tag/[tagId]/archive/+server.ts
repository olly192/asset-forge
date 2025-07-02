import type { Session } from "@auth/sveltekit";
import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/prisma";
import type { Tag } from "@prisma/client"

export const POST: RequestHandler = async (event: RequestEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return error(403, "Unauthorized");

    const { tagId } = event.params;
    if (!tagId) return error(400, "Tag ID is required");

    const tag: Tag | null = await prisma.tag.findUnique({
        where: { id: tagId, deleted: null }
    });
    if (!tag) return error(404, "Tag not found");

    await prisma.tag.update({
        where: { id: tagId },
        data: { archived: true }
    });

    return json({ tagId });
}
