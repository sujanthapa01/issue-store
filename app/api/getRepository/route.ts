import { prisma } from '@/lib/prismaClient'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'Username required in query' }, { status: 400 })
  }

  try {
    const repos = await prisma.repository.findMany({
      where: {
        owner: username,
      },
      include: {
        issues: true,
      },
    })

    return NextResponse.json(repos)
  } catch (err) {
    console.error('Error fetching repositories:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
