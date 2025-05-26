import type { AssetType } from "@prisma/client";
import type { FullCustomField } from "../../field/columns";
import type { PageServerLoad, Actions, RequestEvent } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { assetTypeSchema } from "../schema";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";

export const load: PageServerLoad = async ({ request }) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return;

    const customFields: FullCustomField[] = await prisma.customField.findMany({
        where: { deleted: null, archived: false, perInstance: false },
        orderBy: { name: "asc" },
        include: { tagLimit: true, categoryLimit: true }
    })
    const form = await superValidate(valibot(assetTypeSchema(customFields)));

    customFields.forEach(
        (field: FullCustomField) => form.data.customFields[field.id] = (field.options as { default: any })?.default
    );

    return { form, customFields };
};

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const session = await auth.api.getSession(event.request);
        if (!session?.user) return;

        const customFields: FullCustomField[] = await prisma.customField.findMany({
            where: { deleted: null, archived: false, perInstance: false },
            orderBy: { name: "asc" },
            include: { tagLimit: true, categoryLimit: true }
        })

        const form = await superValidate(event, valibot(assetTypeSchema(customFields)));
        if (!form.valid) return fail(400, { form });

        console.log("Data:", form.data)

        const assetType: AssetType = await prisma.assetType.create({
            data: {
                name: form.data.name,
                displayName: form.data.displayName,
                description: form.data.description,
                brand: form.data.brand,
                value: form.data.value,
                category: form.data.category ? { connect: { id: form.data.category } } : undefined,
                images: { set: form.data.images ? form.data.images : [] }
            }
        })

        await prisma.customFieldTypeValue.createMany({
            data: Object.keys(form.data.customFields).map((id: string) => (form.data.customFields[id] ? {
                customFieldId: id,
                assetTypeId: assetType.id,
                value: form.data.customFields[id]
            } : undefined)).filter(data => data !== undefined)
        })

        return { form };
    }
};
