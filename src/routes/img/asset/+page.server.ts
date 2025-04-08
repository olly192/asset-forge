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

//
// export const actions: Actions = {
//     default: async (event) => {
//         const form = await superValidate(event, valibot(formSchema));
//         if (!form.valid) {
//             return fail(400, { form });
//         }
//         console.log(form)
//
//         const logo: File = form.data.logo;
//
//         const logoBuffer: Buffer = Buffer.from(await logo.arrayBuffer());
//         console.log("logo", logo)
//         const organisationId = "123-123-123"
//         const logoPath = `asset/${organisationId}`;
//         await s3.putObject(bucket, logoPath, logoBuffer, logo.size, {
//             'Content-Type': logo.type
//         })
//
//         return { form };
//     }
// };
