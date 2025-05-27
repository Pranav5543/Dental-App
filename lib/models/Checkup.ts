import mongoose from "mongoose"

const CheckupSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dentist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    completedDate: {
      type: Date,
    },
    patientNotes: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Checkup || mongoose.model("Checkup", CheckupSchema)
