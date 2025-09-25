import { mockPrisma } from "./mock-prisma"

// Try to use real Prisma client, fall back to mock if not available
let prismaClient: any = mockPrisma

try {
  const { PrismaClient } = require("@prisma/client")
  
  const globalForPrisma = globalThis as unknown as {
    prisma: any | undefined
  }

  prismaClient = globalForPrisma.prisma ?? new PrismaClient()
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClient
} catch (error) {
  console.log("Prisma client not available, using mock client for development")
  prismaClient = mockPrisma
}

export const prisma = prismaClient
