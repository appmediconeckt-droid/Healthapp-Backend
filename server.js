import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";


dotenv.config();
const app = express();

// ✅ CORS Setup (sabhi domains allowed)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ JSON Parser
app.use(express.json());

// ✅ Database Connect
connectDB();

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api", loginRoutes);
app.use("/patient", patientRoutes);
app.use("/doctor", doctorRoutes);
app.use("/api", otpRoutes);


// ✅ Default Route
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
