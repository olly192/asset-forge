import type { AssetWithTagsAndType, FullCustomField } from "$lib/types";
import type { PageServerLoad, Actions, RequestEvent } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate, type SuperValidated } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { assetSchema } from "../../schema";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { Asset, AssetType, Category, CustomFieldAssetValue, CustomFieldTypeValue } from "@prisma/client";

export const load: PageServerLoad = async ({ request, params }) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return;

    const { assetId } = params;
    if (!assetId) return fail(400, { message: "Asset ID is required" });

    const asset: AssetWithTagsAndType | null = await prisma.asset.findUnique({
        where: { id: assetId, deleted: null },
        include: { tags: true, type: true }
    });
    if (!asset) return fail(404, { message: "Asset not found" });

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

    const form: SuperValidated<any> = await superValidate(valibot(assetSchema(customFields, typeCustomFields)));
    form.data = {
        assetId: asset.assetId,
        notes: asset.notes || undefined,
        location: asset.locationId || undefined,
        typeId: asset.typeId,
        individualType: asset.type.individualType,
        type: {
            name: asset.type.name,
            displayName: asset.type.displayName || undefined,
            description: asset.type.description || undefined,
            brand: asset.type.brand || undefined,
            value: asset.type.value || undefined,
            category: asset.type?.categoryId || undefined,
            images: asset.type.images || [],
        },
        tags: asset.tags.map(tag => tag.id) || [],
        customFields: Object.fromEntries(
            customFields.map((field: FullCustomField) => [field.id, (field.options as { default: any })?.default])
        ),
        typeCustomFields: Object.fromEntries(
            typeCustomFields.map((field: FullCustomField) => [field.id, (field.options as { default: any })?.default])
        )
    };

    const customFieldValues: CustomFieldAssetValue[] = await prisma.customFieldAssetValue.findMany({
        where: { assetId }
    })
    customFieldValues.forEach((data: CustomFieldAssetValue) => form.data.customFields[data.customFieldId] = data.value);

    const typeCustomFieldValues: CustomFieldTypeValue[] = await prisma.customFieldTypeValue.findMany({
        where: { assetTypeId: asset.typeId }
    })
    typeCustomFieldValues.forEach(
        (data: CustomFieldTypeValue) => form.data.typeCustomFields[data.customFieldId] = data.value
    );

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

        const typeCustomFields: FullCustomField[] = await prisma.customField.findMany({
            where: { deleted: null, archived: false, perInstance: false },
            orderBy: { name: "asc" },
            include: { tagLimit: true, categoryLimit: true }
        })

        const form: SuperValidated<any> = await superValidate(
            event, valibot(assetSchema(customFields, typeCustomFields))
        );
        if (!form.valid) return fail(400, { form });

        const { assetId } = event.params;
        if (!assetId) return fail(400, { message: "Asset ID is required" });

        const asset: Asset | null = await prisma.asset.findUnique({
            where: { id: assetId, deleted: null }
        });
        if (!asset) return fail(404, { message: "Asset not found" });

        let assetTypeId: string = form.data.typeId;
        if (form.data.individualType) {
            await prisma.assetType.update({
                where: { id: asset.typeId },
                data: {
                    name: form.data.type.name,
                    displayName: form.data.type.displayName,
                    description: form.data.type.description,
                    brand: form.data.type.brand,
                    value: form.data.type.value,
                    category: form.data.type.category ? { connect: { id: form.data.type.category } }
                        : { disconnect: true },
                    images: { set: form.data.type.images ? form.data.type.images : [] },
                    individualType: true
                }
            })

            for (const [fieldId, value] of Object.entries(form.data.typeCustomFields)) {
                const emptyVal: any = customFields.find(
                    (field: FullCustomField) => field.id === fieldId
                )?.options?.default;
                if (value !== emptyVal) {
                    await prisma.customFieldTypeValue.upsert({
                        where: { id: { customFieldId: fieldId, assetTypeId: asset.typeId } },
                        create: { customFieldId: fieldId, assetTypeId: asset.typeId, value },
                        update: { value }
                    });
                } else {
                    await prisma.customFieldTypeValue.deleteMany({
                        where: { customFieldId: fieldId, assetTypeId: asset.typeId }
                    });
                }
            }

            assetTypeId = asset.typeId;
        }
        await prisma.asset.update({
            where: { id: assetId },
            data: {
                assetId: form.data.assetId,
                notes: form.data.notes || null,
                locationId: form.data.location || null,
                typeId: assetTypeId,
                tags: { set: form.data.tags ? form.data.tags.map((tagId: string) => ({ id: tagId })) : [] }
            }
        })

        for (const [fieldId, value] of Object.entries(form.data.customFields)) {
            const emptyVal: any = customFields.find((field: FullCustomField) => field.id === fieldId)?.options?.default;
            if (value !== emptyVal) {
                await prisma.customFieldAssetValue.upsert({
                    where: { id: { customFieldId: fieldId, assetId } },
                    create: { customFieldId: fieldId, assetId, value },
                    update: { value }
                });
            } else {
                await prisma.customFieldAssetValue.deleteMany({ where: { customFieldId: fieldId, assetId } });
            }
        }

        return { form };
    }
};
