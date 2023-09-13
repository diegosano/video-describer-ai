'use client'

import { OurFileRouter } from '@/app/api/uploadthing/core'
import { UploadButton } from '@uploadthing/react'

export const OurUploadButton = () => (
  <UploadButton<OurFileRouter>
    endpoint="videoUploader"
    onClientUploadComplete={(res) => {
      // Do something with the response
      console.log('Files: ', res)
      alert('Upload Completed')
    }}
    onUploadError={(error: Error) => {
      // Do something with the error.
      alert(`ERROR! ${error.message}`)
    }}
    onUploadBegin={(name) => {
      // Do something once upload begins
      console.log('Uploading: ', name)
    }}
  />
)
