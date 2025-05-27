import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import Checkup from "@/lib/models/Checkup"
import PDFDocument from "pdfkit"

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
      .populate("patient", "name email age address phone")
      .populate("dentist", "name specialization location")

    if (!checkup) {
      return NextResponse.json({ message: "Checkup not found" }, { status: 404 })
    }

    // Check access permissions
    if (decoded.role === "patient" && checkup.patient._id.toString() !== decoded.userId) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 })
    }

    if (decoded.role === "dentist" && checkup.dentist._id.toString() !== decoded.userId) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 })
    }

    if (checkup.status !== "completed") {
      return NextResponse.json({ message: "Checkup not completed yet" }, { status: 400 })
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 })
    const chunks: Buffer[] = []

    doc.on("data", (chunk) => chunks.push(chunk))

    const pdfPromise = new Promise<Buffer>((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)))
    })

    // Header
    doc.fontSize(20).text("OnlyFix HealthCare", { align: "center" })
    doc.fontSize(16).text("Dental Checkup Report", { align: "center" })
    doc.moveDown(2)

    // Patient Information
    doc.fontSize(14).text("Patient Information:", { underline: true })
    doc.fontSize(12)
    doc.text(`Name: ${checkup.patient.name}`)
    doc.text(`Email: ${checkup.patient.email}`)
    doc.text(`Age: ${checkup.patient.age}`)
    if (checkup.patient.phone) doc.text(`Phone: ${checkup.patient.phone}`)
    if (checkup.patient.address) doc.text(`Address: ${checkup.patient.address}`)
    doc.moveDown()

    // Dentist Information
    doc.fontSize(14).text("Dentist Information:", { underline: true })
    doc.fontSize(12)
    doc.text(`Name: Dr. ${checkup.dentist.name}`)
    doc.text(`Specialization: ${checkup.dentist.specialization}`)
    if (checkup.dentist.location) doc.text(`Location: ${checkup.dentist.location}`)
    doc.moveDown()

    // Checkup Details
    doc.fontSize(14).text("Checkup Details:", { underline: true })
    doc.fontSize(12)
    doc.text(`Request Date: ${new Date(checkup.requestDate).toLocaleDateString()}`)
    doc.text(`Completed Date: ${new Date(checkup.completedDate).toLocaleDateString()}`)
    doc.text(`Status: ${checkup.status.toUpperCase()}`)
    doc.moveDown()

    // Patient Notes
    if (checkup.patientNotes) {
      doc.fontSize(14).text("Patient Notes:", { underline: true })
      doc.fontSize(12).text(checkup.patientNotes)
      doc.moveDown()
    }

    // Professional Notes
    if (checkup.notes) {
      doc.fontSize(14).text("Professional Assessment:", { underline: true })
      doc.fontSize(12).text(checkup.notes)
      doc.moveDown()
    }

    // Images section
    if (checkup.images && checkup.images.length > 0) {
      doc.fontSize(14).text("Checkup Images:", { underline: true })
      doc.moveDown()

      checkup.images.forEach((image, index) => {
        try {
          // For base64 images, we'll just add the description
          doc.fontSize(12).text(`Image ${index + 1}: ${image.description || "No description provided"}`)
          doc.moveDown(0.5)
        } catch (error) {
          console.error("Error adding image to PDF:", error)
        }
      })
    }

    // Footer
    doc
      .fontSize(10)
      .text(`Generated on ${new Date().toLocaleDateString()} by OnlyFix HealthCare System`, { align: "center" })

    doc.end()

    const pdfBuffer = await pdfPromise

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="checkup-report-${params.id}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
