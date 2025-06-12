"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bus, MapPin, ArrowLeft, Search, Clock, IndianRupee } from "lucide-react"

interface Route {
  route_id: number
  source: string
  destination: string
  distance: number
  schedules: Array<{
    schedule_id: number
    departure_time: string
    arrival_time: string
    fare: number
    bus: {
      bus_number: string
      capacity: number
    }
  }>
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch("/api/routes")
        const data = await response.json()

        if (response.ok) {
          setRoutes(data)
          setFilteredRoutes(data)
        } else {
          setError(data.error || "Failed to fetch routes")
        }
      } catch (err) {
        setError("Network error. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchRoutes()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = routes.filter(
        (route) =>
          route.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.destination.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredRoutes(filtered)
    } else {
      setFilteredRoutes(routes)
    }
  }, [searchTerm, routes])

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kerala-green to-kerala-brown kerala-pattern flex items-center justify-center">
        <div className="text-kerala-white text-xl">Loading routes...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kerala-green to-kerala-brown kerala-pattern">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="border-kerala-white text-kerala-white hover:bg-kerala-white hover:text-kerala-green mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-kerala-white">All Routes</h1>
            <p className="text-kerala-white/80">Explore all available bus routes across Kerala</p>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-8 bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-kerala-brown flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-kerala-brown/50" />
              <Input
                placeholder="Search by source or destination city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-kerala-green/30 focus:border-kerala-green"
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Routes Grid */}
        {filteredRoutes.length === 0 ? (
          <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="pt-6 text-center">
              <Bus className="h-16 w-16 text-kerala-brown/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-kerala-brown mb-2">No routes found</h3>
              <p className="text-kerala-brown/70 mb-4">
                {searchTerm ? "No routes match your search criteria." : "No routes available at the moment."}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  className="bg-kerala-green hover:bg-kerala-green/90 text-kerala-white"
                >
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map((route) => (
              <Card
                key={route.route_id}
                className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-kerala-brown flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    {route.source} → {route.destination}
                  </CardTitle>
                  <CardDescription className="text-kerala-brown/70">Distance: {route.distance} km</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-kerala-brown mb-2">Available Schedules:</h4>
                    {route.schedules.length === 0 ? (
                      <p className="text-kerala-brown/70 text-sm">No schedules available</p>
                    ) : (
                      <div className="space-y-2">
                        {route.schedules.slice(0, 3).map((schedule) => (
                          <div
                            key={schedule.schedule_id}
                            className="flex items-center justify-between p-2 bg-kerala-green/10 rounded"
                          >
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3 text-kerala-green" />
                              <span className="text-sm text-kerala-brown">{formatTime(schedule.departure_time)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <IndianRupee className="h-3 w-3 text-kerala-green" />
                              <span className="text-sm font-semibold text-kerala-brown">{schedule.fare}</span>
                            </div>
                          </div>
                        ))}
                        {route.schedules.length > 3 && (
                          <p className="text-xs text-kerala-brown/70">+{route.schedules.length - 3} more schedules</p>
                        )}
                      </div>
                    )}
                  </div>

                  <Link href={`/search?source=${route.source}&destination=${route.destination}`}>
                    <Button className="w-full bg-kerala-green hover:bg-kerala-green/90 text-kerala-white">
                      View Schedules
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
