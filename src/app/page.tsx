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

export default async function Home() {
  // Fetch products from 'Featured Products' backend category
  let featuredProducts = await getProducts({ category: "featured-products", limit: 12 });
  if (!featuredProducts || featuredProducts.length === 0) {
    featuredProducts = await getProducts({ category: "featured", limit: 12 });
  }
  if (!featuredProducts || featuredProducts.length === 0) {
    featuredProducts = await getProducts({ featured: true, limit: 12 });
  }
  if (!featuredProducts || featuredProducts.length === 0) {
    featuredProducts = await getProducts({ limit: 12 });
  }

  const [bestSellers, newArrivals] = await Promise.all([
    getProducts({ limit: 16 }),
    getProducts({ limit: 4 }),
  ]);

  return (
    <main className="min-h-screen bg-brand-black text-white relative">
      <Navbar />
      <HeroSection />
      <Marquee />
      <CategoryGrid />
      <BestSellers initialProducts={bestSellers} />
      <NewArrivals initialProducts={newArrivals} />
      <FeaturedProducts initialProducts={featuredProducts} />
      <EditorialMessage />
      <ReviewsCarousel />
      <TrustStrip />
      <SocialGrid />
      <Footer />
    </main>
  );
}
