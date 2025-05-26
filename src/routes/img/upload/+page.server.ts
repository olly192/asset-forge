import { auth } from "$lib/auth";
import { fail, type Actions } from "@sveltejs/kit";
import { randomUUID } from "node:crypto";
import { superValidate } from "sveltekit-superforms";
import * as v from "valibot";
import { bucket, s3 } from "$lib/storage";
import { valibot } from "sveltekit-superforms/adapters";

const uploadSchema = v.object({
    image: v.pipe(
        v.file("Please select an image file."),
        v.mimeType(["image/jpeg", "image/png"], "Please select a JPEG or PNG file."),
        v.maxSize(1024 * 1024 * 10, "Please select a file smaller than 10 MB.")
    )
});

export const actions: Actions = {
    default: async (event) => {
        const session = await auth.api.getSession(event.request);
        if (!session?.user) return fail(401, { message: "Unauthorized" });

        const form = await superValidate(event, valibot(uploadSchema));
        if (!form.valid) return fail(400, { form });

        const image: File = form.data.image;
        const imageBuffer: Buffer = Buffer.from(await image.arrayBuffer());
        const id: string = randomUUID();
        const path: string = `images/${id}`;

        console.log(`Uploading image with ID: ${id} to path: ${path}`);

        await s3.putObject(bucket, path, imageBuffer, image.size, { "Content-Type": image.type });

        return id;
    }
};
