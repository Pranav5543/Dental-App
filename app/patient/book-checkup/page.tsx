"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Stethoscope, ArrowLeft, User, Star, MapPin, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Dentist {
  _id: string
  name: string
  email: string
  specialization: string
  experience: number
  location: string
  rating: number
  availability: string
}

export default function BookCheckup() {
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [selectedDentist, setSelectedDentist] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/patient/login")
      return
    }
    fetchDentists()
  }, [router])

  const fetchDentists = async () => {
    try {
      const response = await fetch("/api/dentists")
      if (response.ok) {
        const data = await response.json()
        setDentists(data.dentists)
      }
    } catch (error) {
      console.error("Error fetching dentists:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDentist) {
      toast({
        title: "Error",
        description: "Please select a dentist",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/checkups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dentistId: selectedDentist,
          notes: notes,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Checkup request submitted successfully!",
        })
        router.push("/patient/dashboard")
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to submit request",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Stethoscope className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading available dentists...</p>
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
          <Link href="/patient/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Book a Checkup</h2>
            <p className="text-gray-600">Choose from our qualified dentists and schedule your appointment.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dentist Selection */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Select a Dentist</h3>

              {dentists.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No dentists available</h4>
                    <p className="text-gray-600">Please check back later or contact support.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {dentists.map((dentist) => (
                    <Card
                      key={dentist._id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedDentist === dentist._id
                          ? "ring-2 ring-blue-500 border-blue-500"
                          : "hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedDentist(dentist._id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center space-x-2">
                              <User className="h-5 w-5 text-blue-600" />
                              <span>Dr. {dentist.name}</span>
                            </CardTitle>
                            <CardDescription>{dentist.specialization}</CardDescription>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{dentist.rating}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{dentist.experience} years experience</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{dentist.location}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Availability:</span> {dentist.availability}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes" className="text-lg font-semibold">
                Additional Notes (Optional)
              </Label>
              <p className="text-sm text-gray-600 mb-3">
                Describe any specific concerns or symptoms you'd like the dentist to know about.
              </p>
              <Textarea
                id="notes"
                placeholder="Enter any additional information about your dental concerns..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/patient/dashboard">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!selectedDentist || isSubmitting} className="min-w-[150px]">
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
