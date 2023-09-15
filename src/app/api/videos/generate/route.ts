import { NextResponse } from 'next/server'
import { z } from 'zod'
import { OpenAIStream, StreamingTextResponse } from 'ai'

import prisma from '@/lib/db'
import { openai } from '@/lib/openai'

const transcriptionBodySchema = z.object({
  videoId: z.string().uuid(),
  prompt: z.string(),
  temperature: z.number().min(0).max(1).default(0.5),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { videoId, prompt, temperature } = transcriptionBodySchema.parse(body)

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    })

    if (!video.transcription) {
      return NextResponse.json(
        {
          error: 'Video transcription was not generated yet.',
        },
        {
          status: 400,
        },
      )
    }

    const promptMessage = prompt.replace('{transcription}', video.transcription)

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      temperature,
      messages: [
        {
          role: 'user',
          content: promptMessage,
        },
      ],
      stream: true,
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
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
