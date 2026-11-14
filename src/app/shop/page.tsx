import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { getProductCategories } from "@/lib/woocommerce";
import ShopBrowser from "@/components/shop/ShopBrowser";

export const revalidate = 0; // Bypass Next.js route caching to fetch real-time WordPress category updates

const fallbackMainCategories = [
  { id: 11, name: "Mens", slug: "mens", parent: 0, description: "Men's Streetwear Collection", count: 12 },
  { id: 22, name: "Womens", slug: "womens", parent: 0, description: "Women's Streetwear Collection", count: 8 },
  { id: 33, name: "Kids", slug: "kids", parent: 0, description: "Streetwear for Kids", count: 6 },
  { id: 44, name: "Home & Living", slug: "home-living", parent: 0, description: "Yubby Dubby Lifestyle & Home Decor", count: 10 },
  { id: 55, name: "Accessories", slug: "accessories", parent: 0, description: "Tech cases, caps, bags, and lifestyle items", count: 7 }
];

export default async function ShopPage() {
    let mainCategories: any[] = [];
    
    try {
        mainCategories = await getProductCategories({ parent: 0 });
    } catch (error) {
        console.error("Failed to fetch top level product categories from WooCommerce:", error);
    }

    const categoriesData = mainCategories && mainCategories.length > 0
        ? mainCategories.filter(c => {
            const slug = c.slug.toLowerCase();
            const name = c.name ? c.name.toLowerCase() : '';
            return !['uncategorized', 'shop'].includes(slug) && 
                   !slug.includes('adidas') && 
                   !slug.includes('create') && 
                   !slug.includes('collab') &&
                   !slug.includes('featured') &&
                   !name.includes('featured');
          })
        : fallbackMainCategories;

    // Define the custom sort order for standard main categories
    const categoriesOrder = ["mens", "womens", "kids", "home-living", "accessories"];

    // Filter and sort the standard categories
    const sortedCategories = categoriesData
        .filter(c => categoriesOrder.includes(c.slug.toLowerCase()))
        .sort((a, b) => {
            const indexA = categoriesOrder.indexOf(a.slug.toLowerCase());
            const indexB = categoriesOrder.indexOf(b.slug.toLowerCase());
            return indexA - indexB;
        });

    // Return the sorted standard categories
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

                <ShopBrowser initialMainCategories={sortedCategories} />
            </div>
            <Footer />
        </main>
    );
}
