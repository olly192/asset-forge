import type { FullCustomField } from "../../columns";
import type { PageServerLoad, Actions, RequestEvent } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { customFieldSchema, type FieldTypeKey } from "../../schema";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { CustomField, Tag } from "@prisma/client";

export const load: PageServerLoad = async ({ request, params }) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return;

    const { fieldId } = params;
    if (!fieldId) return fail(400, { message: "Custom field ID is required" });

    const customField: FullCustomField | null = await prisma.customField.findUnique({
        where: { id: fieldId, deleted: null },
        include: {
            tagLimit: true,
            categoryLimit: true
        }
    });
    if (!customField) return fail(404, { message: "Custom field not found" });

    const form = await superValidate(valibot(customFieldSchema));
    form.data = {
        name: customField.name,
        type: customField.type,
        description: customField.description || undefined,
        options: { type: (customField.type as FieldTypeKey), ...(customField.options as object) },
        perInstance: customField.perInstance,
        categoryLimit: customField.categoryLimit?.id || undefined,
        tagLimit: customField.tagLimit.map((tag: Tag) => tag.id) || []
    };

    return { form };
};

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const session = await auth.api.getSession(event.request);
        if (!session?.user) return;

        const form = await superValidate(event, valibot(customFieldSchema));
        if (!form.valid) return fail(400, { form });

        const { fieldId } = event.params;
        if (!fieldId) return fail(400, { message: "Custom field ID is required" });

        const customField: CustomField | null = await prisma.customField.findUnique({
            where: { id: fieldId, deleted: null }
        });
        if (!customField) return fail(404, { message: "Custom field not found" });

        await prisma.customField.update({
            where: { id: fieldId },
            data: {
                name: form.data.name,
                type: form.data.options.type,
                description: form.data.description,
                options: form.data.options,
                perInstance: form.data.perInstance,
                categoryLimit: (
                    form.data.categoryLimit ? { connect: { id: form.data.categoryLimit } } : { disconnect: true }
                ),
                tagLimit: { set: form.data.tagLimit ? form.data.tagLimit.map((id: string) => ({ id })) : [] }
            }
        })

        return { form };
    }
};
