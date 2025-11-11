import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Get All Doctors List (for dropdown in signup)
export const getAllDoctors = async (req, res) => {
  try {
    const { specialization, city } = req.query;
    
    let filter = { role: "doctor" };
    
    if (specialization) {
      filter.specialization = { $regex: specialization, $options: "i" };
    }
    
    if (city) {
      filter.clinicCity = { $regex: city, $options: "i" };
    }

    const doctors = await User.find(filter).select(
      "_id fullName specialization experience clinicCity rating consultationFee clinicPhone"
    ).sort({ rating: -1 });

    console.log(`✅ Found ${doctors.length} doctors`);

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });

  } catch (error) {
    console.error("Get Doctors List Error:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch doctors list",
      error: error.message 
    });
  }
};

// ✅ Patient Signup with Doctor Selection
export const patientSignup = async (req, res) => {
  try {
    const {
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
      preferredDoctorId,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide: fullName, email, phone, password",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let preferredDoctorData = null;

    // If doctor is selected, get doctor details and add patient to doctor's list
    if (preferredDoctorId) {
      const doctor = await User.findById(preferredDoctorId);
      
      if (!doctor || doctor.role !== "doctor") {
        return res.status(400).json({
          success: false,
          message: "Selected doctor not found",
        });
      }

      preferredDoctorData = {
        doctorId: doctor._id,
        doctorName: doctor.fullName,
        doctorSpecialization: doctor.specialization,
      };
    }

    // Create new patient user
    const newPatient = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "patient",
      phone,
      gender,
      age,
      bloodGroup,
      birthDate,
      address,
      medicalConditions: medicalConditions || [],
      allergies,
      medications,
      emergencyName,
      emergencyPhone,
      preferredDoctor: preferredDoctorData,
    });

    // If doctor is selected, add patient to doctor's patient list
    if (preferredDoctorId) {
      await User.findByIdAndUpdate(
        preferredDoctorId,
        {
          $push: {
            patients: {
              patientId: newPatient._id,
              patientName: fullName,
              email: email,
              phone: phone,
            },
          },
          $inc: { totalPatients: 1 },
        },
        { new: true }
      );

      console.log(`✅ Patient ${fullName} added to doctor ${preferredDoctorId}`);
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: newPatient._id, role: newPatient.role, email: newPatient.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`✅ Patient signup successful: ${email}`);

    res.status(201).json({
      success: true,
      message: "Patient signup successful",
      token,
      user: {
        _id: newPatient._id,
        fullName: newPatient.fullName,
        email: newPatient.email,
        role: newPatient.role,
        preferredDoctor: newPatient.preferredDoctor,
      },
    });

  } catch (error) {
    console.error("Patient Signup Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Patient signup failed",
      error: error.message,
    });
  }
};

// ✅ Get Patient Profile
export const getPatientProfile = async (req, res) => {
  try {
    const patient = await User.findById(req.user._id).select("-password");

    if (!patient || patient.role !== "patient") {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });

  } catch (error) {
    console.error("Get Patient Profile Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient profile",
      error: error.message,
    });
  }
};

// ✅ Select Doctor for Patient
export const selectDoctor = async (req, res) => {
  try {
    const { preferredDoctorId } = req.body;
    const patientId = req.user._id;

    // Validate doctor ID is provided
    if (!preferredDoctorId) {
      return res.status(400).json({
        success: false,
        message: "Please provide preferredDoctorId",
      });
    }

    // Get old doctor (if exists)
    const patient = await User.findById(patientId);
    const oldDoctorId = patient.preferredDoctor?.doctorId;

    // Verify doctor exists and is actually a doctor
    const doctor = await User.findById(preferredDoctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({
        success: false,
        message: "Selected doctor not found",
      });
    }

    // Create new preferred doctor data
    const preferredDoctorData = {
      doctorId: doctor._id,
      doctorName: doctor.fullName,
      doctorSpecialization: doctor.specialization,
    };

    // Update patient with new doctor
    const updatedPatient = await User.findByIdAndUpdate(
      patientId,
      { preferredDoctor: preferredDoctorData },
      { new: true }
    ).select("-password");

    // If patient had a previous doctor, remove from their patient list
    if (oldDoctorId && oldDoctorId.toString() !== preferredDoctorId) {
      await User.findByIdAndUpdate(
        oldDoctorId,
        {
          $pull: { patients: { patientId: patientId } },
          $inc: { totalPatients: -1 },
        },
        { new: true }
      );
      console.log(`✅ Patient removed from old doctor's list`);
    }

    // Add patient to new doctor's patient list (if not already there)
    const doctorPatients = doctor.patients || [];
    const isAlreadyAdded = doctorPatients.some(
      (p) => p.patientId.toString() === patientId.toString()
    );

    if (!isAlreadyAdded) {
      await User.findByIdAndUpdate(
        preferredDoctorId,
        {
          $push: {
            patients: {
              patientId: patientId,
              patientName: patient.fullName,
              email: patient.email,
              phone: patient.phone,
            },
          },
          $inc: { totalPatients: 1 },
        },
        { new: true }
      );
      console.log(`✅ Patient added to new doctor's list`);
    }

    console.log(
      `✅ Doctor selected: ${patient.fullName} -> ${doctor.fullName}`
    );

    res.status(200).json({
      success: true,
      message: "Doctor selected successfully",
      patient: updatedPatient,
    });

  } catch (error) {
    console.error("Select Doctor Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to select doctor",
      error: error.message,
    });
  }
};

// ✅ Update Patient Profile
export const updatePatientProfile = async (req, res) => {
  try {
    const {
      phone,
      gender,
      age,
      bloodGroup,
      address,
      medicalConditions,
      allergies,
      medications,
      emergencyName,
      emergencyPhone,
    } = req.body;

    const updateData = {};
    if (phone) updateData.phone = phone;
    if (gender) updateData.gender = gender;
    if (age) updateData.age = age;
    if (bloodGroup) updateData.bloodGroup = bloodGroup;
    if (address) updateData.address = address;
    if (medicalConditions) updateData.medicalConditions = medicalConditions;
    if (allergies) updateData.allergies = allergies;
    if (medications) updateData.medications = medications;
    if (emergencyName) updateData.emergencyName = emergencyName;
    if (emergencyPhone) updateData.emergencyPhone = emergencyPhone;

    const patient = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select("-password");

    console.log(`✅ Patient profile updated: ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: "Patient profile updated successfully",
      patient,
    });

  } catch (error) {
    console.error("Update Patient Profile Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update patient profile",
      error: error.message,
    });
  }
};
