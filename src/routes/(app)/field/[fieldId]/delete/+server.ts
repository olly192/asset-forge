import type { Session } from "@auth/sveltekit";
import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/prisma";
import type { CustomField } from "@prisma/client";

export const POST: RequestHandler = async (event: RequestEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return error(403, "Unauthorized");

    const { fieldId } = event.params;
    if (!fieldId) return error(400, "Custom field ID is required");

    const customField: CustomField | null = await prisma.customField.findUnique({
        where: { id: fieldId, deleted: null }
    });
    if (!customField) return error(404, "Custom field not found");

    await prisma.customField.update({
        where: { id: fieldId },
        data: { deleted: new Date() }
    });

    return json({ fieldId });
}
