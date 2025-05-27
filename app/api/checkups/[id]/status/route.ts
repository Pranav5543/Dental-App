import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import Checkup from "@/lib/models/Checkup"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    const { status } = await request.json()

    const checkup = await Checkup.findById(params.id)
    if (!checkup) {
      return NextResponse.json({ message: "Checkup not found" }, { status: 404 })
    }

    // Only dentist can update status
    if (decoded.role !== "dentist" || checkup.dentist.toString() !== decoded.userId) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 })
    }

    checkup.status = status
    await checkup.save()

    return NextResponse.json({
      message: "Status updated successfully",
      checkup,
    })
  } catch (error) {
    console.error("Error updating checkup status:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
