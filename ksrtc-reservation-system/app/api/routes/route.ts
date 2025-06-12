import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const routes = await prisma.route.findMany({
      include: {
        schedules: {
          include: {
            bus: {
              select: {
                bus_number: true,
                capacity: true,
              },
            },
          },
          orderBy: {
            departure_time: "asc",
          },
        },
      },
      orderBy: {
        source: "asc",
      },
    })

    return NextResponse.json(routes)
  } catch (error) {
    console.error("Routes error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
