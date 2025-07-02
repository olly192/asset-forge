import type { FullCustomField } from "$lib/types";
import type { Session } from "@auth/sveltekit";
import type { PageServerLoad, Actions, RequestEvent } from "./$types.js";
import { fail, type ServerLoadEvent } from "@sveltejs/kit";
import { superValidate, type SuperValidated } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { assetSchema } from "../schema";
import { prisma } from "$lib/prisma";
import type { Asset, AssetType, Category } from "@prisma/client";

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return;

    const assetId: string | null = event.url.searchParams.get("assetId");
    const typeId: string | null = event.url.searchParams.get("type");

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
        assetId,
        typeId: typeId || null,
        individualType: typeId === null,
        type: {},
        tags: [],
        customFields: Object.fromEntries(
            customFields.map((field: FullCustomField) => [field.id, (field.options as { default: any })?.default])
        ),
        typeCustomFields: Object.fromEntries(
            typeCustomFields.map((field: FullCustomField) => [field.id, (field.options as { default: any })?.default])
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
        const session: Session | null = await event.locals.auth();
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

        const duplicateId: Asset | null = await prisma.asset.findFirst({
            where: { assetId: form.data.assetId, deleted: null }
        })
        if (duplicateId) return fail(400, { form, message: "Asset ID already exists" });

        let assetTypeId: string = form.data.typeId;
        if (form.data.individualType) {
            const assetType: AssetType = await prisma.assetType.create({
                data: {
                    name: form.data.type.name,
                    displayName: form.data.type.displayName,
                    description: form.data.type.description,
                    brand: form.data.type.brand,
                    value: form.data.type.value,
                    category: form.data.type.category ? { connect: { id: form.data.type.category } } : undefined,
                    images: { set: form.data.type.images ? form.data.type.images : [] },
                    individualType: true
                }
            })

            await prisma.customFieldTypeValue.createMany({
                data: Object.keys(form.data.typeCustomFields).map((id: string) => {
                    const defaultVal: any = typeCustomFields.find(
                        (field: FullCustomField) => field.id === id
                    )?.options?.default;
                    if (form.data.typeCustomFields[id] === defaultVal) return undefined;
                    if (form.data.typeCustomFields[id] === undefined) return undefined;
                    return { customFieldId: id, assetTypeId: assetType.id, value: form.data.typeCustomFields[id] };
                }).filter(data => data !== undefined)
            })

            assetTypeId = assetType.id;
        }

        const asset: Asset = await prisma.asset.create({
            data: {
                assetId: form.data.assetId,
                notes: form.data.notes || null,
                locationId: form.data.location || null,
                typeId: assetTypeId,
                tags: { connect: form.data.tags ? form.data.tags.map((tagId: string) => ({ id: tagId })) : [] }
            }
        })

        await prisma.customFieldAssetValue.createMany({
            data: Object.keys(form.data.customFields).map((id: string) => {
                const defaultVal: any = customFields.find(
                    (field: FullCustomField) => field.id === id
                )?.options?.default;
                if (form.data.customFields[id] === defaultVal) return undefined;
                if (form.data.customFields[id] === undefined) return undefined;
                return { customFieldId: id, assetId: asset.id, value: form.data.typeCustomFields[id] };
            }).filter(data => data !== undefined)
        })

        return { form };
    }
};
