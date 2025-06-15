import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./auth"

// The handler now accepts a context object which contains params for dynamic routes
export function withAuth<T extends { params: any } = { params: {} }>(
  handler: (req: NextRequest, userId: number, context: T) => Promise<NextResponse>,
) {
  return async (req: NextRequest, context: T) => {
    const token = req.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Pass the context object (which contains params) to the handler
    return handler(req, decoded.userId, context)
  }
}
