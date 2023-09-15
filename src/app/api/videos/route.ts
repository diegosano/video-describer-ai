import { NextRequest, NextResponse } from 'next/server'
import { utapi } from 'uploadthing/server'

import prisma from '@/lib/db'

export async function GET() {
  try {
    const videos = await prisma.video.findMany()

    return NextResponse.json({ videos })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file: File | null = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        {
          error: 'Missing file input.',
        },
        {
          status: 400,
        },
      )
    }

    const response = await utapi.uploadFiles(file)

    if (response.error) {
      return NextResponse.json(
        {
          error: response.error.message,
        },
        {
          status: 400,
        },
      )
    }

    const video = await prisma.video.create({
      data: {
        name: response.data.name,
        url: response.data.url,
      },
    })

    return NextResponse.json({ video })
  } catch (error) {
    console.log({
      error,
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
