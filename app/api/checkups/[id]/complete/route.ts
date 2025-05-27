import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import Checkup from "@/lib/models/Checkup"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    const formData = await request.formData()

    const notes = formData.get("notes") as string
    const imageFiles = formData.getAll("images") as File[]

    const checkup = await Checkup.findById(params.id)
    if (!checkup) {
      return NextResponse.json({ message: "Checkup not found" }, { status: 404 })
    }

    // Only dentist can complete checkup
    if (decoded.role !== "dentist" || checkup.dentist.toString() !== decoded.userId) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 })
    }

    // Process images (in a real app, you'd upload to cloud storage)
    const images = []
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      const description = formData.get(`descriptions[${i}]`) as string

      // Convert file to base64 for demo purposes
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString("base64")
      const dataUrl = `data:${file.type};base64,${base64}`

      images.push({
        url: dataUrl,
        description: description || "",
      })
    }

    // Update checkup
    checkup.status = "completed"
    checkup.notes = notes
    checkup.images = images
    checkup.completedDate = new Date()

    await checkup.save()

    return NextResponse.json({
      message: "Checkup completed successfully",
      checkup,
    })
  } catch (error) {
    console.error("Error completing checkup:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
