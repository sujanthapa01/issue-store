// app/api/feed/route.ts

import { prisma } from '@/lib/prismaClient';
import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

const FEED_CACHE_KEY = 'public:feed';

export async function GET() {
  try {
    const cachedFeed = await redis.get(FEED_CACHE_KEY);
    if (cachedFeed) {
      return NextResponse.json({ ok: true, feed: cachedFeed }, { status: 200 });
    }

    const feed = await prisma.repository.findMany({
      where: { isPrivate: false },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        issues: true,
      },
    });

    await redis.set(FEED_CACHE_KEY, feed, { ex: 7200 });

    return NextResponse.json({ ok: true, feed }, { status: 200 });
  } catch (error) {
    console.error('[FEED_ERROR]', error);
    return NextResponse.json({ ok: false, msg: 'Internal server error' }, { status: 500 });
  }
}
