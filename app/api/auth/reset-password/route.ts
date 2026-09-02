import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Email, OTP code, and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify reset OTP code matches and hasn't expired
    if (!user.resetOtp || user.resetOtp !== otp) {
      return NextResponse.json(
        { error: "Invalid reset code" },
        { status: 400 }
      );
    }

    if (!user.resetOtpExpires || new Date() > new Date(user.resetOtpExpires)) {
      return NextResponse.json(
        { error: "Reset code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash new password and clear reset fields
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.isVerified = true; // Proof of email ownership via OTP
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
