import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import { auth } from "$lib/auth";
import { prisma } from "$lib/prisma";
import type { CustomField } from "@prisma/client";

export const POST: RequestHandler = async ({ request, params }: RequestEvent) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return error(403, "Unauthorized");

    const { fieldId } = params;
    if (!fieldId) return error(400, "Custom field ID is required");

    const customField: CustomField | null = await prisma.customField.findUnique({
        where: { id: fieldId, deleted: null }
    });
    if (!customField) return error(404, "Custom field not found");

    await prisma.customField.update({
        where: { id: fieldId },
        data: { archived: false }
    });

    return json({ fieldId });
}
