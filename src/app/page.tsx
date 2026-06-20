import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import Marquee from "@/components/ui/Marquee";
import CategoryGrid from "@/components/home/CategoryGrid";
import BestSellers from "@/components/home/BestSellers";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ReviewsCarousel from "@/components/home/ReviewsCarousel";
import { LimitedDrop, EditorialMessage, TrustStrip, Footer } from "@/components/home/HomeSections";
import SocialGrid from "@/components/home/SocialGrid";
import { getProducts } from "@/lib/woocommerce";

export default async function Home() {
  const [products, featuredProducts] = await Promise.all([
    getProducts({ limit: 16 }), // Fetches more products for Best Sellers
    getProducts({ featured: true, limit: 4 })
  ]);

  return (
    <main className="min-h-screen bg-brand-black text-white relative">
      <Navbar />
      <HeroSection />
      <Marquee />
      <CategoryGrid />
      <BestSellers initialProducts={products} />
      <FeaturedProducts initialProducts={featuredProducts} />
      <LimitedDrop />
      <EditorialMessage />
      <ReviewsCarousel />
      <TrustStrip />
      <SocialGrid />
      <Footer />
    </main>
  );
}
