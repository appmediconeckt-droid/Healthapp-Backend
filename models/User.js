import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ["patient", "doctor"], default: "patient" },

  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },

  gender: String,
  age: Number,
  bloodGroup: String,
  address: String,
  birthDate: Date,

  // Patient Fields
  medicalConditions: [String],
  allergies: String,
  medications: String,
  emergencyName: String,
  emergencyPhone: String,
  preferredDoctor: {
    doctorId: mongoose.Schema.Types.ObjectId,
    doctorName: String,
    doctorSpecialization: String,
  },

  // Doctor Fields
  specialization: String,
  qualifications: String,
  experience: Number, // in years
  licenseNumber: String,
  clinicAddress: String,
  clinicCity: String,
  clinicState: String,
  clinicPincode: String,
  clinicPhone: String,
  consultationFee: Number,
  availableSlots: {
    monday: { startTime: String, endTime: String }, // "09:00", "18:00"
    tuesday: { startTime: String, endTime: String },
    wednesday: { startTime: String, endTime: String },
    thursday: { startTime: String, endTime: String },
    friday: { startTime: String, endTime: String },
    saturday: { startTime: String, endTime: String },
    sunday: { startTime: String, endTime: String },
  },
  totalPatients: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5 },
  patients: [{
    patientId: mongoose.Schema.Types.ObjectId,
    patientName: String,
    email: String,
    phone: String,
    createdAt: { type: Date, default: Date.now },
  }],
});

userSchema.index({ email: 1, role: 1 });

const User = mongoose.model("User", userSchema);
export default User;
