import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const resetPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Reset all passwords to a test password
    const testPassword = "123456"; // Test password
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    const result = await User.updateMany({}, { password: hashedPassword });

    console.log(`✅ Updated ${result.modifiedCount} users with password: ${testPassword}`);
    console.log("🔐 Hashed password saved in database");

    // Show all users
    const users = await User.find({}).select("email role phone");
    console.log("\n📋 All users in database:");
    users.forEach((user, idx) => {
      console.log(`${idx + 1}. Email: ${user.email}, Role: ${user.role}, Phone: ${user.phone}`);
    });

    mongoose.connection.close();
    console.log("\n✅ Database reset complete!");

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

resetPasswords();
