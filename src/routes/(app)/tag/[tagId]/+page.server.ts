import type { PageServerLoad } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { Tag } from "@prisma/client";

export const load: PageServerLoad = async ({ request, params }) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return;

    const { tagId } = params;
    if (!tagId) return fail(400, { message: "Tag ID is required" });

    const tag: Tag | null = await prisma.tag.findUnique({
        where: { id: tagId, deleted: null }
    });
    if (!tag) return fail(404, { message: "Tag not found" });

    const tags: Tag[] = await prisma.tag.findMany({ where: { deleted: null } });

    return { tag, tags };
};
