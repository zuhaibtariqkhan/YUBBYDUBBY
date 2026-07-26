import type { Metadata } from "next";
import { Oswald, Montserrat } from "next/font/google";
import CustomCursor from "@/components/ui/CustomCursor";
import BackToTop from "@/components/ui/BackToTop";
import Grain from "@/components/ui/Grain";
import { CartProvider } from "@/context/CartContext";
import NextTopLoader from "nextjs-toploader";
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
  title: {
    default: "Elevating The Everyday",
    template: "%s | Yubby Dubby",
  },
  description: "Next Generation Streetwear",
  icons: {
    icon: [
      { url: "/favicon.ico?v=3" },
      { url: "/favicon-16x16.png?v=3", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png?v=3", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png?v=3", sizes: "48x48", type: "image/png" },
      { url: "/android-chrome-192x192.png?v=3", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png?v=3", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=3",
    apple: [
      { url: "/apple-touch-icon.png?v=3", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
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
        <NextTopLoader
          color="#B1F310"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #B1F310, 0 0 5px #B1F310"
        />
        <CartProvider>
          <CustomCursor />
          <BackToTop />
          <Grain />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

