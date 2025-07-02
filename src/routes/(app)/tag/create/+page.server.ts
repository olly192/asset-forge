import type { Session } from "@auth/sveltekit";
import type { PageServerLoad, Actions, RequestEvent } from "./$types.js";
import { fail, type ServerLoadEvent } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { tagSchema } from "../schema";
import { prisma } from "$lib/prisma";

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return;

    const form = await superValidate(valibot(tagSchema));
    return { form };
};

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const session: Session | null = await event.locals.auth();
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
