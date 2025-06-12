"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bus, Clock, MapPin, ArrowLeft, Loader2 } from "lucide-react"

interface Seat {
  seat_id: number
  seat_number: string
  is_available: boolean
}

interface BookingData {
  schedule: {
    schedule_id: number
    departure_time: string
    arrival_time: string
    fare: number
    route: {
      route_id: number
      source: string
      destination: string
      distance: number
    }
    bus: {
      bus_id: number
      bus_number: string
      capacity: number
    }
  }
  seats: Seat[]
}

export default function BookingPage({ params }: { params: { scheduleId: string } }) {
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const scheduleId = params.scheduleId
        if (!scheduleId || isNaN(Number(scheduleId))) {
          setError("Invalid schedule ID")
          setLoading(false)
          return
        }

        const response = await fetch(`/api/seats/${scheduleId}`)
        const data = await response.json()

        if (response.ok) {
          if (!data.schedule || !data.schedule.route) {
            setError("Schedule data is incomplete")
            return
          }
          setBookingData(data)
        } else {
          setError(data.error || "Failed to fetch booking data")
        }
      } catch (err) {
        console.error("Fetch error:", err)
        setError("Network error. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchBookingData()
  }, [params.scheduleId])

  const handleSeatSelect = (seatNumber: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((seat) => seat !== seatNumber)
      } else {
        return [...prev, seatNumber]
      }
    })
  }

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    setBookingLoading(true)
    setError("")

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          schedule_id: Number.parseInt(params.scheduleId),
          seats: selectedSeats,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/payment/${data.reservation_id}`)
      } else {
        setError(data.error || "Booking failed")
        // If seats are no longer available, refresh the page
        if (data.unavailable_seats) {
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }
      }
    } catch (err) {
      console.error("Booking error:", err)
      setError("Network error. Please try again.")
    } finally {
      setBookingLoading(false)
    }
  }

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

  const totalFare = selectedSeats.length * (bookingData?.schedule.fare || 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kerala-green to-kerala-brown kerala-pattern flex items-center justify-center">
        <div className="flex items-center space-x-2 text-kerala-white text-xl">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading booking details...</span>
        </div>
      </div>
    )
  }

  if (!bookingData || !bookingData.schedule || !bookingData.schedule.route) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kerala-green to-kerala-brown kerala-pattern flex items-center justify-center">
        <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl max-w-md">
          <CardContent className="pt-6 text-center">
            <Bus className="h-16 w-16 text-kerala-brown/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-kerala-brown mb-2">Booking Not Available</h3>
            <p className="text-kerala-brown/70 mb-4">
              {error || "The requested schedule could not be found or is no longer available."}
            </p>
            <Link href="/search">
              <Button className="bg-kerala-green hover:bg-kerala-green/90 text-kerala-white">Search Other Buses</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kerala-green to-kerala-brown kerala-pattern">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/search">
            <Button
              variant="outline"
              className="border-kerala-white text-kerala-white hover:bg-kerala-white hover:text-kerala-green mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-kerala-white">Select Seats</h1>
            <p className="text-kerala-white/80">
              {bookingData.schedule.route.source} → {bookingData.schedule.route.destination}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Journey Details */}
          <div className="lg:col-span-1">
            <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl mb-6">
              <CardHeader>
                <CardTitle className="text-kerala-brown flex items-center">
                  <Bus className="h-5 w-5 mr-2" />
                  Journey Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center text-kerala-brown mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="font-semibold">{bookingData.schedule.route.source}</span>
                    <span className="mx-2">→</span>
                    <span className="font-semibold">{bookingData.schedule.route.destination}</span>
                  </div>
                  <div className="text-sm text-kerala-brown/70">Distance: {bookingData.schedule.route.distance} km</div>
                </div>

                <div>
                  <div className="flex items-center text-kerala-brown mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="font-semibold">{formatTime(bookingData.schedule.departure_time)}</span>
                    <span className="mx-2">-</span>
                    <span className="font-semibold">{formatTime(bookingData.schedule.arrival_time)}</span>
                  </div>
                  <div className="text-sm text-kerala-brown/70">{formatDate(bookingData.schedule.departure_time)}</div>
                </div>

                <div>
                  <div className="text-kerala-brown font-semibold">Bus: {bookingData.schedule.bus.bus_number}</div>
                  <div className="text-sm text-kerala-brown/70">
                    Capacity: {bookingData.schedule.bus.capacity} seats
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="text-kerala-brown font-semibold">Fare per seat: ₹{bookingData.schedule.fare}</div>
                  {selectedSeats.length > 0 && (
                    <div className="text-lg font-bold text-kerala-green">Total: ₹{totalFare}</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Selected Seats */}
            {selectedSeats.length > 0 && (
              <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-kerala-brown">Selected Seats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedSeats.map((seat) => (
                      <Badge key={seat} className="bg-kerala-green text-kerala-white">
                        {seat}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    onClick={handleBooking}
                    className="w-full bg-kerala-green hover:bg-kerala-green/90 text-kerala-white"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Proceed to Payment (₹${totalFare})`
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Seat Layout */}
          <div className="lg:col-span-2">
            <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-kerala-brown">Select Your Seats</CardTitle>
                <CardDescription className="text-kerala-brown/70">
                  Click on available seats to select them
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-4 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Legend */}
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-kerala-green rounded mr-2"></div>
                    <span className="text-sm text-kerala-brown">Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-kerala-brown rounded mr-2"></div>
                    <span className="text-sm text-kerala-brown">Selected</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-400 rounded mr-2"></div>
                    <span className="text-sm text-kerala-brown">Occupied</span>
                  </div>
                </div>

                {/* Bus Layout */}
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="text-center mb-4 text-kerala-brown font-semibold">Driver</div>
                  <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                    {bookingData.seats.map((seat) => (
                      <button
                        key={seat.seat_id}
                        onClick={() => seat.is_available && handleSeatSelect(seat.seat_number)}
                        disabled={!seat.is_available}
                        className={`
                          w-12 h-12 rounded text-sm font-semibold transition-colors
                          ${
                            !seat.is_available
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : selectedSeats.includes(seat.seat_number)
                                ? "bg-kerala-brown text-kerala-white"
                                : "bg-kerala-green text-kerala-white hover:bg-kerala-green/80"
                          }
                        `}
                      >
                        {seat.seat_number}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
