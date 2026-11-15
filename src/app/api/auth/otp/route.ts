import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { signPayload, verifyPayload, hashOtp, verifyOtpHash } from "@/lib/otp-token";
import { isValidIndianPhone, cleanIndianPhone } from "@/lib/india-locations";

const OTP_DEBUG_LOG_PATH = path.join(process.cwd(), "otp-debug.log");

// In-memory rate limiting map: identifier -> timestamp of last dispatch
const recentRequestsMap = new Map<string, number>();
const OTP_COOLDOWN_MS = 30 * 1000; // 30 seconds server cooldown

// Helper to log OTP to a local debug file for development testing only
function logOtpToDebugFile(identifier: string, emailOtp: string) {
  try {
    const logMsg = `[${new Date().toISOString()}] REGISTRATION OTP FOR:\n` +
      `Target: ${identifier} -> OTP: ${emailOtp}\n` +
      `----------------------------------------\n`;
    fs.appendFileSync(OTP_DEBUG_LOG_PATH, logMsg, "utf8");
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
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, email, phone, emailOtp, otpToken, purpose } = body;

    console.log("[OTP API] Request action:", action, "email:", email, "purpose:", purpose);

    if (action === "send") {
      if (!email) {
        return NextResponse.json(
          { error: "Email address is required to dispatch verification code." },
          { status: 400 }
        );
      }

      const cleanEmail = String(email).toLowerCase().trim();

      // Strict email format check
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return NextResponse.json(
          { error: "Please provide a valid email address." },
          { status: 400 }
        );
      }

      // Optional phone validation if provided
      if (phone) {
        const cleanedPhone = cleanIndianPhone(String(phone));
        if (!isValidIndianPhone(cleanedPhone)) {
          return NextResponse.json(
            { error: "Please enter a valid 10-digit Indian mobile number." },
            { status: 400 }
          );
        }
      }

      // Server-side cooldown / debounce check (prevent spamming)
      const lastRequestTime = recentRequestsMap.get(cleanEmail) || 0;
      const timeSinceLastRequest = Date.now() - lastRequestTime;
      if (timeSinceLastRequest < OTP_COOLDOWN_MS) {
        const waitSeconds = Math.ceil((OTP_COOLDOWN_MS - timeSinceLastRequest) / 1000);
        return NextResponse.json(
          { error: `Please wait ${waitSeconds}s before requesting a new code.` },
          { status: 429 }
        );
      }

      const generatedEmailOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

      // Record dispatch time for rate limiting
      recentRequestsMap.set(cleanEmail, Date.now());

      // Log OTP locally for developer test access
      logOtpToDebugFile(cleanEmail, generatedEmailOtp);

      // Attempt to send email via SMTP
      let emailSent = false;
      let emailErrorDetail = "";
      const transporter = getTransporter();

      const isReset = purpose === "reset";
      const emailSubject = isReset
        ? "Your YUBBY DUBBY Password Reset Code"
        : "Your YUBBY DUBBY Verification Code";

      const emailText = isReset
        ? `Hello,\n\nUse this 6-digit OTP code to verify your email and authorize your account password reset: ${generatedEmailOtp}\nIt will expire in 5 minutes.\n\nFor your security, never share this code with anyone.\n\nStay secure,\nTeam Yubby Dubby\nwww.yubbydubby.com`
        : `Welcome to Yubby Dubby,\n\nUse this 6-digit OTP code to verify your email: ${generatedEmailOtp}\nIt will expire in 5 minutes.\n\nWelcome to the club.\nTeam Yubby Dubby\nwww.yubbydubby.com`;

      const emailHtml = `
        <div style="background-color: #030303; color: #ffffff; padding: 40px 20px; font-family: sans-serif; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #1a1a1a;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #B1F310; font-size: 28px; font-weight: 900; letter-spacing: 4px; margin: 0; text-transform: uppercase;">YUBBY DUBBY</h1>
            <p style="color: #888888; font-size: 11px; letter-spacing: 2px; margin: 5px 0 0 0; text-transform: uppercase;">Next Generation Lifestyle Marketplace</p>
          </div>
          
          <div style="padding: 0 10px; line-height: 1.6; font-size: 14px; color: #dddddd;">
            <p style="margin-top: 0; font-weight: bold; color: #ffffff; font-size: 16px;">
              ${isReset ? "Passcode Recovery Request" : "Welcome to Yubby Dubby,"}
            </p>
            
            <p style="color: #aaaaaa; margin-bottom: 25px;">
              ${isReset
          ? "We received a request to reset your password. Use the verification code below to authorize your password rotation."
          : "Use the verification code below to authorize your email address and finalize registration."}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 10px; font-weight: bold; letter-spacing: 2px; color: #888888; display: block; margin-bottom: 8px; text-transform: uppercase;">Verification Code</span>
              <div style="font-size: 38px; font-weight: 900; background-color: #0d0d0d; border: 1px solid #B1F310; color: #B1F310; padding: 15px 30px; display: inline-block; border-radius: 12px; letter-spacing: 6px; box-shadow: 0 0 20px rgba(177, 243, 16, 0.1);">
                ${generatedEmailOtp}
              </div>
              <span style="font-size: 11px; color: #666666; display: block; margin-top: 8px;">Expires in 5 minutes</span>
            </div>

            <p style="font-size: 12px; color: #888888; margin-bottom: 15px; background-color: #0b0b0b; border-left: 3px solid #B1F310; padding: 10px 15px; border-radius: 0 8px 8px 0;">
              For your security, never share this code with anyone. Yubby Dubby will never ask for your verification code via phone, email, or social media.
            </p>

            <div style="border-top: 1px solid #1a1a1a; padding-top: 20px; font-size: 12px; color: #888888;">
              <p style="margin: 0 0 4px 0; font-weight: bold; color: #ffffff;">Team Yubby Dubby</p>
              <a href="https://www.yubbydubby.com" style="color: #B1F310; text-decoration: none; font-size: 11px; font-weight: bold;">www.yubbydubby.com</a>
            </div>
          </div>
        </div>
      `;

      if (!transporter) {
        emailErrorDetail = "SMTP service is not configured.";
        console.warn("[OTP] SMTP not configured on server.");
      } else {
        try {
          await transporter.sendMail({
            from: `"Yubby Dubby Security" <${process.env.SMTP_USER}>`,
            to: cleanEmail,
            subject: emailSubject,
            text: emailText,
            html: emailHtml,
          });
          console.log(`[OTP] Sent email verification OTP to ${cleanEmail}`);
          emailSent = true;
        } catch (emailError: any) {
          console.error("Nodemailer failed to send email:", emailError);
          emailErrorDetail = emailError?.message || String(emailError);
        }
      }

      // Generate secure signed OTP token (HMAC-signed hash, never exposed plain text)
      const signedOtpToken = signPayload({
        email: cleanEmail,
        otpHash: hashOtp(cleanEmail, generatedEmailOtp),
        expiresAt,
      });

      // Provide developer testing fallback in non-production environments
      if (!emailSent) {
        if (process.env.NODE_ENV === "production") {
          return NextResponse.json(
            {
              error: `Unable to dispatch verification email at this moment (${emailErrorDetail || "SMTP delivery failure"}). Please verify your address or contact support.`,
            },
            { status: 502 }
          );
        } else {
          // In development mode, return token with informative developer notice
          return NextResponse.json({
            success: true,
            message: "Verification OTP generated.",
            otpToken: signedOtpToken,
            debugNote: `[Local Dev] Email delivery simulated (${emailErrorDetail || "SMTP off"}). OTP: ${generatedEmailOtp} (also saved to otp-debug.log)`,
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: "Verification OTP sent to your email address.",
        otpToken: signedOtpToken,
      });
    }

    if (action === "verify") {
      if (!otpToken) {
        return NextResponse.json(
          { error: "Verification session token is missing. Please request a new OTP." },
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

      const cleanEnteredOtp = String(emailOtp || "").trim();
      if (!cleanEnteredOtp || cleanEnteredOtp.length !== 6) {
        return NextResponse.json(
          { error: "Please enter the complete 6-digit verification code." },
          { status: 400 }
        );
      }

      // Enforce email OTP check against cryptographic hash
      const isOtpValid = payload.otpHash
        ? verifyOtpHash(payload.email, cleanEnteredOtp, payload.otpHash)
        : (payload.emailOtp && cleanEnteredOtp === payload.emailOtp);

      if (!isOtpValid) {
        return NextResponse.json(
          { error: "The verification code you entered is incorrect. Please check and try again." },
          { status: 400 }
        );
      }

      // Generate verified token for registration authorization step
      const verifiedToken = signPayload({
        email: payload.email,
        verified: true,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes validity
      });

      return NextResponse.json({
        success: true,
        message: "Email verified successfully.",
        verifiedToken,
      });
    }

    return NextResponse.json({ error: "Unsupported verification action." }, { status: 400 });
  } catch (error: any) {
    console.error("OTP Service Error:", error);
    return NextResponse.json(
      { error: "Verification server encountered an error. Please try again." },
      { status: 500 }
    );
  }
}
