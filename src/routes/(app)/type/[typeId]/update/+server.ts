import type { Session } from "@auth/sveltekit";
import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import type { AssetType } from "@prisma/client";
import { prisma } from "$lib/prisma";

export const POST: RequestHandler = async (event: RequestEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return error(401, { message: "Unauthorized" });

    const { typeId } = event.params;
    if (!typeId) return error(400, { message: "Asset type ID is required" });

    const assetType: AssetType | null = await prisma.assetType.findUnique({
        where: { id: typeId, deleted: null }
    });
    if (!assetType) return error(404, { message: "Asset type not found" });

    const data: { categoryId?: string } = await event.request.json();
    if (!data) return error(400, { message: "No data provided" });

    if (data.categoryId !== undefined) {
        if (data.categoryId !== null) {
            const category = await prisma.category.findUnique({
                where: { id: data.categoryId, deleted: null }
            });
            if (!category) return error(404, { message: "Category not found" });
        }
        await prisma.assetType.update({
            where: { id: typeId },
            data: {
                category: (data.categoryId === null ? { disconnect: true } : { connect: { id: data.categoryId } })
            }
        });
    }

    return json("Asset type updated successfully");
}