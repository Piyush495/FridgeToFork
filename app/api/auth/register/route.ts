import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendOTPEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {

      if(existing.isVerified){
        return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
      }

      const hashed= await bcrypt.hash(password,12);
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

      existing.name = name;
      existing.password = hashed;
      existing.otp = otp;
      existing.otpExpires = otpExpires;
      await existing.save();

      await sendOTPEmail(email,otp,name);

      return NextResponse.json(
        { message: "Verification code sent to email." },
        { status: 200 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await User.create({
      name,
      email,
      password: hashed,
      isVerified: false,
      otp,
      otpExpires,
    });
    await sendOTPEmail(email, otp, name);
    return NextResponse.json(
      { message: "Account registered. Verification code sent." },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
