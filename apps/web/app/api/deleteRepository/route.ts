import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
async function POST(res: NextResponse) {
  try {
    const { repositoryId } = await res.json();

    if (!repositoryId) {
      return NextResponse.json({ ok: false, msg: 'repository id missing!' }, { status: 400 });
    }

    const response = await prisma.repository.delete({
      where: { id: repositoryId },
    });

    return NextResponse.json({ ok: true, response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ ok: false, msg: 'Internal server error', error }, { status: 500 });
  }
}

export default POST;
