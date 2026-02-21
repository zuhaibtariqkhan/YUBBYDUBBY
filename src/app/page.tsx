import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import BestSellers from "@/components/home/BestSellers";
import { LimitedDrop, EditorialMessage, TrustStrip, Footer } from "@/components/home/HomeSections";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-black text-white relative">
      <Navbar />
      <HeroSection />
      <CategoryGrid />
      <BestSellers />
      <LimitedDrop />
      <EditorialMessage />
      <TrustStrip />
      <Footer />
    </main>
  );
}
