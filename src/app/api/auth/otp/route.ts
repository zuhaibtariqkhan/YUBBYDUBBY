import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { signPayload, verifyPayload } from "@/lib/otp-token";

const OTP_DEBUG_LOG_PATH = path.join(process.cwd(), "otp-debug.log");

// Helper to log OTP to a local debug file for developer convenience
function logOtpToDebugFile(email: string, phone: string, emailOtp: string, phoneOtp: string) {
  try {
    const logMsg = `[${new Date().toISOString()}] REGISTRATION OTPs FOR:\n` +
      `Email: ${email} -> OTP: ${emailOtp}\n` +
      `Phone: ${phone} -> OTP: ${phoneOtp}\n` +
      `----------------------------------------\n`;
    fs.appendFileSync(OTP_DEBUG_LOG_PATH, logMsg, "utf8");
    console.log(`[OTP DEBUG] OTPs written to ${OTP_DEBUG_LOG_PATH}`);
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
    const { action, email, phone, emailOtp, phoneOtp, otpToken } = body;

    console.log("[OTP API] Request action:", action, "email:", email, "phone:", phone);

    if (action === "send") {
      if (!email && !phone) {
        return NextResponse.json(
          { error: "At least email address or mobile phone number is required." },
          { status: 400 }
        );
      }

      const cleanEmail = email ? email.toLowerCase().trim() : null;
      const cleanPhone = phone ? phone.trim() : null;

      let generatedEmailOtp = "";
      let generatedPhoneOtp = "";

      if (cleanEmail) {
        generatedEmailOtp = Math.floor(100000 + Math.random() * 900000).toString();
      }
      if (cleanPhone) {
        generatedPhoneOtp = Math.floor(100000 + Math.random() * 900000).toString();
      }

      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

      // Log OTPs locally so developer can read them instantly
      logOtpToDebugFile(cleanEmail || "N/A", cleanPhone || "N/A", generatedEmailOtp || "N/A", generatedPhoneOtp || "N/A");

      // Send Email OTP using SMTP if configured
      let emailSent = false;
      let emailErrorDetail = "";
      if (cleanEmail && generatedEmailOtp) {
        const transporter = getTransporter();
        if (!transporter) {
          emailErrorDetail = `SMTP configuration missing (SMTP_HOST, SMTP_USER or SMTP_PASS is undefined). Available env keys: ${Object.keys(process.env).filter(k => k.toLowerCase().includes("smtp")).join(", ") || "none"}`;
        } else {
          try {
            await transporter.sendMail({
              from: `"Yubby Dubby Security" <${process.env.SMTP_USER}>`,
              to: cleanEmail,
              subject: "YUBBY DUBBY - Complete Your Profile Registration",
              text: `Use this 6-digit OTP code to verify your email: ${generatedEmailOtp}\nIt will expire in 5 minutes.`,
              html: `
                <div style="background-color: #000; color: #fff; padding: 30px; font-family: sans-serif; text-align: center; border-radius: 12px;">
                  <h1 style="color: #B1F310; letter-spacing: 2px;">SECURE ACCESS PORTAL</h1>
                  <p style="font-size: 14px; color: #ccc;">Use the verification code below to authorize your email address and finalize registration.</p>
                  <div style="font-size: 36px; font-weight: bold; background-color: #111; border: 1px solid #B1F310; color: #B1F310; padding: 15px; margin: 25px auto; width: 200px; border-radius: 8px; letter-spacing: 4px;">
                    ${generatedEmailOtp}
                  </div>
                  <p style="font-size: 11px; color: #666;">This security credentials validation request will expire in 5 minutes.</p>
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
      }

      // Send SMS OTP using Msg91 if configured
      let smsSent = false;
      let smsErrorDetail = "";
      if (cleanPhone && generatedPhoneOtp) {
        const authKey = process.env.MSG91_AUTH_KEY;
        const templateId = process.env.MSG91_TEMPLATE_ID || process.env.MSG91_TEMP_ID;

        if (!authKey || !templateId) {
          smsErrorDetail = `Msg91 configuration missing (MSG91_AUTH_KEY or MSG91_TEMPLATE_ID is undefined). Available env keys: ${Object.keys(process.env).filter(k => k.toLowerCase().includes("msg91")).join(", ") || "none"}`;
        } else {
          try {
            const cleanDigits = cleanPhone.replace(/[^0-9]/g, "");
            const url = `https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${cleanDigits}&authkey=${authKey}&otp=${generatedPhoneOtp}`;
            const response = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" }
            });
            const data = await response.json();
            console.log("[Msg91] Sent OTP response:", data);
            if (data.type === "success") {
              smsSent = true;
            } else {
              smsErrorDetail = `Msg91 API error: ${data.message || JSON.stringify(data)}`;
            }
          } catch (smsError: any) {
            console.error("[Msg91] Error sending OTP SMS:", smsError);
            smsErrorDetail = smsError?.message || String(smsError);
          }
        }
      }

      // Generate secure signed OTP token
      const signedOtpToken = signPayload({
        email: cleanEmail,
        phone: cleanPhone,
        emailOtp: generatedEmailOtp || undefined,
        phoneOtp: generatedPhoneOtp || undefined,
        expiresAt,
      });

      // Prepare user guidance response message
      let debugNote = "";
      if (cleanEmail && !emailSent) {
        debugNote += `[Email Failed: ${emailErrorDetail}] `;
      }
      if (cleanPhone && !smsSent) {
        debugNote += `[SMS Failed: ${smsErrorDetail}] `;
      }
      if (debugNote) {
        debugNote += "Find your verification code in the root file 'otp-debug.log'";
      }

      return NextResponse.json({
        success: true,
        message: "Verification OTPs generated and dispatched.",
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

      // Enforce email OTP check only if email OTP was sent
      if (payload.emailOtp) {
        if (!emailOtp || emailOtp.trim() !== payload.emailOtp) {
          return NextResponse.json({ error: "Email verification code is incorrect." }, { status: 400 });
        }
      }

      // Enforce phone OTP check only if phone OTP was sent
      if (payload.phoneOtp) {
        if (!phoneOtp || phoneOtp.trim() !== payload.phoneOtp) {
          return NextResponse.json({ error: "Mobile verification code is incorrect." }, { status: 400 });
        }
      }

      // Generate verified token for registration authorization step
      const verifiedToken = signPayload({
        email: payload.email,
        phone: payload.phone,
        verified: true,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes validity to fill the password and submit
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
