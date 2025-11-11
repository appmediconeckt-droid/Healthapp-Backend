import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getAllDoctors,
  patientSignup,
  getPatientProfile,
  updatePatientProfile,
  selectDoctor,
} from "../controllers/patientController.js";

const router = express.Router();

// ✅ Public Routes
router.get("/doctors/list", getAllDoctors); // Get all doctors for dropdown
router.post("/signup", patientSignup); // Patient signup with doctor selection

// ✅ Protected Routes
router.get("/me", authMiddleware, getPatientProfile); // Get patient profile
router.put("/profile", authMiddleware, updatePatientProfile); // Update patient profile
router.put("/select-doctor", authMiddleware, selectDoctor); // Select doctor

export default router;
