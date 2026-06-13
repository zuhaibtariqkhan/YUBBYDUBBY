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

  try {
    const res = await fetch("https://shop.yubbydubby.com/wp-json/wp/v2/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.id || null;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}
