import type { PageServerLoad, Actions, RequestEvent } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { tagSchema } from "../schema";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";

export const load: PageServerLoad = async ({ request }) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return;

    const form = await superValidate(valibot(tagSchema));
    return { form };
};

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const session = await auth.api.getSession(event.request);
        if (!session?.user) return;

        const form = await superValidate(event, valibot(tagSchema));
        if (!form.valid) return fail(400, { form });

        await prisma.tag.create({
            data: {
                name: form.data.name,
                description: form.data.description,
                color: form.data.color
            }
        })

        return { form };
    }
};
