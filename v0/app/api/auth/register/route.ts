import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password, name } = body

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
        }

        const hashedPassword = await hashPassword(password)

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                passwordHash: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true
            }
        })

        return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 })
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
