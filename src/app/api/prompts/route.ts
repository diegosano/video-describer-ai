import { NextResponse } from 'next/server'

import prisma from '@/lib/db'

export async function GET() {
  try {
    const prompts = await prisma.prompt.findMany()

    return NextResponse.json(prompts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
