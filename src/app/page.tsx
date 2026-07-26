import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import Marquee from "@/components/ui/Marquee";
import CategoryGrid from "@/components/home/CategoryGrid";
import BestSellers from "@/components/home/BestSellers";
import NewArrivals from "@/components/home/NewArrivals";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ReviewsCarousel from "@/components/home/ReviewsCarousel";
import { EditorialMessage, TrustStrip, Footer } from "@/components/home/HomeSections";
import SocialGrid from "@/components/home/SocialGrid";
import { getProducts } from "@/lib/woocommerce";
import { HomepageProvider } from "@/context/HomepageContext";

export default async function Home() {
  // Fetch up to 100 published WooCommerce products for global deduplication & distribution
  const masterProducts = await getProducts({ limit: 100 });

  return (
    <HomepageProvider initialProducts={masterProducts}>
      <main className="min-h-screen bg-brand-black text-white relative">
        <Navbar />
        <HeroSection />
        <Marquee />
        <CategoryGrid />
        <BestSellers />
        <NewArrivals />
        <FeaturedProducts />
        <EditorialMessage />
        <ReviewsCarousel />
        <TrustStrip />
        <SocialGrid />
        <Footer />
      </main>
    </HomepageProvider>
  );
}
