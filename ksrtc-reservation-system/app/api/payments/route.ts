import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/middleware"

export const POST = withAuth(async (req: NextRequest, userId: number) => {
  try {
    const { reservation_id, amount, payment_method } = await req.json()

    // Get reservation details
    const reservation = await prisma.reservation.findUnique({
      where: { reservation_id: reservation_id },
      include: {
        schedule: {
          include: {
            route: true,
            bus: true,
          },
        },
      },
    })

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        customer_id: userId,
        amount: amount,
        payment_status: "completed",
        payment_method: payment_method,
      },
    })

    // Update reservation with payment
    const updatedReservation = await prisma.reservation.update({
      where: { reservation_id: reservation_id },
      data: {
        payment_id: payment.payment_id,
        status: "confirmed",
      },
      include: {
        schedule: {
          include: {
            route: true,
            bus: true,
          },
        },
        payment: true,
      },
    })

    // Create individual tickets for each seat (weak entity)
    const ticketData = reservation.seats_booked.map((seatNo, index) => ({
      reservation_id: reservation_id,
      ticket_no: `T${String(index + 1).padStart(3, "0")}`, // T001, T002, etc.
      seat_no: seatNo,
      issue_date: new Date(),
    }))

    await prisma.ticket.createMany({
      data: ticketData,
    })

    // Get the created tickets
    const tickets = await prisma.ticket.findMany({
      where: { reservation_id: reservation_id },
      orderBy: { ticket_no: "asc" },
    })

    return NextResponse.json({
      payment,
      reservation: updatedReservation,
      tickets,
    })
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
