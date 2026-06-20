import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { getProductCategories } from "@/lib/woocommerce";
import ShopBrowser from "@/components/shop/ShopBrowser";

export const revalidate = 0; // Bypass Next.js route caching to fetch real-time WordPress category updates

const fallbackMainCategories = [
  { id: 11, name: "Mens", slug: "mens", parent: 0, description: "Men's Streetwear Collection", count: 12 },
  { id: 22, name: "Womens", slug: "womens", parent: 0, description: "Women's Streetwear Collection", count: 8 },
  { id: 33, name: "Kids", slug: "kids", parent: 0, description: "Streetwear for Kids", count: 6 },
  { id: 44, name: "Home & Living", slug: "home-living", parent: 0, description: "Yubby Dubby Lifestyle & Home Decor", count: 10 }
];

export default async function ShopPage() {
    let mainCategories: any[] = [];
    
    try {
        mainCategories = await getProductCategories({ parent: 0 });
    } catch (error) {
        console.error("Failed to fetch top level product categories from WooCommerce:", error);
    }

    const categoriesData = mainCategories && mainCategories.length > 0
        ? mainCategories.filter(c => !['uncategorized', 'shop', 'create-your-own', 'adidas', 'collab'].includes(c.slug.toLowerCase()))
        : fallbackMainCategories;

    return (
        <main className="min-h-screen pt-24 pb-12 transition-colors duration-300 bg-brand-black text-brand-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading uppercase font-bold text-center tracking-wider mb-4">
                        Shop
                    </h1>
                    <p className="text-center text-gray-400 max-w-2xl mx-auto font-sans text-xs uppercase tracking-widest font-semibold">
                        Exclusive collections powered dynamically
                    </p>
                </header>

                <ShopBrowser initialMainCategories={categoriesData} />
            </div>
            <Footer />
        </main>
    );
}
