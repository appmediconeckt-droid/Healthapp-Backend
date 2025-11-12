import express from "express";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import twilio from "twilio";
import User from "../models/User.js";

const router = express.Router();

// ✅ Twilio client setup
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// Temporary in-memory OTP store (production me Redis ya DB use karo)
const otpStore = new Map();

/**
 * ✅ Step 1: Request OTP
 * body: { phone, role }
 */
router.post("/auth/request-otp", async (req, res) => {
  try {
    const { phone, role } = req.body;

    if (!phone || !role) {
      return res.status(400).json({ message: "Phone and role required" });
    }

    // Check if user exists
    const user = await User.findOne({ phone, role: role.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found with this role" });
    }

    // Generate 6-digit OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      alphabets: false,
    });

    // Store OTP with 5 min expiry
    otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 });

    // ✅ Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP for MediConeckt is ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: phone.startsWith("+91") ? phone : `+91${phone}`,
    });

    console.log(`✅ OTP ${otp} sent to ${phone}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("OTP Request Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/**
 * ✅ Step 2: Verify OTP and Login
 * body: { phone, otp, role }
 */
router.post("/auth/verify-otp", async (req, res) => {
  try {
    const { phone, otp, role } = req.body;

    if (!phone || !otp || !role) {
      return res.status(400).json({ message: "Phone, OTP and role required" });
    }

    const record = otpStore.get(phone);
    if (!record) {
      return res.status(400).json({ message: "No OTP found or expired" });
    }

    if (record.expires < Date.now()) {
      otpStore.delete(phone);
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP verified successfully → find user
    const user = await User.findOne({ phone, role: role.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Delete OTP from memory after success
    otpStore.delete(phone);

    res.status(200).json({
      message: "OTP verified successfully",
      token,
      user,
    });
  } catch (err) {
    console.error("OTP Verify Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

export default router;
