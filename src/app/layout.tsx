import type { Metadata } from "next";
import { Oswald, Montserrat } from "next/font/google";
import CustomCursor from "@/components/ui/CustomCursor";
import SplashScreen from "@/components/ui/SplashScreen";
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
          <SplashScreen />
          <CustomCursor />
          <BackToTop />
          <Grain />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

