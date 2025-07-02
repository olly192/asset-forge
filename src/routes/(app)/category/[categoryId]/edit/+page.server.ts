import type { Session } from "@auth/sveltekit";
import type { PageServerLoad, Actions, RequestEvent } from "./$types.js";
import { fail, type ServerLoadEvent } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { valibot } from "sveltekit-superforms/adapters";
import { categorySchema } from "../../schema";
import { prisma } from "$lib/prisma";
import type { Category } from "@prisma/client"

export const load: PageServerLoad = async (event: ServerLoadEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return;

    const { categoryId } = event.params;
    if (!categoryId) return fail(400, { message: "Category ID is required" });

    const category: Category | null = await prisma.category.findUnique({
        where: { id: categoryId, deleted: null }
    });
    if (!category) return fail(404, { message: "Category not found" });

    const form = await superValidate(valibot(categorySchema));
    form.data = {
        name: category.name,
        description: category.description || "",
        icon: category.icon,
        color: category.color,
        parent: category.parentId || undefined
    };

    return { form };
};

export const actions: Actions = {
    default: async (event: RequestEvent) => {
        const session: Session | null = await event.locals.auth();
        if (!session?.user) return;

        const form = await superValidate(event, valibot(categorySchema));
        if (!form.valid) return fail(400, { form });

        const { categoryId } = event.params;
        if (!categoryId) return fail(400, { message: "Category ID is required" });
        if (form.data.parent === categoryId) return fail(400, { message: "Category cannot be its own parent" });

        const category: Category | null = await prisma.category.findUnique({
            where: { id: categoryId, deleted: null }
        });
        if (!category) return fail(404, { message: "Category not found" });

        await prisma.category.update({
            where: { id: categoryId },
            data: {
                name: form.data.name,
                description: form.data.description,
                icon: form.data.icon,
                color: form.data.color,
                parent: form.data.parent ? { connect: { id: form.data.parent } } : undefined,
            }
        })

        return { form };
    }
};
