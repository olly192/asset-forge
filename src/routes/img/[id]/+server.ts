import type { Session } from "@auth/sveltekit";
import { error, type RequestEvent, type RequestHandler } from "@sveltejs/kit";
import { bucket, s3 } from "$lib/storage";
import type { BucketItemStat } from "minio";
import type { Readable } from "node:stream";

export const GET: RequestHandler = async (event: RequestEvent) => {
    const session: Session | null = await event.locals.auth();
    if (!session?.user) return error(401, { message: "Unauthorized" });

    const id: string | undefined = event.params.id;
    if (!id) return error(400, { message: "Image ID is required." });

    try {
        const image: Readable = await s3.getObject(bucket, `images/${id}`);
        const meta: BucketItemStat = await s3.statObject(bucket, `images/${id}`);
        const buffer: Buffer = Buffer.from(image.read());

        return new Response(buffer, {
            headers: { "Content-Type": meta.metaData["content-type"] || "application/octet-stream" }
        });
    } catch (_) {
        return error(404, { message: "Image not found." });
    }
}
