"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Stethoscope,
  LogOut,
  Calendar,
  FileText,
  Download,
  UserIcon,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface UserType {
  _id: string
  name: string
  email: string
  role: string
}

interface Checkup {
  _id: string
  dentist: {
    _id: string
    name: string
    specialization: string
  }
  status: "pending" | "in-progress" | "completed"
  requestDate: string
  completedDate?: string
  images: Array<{
    url: string
    description: string
  }>
  notes: string
}

export default function PatientDashboard() {
  const [user, setUser] = useState<UserType | null>(null)
  const [checkups, setCheckups] = useState<Checkup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/patient/login")
      return
    }

    setUser(JSON.parse(userData))
    fetchCheckups()
  }, [router])

  const fetchCheckups = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/checkups/patient", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCheckups(data.checkups)
      }
    } catch (error) {
      console.error("Error fetching checkups:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Add this after the existing fetchCheckups function
  useEffect(() => {
    // Auto-refresh checkups every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchCheckups()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const downloadPDF = async (checkupId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/checkups/${checkupId}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `checkup-report-${checkupId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)

        toast({
          title: "Success",
          description: "PDF downloaded successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to download PDF",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in-progress":
        return <AlertCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Stethoscope className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">OnlyFix HealthCare</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{user?.name}</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-gray-600">Manage your dental checkups and view your health records.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Book Checkup</span>
              </CardTitle>
              <CardDescription>Schedule a new dental checkup with available dentists</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/patient/book-checkup">
                <Button className="w-full">Book Now</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span>My Records</span>
              </CardTitle>
              <CardDescription>View and download your checkup reports and medical records</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Records
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-purple-600" />
                <span>Profile</span>
              </CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Checkups */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Checkups</h3>

          {checkups.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No checkups yet</h4>
                <p className="text-gray-600 mb-4">Book your first dental checkup to get started</p>
                <Link href="/patient/book-checkup">
                  <Button>Book Your First Checkup</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {checkups.map((checkup) => (
                <Card key={checkup._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <span>Dr. {checkup.dentist.name}</span>
                          <Badge className={getStatusColor(checkup.status)}>
                            {getStatusIcon(checkup.status)}
                            <span className="ml-1 capitalize">{checkup.status}</span>
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {checkup.dentist.specialization} • Requested on{" "}
                          {new Date(checkup.requestDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {checkup.status === "completed" && (
                        <Button variant="outline" size="sm" onClick={() => downloadPDF(checkup._id)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  {checkup.status === "completed" && (
                    <CardContent>
                      <div className="space-y-4">
                        {checkup.notes && (
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2">Dentist Notes:</h5>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{checkup.notes}</p>
                          </div>
                        )}

                        {checkup.images && checkup.images.length > 0 && (
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2">Checkup Images:</h5>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {checkup.images.map((image, index) => (
                                <div key={index} className="space-y-2">
                                  <img
                                    src={image.url || "/placeholder.svg"}
                                    alt={`Checkup image ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border"
                                  />
                                  {image.description && <p className="text-sm text-gray-600">{image.description}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {checkup.completedDate && (
                          <p className="text-sm text-gray-500">
                            Completed on {new Date(checkup.completedDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
