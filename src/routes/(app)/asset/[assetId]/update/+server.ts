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

    const data: { categoryId?: string | null, locationId?: string, tagIds?: string } = await request.json();
    if (!data) return error(400, { message: "No data provided" });

    if (data.categoryId !== undefined) {
        if (data.categoryId !== null) {
            const category = await prisma.category.findUnique({
                where: { id: data.categoryId, deleted: null }
            });
            if (!category) return error(404, { message: "Category not found" });
        }
        await prisma.asset.update({
            where: { id: assetId },
            data: {
                category: (data.categoryId === null ? { disconnect: true } : { connect: { id: data.categoryId } })
            }
        });
    }

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

    return json("Asset updated successfully");
}