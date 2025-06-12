import { PrismaClient } from "@prisma/client"
import { readFileSync } from "fs"
import { join } from "path"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  try {
    // Read and execute SQL scripts in order
    const sqlScripts = ["01-create-tables.sql", "02-create-seats.sql", "03-insert-attributes.sql"]

    for (const script of sqlScripts) {
      const filePath = join(__dirname, "../scripts", script)
      console.log(`📄 Executing script: ${script}`)

      try {
        const sql = readFileSync(filePath, "utf8")

        // Split SQL by semicolons and execute each statement separately
        const statements = sql
          .split(";")
          .map((statement) => statement.trim())
          .filter((statement) => statement.length > 0)

        for (const statement of statements) {
          if (statement.trim()) {
            await prisma.$executeRawUnsafe(statement)
          }
        }

        console.log(`✅ Finished executing script: ${script}`)
      } catch (error) {
        console.error(`❌ Error executing script ${script}:`, error)
        throw error
      }
    }

    console.log("🎉 Database seeding completed successfully!")

    // Verify data was inserted
    const customerCount = await prisma.customer.count()
    const busCount = await prisma.bus.count()
    const routeCount = await prisma.route.count()
    const scheduleCount = await prisma.schedule.count()
    const seatCount = await prisma.seat.count()

    console.log("📊 Data verification:")
    console.log(`   - Customers: ${customerCount}`)
    console.log(`   - Buses: ${busCount}`)
    console.log(`   - Routes: ${routeCount}`)
    console.log(`   - Schedules: ${scheduleCount}`)
    console.log(`   - Seats: ${seatCount}`)
  } catch (error) {
    console.error("💥 Seeding failed:", error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error("🚨 Seed script failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log("🔌 Disconnected from database")
  })
