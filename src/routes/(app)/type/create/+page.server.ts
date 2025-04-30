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

    const form = await superValidate(valibot(assetTypeSchema));
    return { form };
};

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const session = await auth.api.getSession(event.request);
        if (!session?.user) return;

        const form = await superValidate(event, valibot(assetTypeSchema));
        if (!form.valid) return fail(400, { form });

        await prisma.assetType.create({
            data: {
                name: form.data.name,
                category: form.data.category ? { connect: { id: form.data.category } } : undefined
            }
        })

        return { form };
    }
};
