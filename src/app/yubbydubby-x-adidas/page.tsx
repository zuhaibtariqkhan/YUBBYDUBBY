import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { getProducts } from "@/lib/woocommerce";
import Image from "next/image";
import Link from "next/link";

const mockAdidasProducts = [
  { id: "a1", name: "YUBBY DUBBY x ADIDAS ULTRA-BOOST CYBER", price: 220, image: "/prod-cargo.png", tag: "COLLAB" },
  { id: "a2", name: "ADIDAS ZERO-G HOODIE GREEN", price: 160, image: "/prod-hoodie.png", tag: "NEW" },
  { id: "a3", name: "ADIDAS VOID TRACK PANTS", price: 140, image: "/prod-cargo.png", tag: "" },
  { id: "a4", name: "ADIDAS NEBULA COLLAB TEE", price: 80, image: "/prod-tee.png", tag: "LIMITED" },
];

export default async function AdidasCollabPage() {
    const wcProducts = await getProducts({ tag: "adidas", limit: 12 });

    const displayProducts = wcProducts && wcProducts.length > 0
        ? wcProducts.map(p => ({
            id: p.id.toString(),
            name: p.name,
            price: parseFloat(p.price) || 0,
            image: p.images[0]?.src || "/prod-cargo.png",
            tag: p.on_sale ? "SALE" : "COLLAB"
          }))
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

                <div className="space-y-16">
                    <section>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {displayProducts.map((product) => (
                                <div key={product.id} className="glass-card p-4 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(177,243,16,0.15)] group relative">
                                    <div className="relative aspect-[3/4] bg-white/5 rounded-[var(--radius-img)] overflow-hidden mb-6 flex items-center justify-center">
                                        <Link href={`/product/${product.id}`} className="absolute inset-0 w-full h-full block z-0">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                        </Link>
                                        {product.tag && (
                                            <span className="absolute top-4 left-4 bg-brand-green text-brand-black text-xs font-bold px-3 py-1 uppercase tracking-widest z-10 pointer-events-none">
                                                {product.tag}
                                            </span>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 pointer-events-none">
                                            <Link 
                                                href={`/product/${product.id}`}
                                                className="bg-brand-white text-brand-black font-bold uppercase tracking-widest px-6 py-3 rounded-[var(--radius-btn)] hover:bg-brand-green transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 text-xs text-center pointer-events-auto"
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
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
