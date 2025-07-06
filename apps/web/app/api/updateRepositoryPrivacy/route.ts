import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
export async function POST(req: Request) {
  try {
    const { id, isPrivate } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'missing repository ID' }, { status: 400 });
    }

    const updated = await prisma.repository.update({
      where: { id },
      data: { isPrivate },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update privacy' }, { status: 500 });
  }
}
