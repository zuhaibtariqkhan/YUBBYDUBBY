import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email/username and password are required." },
        { status: 400 }
      );
    }

    // Call CoCart JWT Authentication token endpoint on WordPress
    const response = await fetch("https://shop.yubbydubby.com/wp-json/cocart/jwt/v1/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        username: email, // WordPress accepts email or username in the username field
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Invalid credentials. Please try again." },
        { status: response.status }
      );
    }

    // Return the token and user metadata to the browser
    return NextResponse.json({
      token: data.token,
      email: data.user_email,
      displayName: data.user_display_name,
      nicename: data.user_nicename,
    });
  } catch (error: any) {
    console.error("Auth Login Error:", error);
    return NextResponse.json(
      { error: "Authentication service unavailable. Please try again later." },
      { status: 500 }
    );
  }
}
