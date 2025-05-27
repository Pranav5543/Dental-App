"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Stethoscope, LogOut, Clock, CheckCircle, AlertCircle, Calendar, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { User } from "@/lib/user"

interface Checkup {
  _id: string
  patient: {
    _id: string
    name: string
    email: string
    age: number
  }
  status: "pending" | "in-progress" | "completed"
  requestDate: string
  completedDate?: string
  images: Array<{
    url: string
    description: string
  }>
  notes: string
  patientNotes?: string
}

export default function DentistDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [checkups, setCheckups] = useState<Checkup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/dentist/login")
      return
    }

    setUser(JSON.parse(userData))
    fetchCheckups()
  }, [router])

  const fetchCheckups = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/checkups/dentist", {
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

  const updateCheckupStatus = async (checkupId: string, status: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/checkups/${checkupId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Checkup status updated successfully!",
        })
        fetchCheckups()
      } else {
        toast({
          title: "Error",
          description: "Failed to update status",
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

  const pendingCount = checkups.filter((c) => c.status === "pending").length
  const inProgressCount = checkups.filter((c) => c.status === "in-progress").length
  const completedCount = checkups.filter((c) => c.status === "completed").length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Stethoscope className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
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
            <Stethoscope className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">OnlyFix HealthCare</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">Dr. {user?.name}</span>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Dr. {user?.name}!</h2>
          <p className="text-gray-600">Manage your patient checkups and appointments.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting your review</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressCount}</div>
              <p className="text-xs text-muted-foreground">Currently working on</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCount}</div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Patient Checkups */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Patient Checkups</h3>

          {checkups.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No checkup requests</h4>
                <p className="text-gray-600">You'll see patient requests here when they book appointments with you.</p>
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
                          <span>{checkup.patient.name}</span>
                          <Badge className={getStatusColor(checkup.status)}>
                            {getStatusIcon(checkup.status)}
                            <span className="ml-1 capitalize">{checkup.status}</span>
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Age: {checkup.patient.age} • Requested on {new Date(checkup.requestDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        {checkup.status === "pending" && (
                          <Button size="sm" onClick={() => updateCheckupStatus(checkup._id, "in-progress")}>
                            Accept Request
                          </Button>
                        )}
                        {checkup.status === "in-progress" && (
                          <Link href={`/dentist/checkup/${checkup._id}`}>
                            <Button size="sm">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Results
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {checkup.patientNotes && (
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Patient Notes:</h5>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{checkup.patientNotes}</p>
                        </div>
                      )}

                      {checkup.status === "completed" && (
                        <>
                          {checkup.notes && (
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-2">Your Notes:</h5>
                              <p className="text-gray-700 bg-green-50 p-3 rounded-lg">{checkup.notes}</p>
                            </div>
                          )}

                          {checkup.images && checkup.images.length > 0 && (
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-2">Uploaded Images:</h5>
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
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
