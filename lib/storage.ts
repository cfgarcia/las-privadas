import { Storage, type StorageOptions } from "@google-cloud/storage"

// Initialize storage. In production (Vercel) we pass explicit credentials via
// env vars. In local dev we typically have GOOGLE_APPLICATION_CREDENTIALS
// pointing at a service-account JSON file — let the SDK auto-detect that.
const explicitClientEmail = process.env.GCP_CLIENT_EMAIL
const explicitPrivateKey = process.env.GCP_PRIVATE_KEY

const storageOptions: StorageOptions = {}
if (process.env.GCP_PROJECT_ID) storageOptions.projectId = process.env.GCP_PROJECT_ID
if (explicitClientEmail && explicitPrivateKey) {
    storageOptions.credentials = {
        client_email: explicitClientEmail,
        private_key: explicitPrivateKey.replace(/\\n/g, '\n'),
    }
}
// If neither explicit credentials nor projectId are provided, the SDK will
// fall back to GOOGLE_APPLICATION_CREDENTIALS — which is the local dev path.
const storage = new Storage(storageOptions)

const bucketName = process.env.GCS_BUCKET_NAME || "artist-booking-app-assets"

export async function uploadToGCS(file: File, folder: string = "artists"): Promise<string> {
    if (!bucketName) {
        throw new Error("GCS_BUCKET_NAME is not defined")
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer())
        // Clean filename and make unique
        const sanitizedParams = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const filename = `${folder}/${Date.now()}-${sanitizedParams}`

        const bucket = storage.bucket(bucketName)
        const fileRef = bucket.file(filename)

        await fileRef.save(buffer, {
            metadata: {
                contentType: file.type,
            },
        })

        // NOTE: This assumes the bucket object is publicly accessible or the bucket is public.
        // If the bucket is uniform bucket-level access and public, this URL works.
        return `https://storage.googleapis.com/${bucketName}/${filename}`
    } catch (error) {
        console.error("Error uploading to GCS:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown GCS error"
        throw new Error(`Failed to upload file: ${errorMessage}`)
    }
}
