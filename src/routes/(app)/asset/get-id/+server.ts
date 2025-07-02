import { prisma } from '$lib/prisma';
import type { Session } from "@auth/sveltekit";
import type { Asset } from "@prisma/client";
import { error, json, type RequestEvent, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async (event: RequestEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return error(403, "Unauthorized");

    const assetId: string | null = event.url.searchParams.get("assetId");
    if (!assetId) return error(400, "Asset ID is required");

    const asset: Asset | null = await prisma.asset.findFirst({
        where: { assetId, archived: false, deleted: undefined },
    });
    if (!asset) return error(404, "Asset not found");

    return json({ id: asset.id });
}
