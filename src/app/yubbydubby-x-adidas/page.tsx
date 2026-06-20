import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { fetchWooCommerce, getProductCategories, isWooCommerceConfigured } from "@/lib/woocommerce";
import AdidasBrowser from "@/components/adidas/AdidasBrowser";

export const revalidate = 0; // Force dynamic fetching for fresh category updates

const fallbackMainCategories = [
  { id: 101, name: "Mens", slug: "adidas-mens", parent: 100, description: "Adidas Men's Streetwear Collection", count: 5 },
  { id: 102, name: "Womens", slug: "adidas-womens", parent: 100, description: "Adidas Women's Streetwear Collection", count: 5 },
  { id: 103, name: "Footwear", slug: "adidas-footwear", parent: 100, description: "Adidas Premium Footwear Collection", count: 4 },
  { id: 104, name: "Accessories", slug: "adidas-accessories", parent: 100, description: "Adidas Collab Accessories Collection", count: 4 }
];

export default async function AdidasCollabPage() {
    let adidasId = 100;
    let mainCategories: any[] = [];

    if (isWooCommerceConfigured()) {
        try {
            const categories = await fetchWooCommerce<any[]>(`products/categories?slug=adidas`);
            if (categories && categories.length > 0) {
                adidasId = categories[0].id;
            }
            mainCategories = await getProductCategories({ parent: adidasId });
        } catch (error) {
            console.error("Failed to load Adidas categories from WooCommerce, using mock fallbacks:", error);
        }
    }

    const categoriesData = mainCategories && mainCategories.length > 0
        ? mainCategories
        : fallbackMainCategories;

    return (
        <main className="min-h-screen pt-24 pb-12 transition-colors duration-300 bg-brand-black text-brand-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-16 mt-8">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading uppercase font-black text-center tracking-tighter mb-4">
                        <span className="text-brand-green">YUBBY DUBBY</span> X ADIDAS
                    </h1>
                    <p className="text-center text-gray-400 max-w-2xl mx-auto text-sm md:text-base uppercase tracking-widest font-semibold font-sans">
                        Exclusive Collaboration Collection
                    </p>
                </header>

                <AdidasBrowser initialMainCategories={categoriesData} />
            </div>
            <Footer />
        </main>
    );
}
