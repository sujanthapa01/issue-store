import { prisma } from '@/lib/prismaClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {

    try {

        const { username, email, avatar } = await req.json()

        if (!username)
            return NextResponse.json({ ok: false, msg: 'username is missing' }, { status: 404 })

        const user = await prisma.user.create({
            data: {
                username,
                email,
                avatar: avatar ? avatar : ""

            }
        })

        return NextResponse.json({ ok: true, user }, { status: 200 })

    } catch (error: any) {

        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 })
    }



}