import { prisma } from '@/lib/prismaClient';
import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username required in query' }, { status: 400 });
  }

  const cacheKey = `reops:${username}`;
  try {
    const cached = await redis.get(cacheKey);
    if (typeof cached === 'string') {
      const repos = JSON.parse(cached);
      return NextResponse.json(repos);
    }

    const repos = await prisma.repository.findMany({
      where: {
        owner: username,
      },
      include: {
        issues: true,
      },
    });

    await redis.set(cacheKey, repos, { ex: 86400 });
    return NextResponse.json(repos);
  } catch (err) {
    console.error('Error fetching repositories:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
