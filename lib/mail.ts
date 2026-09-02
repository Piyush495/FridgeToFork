import nodemailer from "nodemailer";

// Helper transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTPEmail(email: string, otp: string, name: string) {
  // Always log to terminal console for easy developer testing
  console.log(`\n==========================================`);
  console.log(`[OTP VERIFICATION] OTP: ${otp} | Email: ${email}`);
  console.log(`==========================================\n`);

  // Check if SMTP settings are configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("[SMTP] SMTP_USER or SMTP_PASS environment variables are missing. Falling back to console-only logging.");
    return;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || `"FridgeToFork" <noreply@fridgetofork.com>`,
    to: email,
    subject: "Verify your email - FridgeToFork",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #2D6A4F; font-size: 24px; margin: 0;">Welcome to FridgeToFork!</h2>
        </div>
        <p style="font-size: 16px; color: #4a5568; line-height: 1.6;">Hi ${name},</p>
        <p style="font-size: 16px; color: #4a5568; line-height: 1.6;">Thank you for registering. Please enter the following 6-digit OTP code on the verification screen to verify your email address:</p>
        
        <div style="text-align: center; margin: 35px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #2D6A4F; background-color: #EAF5EB; padding: 12px 28px; border-radius: 10px; border: 1.5px dashed #52B788; display: inline-block;">
            ${otp}
          </span>
        </div>
        
        <p style="font-size: 14px; color: #718096; text-align: center; margin-top: 20px;">This code is valid for 10 minutes. If it expires, you can request a new one.</p>
        <hr style="border: none; border-top: 1px solid #edf2f7; margin: 25px 0;" />
        <p style="font-size: 12px; color: #a0aec0; text-align: center;">If you did not request this code, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Verification email sent successfully to ${email}`);
  } catch (error) {
    console.error("[SMTP] Failed to send email via SMTP:", error);
  }
}

export async function sendPasswordResetEmail(email: string, otp: string, name: string) {
  // Always log to terminal console for developer testing
  console.log(`\n==========================================`);
  console.log(`[PASSWORD RESET OTP] OTP: ${otp} | Email: ${email}`);
  console.log(`==========================================\n`);

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("[SMTP] SMTP credentials missing. Falling back to console-only logging.");
    return;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || `"FridgeToFork" <noreply@fridgetofork.com>`,
    to: email,
    subject: "Reset your password - FridgeToFork",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #2D6A4F; font-size: 24px; margin: 0;">Password Reset Request</h2>
        </div>
        <p style="font-size: 16px; color: #4a5568; line-height: 1.6;">Hi ${name},</p>
        <p style="font-size: 16px; color: #4a5568; line-height: 1.6;">We received a request to reset your password. Use the 6-digit OTP code below to reset your password:</p>
        
        <div style="text-align: center; margin: 35px 0;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #2D6A4F; background-color: #EAF5EB; padding: 12px 28px; border-radius: 10px; border: 1.5px dashed #52B788; display: inline-block;">
            ${otp}
          </span>
        </div>
        
        <p style="font-size: 14px; color: #718096; text-align: center; margin-top: 20px;">This code is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #edf2f7; margin: 25px 0;" />
        <p style="font-size: 12px; color: #a0aec0; text-align: center;">FridgeToFork Security Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[SMTP] Password reset email sent successfully to ${email}`);
  } catch (error) {
    console.error("[SMTP] Failed to send password reset email via SMTP:", error);
  }
}
