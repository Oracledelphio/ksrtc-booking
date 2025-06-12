"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Phone, Bus, Clock, MapPin, ArrowLeft, Calendar, Loader2 } from "lucide-react"

interface UserProfile {
  id: number
  name: string
  email: string
  phone: string
}

interface Reservation {
  reservation_id: number
  seats_booked: string[]
  status: string
  reservation_date: string
  schedule: {
    departure_time: string
    arrival_time: string
    fare: number
    route: {
      source: string
      destination: string
    }
    bus: {
      bus_number: string
    }
  }
  payment: {
    amount: number
    payment_status: string
    payment_method: string
  } | null
}

interface ProfileData {
  user: UserProfile
  reservations: Reservation[]
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const response = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (response.ok) {
          setProfileData(data)
        } else {
          setError(data.error || "Failed to fetch profile")
        }
      } catch (err) {
        setError("Network error. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Calculate total spent (only from completed payments)
  const totalSpent =
    profileData?.reservations.reduce((total, reservation) => {
      if (reservation.payment && reservation.payment.payment_status === "completed") {
        return total + Number(reservation.payment.amount)
      }
      return total
    }, 0) || 0

  // Calculate confirmed reservations
  const confirmedReservations =
    profileData?.reservations.filter((reservation) => reservation.status === "confirmed").length || 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kerala-green to-kerala-brown kerala-pattern flex items-center justify-center">
        <div className="flex items-center space-x-2 text-kerala-white text-xl">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    )
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kerala-green to-kerala-brown kerala-pattern flex items-center justify-center">
        <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl max-w-md">
          <CardContent className="pt-6 text-center">
            <User className="h-16 w-16 text-kerala-brown/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-kerala-brown mb-2">Profile Not Available</h3>
            <p className="text-kerala-brown/70 mb-4">{error || "Profile not found"}</p>
            <Link href="/dashboard">
              <Button className="bg-kerala-green hover:bg-kerala-green/90 text-kerala-white">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const upcomingReservations = profileData.reservations.filter(
    (reservation) => new Date(reservation.schedule.departure_time) > new Date(),
  )

  const pastReservations = profileData.reservations.filter(
    (reservation) => new Date(reservation.schedule.departure_time) <= new Date(),
  )

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
            <h1 className="text-3xl font-bold text-kerala-white">My Profile</h1>
            <p className="text-kerala-white/80">Manage your account and bookings</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Profile Information */}
          <Card className="mb-8 bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-kerala-brown flex items-center">
                <User className="h-6 w-6 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-kerala-green" />
                  <div>
                    <div className="text-sm text-kerala-brown/70">Full Name</div>
                    <div className="font-semibold text-kerala-brown">{profileData.user.name}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-kerala-green" />
                  <div>
                    <div className="text-sm text-kerala-brown/70">Email Address</div>
                    <div className="font-semibold text-kerala-brown">{profileData.user.email}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-kerala-green" />
                  <div>
                    <div className="text-sm text-kerala-brown/70">Phone Number</div>
                    <div className="font-semibold text-kerala-brown">{profileData.user.phone}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Statistics */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-kerala-green mb-2">{profileData.reservations.length}</div>
                <div className="text-kerala-brown">Total Bookings</div>
              </CardContent>
            </Card>

            <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-kerala-green mb-2">{upcomingReservations.length}</div>
                <div className="text-kerala-brown">Upcoming Trips</div>
              </CardContent>
            </Card>

            <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-kerala-green mb-2">₹{totalSpent}</div>
                <div className="text-kerala-brown">Total Spent</div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings */}
          <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-kerala-brown flex items-center">
                <Bus className="h-6 w-6 mr-2" />
                My Bookings
              </CardTitle>
              <CardDescription className="text-kerala-brown/70">View and manage your bus reservations</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">Upcoming ({upcomingReservations.length})</TabsTrigger>
                  <TabsTrigger value="past">Past ({pastReservations.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                  {upcomingReservations.length === 0 ? (
                    <div className="text-center py-8">
                      <Bus className="h-16 w-16 text-kerala-brown/30 mx-auto mb-4" />
                      <p className="text-kerala-brown/70">No upcoming bookings</p>
                      <Link href="/dashboard">
                        <Button className="mt-4 bg-kerala-green hover:bg-kerala-green/90 text-kerala-white">
                          Book a Trip
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    upcomingReservations.map((reservation) => (
                      <Card key={reservation.reservation_id} className="border border-kerala-green/20">
                        <CardContent className="p-4">
                          <div className="grid md:grid-cols-4 gap-4 items-center">
                            <div>
                              <div className="flex items-center text-kerala-brown mb-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="font-semibold">{reservation.schedule.route.source}</span>
                                <span className="mx-1">→</span>
                                <span className="font-semibold">{reservation.schedule.route.destination}</span>
                              </div>
                              <div className="text-sm text-kerala-brown/70">
                                Bus: {reservation.schedule.bus.bus_number}
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center text-kerala-brown mb-1">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{formatTime(reservation.schedule.departure_time)}</span>
                              </div>
                              <div className="text-sm text-kerala-brown/70">
                                {formatDate(reservation.schedule.departure_time)}
                              </div>
                            </div>

                            <div>
                              <div className="text-kerala-brown font-semibold mb-1">
                                Seats: {reservation.seats_booked.join(", ")}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(reservation.status)}>
                                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                </Badge>
                                {!reservation.payment && (
                                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                                    Payment Pending
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-bold text-kerala-green mb-2">
                                ₹
                                {reservation.payment?.amount ||
                                  reservation.schedule.fare * reservation.seats_booked.length}
                              </div>
                              <Link href={`/confirmation/${reservation.reservation_id}`}>
                                <Button
                                  size="sm"
                                  className="bg-kerala-brown hover:bg-kerala-brown/90 text-kerala-white"
                                >
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                  {pastReservations.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-16 w-16 text-kerala-brown/30 mx-auto mb-4" />
                      <p className="text-kerala-brown/70">No past bookings</p>
                    </div>
                  ) : (
                    pastReservations.map((reservation) => (
                      <Card key={reservation.reservation_id} className="border border-kerala-brown/20 opacity-75">
                        <CardContent className="p-4">
                          <div className="grid md:grid-cols-4 gap-4 items-center">
                            <div>
                              <div className="flex items-center text-kerala-brown mb-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="font-semibold">{reservation.schedule.route.source}</span>
                                <span className="mx-1">→</span>
                                <span className="font-semibold">{reservation.schedule.route.destination}</span>
                              </div>
                              <div className="text-sm text-kerala-brown/70">
                                Bus: {reservation.schedule.bus.bus_number}
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center text-kerala-brown mb-1">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{formatTime(reservation.schedule.departure_time)}</span>
                              </div>
                              <div className="text-sm text-kerala-brown/70">
                                {formatDate(reservation.schedule.departure_time)}
                              </div>
                            </div>

                            <div>
                              <div className="text-kerala-brown font-semibold mb-1">
                                Seats: {reservation.seats_booked.join(", ")}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(reservation.status)}>
                                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                </Badge>
                                {!reservation.payment && (
                                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                                    Payment Pending
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-bold text-kerala-green mb-2">
                                ₹
                                {reservation.payment?.amount ||
                                  reservation.schedule.fare * reservation.seats_booked.length}
                              </div>
                              <Link href={`/confirmation/${reservation.reservation_id}`}>
                                <Button
                                  size="sm"
                                  className="bg-kerala-brown hover:bg-kerala-brown/90 text-kerala-white"
                                >
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
