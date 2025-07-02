import type { Session } from "@auth/sveltekit";
import type { PageServerLoad, Actions, RequestEvent } from "./$types.js";
import { fail, type ServerLoadEvent } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { settingsSchema } from "./schema";
import { prisma } from "$lib/prisma";

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return;

    const form = await superValidate(valibot(settingsSchema));
    form.data = {
        name: session.user.name,
        email: session.user.email,
        role: session.user.role || undefined
    }
    return { form };
};

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const session: Session | null = await event.locals.auth();
        if (!session?.user) return;

        const form = await superValidate(event, valibot(settingsSchema));
        if (!form.valid) {
            return fail(400, { form });
        }
        console.log("Valid form: ", form);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { name: form.data.name }
        })

        return { form };
    }
};