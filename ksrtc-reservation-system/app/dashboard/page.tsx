"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bus, MapPin, Calendar, LogOut, Search } from "lucide-react"

interface DashboardUser {
  id: number
  name: string
  email: string
  phone: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [searchData, setSearchData] = useState({
    source: "",
    destination: "",
    date: "",
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchData.source) params.append("source", searchData.source)
    if (searchData.destination) params.append("destination", searchData.destination)
    if (searchData.date) params.append("date", searchData.date)

    router.push(`/search?${params.toString()}`)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kerala-green to-kerala-brown kerala-pattern">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Bus className="h-8 w-8 text-kerala-white mr-3" />
            <h1 className="text-3xl font-bold text-kerala-white">KSRTC Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <Button
                variant="outline"
                className="border-kerala-white text-kerala-white hover:bg-kerala-white hover:text-kerala-green"
              >
                <Bus className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-kerala-white text-kerala-white hover:bg-kerala-white hover:text-kerala-green"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Welcome Message */}
        <Card className="mb-8 bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-kerala-brown">Welcome back, {user.name}!</CardTitle>
            <CardDescription className="text-kerala-brown/70">
              Ready to plan your next journey across Kerala?
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Search Section */}
        <Card className="mb-8 bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-kerala-brown flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search Buses
            </CardTitle>
            <CardDescription className="text-kerala-brown/70">Find the perfect bus for your journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source" className="text-kerala-brown">
                  From
                </Label>
                <Select onValueChange={(value) => setSearchData((prev) => ({ ...prev, source: value }))}>
                  <SelectTrigger className="border-kerala-green/30 focus:border-kerala-green">
                    <SelectValue placeholder="Select source city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trivandrum">Trivandrum</SelectItem>
                    <SelectItem value="Kochi">Kochi</SelectItem>
                    <SelectItem value="Kozhikode">Kozhikode</SelectItem>
                    <SelectItem value="Kannur">Kannur</SelectItem>
                    <SelectItem value="Kollam">Kollam</SelectItem>
                    <SelectItem value="Munnar">Munnar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="text-kerala-brown">
                  To
                </Label>
                <Select onValueChange={(value) => setSearchData((prev) => ({ ...prev, destination: value }))}>
                  <SelectTrigger className="border-kerala-green/30 focus:border-kerala-green">
                    <SelectValue placeholder="Select destination city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trivandrum">Trivandrum</SelectItem>
                    <SelectItem value="Kochi">Kochi</SelectItem>
                    <SelectItem value="Kozhikode">Kozhikode</SelectItem>
                    <SelectItem value="Kannur">Kannur</SelectItem>
                    <SelectItem value="Kollam">Kollam</SelectItem>
                    <SelectItem value="Munnar">Munnar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-kerala-brown">
                  Travel Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={searchData.date}
                  onChange={(e) => setSearchData((prev) => ({ ...prev, date: e.target.value }))}
                  className="border-kerala-green/30 focus:border-kerala-green"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="w-full bg-kerala-green hover:bg-kerala-green/90 text-kerala-white"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Buses
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="text-center">
              <MapPin className="h-12 w-12 text-kerala-green mx-auto mb-2" />
              <CardTitle className="text-kerala-brown">View Routes</CardTitle>
              <CardDescription className="text-kerala-brown/70">
                Explore all available routes across Kerala
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/routes">
                <Button className="w-full bg-kerala-brown hover:bg-kerala-brown/90 text-kerala-white">
                  View All Routes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="text-center">
              <Calendar className="h-12 w-12 text-kerala-green mx-auto mb-2" />
              <CardTitle className="text-kerala-brown">My Bookings</CardTitle>
              <CardDescription className="text-kerala-brown/70">View and manage your reservations</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button className="w-full bg-kerala-green hover:bg-kerala-green/90 text-kerala-white">
                  View Bookings
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-kerala-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="text-center">
              <Bus className="h-12 w-12 text-kerala-green mx-auto mb-2" />
              <CardTitle className="text-kerala-brown">Profile</CardTitle>
              <CardDescription className="text-kerala-brown/70">Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/profile">
                <Button className="w-full bg-kerala-brown hover:bg-kerala-brown/90 text-kerala-white">
                  Manage Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
