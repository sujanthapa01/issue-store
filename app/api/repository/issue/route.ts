import { prisma } from '@/lib/prismaClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { title, body, state, number, repositoryId } = await req.json()

    if (!title || !number || !state || !repositoryId) {
      return NextResponse.json({ ok: false, msg: 'Missing required fields' }, { status: 400 })
    }

    const repo = await prisma.repository.findUnique({
      where: { id: repositoryId },
    })

    if (!repo) {
      return NextResponse.json({ ok: false, msg: 'Repository not found' }, { status: 404 })
    }

    const issue = await prisma.issue.create({
      data: {
        title,
        body,
        state,
        number,
        repositoryId,
      }
    })

    return NextResponse.json({ ok: true, issue }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ ok: false, msg: 'Internal Server Error' }, { status: 500 })
  }
}
