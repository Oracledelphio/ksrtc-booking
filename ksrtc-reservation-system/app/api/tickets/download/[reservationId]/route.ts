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

      // Get reservation with tickets
      const reservation = await prisma.reservation.findFirst({
        where: {
          reservation_id: reservationId,
          customer_id: userId,
          status: "confirmed", // Only allow download for confirmed reservations
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
        return NextResponse.json({ error: "Reservation not found or not confirmed" }, { status: 404 })
      }

      if (reservation.tickets.length === 0) {
        return NextResponse.json({ error: "No tickets found for this reservation" }, { status: 404 })
      }

      // Generate ticket data for download
      const ticketData = {
        reservation_id: reservation.reservation_id,
        passenger_name: reservation.customer.name,
        passenger_email: reservation.customer.email,
        passenger_phone: reservation.customer.phone,
        route: {
          source: reservation.schedule.route.source,
          destination: reservation.schedule.route.destination,
          distance: reservation.schedule.route.distance,
        },
        schedule: {
          bus_number: reservation.schedule.bus.bus_number,
          departure_time: reservation.schedule.departure_time,
          arrival_time: reservation.schedule.arrival_time,
          fare: reservation.schedule.fare,
        },
        payment: {
          amount: reservation.payment?.amount,
          payment_method: reservation.payment?.payment_method,
          payment_date: reservation.payment?.payment_date,
        },
        tickets: reservation.tickets.map((ticket) => ({
          ticket_id: ticket.ticket_id,
          ticket_no: ticket.ticket_no,
          seat_no: ticket.seat_no,
          issue_date: ticket.issue_date,
        })),
        booking_date: reservation.reservation_date,
      }

      return NextResponse.json(ticketData)
    } catch (error) {
      console.error("Ticket download error:", error)
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
  },
)
