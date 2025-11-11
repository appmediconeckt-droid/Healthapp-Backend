import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Get Doctor Dashboard Data
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    console.log("📊 Doctor dashboard request for:", req.user.email);

    // Check if user is doctor
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can access this" });
    }

    const doctor = await User.findById(req.user._id).select("-password");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const dashboardData = {
      doctor: {
        _id: doctor._id,
        fullName: doctor.fullName,
        email: doctor.email,
        phone: doctor.phone,
        specialization: doctor.specialization,
        qualifications: doctor.qualifications,
        experience: doctor.experience,
        licenseNumber: doctor.licenseNumber,
        rating: doctor.rating,
        consultationFee: doctor.consultationFee,
      },
      clinic: {
        address: doctor.clinicAddress,
        city: doctor.clinicCity,
        state: doctor.clinicState,
        pincode: doctor.clinicPincode,
        phone: doctor.clinicPhone,
      },
      schedule: doctor.availableSlots,
      patients: doctor.patients || [],
      stats: {
        totalPatients: doctor.totalPatients || 0,
        totalAppointments: 0, // Will add when appointments are created
        rating: doctor.rating,
        consultationFee: doctor.consultationFee,
      },
    };

    console.log("✅ Dashboard data fetched for:", doctor.fullName);

    res.status(200).json({
      message: "Doctor dashboard data",
      data: dashboardData,
    });

  } catch (error) {
    console.error("Doctor Dashboard Error:", error.message);
    res.status(500).json({
      message: "Failed to fetch doctor dashboard",
      error: error.message,
    });
  }
});

// ✅ Get Doctor Profile (Public)
router.get("/profile/:doctorId", async (req, res) => {
  try {
    const doctor = await User.findById(req.params.doctorId).select(
      "fullName specialization qualifications experience rating clinicCity availableSlots consultationFee"
    );

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      doctor,
    });

  } catch (error) {
    console.error("Get Doctor Profile Error:", error.message);
    res.status(500).json({ message: "Failed to fetch doctor profile" });
  }
});

// ✅ Get All Doctors (Public - for search/listing)
router.get("/list", async (req, res) => {
  try {
    const { specialization, city } = req.query;
    
    let filter = { role: "doctor" };
    
    if (specialization) {
      filter.specialization = specialization;
    }
    
    if (city) {
      filter.clinicCity = city;
    }

    const doctors = await User.find(filter).select(
      "fullName specialization experience clinicCity rating consultationFee availableSlots"
    );

    console.log(`✅ Found ${doctors.length} doctors`);

    res.status(200).json({
      count: doctors.length,
      doctors,
    });

  } catch (error) {
    console.error("Get Doctors List Error:", error.message);
    res.status(500).json({ message: "Failed to fetch doctors list" });
  }
});

// ✅ Update Doctor Schedule
router.put("/schedule", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can update schedule" });
    }

    const { availableSlots } = req.body;

    if (!availableSlots) {
      return res.status(400).json({ message: "Please provide availableSlots" });
    }

    const doctor = await User.findByIdAndUpdate(
      req.user._id,
      { availableSlots },
      { new: true }
    ).select("-password");

    console.log("✅ Doctor schedule updated:", req.user.email);

    res.status(200).json({
      message: "Schedule updated successfully",
      doctor,
    });

  } catch (error) {
    console.error("Update Schedule Error:", error.message);
    res.status(500).json({ message: "Failed to update schedule" });
  }
});

// ✅ Update Doctor Profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can update profile" });
    }

    const {
      phone,
      specialization,
      qualifications,
      experience,
      clinicAddress,
      clinicCity,
      clinicState,
      clinicPincode,
      clinicPhone,
      consultationFee,
    } = req.body;

    const updateData = {};
    if (phone) updateData.phone = phone;
    if (specialization) updateData.specialization = specialization;
    if (qualifications) updateData.qualifications = qualifications;
    if (experience) updateData.experience = experience;
    if (clinicAddress) updateData.clinicAddress = clinicAddress;
    if (clinicCity) updateData.clinicCity = clinicCity;
    if (clinicState) updateData.clinicState = clinicState;
    if (clinicPincode) updateData.clinicPincode = clinicPincode;
    if (clinicPhone) updateData.clinicPhone = clinicPhone;
    if (consultationFee) updateData.consultationFee = consultationFee;

    const doctor = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    console.log("✅ Doctor profile updated:", req.user.email);

    res.status(200).json({
      message: "Profile updated successfully",
      doctor,
    });

  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;
