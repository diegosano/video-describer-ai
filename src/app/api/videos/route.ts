import { NextResponse } from 'next/server'

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
