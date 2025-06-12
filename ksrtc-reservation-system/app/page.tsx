import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bus, MapPin, Clock, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-kerala-green to-kerala-brown">
      <div className="kerala-pattern min-h-screen">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Bus className="h-12 w-12 text-kerala-white mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-kerala-white">KSRTC</h1>
            </div>
            <p className="text-xl text-kerala-white/90 mb-8">Kerala State Road Transport Corporation</p>
            <p className="text-lg text-kerala-white/80 max-w-2xl mx-auto">
              Experience comfortable and reliable bus travel across God's Own Country. Book your journey with Kerala's
              premier transport service.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-kerala-brown">Book Your Journey</CardTitle>
                <CardDescription className="text-kerala-brown/70">
                  Find and book bus tickets for your travel across Kerala
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/login">
                  <Button className="w-full bg-kerala-green hover:bg-kerala-green/90 text-kerala-white">
                    Login to Book
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    className="w-full border-kerala-green text-kerala-green hover:bg-kerala-green hover:text-kerala-white"
                  >
                    Create New Account
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-kerala-brown">Quick Search</CardTitle>
                <CardDescription className="text-kerala-brown/70">
                  Search for available buses and routes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/search">
                  <Button className="w-full bg-kerala-brown hover:bg-kerala-brown/90 text-kerala-white">
                    Search Buses
                  </Button>
                </Link>
                <Link href="/routes">
                  <Button
                    variant="outline"
                    className="w-full border-kerala-brown text-kerala-brown hover:bg-kerala-brown hover:text-kerala-white"
                  >
                    View All Routes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-kerala-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-kerala-white" />
              </div>
              <h3 className="text-xl font-semibold text-kerala-white mb-2">Extensive Network</h3>
              <p className="text-kerala-white/80">
                Connecting all major cities and towns across Kerala with reliable service
              </p>
            </div>

            <div className="text-center">
              <div className="bg-kerala-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-kerala-white" />
              </div>
              <h3 className="text-xl font-semibold text-kerala-white mb-2">On-Time Service</h3>
              <p className="text-kerala-white/80">Punctual departures and arrivals with real-time tracking</p>
            </div>

            <div className="text-center">
              <div className="bg-kerala-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-kerala-white" />
              </div>
              <h3 className="text-xl font-semibold text-kerala-white mb-2">Safe & Secure</h3>
              <p className="text-kerala-white/80">Experienced drivers and well-maintained buses for your safety</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
