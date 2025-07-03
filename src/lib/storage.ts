import { Client } from "minio";

export let s3: Client;
export let bucket: string;

if (
    process.env.S3_ENDPOINT && process.env.S3_PORT && process.env.S3_ACCESS_KEY
    && process.env.S3_SECRET_KEY && process.env.S3_BUCKET
) {
    s3 = new Client({
        endPoint: process.env.S3_ENDPOINT as string,
        port: parseInt(process.env.S3_PORT as string),
        useSSL: process.env.S3_USE_SSL === 'true',
        accessKey: process.env.S3_ACCESS_KEY,
        secretKey: process.env.S3_SECRET_KEY
    })

    bucket = process.env.S3_BUCKET as string

    if (await s3.bucketExists(bucket)) {
        console.log(`Bucket ${bucket} exists.`)
    } else {
        await s3.makeBucket(bucket)
        console.log(`Bucket ${bucket} created.`)
    }
}
