import type { PageServerLoad } from "./$types.js";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";

export const load: PageServerLoad = async ({ request, params }) => {
    const session = await auth.api.getSession(request);
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
            admin: await prisma.user.count({ where: { role: "admin" } })
        }
    };
};
