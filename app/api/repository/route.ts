import { prisma } from '@/lib/prismaClient'
import { NextRequest, NextResponse } from 'next/server'

type Repo = {
  id: string | number
  name: string
  owner: string
  fullName: string
  url: string
  description?: string
  isPrivate?: boolean
  username: string
}

export async function POST(req: NextRequest) {
  try {
    const repo: Repo = await req.json()

    const requiredFields: (keyof Repo)[] = ['id', 'name', 'owner', 'fullName', 'url', 'username']
    for (const field of requiredFields) {
      if (
        repo[field] === undefined ||
        repo[field] === null ||
        (typeof repo[field] === 'string' && repo[field].trim() === '')
      ) {
        return NextResponse.json({ ok: false, msg: `Missing or empty field: ${field}` }, { status: 400 })
      }
    }

    const userExists = await prisma.user.findUnique({
      where: { username: repo.username }
    })

    if (!userExists) {
      return NextResponse.json({ ok: false, msg: `User with id '${repo.username}' does not exist` }, { status: 404 })
    }

    const response = await prisma.repository.create({
      data: {
        id: repo.id.toString(),
        name: repo.name,
        owner: repo.owner,
        fullName: repo.fullName,
        url: repo.url,
        description: repo.description ?? null,
        isPrivate: repo.isPrivate ?? false,
        user: {
          connect: {
            username: repo.username
          }
        }
      }
    })

    return NextResponse.json({ ok: true, repo: response }, { status: 201 })

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ ok: false, msg }, { status: 500 })
  }
}
