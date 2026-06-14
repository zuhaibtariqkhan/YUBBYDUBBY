import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { signPayload, verifyPayload } from "@/lib/otp-token";

const OTP_DEBUG_LOG_PATH = path.join(process.cwd(), "otp-debug.log");

// Helper to log OTP to a local debug file for developer convenience
function logOtpToDebugFile(email: string, emailOtp: string) {
  try {
    const logMsg = `[${new Date().toISOString()}] REGISTRATION OTP FOR:\n` +
      `Email: ${email} -> OTP: ${emailOtp}\n` +
      `----------------------------------------\n`;
    fs.appendFileSync(OTP_DEBUG_LOG_PATH, logMsg, "utf8");
    console.log(`[OTP DEBUG] OTP written to ${OTP_DEBUG_LOG_PATH}`);
  } catch (error) {
    console.error("Error writing OTP to debug log:", error);
  }
}

// SMTP Transporter configuration
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, emailOtp, otpToken } = body;

    console.log("[OTP API] Request action:", action, "email:", email);

    if (action === "send") {
      if (!email) {
        return NextResponse.json(
          { error: "Email address is required to dispatch verification code." },
          { status: 400 }
        );
      }

      const cleanEmail = email.toLowerCase().trim();
      const generatedEmailOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

      // Log OTP locally so developer can read it instantly
      logOtpToDebugFile(cleanEmail, generatedEmailOtp);

      // Send Email OTP using SMTP if configured
      let emailSent = false;
      let emailErrorDetail = "";
      const transporter = getTransporter();
      if (!transporter) {
        emailErrorDetail = `SMTP configuration missing (SMTP_HOST, SMTP_USER or SMTP_PASS is undefined). Available env keys: ${Object.keys(process.env).filter(k => k.toLowerCase().includes("smtp")).join(", ") || "none"}`;
      } else {
        try {
          await transporter.sendMail({
            from: `"Yubby Dubby Security" <${process.env.SMTP_USER}>`,
            to: cleanEmail,
            subject: "Your YUBBY DUBBY Verification Code",
            text: `Welcome to Yubby Dubby,\n\nUse this 6-digit OTP code to verify your email: ${generatedEmailOtp}\nIt will expire in 5 minutes.\n\nWhy create a Yubby Dubby account?\n✓ Faster checkout on future orders\n✓ Save your favorite products and wishlists\n✓ Track orders in real time\n✓ Access exclusive member-only offers\n✓ Manage addresses and payment preferences\n✓ Get personalized product recommendations\n✓ Receive updates on new arrivals and limited drops\n\nFor your security, never share this code with anyone. Yubby Dubby will never ask for your verification code via phone, email, or social media.\n\nIf you did not request this verification, you can safely ignore this email.\n\nWelcome to the club.\nTeam Yubby Dubby\nNext Generation Lifestyle Marketplace\nwww.yubbydubby.com`,
            html: `
              <div style="background-color: #030303; color: #ffffff; padding: 40px 20px; font-family: sans-serif; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #1a1a1a;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #B1F310; font-size: 28px; font-weight: 900; letter-spacing: 4px; margin: 0; text-transform: uppercase;">YUBBY DUBBY</h1>
                  <p style="color: #888888; font-size: 11px; letter-spacing: 2px; margin: 5px 0 0 0; text-transform: uppercase;">Next Generation Lifestyle Marketplace</p>
                </div>
                
                <div style="padding: 0 10px; line-height: 1.6; font-size: 14px; color: #dddddd;">
                  <p style="margin-top: 0; font-weight: bold; color: #ffffff; font-size: 16px;">Welcome to Yubby Dubby,</p>
                  
                  <p style="color: #aaaaaa; margin-bottom: 25px;">Use the verification code below to authorize your email address and finalize registration.</p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 10px; font-weight: bold; letter-spacing: 2px; color: #888888; display: block; margin-bottom: 8px; text-transform: uppercase;">Verification Code</span>
                    <div style="font-size: 38px; font-weight: 900; background-color: #0d0d0d; border: 1px solid #B1F310; color: #B1F310; padding: 15px 30px; display: inline-block; border-radius: 12px; letter-spacing: 6px; box-shadow: 0 0 20px rgba(177, 243, 16, 0.1);">
                      ${generatedEmailOtp}
                    </div>
                    <span style="font-size: 11px; color: #666666; display: block; margin-top: 8px;">Expires in 5 minutes</span>
                  </div>

                  <hr style="border: 0; border-top: 1px solid #1a1a1a; margin: 30px 0;" />

                  <p style="font-weight: bold; color: #ffffff; margin-bottom: 15px;">Why create a Yubby Dubby account?</p>
                  <ul style="list-style-type: none; padding-left: 0; margin-bottom: 30px;">
                    <li style="margin-bottom: 8px; display: flex; align-items: flex-start;"><span style="color: #B1F310; margin-right: 8px; font-weight: bold;">✓</span> Faster checkout on future orders</li>
                    <li style="margin-bottom: 8px; display: flex; align-items: flex-start;"><span style="color: #B1F310; margin-right: 8px; font-weight: bold;">✓</span> Save your favorite products and wishlists</li>
                    <li style="margin-bottom: 8px; display: flex; align-items: flex-start;"><span style="color: #B1F310; margin-right: 8px; font-weight: bold;">✓</span> Track orders in real time</li>
                    <li style="margin-bottom: 8px; display: flex; align-items: flex-start;"><span style="color: #B1F310; margin-right: 8px; font-weight: bold;">✓</span> Access exclusive member-only offers</li>
                    <li style="margin-bottom: 8px; display: flex; align-items: flex-start;"><span style="color: #B1F310; margin-right: 8px; font-weight: bold;">✓</span> Manage addresses and payment preferences</li>
                    <li style="margin-bottom: 8px; display: flex; align-items: flex-start;"><span style="color: #B1F310; margin-right: 8px; font-weight: bold;">✓</span> Get personalized product recommendations</li>
                    <li style="margin-bottom: 8px; display: flex; align-items: flex-start;"><span style="color: #B1F310; margin-right: 8px; font-weight: bold;">✓</span> Receive updates on new arrivals and limited drops</li>
                  </ul>

                  <p style="font-size: 12px; color: #888888; margin-bottom: 15px; background-color: #0b0b0b; border-left: 3px solid #B1F310; padding: 10px 15px; border-radius: 0 8px 8px 0;">
                    For your security, never share this code with anyone. Yubby Dubby will never ask for your verification code via phone, email, or social media.
                  </p>

                  <p style="font-size: 11px; color: #555555; margin-bottom: 30px;">
                    If you did not request this verification, you can safely ignore this email.
                  </p>

                  <div style="border-top: 1px solid #1a1a1a; padding-top: 20px; font-size: 12px; color: #888888;">
                    <p style="margin: 0 0 4px 0; font-weight: bold; color: #ffffff;">Welcome to the club.</p>
                    <p style="margin: 0 0 10px 0;">Team Yubby Dubby</p>
                    <p style="margin: 0 0 4px 0; font-size: 11px; color: #666666;">Next Generation Lifestyle Marketplace</p>
                    <a href="https://www.yubbydubby.com" style="color: #B1F310; text-decoration: none; font-size: 11px; font-weight: bold;">www.yubbydubby.com</a>
                  </div>
                </div>
              </div>
            `,
          });
          console.log(`[OTP] Sent email verification OTP to ${cleanEmail}`);
          emailSent = true;
        } catch (emailError: any) {
          console.error("Nodemailer failed to send email, logged as fallback:", emailError);
          emailErrorDetail = emailError?.message || String(emailError);
        }
      }

      // Generate secure signed OTP token
      const signedOtpToken = signPayload({
        email: cleanEmail,
        emailOtp: generatedEmailOtp,
        expiresAt,
      });

      // Prepare user guidance response message
      let debugNote = "";
      if (!emailSent) {
        debugNote += `[Email Failed: ${emailErrorDetail}] Find your verification code in the root file 'otp-debug.log'`;
      }

      return NextResponse.json({
        success: true,
        message: "Verification OTP generated and dispatched.",
        otpToken: signedOtpToken,
        debugNote: debugNote || undefined
      });
    }

    if (action === "verify") {
      if (!otpToken) {
        return NextResponse.json(
          { error: "Verification session token is missing. Please try requesting a new OTP." },
          { status: 400 }
        );
      }

      const payload = verifyPayload(otpToken);
      if (!payload) {
        return NextResponse.json(
          { error: "Your verification request has expired or is invalid. Please request a new OTP." },
          { status: 400 }
        );
      }

      // Enforce email OTP check
      if (!emailOtp || emailOtp.trim() !== payload.emailOtp) {
        return NextResponse.json({ error: "Email verification code is incorrect." }, { status: 400 });
      }

      // Generate verified token for registration authorization step
      const verifiedToken = signPayload({
        email: payload.email,
        verified: true,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes validity to fill details and submit
      });

      return NextResponse.json({
        success: true,
        message: "Authentication validated. Proceeding to finalize profile checkout.",
        verifiedToken,
      });
    }

    return NextResponse.json({ error: "Unsupported verification action." }, { status: 400 });
  } catch (error: any) {
    console.error("OTP Service Error:", error);
    return NextResponse.json(
      { error: "Verification server error. Please try again." },
      { status: 500 }
    );
  }
}
