import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Patient Signup API
router.post("/signup", async (req, res) => {
  try {
    const {
      role,
      fullName,
      email,
      phone,
      password,
      gender,
      age,
      bloodGroup,
      birthDate,
      address,
      medicalConditions,
      allergies,
      medications,
      emergencyName,
      emergencyPhone,
    } = req.body;

    // Check existing user
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ Password Hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (use fullName to match the User schema)
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || "patient",
      phone,
      gender,
      age,
      bloodGroup,
      birthDate,
      address,
      medicalConditions,
      allergies,
      medications,
      emergencyName,
      emergencyPhone,
    });

    res.status(201).json({ message: "Signup successful", user: newUser });

  } catch (error) {
    console.log("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Doctor Signup API
router.post("/doctor/signup", async (req, res) => {
  try {
    console.log("📝 Doctor signup attempt:", req.body.email);

    const {
      fullName,
      email,
      phone,
      password,
      gender,
      age,
      specialization,
      qualifications,
      experience,
      licenseNumber,
      clinicAddress,
      clinicCity,
      clinicState,
      clinicPincode,
      clinicPhone,
      consultationFee,
      availableSlots,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !password || !specialization) {
      return res.status(400).json({
        message: "Please provide: fullName, email, phone, password, specialization",
      });
    }

    // Check existing user
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ Password Hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create doctor user
    const doctor = await User.create({
      role: "doctor",
      fullName,
      email,
      phone,
      password: hashedPassword,
      gender,
      age,
      specialization,
      qualifications,
      experience: experience || 0,
      licenseNumber,
      clinicAddress,
      clinicCity,
      clinicState,
      clinicPincode,
      clinicPhone: clinicPhone || phone,
      consultationFee: consultationFee || 500,
      availableSlots: availableSlots || {
        monday: { startTime: "09:00", endTime: "18:00" },
        tuesday: { startTime: "09:00", endTime: "18:00" },
        wednesday: { startTime: "09:00", endTime: "18:00" },
        thursday: { startTime: "09:00", endTime: "18:00" },
        friday: { startTime: "09:00", endTime: "18:00" },
        saturday: { startTime: "10:00", endTime: "14:00" },
        sunday: { startTime: null, endTime: null },
      },
      totalPatients: 0,
    });

    console.log("✅ Doctor created successfully:", doctor.email);

    res.status(201).json({
      message: "Doctor signup successful",
      doctor: {
        _id: doctor._id,
        fullName: doctor.fullName,
        email: doctor.email,
        specialization: doctor.specialization,
        clinicCity: doctor.clinicCity,
      },
    });

  } catch (error) {
    console.error("Doctor Signup Error:", error.message);
    res.status(500).json({
      message: "Doctor signup failed",
      error: error.message,
    });
  }
});

export default router;
