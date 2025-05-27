import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/lib/models/User"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const dentists = await User.find({ role: "dentist" }).select("-password").sort({ createdAt: -1 })

    return NextResponse.json({
      dentists,
    })
  } catch (error) {
    console.error("Error fetching dentists:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Add this after the existing GET function
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Create sample dentists if none exist
    const dentistCount = await User.countDocuments({ role: "dentist" })

    if (dentistCount === 0) {
      const sampleDentists = [
        {
          name: "Sarah Johnson",
          email: "dr.sarah@onlyfix.com",
          password: await bcrypt.hash("password123", 12),
          role: "dentist",
          phone: "+1-555-0101",
          specialization: "General Dentistry",
          experience: 8,
          location: "New York, NY",
          availability: "Mon-Fri 9AM-5PM",
          licenseNumber: "DDS-NY-12345",
          rating: 4.8,
        },
        {
          name: "Michael Chen",
          email: "dr.chen@onlyfix.com",
          password: await bcrypt.hash("password123", 12),
          role: "dentist",
          phone: "+1-555-0102",
          specialization: "Orthodontics",
          experience: 12,
          location: "Los Angeles, CA",
          availability: "Mon-Sat 8AM-6PM",
          licenseNumber: "DDS-CA-67890",
          rating: 4.9,
        },
        {
          name: "Emily Rodriguez",
          email: "dr.emily@onlyfix.com",
          password: await bcrypt.hash("password123", 12),
          role: "dentist",
          phone: "+1-555-0103",
          specialization: "Pediatric Dentistry",
          experience: 6,
          location: "Chicago, IL",
          availability: "Tue-Sat 10AM-4PM",
          licenseNumber: "DDS-IL-11111",
          rating: 4.7,
        },
      ]

      await User.insertMany(sampleDentists)
    }

    return NextResponse.json({ message: "Sample dentists created" })
  } catch (error) {
    console.error("Error creating sample dentists:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
