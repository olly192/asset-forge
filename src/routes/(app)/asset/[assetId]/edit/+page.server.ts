import type { UnmappedAssetWithTags } from "$lib/types";
import type { PageServerLoad, Actions, RequestEvent } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { assetSchema } from "../../schema";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { Asset, AssetType, Category } from "@prisma/client";

export const load: PageServerLoad = async ({ request, params }) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return;

    const { assetId } = params;
    if (!assetId) return fail(400, { message: "Asset ID is required" });

    const asset: UnmappedAssetWithTags | null = await prisma.asset.findUnique({
        where: { id: assetId, deleted: null },
        include: { tags: true }
    });
    if (!asset) return fail(404, { message: "Asset not found" });

    const form = await superValidate(valibot(assetSchema));
    form.data = {
        assetId: asset.assetId,
        notes: asset.notes || undefined,
        location: asset.locationId || undefined,
        type: asset.typeId,
        tags: asset.tags.map(tag => tag.id) || undefined
    };

    const assetTypes: AssetType[] = await prisma.assetType.findMany({
        where: { deleted: null },
        orderBy: { name: "asc" }
    })
    const categories: Category[] = await prisma.category.findMany({ where: { deleted: null } });

    return { form, assetTypes, categories };
};

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const session = await auth.api.getSession(event.request);
        if (!session?.user) return;

        const form = await superValidate(event, valibot(assetSchema));
        if (!form.valid) return fail(400, { form });

        const { assetId } = event.params;
        if (!assetId) return fail(400, { message: "Asset ID is required" });

        const asset: Asset | null = await prisma.asset.findUnique({
            where: { id: assetId, deleted: null }
        });
        if (!asset) return fail(404, { message: "Asset not found" });

        await prisma.asset.update({
            where: { id: assetId },
            data: {
                assetId: form.data.assetId,
                notes: form.data.notes || null,
                locationId: form.data.location || null,
                typeId: form.data.type,
                tags: { set: form.data.tags ? form.data.tags.map(tagId => ({ id: tagId })) : [] }
            }
        })

        return { form };
    }
};
