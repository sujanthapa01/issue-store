import { prisma } from '@/lib/prismaClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    if (!data || !Array.isArray(data) || !data.length) {
      return NextResponse.json({ ok: false, msg: 'Invalid or missing repository data' }, { status: 400 })
    }

    const formattedData = data.map((repo: any) => {
      if (!repo.userId) throw new Error('Missing userId in repository data')

      return {
        id: repo.id?.toString() ?? undefined,
        name: repo.name,
        owner: repo.owner,
        fullName: repo.fullName,
        url: repo.url,
        description: repo.description || null,
        isPrivate: repo.isPrivate,
        userId: repo.userId,
      }
    })

 
    const response = await prisma.repository.createMany({
      data: formattedData,
      skipDuplicates: true,
    })

    return NextResponse.json({ ok: true, count: response.count }, { status: 201 })

  } catch (error) {
    console.error('Error inserting repositories:', error)
    return NextResponse.json({ ok: false, msg: 'Internal Server Error' }, { status: 500 })
  }
}
