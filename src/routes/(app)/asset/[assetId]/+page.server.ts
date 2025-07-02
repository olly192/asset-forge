import type { Session } from "@auth/sveltekit";
import type { PageServerLoad } from "./$types.js";
import { fail, type ServerLoadEvent } from "@sveltejs/kit";
import { prisma } from "$lib/prisma";
import type { FullAsset } from "$lib/types";
import type { Category, Location, Tag } from "@prisma/client";

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return;

    const { assetId } = event.params;
    if (!assetId) return fail(400, { message: "Asset ID is required" });

    const asset: FullAsset | null = await prisma.asset.findUnique({
        where: { id: assetId, deleted: null },
        include: { location: true, tags: true, type: { include: { category: true } } }
    });
    if (!asset) return fail(404, { message: "Asset not found" });

    const categories: Category[] = await prisma.category.findMany({ where: { deleted: null } });
    const tags: Tag[] = await prisma.tag.findMany({ where: { deleted: null } });
    const locations: Location[] = await prisma.location.findMany({ where: { deleted: null } });

    return { asset, categories, tags, locations };
};
