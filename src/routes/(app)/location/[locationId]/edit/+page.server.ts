import type { PageServerLoad, Actions, RequestEvent } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { locationSchema } from "../../schema";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { Location } from "@prisma/client"

export const load: PageServerLoad = async ({ request, params }) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return;

    const { locationId } = params;
    if (!locationId) return fail(400, { message: "Location ID is required" });

    const location: Location | null = await prisma.location.findUnique({
        where: { id: locationId, deleted: null }
    });
    if (!location) return fail(404, { message: "Location not found" });

    const form = await superValidate(valibot(locationSchema));
    form.data = {
        name: location.name,
        icon: location.icon,
        color: location.color,
        parent: location.parentId || undefined,
    };

    return { form };
};

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const session = await auth.api.getSession(event.request);
        if (!session?.user) return;

        const form = await superValidate(event, valibot(locationSchema));
        if (!form.valid) return fail(400, { form });

        const { locationId } = event.params;
        if (!locationId) return fail(400, { message: "Location ID is required" });
        if (form.data.parent === locationId) return fail(400, { message: "Location cannot be its own parent" });

        const location: Location | null = await prisma.location.findUnique({
            where: { id: locationId, deleted: null }
        });
        if (!location) return fail(404, { message: "Location not found" });

        await prisma.location.update({
            where: { id: locationId },
            data: {
                name: form.data.name,
                icon: form.data.icon,
                color: form.data.color,
                parent: form.data.parent ? { connect: { id: form.data.parent } } : undefined,
            }
        })

        return { form };
    }
};
