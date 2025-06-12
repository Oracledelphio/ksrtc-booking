import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/middleware"

export const GET = withAuth(async (req: NextRequest, userId: number) => {
  try {
    const user = await prisma.customer.findUnique({
      where: { customer_id: userId },
      include: {
        reservations: {
          include: {
            schedule: {
              include: {
                route: true,
                bus: true,
              },
            },
            payment: true,
          },
          orderBy: {
            reservation_date: "desc",
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.customer_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      reservations: user.reservations,
    })
  } catch (error) {
    console.error("Profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
