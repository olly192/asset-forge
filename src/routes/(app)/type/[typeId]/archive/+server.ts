import type { Session } from "@auth/sveltekit";
import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/prisma";
import type { AssetType } from "@prisma/client"

export const POST: RequestHandler = async (event: RequestEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return error(403, "Unauthorized");

    const { typeId } = event.params;
    if (!typeId) return error(400, "Asset type ID is required");

    const assetType: AssetType | null = await prisma.assetType.findUnique({
        where: { id: typeId, deleted: null }
    });
    if (!assetType) return error(404, "Asset type not found");

    await prisma.assetType.update({
        where: { id: typeId },
        data: { archived: true }
    });

    return json({ typeId });
}
