import type { Session } from "@auth/sveltekit";
import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/prisma";
import type { Asset } from "@prisma/client";

export const POST: RequestHandler = async (event: RequestEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return error(403, "Unauthorized");

    const { assetId } = event.params;
    if (!assetId) return error(400, "Asset ID is required");

    const asset: Asset | null = await prisma.asset.findUnique({
        where: { id: assetId, deleted: null }
    });
    if (!asset) return error(404, "Asset not found");

    await prisma.asset.update({
        where: { id: assetId },
        data: { archived: false }
    });

    return json({ assetId });
}
