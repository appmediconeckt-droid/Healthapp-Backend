import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      emergencyPhone
    } = req.body;

    // Check email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      role,
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
      emergencyPhone
    });

    // Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
};
