import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Database Connect
connectDB();

// ✅ Routes Use
app.use("/api/auth", authRoutes);
app.use("/api", loginRoutes);
app.use("/patient", patientRoutes);
app.use("/doctor", doctorRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

