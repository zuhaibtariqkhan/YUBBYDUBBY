import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { getProducts, WooCommerceProduct } from "@/lib/woocommerce";
import ShopSection from "@/components/shop/ShopSection";

const mockProductsByCategory = {
  mens: [
    { id: "p1", name: "0-GRAVITY HOODIE", price: 120, image: "/prod-hoodie.png", tag: "NEW", subcategory: "Hoodies" },
    { id: "p2", name: "VOID CARGO PANTS", price: 145, image: "/prod-cargo.png", tag: "", subcategory: "Bottoms" },
    { id: "p4", name: "STRUCTURAL JACKET", price: 210, image: "/prod-jacket.png", tag: "LIMITED", subcategory: "Jackets" },
    { id: "p8", name: "CYBERPUNK VEST", price: 180, image: "/prod-jacket.png", tag: "LIMITED", subcategory: "Vests" }
  ],
  womens: [
    { id: "p3", name: "NEBULA OVERSIZED TEE", price: 65, image: "/prod-tee.png", tag: "BEST SELLER", subcategory: "Tees" },
    { id: "p6", name: "TECH-WEAR SKIRT", price: 95, image: "/prod-cargo.png", tag: "NEW", subcategory: "Skirts" }
  ],
  kids: [
    { id: "p9", name: "FUTURE YOUTH HOODIE", price: 75, image: "/prod-hoodie.png", tag: "NEW", subcategory: "Hoodies" },
    { id: "p10", name: "NEO-CARGO SHORTS", price: 60, image: "/prod-cargo.png", tag: "", subcategory: "Shorts" }
  ],
  homeLiving: [
    { id: "p11", name: "MINIMALIST RUG", price: 250, image: "/cat-home.png", tag: "BEST SELLER", subcategory: "Rugs" },
    { id: "p12", name: "STEEL DESK LAMP", price: 120, image: "/prod-jacket.png", tag: "LIMITED", subcategory: "Lamps" }
  ],
  accessories: [
    { id: "p5", name: "SYNTHETIC BEANIE", price: 35, image: "/prod-hoodie.png", tag: "", subcategory: "Headwear" },
    { id: "p7", name: "HEAVY METAL CHAIN", price: 55, image: "/prod-tee.png", tag: "", subcategory: "Jewelry" },
    { id: "p13", name: "CYBERPUNK IPHONE CASE", price: 40, image: "/prod-phone-case.png", tag: "NEW", subcategory: "Tech Cases" },
    { id: "p14", name: "CYBERPUNK AIRPODS COVER", price: 30, image: "/prod-airpods-cover.png", tag: "NEW", subcategory: "Tech Cases" },
    { id: "p15", name: "STREETWEAR SNAPBACK CAP", price: 45, image: "/prod-cap.png", tag: "POPULAR", subcategory: "Headwear" },
    { id: "p16", name: "TECHWEAR SUNGLASSES", price: 60, image: "/prod-sunglasses.png", tag: "LIMITED", subcategory: "Eyewear" },
    { id: "p17", name: "AESTHETIC STICKER PACK", price: 15, image: "/prod-stickers.png", tag: "BUDGET", subcategory: "Stickers" }
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
            return wcProducts.map(p => {
                let image = p.images[0]?.src || "/prod-hoodie.png";
                const lowerName = p.name.toLowerCase();
                if (lowerName.includes("iphone") || lowerName.includes("phone") || lowerName.includes("case")) {
                    image = "/prod-phone-case.png";
                } else if (lowerName.includes("airpod")) {
                    image = "/prod-airpods-cover.png";
                } else if (lowerName.includes("cap") || lowerName.includes("hat")) {
                    image = "/prod-cap.png";
                } else if (lowerName.includes("sunglass") || lowerName.includes("glasses")) {
                    image = "/prod-sunglasses.png";
                } else if (lowerName.includes("sticker")) {
                    image = "/prod-stickers.png";
                }

                // Map standard category slugs
                const categorySlugMapping: Record<string, string> = {
                  mens: "mens",
                  womens: "womens",
                  kids: "kids",
                  homeLiving: "home-living",
                  accessories: "accessories"
                };
                const parentSlug = categorySlugMapping[categoryKey];
                
                // Find a subcategory slug that isn't the parent or 'shop'
                const subCat = p.categories.find(
                  c => c.slug !== parentSlug && c.slug !== 'shop' && c.slug !== 'uncategorized'
                );

                let subcategoryName = subCat ? subCat.name : "";
                
                if (!subcategoryName) {
                  // Fallback classification based on product name
                  if (lowerName.includes("hoodie")) subcategoryName = "Hoodies";
                  else if (lowerName.includes("cargo") || lowerName.includes("pants") || lowerName.includes("skirt") || lowerName.includes("shorts")) subcategoryName = "Bottoms";
                  else if (lowerName.includes("jacket") || lowerName.includes("vest") || lowerName.includes("overcoat")) subcategoryName = "Outerwear";
                  else if (lowerName.includes("tee") || lowerName.includes("shirt")) subcategoryName = "Tops";
                  else if (lowerName.includes("case") || lowerName.includes("cover")) subcategoryName = "Tech Cases";
                  else if (lowerName.includes("cap") || lowerName.includes("beanie") || lowerName.includes("hat")) subcategoryName = "Headwear";
                  else if (lowerName.includes("sunglass")) subcategoryName = "Eyewear";
                  else if (lowerName.includes("chain") || lowerName.includes("jewelry")) subcategoryName = "Jewelry";
                  else if (lowerName.includes("sticker")) subcategoryName = "Stickers";
                  else if (lowerName.includes("rug")) subcategoryName = "Rugs";
                  else if (lowerName.includes("lamp") || lowerName.includes("light")) subcategoryName = "Lamps";
                  else subcategoryName = "Other";
                }

                return {
                    id: p.id.toString(),
                    name: p.name,
                    price: parseFloat(p.price) || 0,
                    image,
                    tag: p.on_sale ? "SALE" : p.tags.some(t => t.slug.includes("new")) ? "NEW" : "",
                    subcategory: subcategoryName
                };
            });
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
                        <ShopSection 
                            key={section.key}
                            id={section.key}
                            title={section.title}
                            products={section.products as any}
                        />
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}
