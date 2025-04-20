import type { PageServerLoad, Actions, RequestEvent } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { tagSchema } from "../../schema";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { Tag } from "@prisma/client";

export const load: PageServerLoad = async ({ request, params }) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return;

    const { tagId } = params;
    if (!tagId) return fail(400, { message: "Tag ID is required" });

    const tag: Tag | null = await prisma.tag.findUnique({
        where: { id: tagId, deleted: null }
    });
    if (!tag) return fail(404, { message: "Tag not found" });

    const form = await superValidate(valibot(tagSchema));
    form.data = {
        name: tag.name,
        description: tag.description || "",
        color: tag.color
    };

    return { form };
};

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const session = await auth.api.getSession(event.request);
        if (!session?.user) return;

        const form = await superValidate(event, valibot(tagSchema));
        if (!form.valid) return fail(400, { form });

        const { tagId } = event.params;
        if (!tagId) return fail(400, { message: "Tag ID is required" });

        const tag: Tag | null = await prisma.tag.findUnique({
            where: { id: tagId, deleted: null }
        });
        if (!tag) return fail(404, { message: "Tag not found" });

        await prisma.tag.update({
            where: { id: tagId },
            data: {
                name: form.data.name,
                description: form.data.description,
                color: form.data.color
            }
        })

        return { form };
    }
};
