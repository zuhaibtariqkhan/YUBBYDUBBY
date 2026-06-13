/**
 * Helper to authenticate a user via the JWT token sent in the Authorization header.
 * Returns the WordPress User ID on success, or null on failure.
 */
export async function getAuthenticatedUserId(req: Request): Promise<number | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  if (!token || token === "undefined") {
    return null;
  }

  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString('utf8'));
    const decoded = JSON.parse(jsonPayload);

    // Verify issuer is the WooCommerce store and token has not expired
    const iss = decoded.iss || "";
    const exp = decoded.exp || 0;
    const now = Math.floor(Date.now() / 1000);

    if (iss !== "https://shop.yubbydubby.com") {
      console.warn("JWT Verification failed: issuer mismatch", iss);
      return null;
    }

    if (exp && now > exp) {
      console.warn("JWT Verification failed: token expired");
      return null;
    }

    const userId = decoded.data?.user?.id || decoded.user_id || null;
    return userId ? Number(userId) : null;
  } catch (error) {
    console.error("Token decoding error:", error);
    return null;
  }
}
