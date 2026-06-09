import type { Metadata } from "next";
import { Oswald, Montserrat } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YUBBY DUBBY | Futuristic E-Commerce",
  description: "Next Generation Streetwear",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${montserrat.variable} antialiased bg-black text-white font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
