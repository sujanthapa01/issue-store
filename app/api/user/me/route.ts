import { prisma } from '@/lib/prismaClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { username, userId } = await req.json();

    let user

    if (username || userId) {
      user = await prisma.user.findUnique({
        where: { username },
      });
    }

    if (!user && userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
