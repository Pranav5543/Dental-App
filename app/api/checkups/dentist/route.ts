import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import Checkup from "@/lib/models/Checkup"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any

    const checkups = await Checkup.find({ dentist: decoded.userId })
      .populate("patient", "name email age")
      .sort({ requestDate: -1 })

    return NextResponse.json({
      checkups,
    })
  } catch (error) {
    console.error("Error fetching dentist checkups:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
