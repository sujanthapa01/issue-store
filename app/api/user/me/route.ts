import { prisma } from '@/lib/prismaClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        console.log("[API] api/user/me",email)
        if (!email) {
            return NextResponse.json({ ok: false, msg: "userAuthId is missing" }, { status: 404 })
        }

        const user = await prisma.user.findUnique({
            where: { email: email }
        })
        console.log('user fom /api/user/me',user)

        return NextResponse.json({ ok: true, user: user }, { status: 200 })

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
