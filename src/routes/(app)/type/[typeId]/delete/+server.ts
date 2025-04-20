import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { AssetType } from "@prisma/client"

export const POST: RequestHandler = async ({ request, params }: RequestEvent) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return error(403, "Unauthorized");

    const { typeId } = params;
    if (!typeId) return error(400, "Asset type ID is required");

    const assetType: AssetType | null = await prisma.assetType.findUnique({
        where: { id: typeId, deleted: null }
    });
    if (!assetType) return error(404, "Asset type not found");

    await prisma.assetType.update({
        where: { id: typeId },
        data: { deleted: new Date() }
    });

    return json({ typeId });
}
