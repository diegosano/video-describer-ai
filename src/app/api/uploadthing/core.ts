import prisma from '@/lib/db'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

const auth = (req: Request) => ({ id: 'fakeId' }) // Fake auth function

export const ourFileRouter = {
  videoUploader: f({ video: { maxFileCount: 1, maxFileSize: '32MB' } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req)

      // If you throw, the user will not be able to upload
      if (!user) throw new Error('Unauthorized')

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.video.create({
        data: {
          name: file.name,
          path: file.url,
        },
      })
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
