import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import type { Asset } from "@prisma/client";
import { bucket, s3 } from "$lib/storage";
import { prisma } from "$lib/prisma";

export const load: PageServerLoad = async ({ url }) => {
    let assetId: string | null = url.searchParams.get("id");
    if (!assetId) return fail(400);

    let asset: Asset | null = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) return fail(400);

    let object = await s3.getObject(bucket, `asset/${assetId}`);
    console.log(object);

    return {}
};
