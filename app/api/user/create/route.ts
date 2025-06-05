import { prisma } from '@/lib/prismaClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {

    try {
        const { username, email, avatar } = await req.json()
        if (!username || !email)
            return NextResponse.json({ ok: false, msg: 'username or email is missing' }, { status: 404 })

        const user = await prisma.user.create({
            data: {
                username,
                email,
                avatar: avatar ? avatar : ""

            }
        })

        return NextResponse.redirect(new URL('/main', req.url))

    } catch (error: any) {
        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 })
    }



}