import { prisma } from '$lib/prisma';
import type { Asset } from "@prisma/client";
import { auth } from '$lib/auth';
import { error, json } from "@sveltejs/kit"

export async function GET({ request, url }) {
    const session = await auth.api.getSession(request);
    if (!session?.user) return error(403, "Unauthorized");

    const assetId: string | null = url.searchParams.get("assetId");
    if (!assetId) return error(400, "Asset ID is required");

    const asset: Asset | null = await prisma.asset.findFirst({
        where: { assetId, archived: false, deleted: undefined },
    });
    if (!asset) return error(404, "Asset not found");

    return json({ id: asset.id });
}
