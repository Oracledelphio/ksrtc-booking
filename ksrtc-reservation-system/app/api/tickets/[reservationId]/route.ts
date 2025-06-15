import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/middleware"

export const GET = withAuth(
  async (req: NextRequest, userId: number, context: { params: { reservationId: string } }) => {
    try {
      const reservationId = Number.parseInt(context.params.reservationId)

      if (isNaN(reservationId)) {
        return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 })
      }

      // Verify the reservation belongs to the user
      const reservation = await prisma.reservation.findFirst({
        where: {
          reservation_id: reservationId,
          customer_id: userId,
        },
        include: {
          tickets: {
            orderBy: { ticket_no: "asc" },
          },
          schedule: {
            include: {
              route: true,
              bus: true,
            },
          },
          customer: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          payment: true,
        },
      })

      if (!reservation) {
        return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
      }

      return NextResponse.json({
        reservation,
        tickets: reservation.tickets,
      })
    } catch (error) {
      console.error("Tickets fetch error:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  },
)
