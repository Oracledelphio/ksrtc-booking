"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Bus, Clock, MapPin, User, Phone, Mail, Download, Ticket, Loader2 } from "lucide-react"

interface TicketData {
  ticket_id: number
  ticket_no: string
  seat_no: string
  issue_date: string
}

interface ReservationDetails {
  reservation_id: number
  seats_booked: string[]
  status: string
  reservation_date: string
  tickets: TicketData[] // Added tickets
  schedule: {
    // Full schedule object
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
    // Payment can be null if not completed
    payment_id: number
    amount: number
    payment_status: string
    payment_method: string
    payment_date: string
  } | null
  customer: {
    name: string
    email: string
    phone: string
  }
}

export default function ConfirmationPage({ params }: { params: { reservationId: string } }) {
  const [reservation, setReservation] = useState<ReservationDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchReservation = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const response = await fetch(`/api/reservations/${params.reservationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (response.ok) {
          setReservation(data)
        } else {
          setError(data.error || "Failed to fetch reservation")
        }
      } catch (err) {
        setError("Network error. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchReservation()
  }, [params.reservationId, router])

  const handleDownloadTickets = async () => {
    if (!reservation) return

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    setDownloadLoading(true)

    try {
      const response = await fetch(`/api/tickets/download/${params.reservationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        // Create and download the ticket as JSON (in a real app, you'd generate a PDF)
        const ticketBlob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(ticketBlob)
        const a = document.createElement("a")
        a.href = url
        a.download = `KSRTC_Tickets_${reservation.reservation_id}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        setError(data.error || "Failed to download tickets")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setDownloadLoading(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kerala-green to-kerala-brown kerala-pattern flex items-center justify-center">
        <div className="flex items-center space-x-2 text-kerala-white text-xl">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading confirmation details...</span>
        </div>
      </div>
    )
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kerala-green to-kerala-brown kerala-pattern flex items-center justify-center">
        <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-kerala-brown/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-kerala-brown mb-2">Booking Not Found</h3>
            <p className="text-kerala-brown/70 mb-4">{error || "Reservation not found"}</p>
            <Link href="/dashboard">
              <Button className="bg-kerala-green hover:bg-kerala-green/90 text-kerala-white">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kerala-green to-kerala-brown kerala-pattern">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-kerala-white" />
          </div>
          <h1 className="text-4xl font-bold text-kerala-white mb-2">Booking Confirmed!</h1>
          <p className="text-kerala-white/80 text-lg">Your bus tickets have been successfully issued</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Booking Details */}
          <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-kerala-brown flex items-center">
                <Bus className="h-6 w-6 mr-2" />
                Booking Details
              </CardTitle>
              <CardDescription className="text-kerala-brown/70">
                Reservation ID: #{reservation.reservation_id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Journey Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-kerala-brown text-lg">Journey Information</h3>

                  <div>
                    <div className="flex items-center text-kerala-brown mb-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="font-semibold">{reservation.schedule.route.source}</span>
                      <span className="mx-2">→</span>
                      <span className="font-semibold">{reservation.schedule.route.destination}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center text-kerala-brown mb-1">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="font-semibold">{formatTime(reservation.schedule.departure_time)}</span>
                      <span className="mx-2">-</span>
                      <span className="font-semibold">{formatTime(reservation.schedule.arrival_time)}</span>
                    </div>
                    <div className="text-sm text-kerala-brown/70 ml-6">
                      {formatDate(reservation.schedule.departure_time)}
                    </div>
                  </div>

                  <div>
                    <div className="text-kerala-brown font-semibold">Bus: {reservation.schedule.bus.bus_number}</div>
                  </div>

                  <div>
                    <div className="text-kerala-brown font-semibold mb-2">Seats:</div>
                    <div className="flex flex-wrap gap-2">
                      {reservation.seats_booked.map((seat) => (
                        <Badge key={seat} className="bg-kerala-green text-kerala-white">
                          {seat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Passenger Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-kerala-brown text-lg">Passenger Information</h3>

                  <div className="flex items-center text-kerala-brown">
                    <User className="h-4 w-4 mr-2" />
                    <span>{reservation.customer.name}</span>
                  </div>

                  <div className="flex items-center text-kerala-brown">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{reservation.customer.email}</span>
                  </div>

                  <div className="flex items-center text-kerala-brown">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{reservation.customer.phone}</span>
                  </div>

                  <div>
                    <div className="text-kerala-brown font-semibold">Booking Status:</div>
                    <Badge className={`mt-1 ${reservation.status === "confirmed" ? "bg-green-500" : "bg-yellow-500"}`}>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Tickets */}
          {reservation.tickets && reservation.tickets.length > 0 && (
            <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-kerala-brown flex items-center">
                  <Ticket className="h-6 w-6 mr-2" />
                  Individual Tickets
                </CardTitle>
                <CardDescription className="text-kerala-brown/70">Each seat has its own ticket</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {reservation.tickets.map((ticket) => (
                    <Card key={ticket.ticket_id} className="border border-kerala-green/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Ticket className="h-4 w-4 text-kerala-green mr-2" />
                            <span className="font-semibold text-kerala-brown">Ticket {ticket.ticket_no}</span>
                          </div>
                          <Badge className="bg-kerala-green text-kerala-white">Seat {ticket.seat_no}</Badge>
                        </div>
                        <div className="text-sm text-kerala-brown/70">Issued: {formatDateTime(ticket.issue_date)}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Details */}
          {reservation.payment && ( // Only show payment details if payment exists
            <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-kerala-brown">Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-kerala-brown">Payment ID:</span>
                      <span className="text-kerala-brown font-semibold">#{reservation.payment.payment_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-kerala-brown">Amount Paid:</span>
                      <span className="text-kerala-green font-bold text-lg">₹{reservation.payment.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-kerala-brown">Payment Method:</span>
                      <span className="text-kerala-brown font-semibold capitalize">
                        {reservation.payment.payment_method.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-kerala-brown">Payment Status:</span>
                      <Badge className="bg-green-500">
                        {reservation.payment.payment_status.charAt(0).toUpperCase() +
                          reservation.payment.payment_status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-kerala-brown">Payment Date:</span>
                      <span className="text-kerala-brown font-semibold">
                        {formatDateTime(reservation.payment.payment_date)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-kerala-brown">Booking Date:</span>
                      <span className="text-kerala-brown font-semibold">
                        {formatDateTime(reservation.reservation_date)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleDownloadTickets}
              className="bg-kerala-green hover:bg-kerala-green/90 text-kerala-white"
              disabled={downloadLoading || reservation.status !== "confirmed"}
            >
              {downloadLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Tickets...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Tickets
                </>
              )}
            </Button>
            <Link href="/profile">
              <Button
                variant="outline"
                className="border-kerala-white text-kerala-white hover:bg-kerala-white hover:text-kerala-green"
              >
                View All Bookings
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-kerala-white text-kerala-white hover:bg-kerala-white hover:text-kerala-green"
              >
                Book Another Ticket
              </Button>
            </Link>
          </div>

          {/* Important Information */}
          <Card className="bg-kerala-brown/10 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="text-kerala-brown">Important Information</CardTitle>
            </CardHeader>
            <CardContent className="text-kerala-brown/80 space-y-2">
              <p>• Please arrive at the boarding point at least 15 minutes before departure time.</p>
              <p>• Carry a valid ID proof along with your tickets.</p>
              <p>• Each passenger must have their individual ticket for the assigned seat.</p>
              <p>• For any queries, contact KSRTC customer support.</p>
              <p>• Cancellation and refund policies apply as per KSRTC terms and conditions.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
