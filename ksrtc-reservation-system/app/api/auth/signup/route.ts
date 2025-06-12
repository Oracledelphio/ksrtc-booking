import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json()

    // Check if user already exists
    const existingUser = await prisma.customer.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
      },
    })

    // Generate token
    const token = generateToken(user.customer_id)

    return NextResponse.json({
      message: "User created successfully",
      token,
      user: {
        id: user.customer_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
