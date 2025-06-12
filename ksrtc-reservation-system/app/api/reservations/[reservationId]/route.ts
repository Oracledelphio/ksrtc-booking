import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/middleware"

export const GET = withAuth(
  async (req: NextRequest, userId: number, { params }: { params: { reservationId: string } }) => {
    try {
      const reservationId = Number.parseInt(params.reservationId)

      const reservation = await prisma.reservation.findFirst({
        where: {
          reservation_id: reservationId,
          customer_id: userId,
        },
        include: {
          schedule: {
            include: {
              route: true,
              bus: true,
            },
          },
          payment: true,
          customer: true,
        },
      })

      if (!reservation) {
        return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
      }

      return NextResponse.json(reservation)
    } catch (error) {
      console.error("Reservation details error:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  },
)
