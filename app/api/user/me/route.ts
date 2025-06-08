import { prisma } from '@/lib/prismaClient'
import { NextRequest, NextResponse } from 'next/server'
import redis from '@/lib/redis';

export async function POST(req: NextRequest) {
    try {
        const { username } = await req.json();
        console.log("[API] api/user/me", username)
        if (!username) {
            return NextResponse.json({ ok: false, msg: "userAuthId is missing" }, { status: 404 })
        }

        // check if user data is cached in redis

        const cachedUser = await redis.get(`user:${username}`)
        if (cachedUser) {
            return NextResponse.json({ ok: true, user: cachedUser }, { status: 200 })
        }

        const user = await prisma.user.findUnique({
            where: {username: username}
        })

        redis.set(`user:${username}`, user, {'ex':  86400 })

        return NextResponse.json({ ok: true, user: user }, { status: 200 })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
