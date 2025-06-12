import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/middleware"

export const POST = withAuth(async (req: NextRequest, userId: number) => {
  try {
    const { reservation_id, amount, payment_method } = await req.json()

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
    const reservation = await prisma.reservation.update({
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

    return NextResponse.json({
      payment,
      reservation,
    })
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
