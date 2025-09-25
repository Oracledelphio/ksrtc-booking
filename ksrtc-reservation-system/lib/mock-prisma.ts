// Temporary mock Prisma client to make the app work without database
// This will be replaced with real Prisma client once we get the database working

interface MockCustomer {
  customer_id: number
  name: string
  email: string
  password: string
  phone: string
  created_at: Date
}

interface MockRoute {
  route_id: number
  source: string
  destination: string
  distance: number
  schedules: MockSchedule[]
}

interface MockSchedule {
  schedule_id: number
  route_id: number
  bus_id: number
  departure_time: Date
  arrival_time: Date
  fare: number
  bus: {
    bus_number: string
    capacity: number
  }
}

interface MockReservation {
  reservation_id: number
  customer_id: number
  schedule_id: number
  payment_id?: number
  reservation_date: Date
  status: string
  seats_booked: string[]
  schedule: MockSchedule & {
    route: {
      source: string
      destination: string
    }
  }
  tickets: Array<{
    ticket_id: number
    reservation_id: number
    ticket_no: string
    seat_no: string
    issue_date: Date
  }>
}

// Mock data with sample Kerala routes
const mockCustomers: MockCustomer[] = []

const mockRoutes: MockRoute[] = [
  {
    route_id: 1,
    source: "Thiruvananthapuram",
    destination: "Kochi",
    distance: 200,
    schedules: [
      {
        schedule_id: 1,
        route_id: 1,
        bus_id: 1,
        departure_time: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        arrival_time: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        fare: 250,
        bus: {
          bus_number: "KL-01-AA-1234",
          capacity: 45
        }
      },
      {
        schedule_id: 2,
        route_id: 1,
        bus_id: 2,
        departure_time: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        arrival_time: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
        fare: 280,
        bus: {
          bus_number: "KL-01-BB-5678",
          capacity: 50
        }
      }
    ]
  },
  {
    route_id: 2,
    source: "Kochi",
    destination: "Kozhikode",
    distance: 190,
    schedules: [
      {
        schedule_id: 3,
        route_id: 2,
        bus_id: 3,
        departure_time: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
        arrival_time: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
        fare: 220,
        bus: {
          bus_number: "KL-07-CC-9101",
          capacity: 40
        }
      }
    ]
  },
  {
    route_id: 3,
    source: "Kozhikode",
    destination: "Thiruvananthapuram",
    distance: 380,
    schedules: [
      {
        schedule_id: 4,
        route_id: 3,
        bus_id: 4,
        departure_time: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
        arrival_time: new Date(Date.now() + 10 * 60 * 60 * 1000), // 10 hours from now
        fare: 450,
        bus: {
          bus_number: "KL-11-DD-1122",
          capacity: 52
        }
      }
    ]
  }
]

const mockReservations: MockReservation[] = []

let nextCustomerId = 1
let nextReservationId = 1000

export const mockPrisma = {
  customer: {
    async findUnique({ where }: { where: { email?: string; customer_id?: number } }) {
      if (where.email) {
        return mockCustomers.find(c => c.email === where.email) || null
      }
      if (where.customer_id) {
        return mockCustomers.find(c => c.customer_id === where.customer_id) || null
      }
      return null
    },
    
    async create({ data }: { data: Omit<MockCustomer, 'customer_id' | 'created_at'> }) {
      const newCustomer: MockCustomer = {
        customer_id: nextCustomerId++,
        created_at: new Date(),
        ...data
      }
      mockCustomers.push(newCustomer)
      return newCustomer
    },
    
    async count() {
      return mockCustomers.length
    }
  },
  
  route: {
    async findMany({ include }: any = {}) {
      if (include?.schedules) {
        return mockRoutes.map(route => ({
          ...route,
          schedules: route.schedules.map(schedule => ({
            ...schedule,
            bus: schedule.bus
          }))
        }))
      }
      return mockRoutes
    },
    
    async count() {
      return mockRoutes.length
    }
  },
  
  schedule: {
    async findMany({ where, include }: any = {}) {
      // Extract all schedules from routes and add route info
      const allSchedules = mockRoutes.flatMap(route => 
        route.schedules.map(schedule => ({
          ...schedule,
          route: {
            route_id: route.route_id,
            source: route.source,
            destination: route.destination,
            distance: route.distance
          },
          bus: {
            ...schedule.bus,
            seats: Array.from({ length: schedule.bus.capacity }, (_, i) => ({
              seat_id: i + 1,
              seat_number: `${Math.floor(i / 4) + 1}${String.fromCharCode(65 + (i % 4))}`,
              is_available: Math.random() > 0.3 // 70% seats available
            }))
          }
        }))
      )

      // Apply basic filtering
      let filteredSchedules = allSchedules
      
      if (where?.route?.source?.contains) {
        filteredSchedules = filteredSchedules.filter(s => 
          s.route.source.toLowerCase().includes(where.route.source.contains.toLowerCase())
        )
      }
      
      if (where?.route?.destination?.contains) {
        filteredSchedules = filteredSchedules.filter(s => 
          s.route.destination.toLowerCase().includes(where.route.destination.contains.toLowerCase())
        )
      }
      
      return filteredSchedules
    }
  },
  
  reservation: {
    async create({ data, include }: any) {
      const newReservation: any = {
        reservation_id: nextReservationId++,
        reservation_date: new Date(),
        ...data
      }
      mockReservations.push(newReservation)
      return newReservation
    },
    
    async findMany({ where, include }: any = {}) {
      return mockReservations.filter(r => !where?.customer_id || r.customer_id === where.customer_id)
    },
    
    async findUnique({ where, include }: any) {
      return mockReservations.find(r => r.reservation_id === where.reservation_id) || null
    }
  },
  
  seat: {
    async findMany({ where }: any = {}) {
      // Return seats for a specific bus
      if (where?.bus_id) {
        const bus = mockRoutes.flatMap(r => r.schedules).find(s => s.bus_id === where.bus_id)
        if (bus) {
          return Array.from({ length: bus.bus.capacity }, (_, i) => ({
            seat_id: i + 1,
            bus_id: where.bus_id,
            seat_number: `${Math.floor(i / 4) + 1}${String.fromCharCode(65 + (i % 4))}`,
            is_available: Math.random() > 0.3
          }))
        }
      }
      return []
    },
    
    async count() {
      return mockRoutes.reduce((total, route) => 
        total + route.schedules.reduce((routeTotal, schedule) => 
          routeTotal + schedule.bus.capacity, 0), 0)
    }
  },
  
  bus: {
    async count() {
      return mockRoutes.reduce((total, route) => total + route.schedules.length, 0)
    }
  },
  route: {
    async findMany({ include }: any = {}) {
      if (include?.schedules) {
        return mockRoutes.map(route => ({
          ...route,
          schedules: route.schedules.map(schedule => ({
            ...schedule,
            bus: schedule.bus
          }))
        }))
      }
      return mockRoutes
    },
    
    async count() {
      return mockRoutes.length
    }
  },
  
  payment: {
    async create({ data }: any) {
      return { payment_id: 1, ...data }
    }
  },
  
  ticket: {
    async createMany({ data }: any) {
      return { count: data.length }
    }
  },
  
  async $disconnect() {
    // Mock disconnect
  },
  
  async $executeRawUnsafe(sql: string) {
    // Mock SQL execution
    console.log('Mock SQL execution:', sql)
  }
}