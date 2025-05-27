import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import Checkup from "@/lib/models/Checkup"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any

    const checkup = await Checkup.findById(params.id)
      .populate("patient", "name email age")
      .populate("dentist", "name specialization")

    if (!checkup) {
      return NextResponse.json({ message: "Checkup not found" }, { status: 404 })
    }

    // Check if user has access to this checkup
    if (decoded.role === "patient" && checkup.patient._id.toString() !== decoded.userId) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 })
    }

    if (decoded.role === "dentist" && checkup.dentist._id.toString() !== decoded.userId) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 })
    }

    return NextResponse.json({
      checkup,
    })
  } catch (error) {
    console.error("Error fetching checkup:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
