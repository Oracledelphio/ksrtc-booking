import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const source = searchParams.get("source")
    const destination = searchParams.get("destination")
    const date = searchParams.get("date")

    const whereClause: any = {}

    if (source && destination) {
      whereClause.route = {
        source: { contains: source, mode: "insensitive" },
        destination: { contains: destination, mode: "insensitive" },
      }
    }

    if (date) {
      const searchDate = new Date(date)
      const nextDay = new Date(searchDate)
      nextDay.setDate(nextDay.getDate() + 1)

      whereClause.departure_time = {
        gte: searchDate,
        lt: nextDay,
      }
    }

    const schedules = await prisma.schedule.findMany({
      where: whereClause,
      include: {
        route: true,
        bus: {
          include: {
            seats: true,
          },
        },
      },
      orderBy: {
        departure_time: "asc",
      },
    })

    const schedulesWithAvailability = schedules.map((schedule) => ({
      ...schedule,
      available_seats: schedule.bus.seats.filter((seat) => seat.is_available).length,
    }))

    return NextResponse.json(schedulesWithAvailability)
  } catch (error) {
    console.error("Schedules error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
