import crypto from "crypto";

const getSecret = (): string => {
  return process.env.COCART_JWT_AUTH_SECRET_KEY || "";
};

function base64UrlToBase64(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return base64;
}

/**
 * Helper to authenticate a user via the JWT token sent in the Authorization header.
 * Verifies cryptographic HMAC-SHA256 signature, expiration, and issuer.
 * Returns the WordPress User ID on success, or null on failure.
 */
export async function getAuthenticatedUserId(req: Request): Promise<number | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7).trim();
  if (!token || token === "undefined") {
    return null;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("JWT Verification failed: invalid token structure (expected 3 parts)");
      return null;
    }

    const [headerB64, payloadB64, signatureB64] = parts;
    const secret = getSecret();

    // Verify HMAC-SHA256 cryptographic signature if secret key is present
    if (secret) {
      const expectedSignatureB64 = crypto
        .createHmac("sha256", secret)
        .update(`${headerB64}.${payloadB64}`)
        .digest("base64");

      const sigBuf = Buffer.from(base64UrlToBase64(signatureB64), "base64");
      const expBuf = Buffer.from(expectedSignatureB64, "base64");

      if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        console.warn("JWT Verification failed: cryptographic signature mismatch");
        return null;
      }
    } else if (process.env.NODE_ENV === "production") {
      console.error("[SECURITY] COCART_JWT_AUTH_SECRET_KEY is not configured in production");
      return null;
    }

    // Decode and parse payload safely
    const payloadJson = Buffer.from(base64UrlToBase64(payloadB64), "base64").toString("utf8");
    const decoded = JSON.parse(payloadJson);

    // Verify issuer matches WooCommerce store URL
    const expectedIss = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || "https://shop.yubbydubby.com";
    const iss = decoded.iss || "";
    if (iss && !iss.includes("yubbydubby.com") && iss !== expectedIss) {
      console.warn("JWT Verification failed: issuer mismatch", iss);
      return null;
    }

    // Verify token expiration
    const exp = decoded.exp || 0;
    const now = Math.floor(Date.now() / 1000);
    if (exp && now > exp) {
      console.warn("JWT Verification failed: token expired");
      return null;
    }

    const userId = decoded.data?.user?.id || decoded.user_id || decoded.id || null;
    return userId ? Number(userId) : null;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}
