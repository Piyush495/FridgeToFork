import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address" },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP code and 10-minute expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOtp = otp;
    user.resetOtpExpires = otpExpires;
    await user.save();

    await sendPasswordResetEmail(email, otp, user.name);

    return NextResponse.json(
      { message: "Password reset code sent to your email." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
