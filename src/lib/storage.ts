import { env } from "$env/dynamic/private";
import { Client } from "minio";

export let s3: Client;
export let bucket: string;

if (env.S3_ENDPOINT && env.S3_PORT && env.S3_ACCESS_KEY && env.S3_SECRET_KEY && env.S3_BUCKET) {
    s3 = new Client({
        endPoint: env.S3_ENDPOINT as string,
        port: parseInt(env.S3_PORT as string),
        useSSL: env.S3_USE_SSL === 'true',
        accessKey: env.S3_ACCESS_KEY,
        secretKey: env.S3_SECRET_KEY
    })

    bucket = env.S3_BUCKET as string

    if (await s3.bucketExists(bucket)) {
        console.log(`Bucket ${bucket} exists.`)
    } else {
        await s3.makeBucket(bucket)
        console.log(`Bucket ${bucket} created.`)
    }
}
