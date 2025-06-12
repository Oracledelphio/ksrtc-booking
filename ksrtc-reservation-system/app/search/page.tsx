"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bus, Clock, MapPin, Users, ArrowLeft } from "lucide-react"

interface Schedule {
  schedule_id: number
  departure_time: string
  arrival_time: string
  fare: number
  available_seats: number
  route: {
    source: string
    destination: string
    distance: number
  }
  bus: {
    bus_number: string
    capacity: number
  }
}

export default function SearchPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const params = new URLSearchParams()
        const source = searchParams.get("source")
        const destination = searchParams.get("destination")
        const date = searchParams.get("date")

        if (source) params.append("source", source)
        if (destination) params.append("destination", destination)
        if (date) params.append("date", date)

        const response = await fetch(`/api/schedules?${params.toString()}`)
        const data = await response.json()

        if (response.ok) {
          setSchedules(data)
        } else {
          setError(data.error || "Failed to fetch schedules")
        }
      } catch (err) {
        setError("Network error. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()
  }, [searchParams])

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const calculateDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure)
    const arr = new Date(arrival)
    const diff = arr.getTime() - dep.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kerala-green to-kerala-brown kerala-pattern flex items-center justify-center">
        <div className="text-kerala-white text-xl">Loading schedules...</div>
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
            <h1 className="text-3xl font-bold text-kerala-white">Available Buses</h1>
            <p className="text-kerala-white/80">
              {searchParams.get("source")} → {searchParams.get("destination")}
              {searchParams.get("date") && ` • ${formatDate(searchParams.get("date")!)}`}
            </p>
          </div>
        </div>

        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {schedules.length === 0 ? (
          <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="pt-6 text-center">
              <Bus className="h-16 w-16 text-kerala-brown/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-kerala-brown mb-2">No buses found</h3>
              <p className="text-kerala-brown/70 mb-4">
                No buses available for the selected route and date. Try different search criteria.
              </p>
              <Link href="/dashboard">
                <Button className="bg-kerala-green hover:bg-kerala-green/90 text-kerala-white">Search Again</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <Card
                key={schedule.schedule_id}
                className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    {/* Route Info */}
                    <div className="space-y-2">
                      <div className="flex items-center text-kerala-brown">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="font-semibold">{schedule.route.source}</span>
                        <span className="mx-2">→</span>
                        <span className="font-semibold">{schedule.route.destination}</span>
                      </div>
                      <div className="text-sm text-kerala-brown/70">Distance: {schedule.route.distance} km</div>
                    </div>

                    {/* Time Info */}
                    <div className="space-y-2">
                      <div className="flex items-center text-kerala-brown">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="font-semibold">{formatTime(schedule.departure_time)}</span>
                        <span className="mx-2">-</span>
                        <span className="font-semibold">{formatTime(schedule.arrival_time)}</span>
                      </div>
                      <div className="text-sm text-kerala-brown/70">
                        Duration: {calculateDuration(schedule.departure_time, schedule.arrival_time)}
                      </div>
                    </div>

                    {/* Bus Info */}
                    <div className="space-y-2">
                      <div className="flex items-center text-kerala-brown">
                        <Bus className="h-4 w-4 mr-1" />
                        <span className="font-semibold">{schedule.bus.bus_number}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={schedule.available_seats > 10 ? "default" : "destructive"} className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {schedule.available_seats} seats
                        </Badge>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold text-kerala-green">₹{schedule.fare}</div>
                      <Link href={`/booking/${schedule.schedule_id}`}>
                        <Button
                          className="w-full bg-kerala-green hover:bg-kerala-green/90 text-kerala-white"
                          disabled={schedule.available_seats === 0}
                        >
                          {schedule.available_seats === 0 ? "Sold Out" : "Select Seats"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
