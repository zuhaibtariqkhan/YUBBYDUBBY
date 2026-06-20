import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { getProducts, WooCommerceProduct } from "@/lib/woocommerce";
import Image from "next/image";
import Link from "next/link";

const mockProductsByCategory = {
  mens: [
    { id: "p1", name: "0-GRAVITY HOODIE", price: 120, image: "/prod-hoodie.png", tag: "NEW" },
    { id: "p2", name: "VOID CARGO PANTS", price: 145, image: "/prod-cargo.png", tag: "" },
    { id: "p4", name: "STRUCTURAL JACKET", price: 210, image: "/prod-jacket.png", tag: "LIMITED" },
    { id: "p8", name: "CYBERPUNK VEST", price: 180, image: "/prod-jacket.png", tag: "LIMITED" }
  ],
  womens: [
    { id: "p3", name: "NEBULA OVERSIZED TEE", price: 65, image: "/prod-tee.png", tag: "BEST SELLER" },
    { id: "p6", name: "TECH-WEAR SKIRT", price: 95, image: "/prod-cargo.png", tag: "NEW" }
  ],
  kids: [
    { id: "p9", name: "FUTURE YOUTH HOODIE", price: 75, image: "/prod-hoodie.png", tag: "NEW" },
    { id: "p10", name: "NEO-CARGO SHORTS", price: 60, image: "/prod-cargo.png", tag: "" }
  ],
  homeLiving: [
    { id: "p11", name: "MINIMALIST RUG", price: 250, image: "/cat-home.png", tag: "BEST SELLER" },
    { id: "p12", name: "STEEL DESK LAMP", price: 120, image: "/prod-jacket.png", tag: "LIMITED" }
  ],
  accessories: [
    { id: "p5", name: "SYNTHETIC BEANIE", price: 35, image: "/prod-hoodie.png", tag: "" },
    { id: "p7", name: "HEAVY METAL CHAIN", price: 55, image: "/prod-tee.png", tag: "" },
    { id: "p13", name: "CYBERPUNK IPHONE CASE", price: 40, image: "/prod-phone-case.png", tag: "NEW" },
    { id: "p14", name: "CYBERPUNK AIRPODS COVER", price: 30, image: "/prod-airpods-cover.png", tag: "NEW" },
    { id: "p15", name: "STREETWEAR SNAPBACK CAP", price: 45, image: "/prod-cap.png", tag: "POPULAR" },
    { id: "p16", name: "TECHWEAR SUNGLASSES", price: 60, image: "/prod-sunglasses.png", tag: "LIMITED" },
    { id: "p17", name: "AESTHETIC STICKER PACK", price: 15, image: "/prod-stickers.png", tag: "BUDGET" }
  ]
};

export default async function ShopPage() {
    const [mensWC, womensWC, kidsWC, homeLivingWC, accessoriesWC] = await Promise.all([
        getProducts({ category: "mens", limit: 8 }),
        getProducts({ category: "womens", limit: 8 }),
        getProducts({ category: "kids", limit: 8 }),
        getProducts({ category: "home-living", limit: 8 }),
        getProducts({ category: "accessories", limit: 8 }),
    ]);

    const getDisplayProducts = (wcProducts: WooCommerceProduct[], categoryKey: keyof typeof mockProductsByCategory) => {
        if (wcProducts && wcProducts.length > 0) {
            return wcProducts.map(p => ({
                id: p.id.toString(),
                name: p.name,
                price: parseFloat(p.price) || 0,
                image: p.images[0]?.src || "/prod-hoodie.png",
                tag: p.on_sale ? "SALE" : p.tags.some(t => t.slug.includes("new")) ? "NEW" : ""
            }));
        }
        return mockProductsByCategory[categoryKey];
    };

    const sections = [
        { key: "mens", title: "Men's", products: getDisplayProducts(mensWC, "mens") },
        { key: "womens", title: "Women's", products: getDisplayProducts(womensWC, "womens") },
        { key: "kids", title: "Kid's", products: getDisplayProducts(kidsWC, "kids") },
        { key: "home-living", title: "Home & Living", products: getDisplayProducts(homeLivingWC, "homeLiving") },
        { key: "accessories", title: "Accessories", products: getDisplayProducts(accessoriesWC, "accessories") }
    ];

    return (
        <main className="min-h-screen pt-24 pb-12 transition-colors duration-300 bg-brand-black text-brand-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading uppercase font-bold text-center tracking-wider mb-4">
                        Shop All
                    </h1>
                    <p className="text-center text-gray-400 max-w-2xl mx-auto font-sans">
                        Browse our complete collection. Powered by headless structures.
                    </p>
                </header>

                <div className="space-y-16">
                    {sections.map((section) => (
                        <section key={section.key} id={section.key} className="border-t border-white/10 pt-10">
                            <h2 className="text-2xl font-heading uppercase tracking-widest mb-6 border-b border-white/5 pb-2">
                                {section.title}
                            </h2>
                            {section.products.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No products found in this category.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {section.products.map((product) => (
                                        <div key={product.id} className="glass-card p-4 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(177,243,16,0.15)] group relative">
                                            <div className="relative aspect-[3/4] bg-white/5 rounded-[var(--radius-img)] overflow-hidden mb-6 flex items-center justify-center">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                />
                                                {product.tag && (
                                                    <span className="absolute top-4 left-4 bg-brand-green text-brand-black text-xs font-bold px-3 py-1 uppercase tracking-widest">
                                                        {product.tag}
                                                    </span>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <Link 
                                                        href={`/product/${product.id}`}
                                                        className="bg-brand-white text-brand-black font-bold uppercase tracking-widest px-6 py-3 rounded-[var(--radius-btn)] hover:bg-brand-green transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 text-xs text-center"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="px-2">
                                                <Link href={`/product/${product.id}`} className="block">
                                                    <h3 className="font-bold text-lg hover:text-brand-green transition-colors uppercase font-heading truncate">{product.name}</h3>
                                                </Link>
                                                <div className="mt-2 text-brand-green font-bold tracking-widest">
                                                    ${product.price}.00
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
