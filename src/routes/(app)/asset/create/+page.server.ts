import type { FullCustomField } from "$lib/types";
import type { PageServerLoad, Actions, RequestEvent } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate, type SuperValidated } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { assetSchema } from "../schema";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { Asset, AssetType, Category } from "@prisma/client";

export const load: PageServerLoad = async ({ request, url }) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return;

    const assetId: string | null = url.searchParams.get("assetId");
    const typeId: string | null = url.searchParams.get("type");

    const customFields: FullCustomField[] = await prisma.customField.findMany({
        where: { deleted: null, archived: false, perInstance: true },
        orderBy: { name: "asc" },
        include: { tagLimit: true, categoryLimit: true }
    })

    const typeCustomFields: FullCustomField[] = await prisma.customField.findMany({
        where: { deleted: null, archived: false, perInstance: false },
        orderBy: { name: "asc" },
        include: { tagLimit: true, categoryLimit: true }
    })

    const form: SuperValidated<any> = await superValidate(valibot(assetSchema(customFields)));
    form.data = {
        assetId,
        type: typeId || null,
        tags: [],
        customFields: Object.fromEntries(
            customFields.map((field: FullCustomField) => [field.id, (field.options as { default: any })?.default])
        )
    };

    const assetTypes: AssetType[] = await prisma.assetType.findMany({
        where: { deleted: null },
        orderBy: { name: "asc" }
    })
    const categories: Category[] = await prisma.category.findMany({ where: { deleted: null } });

    return { form, customFields, typeCustomFields, assetTypes, categories };
};

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const session = await auth.api.getSession(event.request);
        if (!session?.user) return;

        const customFields: FullCustomField[] = await prisma.customField.findMany({
            where: { deleted: null, archived: false, perInstance: true },
            orderBy: { name: "asc" },
            include: { tagLimit: true, categoryLimit: true }
        })

        const form: SuperValidated<any> = await superValidate(
            event, valibot(assetSchema(customFields))
        );
        if (!form.valid) return fail(400, { form });

        const duplicateId: Asset | null = await prisma.asset.findFirst({
            where: { assetId: form.data.assetId, deleted: null }
        })
        if (duplicateId) return fail(400, { form, message: "Asset ID already exists" });

        const asset: Asset = await prisma.asset.create({
            data: {
                assetId: form.data.assetId,
                notes: form.data.notes || null,
                locationId: form.data.location || null,
                typeId: form.data.type,
                tags: { connect: form.data.tags ? form.data.tags.map((tagId: string) => ({ id: tagId })) : [] }
            }
        })

        for (const [fieldId, value] of Object.entries(form.data.customFields)) {
            const emptyVal: any = customFields.find((field: FullCustomField) => field.id === fieldId)?.options?.default;
            if (value !== emptyVal) {
                await prisma.customFieldAssetValue.create({
                    data: { customFieldId: fieldId, assetId: asset.id, value }
                });
            }
        }

        return { form };
    }
};
