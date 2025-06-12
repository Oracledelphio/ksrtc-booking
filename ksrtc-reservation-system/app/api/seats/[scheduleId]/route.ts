import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { scheduleId: string } }) {
  try {
    const scheduleId = Number.parseInt(params.scheduleId)

    if (isNaN(scheduleId)) {
      return NextResponse.json({ error: "Invalid schedule ID" }, { status: 400 })
    }

    const schedule = await prisma.schedule.findUnique({
      where: { schedule_id: scheduleId },
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
          include: {
            seats: {
              orderBy: {
                seat_number: "asc",
              },
            },
          },
        },
      },
    })

    if (!schedule) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 })
    }

    return NextResponse.json({
      schedule,
      seats: schedule.bus.seats,
    })
  } catch (error) {
    console.error("Seats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
