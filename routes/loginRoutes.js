import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // same user model doctor/patient ke liye

const router = express.Router();

// ✅ LOGIN API
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check fields
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // User find
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(404).json({ message: "User not found with this role" });
    }

    // Password compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Token generate
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Login Successful",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
