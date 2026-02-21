import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import Marquee from "@/components/ui/Marquee";
import CategoryGrid from "@/components/home/CategoryGrid";
import BestSellers from "@/components/home/BestSellers";
import ReviewsCarousel from "@/components/home/ReviewsCarousel";
import { LimitedDrop, EditorialMessage, TrustStrip, Footer } from "@/components/home/HomeSections";
import SocialGrid from "@/components/home/SocialGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-black text-white relative">
      <Navbar />
      <HeroSection />
      <Marquee />
      <CategoryGrid />
      <BestSellers />
      <LimitedDrop />
      <EditorialMessage />
      <ReviewsCarousel />
      <Marquee />
      <TrustStrip />
      <SocialGrid />
      <Footer />
    </main>
  );
}
