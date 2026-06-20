import React from "react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { getProducts } from "@/lib/woocommerce";
import CreateYourOwnInteractive from "./CreateYourOwnInteractive";

export const revalidate = 0; // Bypass Next.js fetch caching for custom designs page

export default async function CreateYourOwnPage() {
  let initialProducts: any[] = [];
  
  try {
    // Fetch live blank products from WooCommerce (under 'create-your-own' category slug)
    const wcProducts = await getProducts({ category: "create-your-own", limit: 20 });
    
    if (wcProducts && wcProducts.length > 0) {
      initialProducts = wcProducts.map(p => ({
        id: p.id.toString(),
        name: p.name,
        price: 1000, // Enforce flat 1000 Rupees
        image: p.images[0]?.src || "/prod-tee.png",
        type: p.name.toLowerCase().includes("hoodie") ? "hoodie" : "tshirt"
      }));
    }
  } catch (error) {
    console.error("Failed to load blank products from WooCommerce, using local fallbacks:", error);
  }

  return (
    <div className="relative min-h-screen w-full bg-[#030303] text-white flex flex-col justify-between overflow-x-hidden font-sans z-10 selection:bg-brand-green selection:text-brand-black">
      <Navbar />

      {/* Futuristic Blur Glow Background */}
      <div className="absolute top-[15%] left-[-10%] w-[500px] h-[500px] bg-radial from-[#B1F310]/5 via-transparent to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-radial from-[#B1F310]/4 via-transparent to-transparent blur-[140px] pointer-events-none z-0" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 z-10 relative flex-1">
        {/* Header Title */}
        <header className="mb-10 text-center space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-green font-bold block">
            Custom Design Studio
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black uppercase tracking-widest text-white">
            DESIGN YOUR OWN
          </h1>
          <p className="text-gray-400 text-xs font-sans max-w-xl mx-auto">
            Design premium high-fidelity custom streetwear. Select your base blank products fetched live from your inventory, and upload your full HD PNG graphic.
          </p>
        </header>

        {/* Interactive Customizer Interface */}
        <CreateYourOwnInteractive initialProducts={initialProducts} />

      </main>
      <Footer />
    </div>
  );
}
