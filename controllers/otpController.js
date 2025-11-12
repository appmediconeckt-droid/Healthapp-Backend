import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// 🔹 OTP bhejne ke liye
export const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    await client.messages.create({
      body: `Your OTP for Mediconeckt is ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: phone.startsWith("+91") ? phone : `+91${phone}`, // India numbers
    });

    // OTP ko memory ya DB me store karo (filhal memory me)
    global.otpStore = { [phone]: otp, createdAt: Date.now() };

    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// 🔹 OTP verify karne ke liye
export const verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;

  const stored = global.otpStore?.[phone];
  if (!stored) return res.status(400).json({ success: false, message: "OTP not found" });

  if (stored == otp) {
    delete global.otpStore[phone];
    res.json({ success: true, message: "OTP verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
};
