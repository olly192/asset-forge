import type { PageServerLoad, Actions, RequestEvent } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { assetTypeSchema } from "../../schema";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { AssetType } from "@prisma/client";

export const load: PageServerLoad = async ({ request, params }) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return;

    const { typeId } = params;
    if (!typeId) return fail(400, { message: "Asset type ID is required" });

    const assetType: AssetType | null = await prisma.assetType.findUnique({
        where: { id: typeId, deleted: null }
    });
    if (!assetType) return fail(404, { message: "Asset type not found" });

    const form = await superValidate(valibot(assetTypeSchema));
    form.data = {
        name: assetType.name,
        category: assetType?.categoryId || undefined
    };

    return { form };
};

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const session = await auth.api.getSession(event.request);
        if (!session?.user) return;

        const form = await superValidate(event, valibot(assetTypeSchema));
        if (!form.valid) return fail(400, { form });

        const { typeId } = event.params;
        if (!typeId) return fail(400, { message: "Asset type ID is required" });

        const assetType: AssetType | null = await prisma.assetType.findUnique({
            where: { id: typeId, deleted: null }
        });
        if (!assetType) return fail(404, { message: "Asset type not found" });

        await prisma.assetType.update({
            where: { id: typeId },
            data: {
                name: form.data.name,
                category: form.data.category ? { connect: { id: form.data.category } } : { disconnect: true }
            }
        })

        return { form };
    }
};
