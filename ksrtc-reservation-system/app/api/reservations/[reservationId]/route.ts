import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/middleware"

export const GET = withAuth(
  async (req: NextRequest, userId: number) => {
    try {
      const url = new URL(req.url)
      const reservationIdStr = url.pathname.split("/").filter(Boolean).pop()
      const reservationId = Number.parseInt(reservationIdStr ?? "")

      if (isNaN(reservationId)) {
        return NextResponse.json({ error: "Invalid reservation ID" }, { status: 400 })
      }

      const reservation = await prisma.reservation.findFirst({
        where: {
          reservation_id: reservationId,
          customer_id: userId,
        },
        include: {
          schedule: {
            include: {
              route: {
                select: {
                  route_id: true,
                  source: true,
                  destination: true,
                  distance: true,
                },
              },
              bus: {
                select: {
                  bus_id: true,
                  bus_number: true,
                  capacity: true,
                },
              },
            },
          },
          payment: {
            select: {
              payment_id: true,
              amount: true,
              payment_status: true,
              payment_method: true,
              payment_date: true,
            },
          },
          customer: {
            select: {
              customer_id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
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
