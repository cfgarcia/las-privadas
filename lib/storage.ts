import { Storage } from "@google-cloud/storage"

// Initialize storage
// It will automatically look for GOOGLE_APPLICATION_CREDENTIALS env var
// OR use specific env vars (Best for Vercel)
const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'), // handle Vercel env var formatting
    }
})

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
