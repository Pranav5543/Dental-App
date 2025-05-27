import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["patient", "dentist"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    // Patient specific fields
    age: {
      type: Number,
      required: function () {
        return this.role === "patient"
      },
    },
    address: {
      type: String,
      required: function () {
        return this.role === "patient"
      },
    },
    // Dentist specific fields
    specialization: {
      type: String,
      required: function () {
        return this.role === "dentist"
      },
    },
    experience: {
      type: Number,
      required: function () {
        return this.role === "dentist"
      },
    },
    location: {
      type: String,
      required: function () {
        return this.role === "dentist"
      },
    },
    availability: {
      type: String,
      required: function () {
        return this.role === "dentist"
      },
    },
    licenseNumber: {
      type: String,
      required: function () {
        return this.role === "dentist"
      },
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.User || mongoose.model("User", UserSchema)
