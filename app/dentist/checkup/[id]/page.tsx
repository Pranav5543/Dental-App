"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Stethoscope, ArrowLeft, Upload, X, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Checkup {
  _id: string
  patient: {
    _id: string
    name: string
    email: string
    age: number
  }
  status: string
  requestDate: string
  patientNotes?: string
}

interface ImageUpload {
  file: File
  description: string
  preview: string
}

export default function CheckupUpload() {
  const [checkup, setCheckup] = useState<Checkup | null>(null)
  const [notes, setNotes] = useState("")
  const [images, setImages] = useState<ImageUpload[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/dentist/login")
      return
    }
    fetchCheckup()
  }, [router, params.id])

  const fetchCheckup = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/checkups/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCheckup(data.checkup)
      } else {
        toast({
          title: "Error",
          description: "Checkup not found",
          variant: "destructive",
        })
        router.push("/dentist/dashboard")
      }
    } catch (error) {
      console.error("Error fetching checkup:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newImage: ImageUpload = {
            file,
            description: "",
            preview: e.target?.result as string,
          }
          setImages((prev) => [...prev, newImage])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const updateImageDescription = (index: number, description: string) => {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, description } : img)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()

      formData.append("notes", notes)
      images.forEach((image, index) => {
        formData.append("images", image.file)
        formData.append(`descriptions[${index}]`, image.description)
      })

      const response = await fetch(`/api/checkups/${params.id}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Checkup completed successfully!",
        })
        router.push("/dentist/dashboard")
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.message || "Failed to complete checkup",
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
          <Stethoscope className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading checkup details...</p>
        </div>
      </div>
    )
  }

  if (!checkup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkup not found</h2>
          <Link href="/dentist/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
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
          <Link href="/dentist/dashboard">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Patient Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>Complete the checkup for this patient</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Patient Name</Label>
                  <p className="text-lg font-semibold">{checkup.patient.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Age</Label>
                  <p className="text-lg font-semibold">{checkup.patient.age} years</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-lg font-semibold">{checkup.patient.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Request Date</Label>
                  <p className="text-lg font-semibold">{new Date(checkup.requestDate).toLocaleDateString()}</p>
                </div>
              </div>

              {checkup.patientNotes && (
                <div className="mt-4">
                  <Label className="text-sm font-medium text-gray-600">Patient Notes</Label>
                  <p className="mt-1 p-3 bg-blue-50 rounded-lg text-gray-700">{checkup.patientNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Checkup Images</CardTitle>
                <CardDescription>
                  Upload images from the dental checkup and add descriptions for each image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="imageUpload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700">Click to upload images</p>
                      <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB each</p>
                    </div>
                  </Label>
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {images.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Uploaded Images</h4>
                    <div className="grid gap-6">
                      {images.map((image, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-white">
                          <div className="flex items-start space-x-4">
                            <img
                              src={image.preview || "/placeholder.svg"}
                              alt={`Upload ${index + 1}`}
                              className="w-24 h-24 object-cover rounded-lg border"
                            />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={`description-${index}`}>Image Description</Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeImage(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <Textarea
                                id={`description-${index}`}
                                placeholder="Describe what this image shows..."
                                value={image.description}
                                onChange={(e) => updateImageDescription(index, e.target.value)}
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Notes</CardTitle>
                <CardDescription>Add your professional assessment and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your professional notes, diagnosis, and recommendations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  required
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <Link href="/dentist/dashboard">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting || images.length === 0} className="min-w-[150px]">
                {isSubmitting ? (
                  "Completing..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Complete Checkup
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
