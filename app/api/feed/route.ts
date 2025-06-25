import { prisma } from "@/lib/prismaClient"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest, res: NextResponse) {

    try {

        const user = await prisma.repository.findMany({
            where: { isPrivate: false },
            orderBy: { createdAt: "desc" },
        })

        return NextResponse.json({ ok: true, user }, { status: 200 })


    } catch (error) {

        return NextResponse.json({ ok: false, msg: "Internal server error" })
    }
}