import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { getProductById, getProducts } from "@/lib/woocommerce";
import ProductInteractive from "./ProductInteractive";
import { CURRENCY_SYMBOL } from "@/lib/utils";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

// Mock fallbacks array (empty - products fetched from WooCommerce API)
const mockProducts: any[] = [];

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
    let images = wcProduct.images.map(img => img.src);
    if (images.length === 0) {
      images = ["/prod-hoodie.png"];
      const lowerName = wcProduct.name.toLowerCase();
      if (lowerName.includes("iphone") || lowerName.includes("phone") || lowerName.includes("case")) {
          images = ["/prod-phone-case.png"];
      } else if (lowerName.includes("airpod")) {
          images = ["/prod-airpods-cover.png"];
      } else if (lowerName.includes("cap") || lowerName.includes("hat")) {
          images = ["/prod-cap.png"];
      } else if (lowerName.includes("sunglass") || lowerName.includes("glasses")) {
          images = ["/prod-sunglasses.png"];
      } else if (lowerName.includes("sticker")) {
          images = ["/prod-stickers.png"];
      }
    }

    product = {
      id: wcProduct.id.toString(),
      name: wcProduct.name.toUpperCase(),
      price: parseFloat(wcProduct.price) || 0,
      description: wcProduct.description || wcProduct.short_description || "No description available.",
      images,
      sizes: wcProduct.attributes.find(attr => attr.name.toLowerCase() === "size")?.options || ["S", "M", "L", "XL"],
      colors: wcProduct.attributes.find(attr => attr.name.toLowerCase() === "color" || attr.name.toLowerCase() === "colour")?.options || [],
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
        .map(p => {
          let image = p.images[0]?.src;
          if (!image) {
            image = "/prod-hoodie.png";
            const relName = p.name.toLowerCase();
            if (relName.includes("iphone") || relName.includes("phone") || relName.includes("case")) {
                image = "/prod-phone-case.png";
            } else if (relName.includes("airpod")) {
                image = "/prod-airpods-cover.png";
            } else if (relName.includes("cap") || relName.includes("hat")) {
                image = "/prod-cap.png";
            } else if (relName.includes("sunglass") || relName.includes("glasses")) {
                image = "/prod-sunglasses.png";
            } else if (relName.includes("sticker")) {
                image = "/prod-stickers.png";
            }
          }

          return {
            id: p.id.toString(),
            name: p.name,
            price: parseFloat(p.price) || 0,
            image,
            tag: p.on_sale ? "SALE" : ""
          };
        });
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
        colors: ["Black", "French Navy", "Stone"],
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
                      {CURRENCY_SYMBOL}{p.price}.00
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
