import { prisma } from '$lib/prisma';
import type { Asset } from "@prisma/client";
import { auth } from '$lib/auth';
import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request, params }) => {
    const session = await auth.api.getSession(request);
    if (!session?.user) return error(403, "Unauthorized");

    const assetId: string | null = params.assetId;
    if (!assetId) return error(400, "Asset ID is required");

    const asset: Asset | null = await prisma.asset.findFirst({
        where: { assetId, deleted: null }
    })
    if (!asset) return error(404, "Asset not found");

    redirect(302, `/asset/${asset.id}`);
}
