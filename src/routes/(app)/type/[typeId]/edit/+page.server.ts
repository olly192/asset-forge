import type { FullCustomField } from "$lib/types";
import type { Session } from "@auth/sveltekit";
import type { PageServerLoad, Actions, RequestEvent } from "./$types.js";
import { fail, type ServerLoadEvent } from "@sveltejs/kit";
import { superValidate, type SuperValidated } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { assetTypeSchema } from "../../schema";
import { prisma } from "$lib/prisma";
import type { AssetType, CustomFieldTypeValue } from "@prisma/client";

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return;

    const { typeId } = event.params;
    if (!typeId) return fail(400, { message: "Asset type ID is required" });

    const assetType: AssetType | null = await prisma.assetType.findUnique({
        where: { id: typeId, deleted: null }
    });
    if (!assetType) return fail(404, { message: "Asset type not found" });

    const customFields: FullCustomField[] = await prisma.customField.findMany({
        where: { deleted: null, archived: false, perInstance: false },
        orderBy: { name: "asc" },
        include: { tagLimit: true, categoryLimit: true }
    })

    const form: SuperValidated<any> = await superValidate(valibot(assetTypeSchema(customFields)));
    form.data = {
        name: assetType.name,
        displayName: assetType.displayName || undefined,
        description: assetType.description || undefined,
        brand: assetType.brand || undefined,
        value: assetType.value || undefined,
        category: assetType?.categoryId || undefined,
        images: assetType.images || [],
        customFields: Object.fromEntries(
            customFields.map((field: FullCustomField) => [field.id, (field.options as { default: any })?.default])
        )
    };

    const customFieldValues: CustomFieldTypeValue[] = await prisma.customFieldTypeValue.findMany({
        where: { assetTypeId: typeId }
    })
    customFieldValues.forEach((data: CustomFieldTypeValue) => form.data.customFields[data.customFieldId] = data.value);

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

        const form: SuperValidated<any> = await superValidate(event, valibot(assetTypeSchema(customFields)));
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
                displayName: form.data.displayName,
                description: form.data.description,
                brand: form.data.brand,
                value: form.data.value,
                category: form.data.category ? { connect: { id: form.data.category } } : { disconnect: true },
                images: { set: form.data.images ? form.data.images : [] }
            }
        })

        for (const [fieldId, value] of Object.entries(form.data.customFields)) {
            const emptyVal: any = customFields.find((field: FullCustomField) => field.id === fieldId)?.options?.default;
            if (value !== emptyVal) {
                await prisma.customFieldTypeValue.upsert({
                    where: { id: { customFieldId: fieldId, assetTypeId: typeId } },
                    create: { customFieldId: fieldId, assetTypeId: typeId, value },
                    update: { value }
                });
            } else {
                await prisma.customFieldTypeValue.deleteMany({
                    where: { customFieldId: fieldId, assetTypeId: typeId }
                });
            }
        }

        return { form };
    }
};
