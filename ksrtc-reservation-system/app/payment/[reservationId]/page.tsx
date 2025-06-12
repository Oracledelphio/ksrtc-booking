"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bus, Clock, MapPin, ArrowLeft, CreditCard, Smartphone, Wallet } from "lucide-react"

interface Reservation {
  reservation_id: number
  seats_booked: string[]
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
}

export default function PaymentPage({ params }: { params: { reservationId: string } }) {
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
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

  const handlePayment = async () => {
    if (!reservation) return

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    setPaymentLoading(true)
    setError("")

    try {
      const totalAmount = reservation.seats_booked.length * reservation.schedule.fare

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reservation_id: reservation.reservation_id,
          amount: totalAmount,
          payment_method: paymentMethod,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/confirmation/${reservation.reservation_id}`)
      } else {
        setError(data.error || "Payment failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setPaymentLoading(false)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kerala-green to-kerala-brown kerala-pattern flex items-center justify-center">
        <div className="text-kerala-white text-xl">Loading payment details...</div>
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kerala-green to-kerala-brown kerala-pattern flex items-center justify-center">
        <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="pt-6 text-center">
            <p className="text-kerala-brown">Reservation not found</p>
            <Link href="/dashboard">
              <Button className="mt-4 bg-kerala-green hover:bg-kerala-green/90 text-kerala-white">
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalAmount = reservation.seats_booked.length * reservation.schedule.fare

  return (
    <div className="min-h-screen bg-gradient-to-br from-kerala-green to-kerala-brown kerala-pattern">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href={`/booking/${reservation.reservation_id}`}>
            <Button
              variant="outline"
              className="border-kerala-white text-kerala-white hover:bg-kerala-white hover:text-kerala-green mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-kerala-white">Payment</h1>
            <p className="text-kerala-white/80">Complete your booking payment</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-kerala-brown flex items-center">
                <Bus className="h-5 w-5 mr-2" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center text-kerala-brown mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="font-semibold">{reservation.schedule.route.source}</span>
                  <span className="mx-2">→</span>
                  <span className="font-semibold">{reservation.schedule.route.destination}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center text-kerala-brown mb-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="font-semibold">{formatTime(reservation.schedule.departure_time)}</span>
                  <span className="mx-2">-</span>
                  <span className="font-semibold">{formatTime(reservation.schedule.arrival_time)}</span>
                </div>
                <div className="text-sm text-kerala-brown/70">{formatDate(reservation.schedule.departure_time)}</div>
              </div>

              <div>
                <div className="text-kerala-brown font-semibold mb-2">Bus: {reservation.schedule.bus.bus_number}</div>
              </div>

              <div>
                <div className="text-kerala-brown font-semibold mb-2">Selected Seats:</div>
                <div className="flex flex-wrap gap-2">
                  {reservation.seats_booked.map((seat) => (
                    <Badge key={seat} className="bg-kerala-green text-kerala-white">
                      {seat}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-kerala-brown">Fare per seat:</span>
                  <span className="text-kerala-brown">₹{reservation.schedule.fare}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-kerala-brown">Number of seats:</span>
                  <span className="text-kerala-brown">{reservation.seats_booked.length}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-kerala-brown">Total Amount:</span>
                  <span className="text-kerala-green">₹{totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-kerala-brown">Payment Method</CardTitle>
              <CardDescription className="text-kerala-brown/70">Choose your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-3 p-4 border border-kerala-green/30 rounded-lg hover:bg-kerala-green/5">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex items-center cursor-pointer flex-1">
                    <CreditCard className="h-5 w-5 text-kerala-green mr-3" />
                    <div>
                      <div className="font-semibold text-kerala-brown">Credit/Debit Card</div>
                      <div className="text-sm text-kerala-brown/70">Pay securely with your card</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border border-kerala-green/30 rounded-lg hover:bg-kerala-green/5">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center cursor-pointer flex-1">
                    <Smartphone className="h-5 w-5 text-kerala-green mr-3" />
                    <div>
                      <div className="font-semibold text-kerala-brown">UPI</div>
                      <div className="text-sm text-kerala-brown/70">Pay using UPI apps</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border border-kerala-green/30 rounded-lg hover:bg-kerala-green/5">
                  <RadioGroupItem value="net_banking" id="net_banking" />
                  <Label htmlFor="net_banking" className="flex items-center cursor-pointer flex-1">
                    <Wallet className="h-5 w-5 text-kerala-green mr-3" />
                    <div>
                      <div className="font-semibold text-kerala-brown">Net Banking</div>
                      <div className="text-sm text-kerala-brown/70">Pay through your bank</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              <Button
                onClick={handlePayment}
                className="w-full bg-kerala-green hover:bg-kerala-green/90 text-kerala-white"
                disabled={paymentLoading}
              >
                {paymentLoading ? "Processing Payment..." : `Pay ₹${totalAmount}`}
              </Button>

              <div className="text-center text-sm text-kerala-brown/70">
                Your payment is secured with 256-bit SSL encryption
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
