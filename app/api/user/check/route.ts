import { prisma } from '@/lib/prismaClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {

    try {

        const { username } = await req.json()
        console.log(username)
        if (!username)
            return NextResponse.json({ ok: false, msg: 'username is missing' }, { status: 404 })

        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })
        const userFound = !!user
        return NextResponse.json({ userFound, user }, { status: 200 })

    } catch (error: any) {

        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 })
    }



}