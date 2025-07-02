import { prisma } from '$lib/prisma';
import type { Session } from "@auth/sveltekit";
import type { Asset } from "@prisma/client";
import { error, redirect, type ServerLoadEvent } from "@sveltejs/kit";
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event: ServerLoadEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return error(403, "Unauthorized");

    const assetId: string | undefined = event.params.assetId;
    if (!assetId) return error(400, "Asset ID is required");

    const asset: Asset | null = await prisma.asset.findFirst({
        where: { assetId, deleted: null }
    })
    if (!asset) return error(404, "Asset not found");

    redirect(302, `/asset/${asset.id}`);
}
