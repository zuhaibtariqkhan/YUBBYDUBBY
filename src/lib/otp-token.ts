import crypto from "crypto";

const SECRET = process.env.COCART_JWT_AUTH_SECRET_KEY || "yubby_dubby_secure_fallback_secret_654321";

/**
 * Encrypt and sign a payload statelessly.
 */
export function signPayload(payload: any): string {
  try {
    const data = Buffer.from(JSON.stringify(payload)).toString("base64");
    const signature = crypto
      .createHmac("sha256", SECRET)
      .update(data)
      .digest("base64");
    return `${data}.${signature}`;
  } catch (error) {
    console.error("Error signing OTP token payload:", error);
    return "";
  }
}

/**
 * Verify signature and expiration of a stateless token, returning the decrypted payload.
 */
export function verifyPayload(token: string): any | null {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [dataB64, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", SECRET)
      .update(dataB64)
      .digest("base64");

    if (signature !== expectedSignature) {
      console.warn("[OTP Token] Signature verification failed.");
      return null;
    }

    const jsonStr = Buffer.from(dataB64, "base64").toString("utf8");
    const payload = JSON.parse(jsonStr);

    if (Date.now() > payload.expiresAt) {
      console.warn("[OTP Token] Token has expired.");
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Error verifying OTP token payload:", error);
    return null;
  }
}
