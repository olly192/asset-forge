import { prisma } from '$lib/prisma';
import type { FullCustomField } from "$lib/types";
import type { Session } from "@auth/sveltekit";
import type { AssetType, Category, CustomFieldTypeValue } from "@prisma/client";
import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event: RequestEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return error(403, "Unauthorized");

    const typeId: string | null = event.url.searchParams.get("id");
    if (typeId) {
        const assetType: AssetType | null = await prisma.assetType.findUnique({
            where: { id: typeId, deleted: null }
        });
        if (!assetType) return error(404, "Asset type not found");

        let typeCustomFields: FullCustomField[] = await prisma.customField.findMany({
            where: { deleted: null, archived: false, perInstance: false },
            orderBy: { name: "asc" },
            include: { tagLimit: true, categoryLimit: true }
        })
        typeCustomFields = typeCustomFields.filter((field: FullCustomField) => (
            !field.categoryLimit || field.categoryLimitId === assetType.categoryId
        ));
        const typeCustomFieldValues: CustomFieldTypeValue[] = await prisma.customFieldTypeValue.findMany({
            where: { assetTypeId: typeId }
        })
        return json({ assetType, customFields: typeCustomFields, customFieldValues: typeCustomFieldValues });
    }

    const assetTypes = await prisma.assetType.findMany({
        orderBy: { name: "asc" },
        where: { deleted: null }
    });
    const categories: Category[] = await prisma.category.findMany({
        orderBy: { name: "asc" },
        where: { deleted: null }
    });

    return json({ assetTypes, categories });
}
