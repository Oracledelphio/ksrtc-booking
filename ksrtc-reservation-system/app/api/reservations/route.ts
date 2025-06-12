import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/middleware"

export const POST = withAuth(async (req: NextRequest, userId: number) => {
  try {
    const { schedule_id, seats } = await req.json()

    // Check if seats are available
    const seatRecords = await prisma.seat.findMany({
      where: {
        seat_number: { in: seats },
        bus: {
          schedules: {
            some: {
              schedule_id: schedule_id,
            },
          },
        },
      },
    })

    const unavailableSeats = seatRecords.filter((seat) => !seat.is_available)
    if (unavailableSeats.length > 0) {
      return NextResponse.json(
        {
          error: "Some seats are no longer available",
          unavailable_seats: unavailableSeats.map((s) => s.seat_number),
        },
        { status: 400 },
      )
    }

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        customer_id: userId,
        schedule_id: schedule_id,
        seats_booked: seats,
        status: "pending",
      },
      include: {
        schedule: {
          include: {
            route: true,
            bus: true,
          },
        },
      },
    })

    // Mark seats as unavailable
    await prisma.seat.updateMany({
      where: {
        seat_number: { in: seats },
        bus_id: reservation.schedule.bus_id,
      },
      data: {
        is_available: false,
      },
    })

    return NextResponse.json(reservation)
  } catch (error) {
    console.error("Reservation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
