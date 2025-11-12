import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Universal Signup (Doctor or Patient)
export const signup = async (req, res) => {
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
      address,
      birthDate,
      medicalConditions,
      allergies,
      medications,
      emergencyName,
      emergencyPhone,
    } = req.body;

    // ✅ Normalize role for consistency
    const normalizedRole = role?.toLowerCase();

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      role: normalizedRole,
      fullName,
      email,
      phone,
      password: hashedPassword,
      gender,
      age,
      bloodGroup,
      address,
      birthDate,
      medicalConditions,
      allergies,
      medications,
      emergencyName,
      emergencyPhone,
    });

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user,
    });
  } catch (error) {
    console.log("Signup Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Login Controller
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const normalizedRole = role?.toLowerCase();

    // ✅ Find user by email and role (case-insensitive)
    const user = await User.findOne({ email, role: normalizedRole });
    if (!user)
      return res.status(404).json({ message: "User not found with this role" });

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // ✅ Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Fetch All Doctors (for Patient Signup dropdown)
export const getAllDoctors = async (req, res) => {
  try {
    const { specialization, city } = req.query;

    let filter = { role: "doctor" };

    if (specialization)
      filter.specialization = { $regex: specialization, $options: "i" };
    if (city) filter.clinicCity = { $regex: city, $options: "i" };

    const doctors = await User.find(filter)
      .select(
        "_id fullName specialization experience clinicCity rating consultationFee clinicPhone"
      )
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors list",
      error: error.message,
    });
  }
};
