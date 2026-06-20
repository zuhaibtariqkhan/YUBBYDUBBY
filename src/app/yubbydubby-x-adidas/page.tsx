import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { getProducts } from "@/lib/woocommerce";
import AdidasGrid from "@/components/adidas/AdidasGrid";

const mockAdidasProducts = [
  { id: "a1", name: "YUBBY DUBBY x ADIDAS ULTRA-BOOST CYBER", price: 220, image: "/prod-cargo.png", tag: "COLLAB", category: "Footwear" },
  { id: "a2", name: "ADIDAS ZERO-G HOODIE GREEN", price: 160, image: "/prod-hoodie.png", tag: "NEW", category: "Mens" },
  { id: "a3", name: "ADIDAS VOID TRACK PANTS", price: 140, image: "/prod-cargo.png", tag: "", category: "Mens" },
  { id: "a4", name: "ADIDAS NEBULA COLLAB TEE", price: 80, image: "/prod-tee.png", tag: "LIMITED", category: "Womens" },
];

export default async function AdidasCollabPage() {
    const wcProducts = await getProducts({ tag: "adidas", limit: 12 });

    const displayProducts = wcProducts && wcProducts.length > 0
        ? wcProducts.map(p => {
            const lowerName = p.name.toLowerCase();
            const cat = p.categories.find(c => c.slug !== 'adidas' && c.slug !== 'shop' && c.slug !== 'uncategorized');
            
            let categoryName = cat ? cat.name : "";
            if (!categoryName) {
              if (lowerName.includes("shoe") || lowerName.includes("boost") || lowerName.includes("sneaker")) {
                categoryName = "Footwear";
              } else if (lowerName.includes("women") || lowerName.includes("skirt")) {
                categoryName = "Womens";
              } else if (lowerName.includes("men") || lowerName.includes("pants") || lowerName.includes("hoodie") || lowerName.includes("jacket")) {
                categoryName = "Mens";
              } else {
                categoryName = "Accessories";
              }
            }

            return {
              id: p.id.toString(),
              name: p.name,
              price: parseFloat(p.price) || 0,
              image: p.images[0]?.src || "/prod-cargo.png",
              tag: p.on_sale ? "SALE" : "COLLAB",
              category: categoryName
            };
          })
        : mockAdidasProducts;

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

                <AdidasGrid products={displayProducts} />
            </div>
            <Footer />
        </main>
    );
}
