import type { PageServerLoad, Actions, RequestEvent } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { customFieldSchema } from "../schema";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";

export const load: PageServerLoad = async ({ request }) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return;

    const form = await superValidate(valibot(customFieldSchema));
    form.data.perInstance = false;

    return { form };
};

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const session = await auth.api.getSession(event.request);
        if (!session?.user) return;

        const form = await superValidate(event, valibot(customFieldSchema));
        if (!form.valid) return fail(400, { form });

        await prisma.customField.create({
            data: {
                name: form.data.name,
                type: form.data.options.type,
                description: form.data.description,
                options: form.data.options,
                perInstance: form.data.perInstance,
                categoryLimit: form.data.categoryLimit ? { connect: { id: form.data.categoryLimit } } : undefined,
                tagLimit: form.data.tagLimit ? { connect: form.data.tagLimit.map((id: string) => ({ id }))} : undefined
            }
        })

        return { form };
    }
};
