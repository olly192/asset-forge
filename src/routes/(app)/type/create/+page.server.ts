import type { FullCustomField } from "$lib/types";
import type { Session } from "@auth/sveltekit";
import type { AssetType } from "@prisma/client";
import type { PageServerLoad, Actions, RequestEvent } from "./$types.js";
import { fail, type ServerLoadEvent } from "@sveltejs/kit";
import { superValidate, type SuperValidated } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { assetTypeSchema } from "../schema";
import { prisma } from "$lib/prisma";

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
    const session: Session | null = await event.locals.auth();
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
        const session: Session | null = await event.locals.auth();
        if (!session?.user) return;

        const customFields: FullCustomField[] = await prisma.customField.findMany({
            where: { deleted: null, archived: false, perInstance: false },
            orderBy: { name: "asc" },
            include: { tagLimit: true, categoryLimit: true }
        })

        const form: SuperValidated<any> & { assetTypeId?: string } = await superValidate(
            event, valibot(assetTypeSchema(customFields))
        );
        if (!form.valid) return fail(400, { form });

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
        form.assetTypeId = assetType.id;

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
