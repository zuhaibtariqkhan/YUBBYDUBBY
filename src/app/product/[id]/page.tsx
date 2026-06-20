import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { getProductById, getProducts } from "@/lib/woocommerce";
import ProductInteractive from "./ProductInteractive";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

// Mock fallbacks if WooCommerce is empty or not configured
const mockProducts = [
  { id: "p1", name: "0-GRAVITY HOODIE", price: 120, image: "/prod-hoodie.png", tag: "NEW", category: "Mens", description: "Engineered for pure weightlessness. The 0-Gravity Hoodie combines a dense structural weave with hyper-breathable fabrics for ultimate street warmth." },
  { id: "p2", name: "VOID CARGO PANTS", price: 145, image: "/prod-cargo.png", tag: "", category: "Mens", description: "Structured silhouette cargo pants featuring water-resistant synthetic blend construction and multi-pocket configuration." },
  { id: "p3", name: "NEBULA OVERSIZED TEE", price: 65, image: "/prod-tee.png", tag: "BEST SELLER", category: "Womens", description: "Heavyweight drop-shoulder tee. Double-stitched seams and custom washed cotton construct a rugged yet refined drape." },
  { id: "p4", name: "STRUCTURAL JACKET", price: 210, image: "/prod-jacket.png", tag: "LIMITED", category: "Mens", description: "Futuristic panels and reinforced stitching compose the signature Yubby Dubby outer shell structure." },
  { id: "p5", name: "SYNTHETIC BEANIE", price: 35, image: "/prod-hoodie.png", tag: "", category: "Accessories", description: "A tight double-knit acrylic beanie featuring our embroidered core branding logo. Perfect for cold structure protection." },
  { id: "p6", name: "TECH-WEAR SKIRT", price: 95, image: "/prod-cargo.png", tag: "NEW", category: "Womens", description: "Asymmetric micro-grid panel skirt with quick-release nylon buckle belt and micro-pocketing." },
  { id: "p7", name: "HEAVY METAL CHAIN", price: 55, image: "/prod-tee.png", tag: "", category: "Accessories", description: "Industrial grade raw finish hardware. Each link is hand-polished with micro-engravings." },
  { id: "p8", name: "CYBERPUNK VEST", price: 180, image: "/prod-jacket.png", tag: "LIMITED", category: "Mens", description: "Sleeveless tactical shell with modular chest attachment locks and custom branding details." },
  { id: "p9", name: "FUTURE YOUTH HOODIE", price: 75, image: "/prod-hoodie.png", tag: "NEW", category: "Kids", description: "Premium street sizing for the next generation. Extremely soft, loopback interior terry." },
  { id: "p10", name: "NEO-CARGO SHORTS", price: 60, image: "/prod-cargo.png", tag: "", category: "Kids", description: "Durable kid-friendly active construction. Easy elastic waist, side webbing straps." },
  { id: "p11", name: "MINIMALIST RUG", price: 250, image: "/cat-home.png", tag: "BEST SELLER", category: "Home & Living", description: "High-density weave rug featuring the blueprint grid graphics of our master design plan." },
  { id: "p12", name: "STEEL DESK LAMP", price: 120, image: "/prod-jacket.png", tag: "LIMITED", category: "Home & Living", description: "Industrial articulating frame, custom neon accents, designed to cast the optimal aesthetic work glow." },
  { id: "p13", name: "CYBERPUNK PHONE CASE", price: 40, image: "/prod-phone-case.png", tag: "NEW", category: "Accessories", description: "Futuristic phone case constructed with military-grade drop protection, glossy outer layer, and high-contrast streetwear graphics." },
  { id: "a1", name: "YUBBY DUBBY x ADIDAS ULTRA-BOOST CYBER", price: 220, image: "/prod-cargo.png", tag: "COLLAB", category: "Accessories", description: "Exclusive collaboration sneakers featuring the Primeknit mesh design and energy-returning Boost midsole." },
  { id: "a2", name: "ADIDAS ZERO-G HOODIE GREEN", price: 160, image: "/prod-hoodie.png", tag: "NEW", category: "Mens", description: "Dual-branded heavyweight hoodie in the signature accent green hue. Engineered with performance sports details." },
  { id: "a3", name: "ADIDAS VOID TRACK PANTS", price: 140, image: "/prod-cargo.png", tag: "", category: "Mens", description: "Slim-fit performance track pants with high-contrast neon details and standard pocket configuration." },
  { id: "a4", name: "ADIDAS NEBULA COLLAB TEE", price: 80, image: "/prod-tee.png", tag: "LIMITED", category: "Womens", description: "Premium cotton blend athletic collab tee with dynamic geometric print across chest." },
];

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  let product = null;
  let relatedProducts: any[] = [];

  // 1. Try fetching from WooCommerce
  const wcProduct = await getProductById(productId);

  if (wcProduct) {
    product = {
      id: wcProduct.id.toString(),
      name: wcProduct.name.toUpperCase(),
      price: parseFloat(wcProduct.price) || 0,
      description: wcProduct.description || wcProduct.short_description || "No description available.",
      images: wcProduct.images.map(img => img.src).length > 0 ? wcProduct.images.map(img => img.src) : ["/prod-hoodie.png"],
      sizes: wcProduct.attributes.find(attr => attr.name.toLowerCase() === "size")?.options || ["S", "M", "L", "XL"],
      inStock: wcProduct.stock_status === "instock",
      rating: parseFloat(wcProduct.average_rating) || 5.0,
      ratingCount: wcProduct.rating_count || 12,
      category: wcProduct.categories[0]?.name || "Clothing"
    };

    // Try fetching related products if WooCommerce is configured
    if (wcProduct.related_ids && wcProduct.related_ids.length > 0) {
      const allRelated = await Promise.all(
        wcProduct.related_ids.slice(0, 4).map(id => getProductById(id.toString()))
      );
      relatedProducts = allRelated
        .filter((p): p is NonNullable<typeof p> => p !== null)
        .map(p => ({
          id: p.id.toString(),
          name: p.name,
          price: parseFloat(p.price) || 0,
          image: p.images[0]?.src || "/prod-hoodie.png",
          tag: p.on_sale ? "SALE" : ""
        }));
    }
  } else {
    // 2. Fallback to mock data matching product ID
    const matchedMock = mockProducts.find(p => p.id === productId);
    if (matchedMock) {
      product = {
        id: matchedMock.id,
        name: matchedMock.name,
        price: matchedMock.price,
        description: matchedMock.description,
        images: [matchedMock.image],
        sizes: ["S", "M", "L", "XL"],
        inStock: true,
        rating: 4.8,
        ratingCount: 142,
        category: matchedMock.category
      };

      // Mock related products (select random ones in the same category)
      relatedProducts = mockProducts
        .filter(p => p.category === matchedMock.category && p.id !== matchedMock.id)
        .slice(0, 4)
        .map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          tag: p.tag
        }));
    }
  }

  // If not found in either, show not found
  if (!product) {
    return (
      <main className="min-h-screen bg-brand-black text-white flex flex-col justify-between">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-32 text-center space-y-6">
          <h1 className="text-4xl font-heading font-black uppercase text-brand-green tracking-tighter">Product Not Found</h1>
          <p className="text-gray-400">The product structure you are attempting to look up is unavailable.</p>
          <Link href="/shop" className="inline-block bg-white text-black font-bold uppercase tracking-widest px-8 py-3 rounded-[var(--radius-btn)] hover:bg-brand-green transition-colors">
            Return to Shop
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-black text-white relative">
      <Navbar />

      {/* Main product wrapper */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-32 pb-24 space-y-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-500 font-sans">
          <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-brand-green transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-gray-300 truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Component */}
        <ProductInteractive product={product} />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-white/10 pt-16 space-y-8">
            <h2 className="text-2xl md:text-3xl font-heading font-black uppercase tracking-tighter">
              Related Structures
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <div key={p.id} className="glass-card p-4 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(177,243,16,0.15)] group relative">
                  <div className="relative aspect-[3/4] bg-white/5 rounded-[var(--radius-img)] overflow-hidden mb-6 flex items-center justify-center">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    {p.tag && (
                      <span className="absolute top-4 left-4 bg-brand-green text-brand-black text-xs font-bold px-3 py-1 uppercase tracking-widest">
                        {p.tag}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Link 
                        href={`/product/${p.id}`}
                        className="bg-brand-white text-brand-black font-bold uppercase tracking-widest px-6 py-3 rounded-[var(--radius-btn)] hover:bg-brand-green transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 text-xs text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className="px-2">
                    <Link href={`/product/${p.id}`} className="block">
                      <h3 className="font-bold text-lg hover:text-brand-green transition-colors uppercase font-heading truncate">{p.name}</h3>
                    </Link>
                    <div className="mt-2 text-brand-green font-bold tracking-widest">
                      ${p.price}.00
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
