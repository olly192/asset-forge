import type { Session } from "@auth/sveltekit";
import type { ServerLoadEvent } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { prisma } from "$lib/prisma";

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return;

    return {
        itemCounts: {
            asset: await prisma.asset.count({ where: { deleted: null, archived: false } }),
            assetArchived: await prisma.asset.count({ where: { deleted: null, archived: true } }),
            category: await prisma.category.count({ where: { deleted: null, archived: false } }),
            categoryArchived: await prisma.category.count({ where: { deleted: null, archived: true } }),
            location: await prisma.location.count({ where: { deleted: null, archived: false } }),
            locationArchived: await prisma.location.count({ where: { deleted: null, archived: true } }),
            tag: await prisma.tag.count({ where: { deleted: null, archived: false } }),
            tagArchived: await prisma.tag.count({ where: { deleted: null, archived: true } }),
            user: await prisma.user.count(),
            // TODO: Count admin users
            admin: await prisma.user.count()
        }
    };
};
