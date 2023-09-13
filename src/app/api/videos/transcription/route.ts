import { NextResponse } from 'next/server'
import fetch from 'node-fetch'
import { z } from 'zod'

import prisma from '@/lib/db'
import { openai } from '@/lib/openai'

const transcriptionBodySchema = z.object({
  videoId: z.string().uuid(),
  prompt: z.string(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { videoId, prompt } = transcriptionBodySchema.parse(body)

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    })

    const response = await fetch(video.path)

    const { text: transcription } = await openai.audio.transcriptions.create({
      file: response,
      model: 'whisper-1',
      language: 'pt',
      // eslint-disable-next-line camelcase
      response_format: 'json',
      temperature: 0,
      prompt,
    })

    await prisma.video.update({
      where: {
        id: videoId,
      },
      data: {
        transcription,
      },
    })

    return NextResponse.json({
      transcription,
    })
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
