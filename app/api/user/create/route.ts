import { prisma } from '@/lib/prismaClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {

    try {
        const { username, email, avatar,auth_id } = await req.json()
        console.log(username, email, avatar, auth_id)
        if (!username || !email)
            return NextResponse.json({ ok: false, msg: 'username or email is missing' }, { status: 404 })

        await prisma.user.create({
            data: {
                username,
                email,
                avatar: avatar ? avatar : "",
                auth_id 
              
            }
        })

        return NextResponse.redirect(new URL('/main', req.url))

    } catch (error: any) {
        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 })
    }



}