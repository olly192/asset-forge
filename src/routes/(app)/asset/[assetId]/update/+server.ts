import { error, json, type RequestHandler } from "@sveltejs/kit";
import { auth } from "$lib/auth";
import type { Asset } from "@prisma/client";
import { prisma } from "$lib/prisma";

export const POST: RequestHandler = async ({ request, params }) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return error(401, { message: "Unauthorized" });

    const { assetId } = params;
    if (!assetId) return error(400, { message: "Asset ID is required" });

    const asset: Asset | null = await prisma.asset.findUnique({
        where: { id: assetId, deleted: null }
    });
    if (!asset) return error(404, { message: "Asset not found" });

    const data: { locationId?: string, tagIds?: string[] } = await request.json();
    if (!data) return error(400, { message: "No data provided" });

    if (data.locationId !== undefined) {
        if (data.locationId !== null) {
            const location = await prisma.location.findUnique({
                where: { id: data.locationId, deleted: null }
            });
            if (!location) return error(404, { message: "Location not found" });
        }
        await prisma.asset.update({
            where: { id: assetId },
            data: {
                location: (data.locationId === null ? { disconnect: true } : { connect: { id: data.locationId } })
            }
        });
    }

    if(data.tagIds) {
        const tags = await prisma.tag.findMany({
            where: { id: { in: data.tagIds }, deleted: null }
        })
        if (tags.length !== data.tagIds.length) return error(404, { message: "Tags not found" });
        await prisma.asset.update({
            where: { id: assetId },
            data: {
                tags: { set: tags.map(tag => ({ id: tag.id })) }
            }
        });
    }

    return json("Asset updated successfully");
}