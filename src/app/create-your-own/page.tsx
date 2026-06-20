import React from "react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import CreateYourOwnInteractive from "./CreateYourOwnInteractive";

export const revalidate = 0; // Bypass Next.js fetch caching for custom designs page

export default function CreateYourOwnPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#030303] text-white flex flex-col justify-between overflow-x-hidden font-sans z-10 selection:bg-brand-green selection:text-brand-black">
      <Navbar />

      {/* Futuristic Blur Glow Background */}
      <div className="absolute top-[15%] left-[-10%] w-[500px] h-[500px] bg-radial from-[#B1F310]/5 via-transparent to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-radial from-[#B1F310]/4 via-transparent to-transparent blur-[140px] pointer-events-none z-0" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 z-10 relative flex-1">
        {/* Header Title */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black uppercase tracking-widest text-white">
            CUSTOM DESIGN STUDIO
          </h1>
        </header>

        {/* Interactive Customizer Interface */}
        <CreateYourOwnInteractive />

      </main>
      <Footer />
    </div>
  );
}
