"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";

export interface CategoryDetail {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  image?: {
    id: number;
    src: string;
    name: string;
    alt: string;
  } | null;
  count: number;
  customLink?: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  image: string;
  tag: string;
  subcategory: string;
}

interface ShopBrowserProps {
  initialMainCategories: CategoryDetail[];
}

export default function ShopBrowser({ initialMainCategories }: ShopBrowserProps) {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState<"main-categories" | "subcategories" | "products">("main-categories");
  const [selectedMainCategory, setSelectedMainCategory] = useState<CategoryDetail | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<CategoryDetail | null>(null);

  const [subcategories, setSubcategories] = useState<CategoryDetail[]>([]);
  const [products, setProducts] = useState<ProductDetail[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCategoryName = (name: string) => {
    if (!name) return "";
    return name
      .replace(/&amp;amp;/g, "&")
      .replace(/&amp;/g, "&")
      .replace(/home and amp livining/gi, "Home & Living")
      .replace(/home &amp; living/gi, "Home & Living")
      .replace(/home and living/gi, "Home & Living");
  };

  // Map slugs/names to local premium background images for fallbacks
  const getCategoryImageUrl = (name: string, slug: string, wcImageSrc?: string) => {
    if (wcImageSrc) return wcImageSrc;

    const lowerName = name.toLowerCase();
    const lowerSlug = slug.toLowerCase();

    if (lowerName.includes("men") || lowerSlug.includes("men")) return "/cat-mens.png";
    if (lowerName.includes("women") || lowerSlug.includes("women")) return "/cat-womens.png";
    if (lowerName.includes("kid") || lowerSlug.includes("kid") || lowerName.includes("boy") || lowerName.includes("girl")) return "/cat-kids.png";
    if (lowerName.includes("home") || lowerSlug.includes("home") || lowerName.includes("living") || lowerName.includes("decor") || lowerName.includes("art") || lowerName.includes("mug")) return "/cat-home.png";
    if (lowerName.includes("accessory") || lowerSlug.includes("accessory") || lowerName.includes("tech") || lowerName.includes("case") || lowerName.includes("cap")) return "/cat-accessories.png";
    if (lowerSlug.includes("adidas")) return "/cat-home.png";
    if (lowerSlug.includes("create-your-own")) return "/create-your-own.png";

    return "/create-your-own.png";
  };

  // Fetch subcategories when a main category is clicked
  useEffect(() => {
    if (!selectedMainCategory) return;

    setLoading(true);
    setError(null);
    setSubcategories([]);

    fetch(`/api/shop/categories?parent=${selectedMainCategory.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load subcategories");
        return res.json();
      })
      .then((data) => {
        setSubcategories(data);
        setCurrentLevel("subcategories");
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load subcategories. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedMainCategory]);

  // Fetch products when a subcategory is clicked
  useEffect(() => {
    if (!selectedSubcategory) return;

    setLoading(true);
    setError(null);
    setProducts([]);

    fetch(`/api/shop/products?category=${selectedSubcategory.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setCurrentLevel("products");
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load products. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedSubcategory]);

  const handleBack = () => {
    if (currentLevel === "products") {
      setSelectedSubcategory(null);
      setCurrentLevel("subcategories");
    } else if (currentLevel === "subcategories") {
      setSelectedMainCategory(null);
      setCurrentLevel("main-categories");
    }
  };

  const resetToShop = () => {
    setSelectedSubcategory(null);
    setSelectedMainCategory(null);
    setCurrentLevel("main-categories");
  };

  const selectMainCategoryFromBreadcrumb = () => {
    setSelectedSubcategory(null);
    setCurrentLevel("subcategories");
  };

  // Stagger animation container bounds
  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Controls Bar: Breadcrumbs & Back Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-md">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-gray-400">
          <Link href="/" className="hover:text-brand-green transition-colors">
            Home
          </Link>
          <ChevronRight size={10} className="text-gray-600" />
          <button 
            onClick={resetToShop}
            className={`hover:text-brand-green transition-colors cursor-pointer ${
              currentLevel === "main-categories" ? "text-brand-green font-bold pointer-events-none" : ""
            }`}
          >
            Shop
          </button>
          
          {selectedMainCategory && (
            <>
              <ChevronRight size={10} className="text-gray-600" />
              <button
                onClick={selectMainCategoryFromBreadcrumb}
                className={`hover:text-brand-green transition-colors cursor-pointer ${
                  currentLevel === "subcategories" ? "text-brand-green font-bold pointer-events-none" : ""
                }`}
              >
                {formatCategoryName(selectedMainCategory.name)}
              </button>
            </>
          )}

          {selectedSubcategory && (
            <>
              <ChevronRight size={10} className="text-gray-600" />
              <span className="text-brand-green font-bold">
                {formatCategoryName(selectedSubcategory.name)}
              </span>
            </>
          )}
        </nav>

        {/* Back Button Action */}
        {currentLevel !== "main-categories" && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4.5 py-2 rounded-full border border-white/10 hover:border-brand-green bg-white/5 text-[10px] font-mono font-bold uppercase tracking-widest text-gray-300 hover:text-brand-green transition-all cursor-pointer shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
          >
            <ArrowLeft size={12} />
            <span>Go Back</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-sm uppercase tracking-wider font-mono">
          {error}
        </div>
      )}

      {/* Primary Display Switcher */}
      <AnimatePresence mode="wait">
        
        {/* Loading state skeleton loaders */}
        {loading ? (
          <motion.div
            key="skeleton-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="glass-card aspect-[4/3] sm:aspect-[3/4] border border-white/5 bg-white/[0.01] p-6 rounded-3xl animate-pulse flex flex-col justify-end space-y-4"
              >
                <div className="w-1/2 h-4.5 bg-white/10 rounded" />
                <div className="w-3/4 h-3 bg-white/5 rounded" />
              </div>
            ))}
          </motion.div>
        ) : currentLevel === "main-categories" ? (
          
          /* Level 1: Main Category Cards */
          <motion.div
            key="main-level"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {initialMainCategories.map((cat) => {
              const imageUrl = getCategoryImageUrl(cat.name, cat.slug, cat.image?.src);
              return (
                <motion.div
                  key={cat.id}
                  variants={itemVariants}
                  onClick={() => {
                    if (cat.customLink) {
                      router.push(cat.customLink);
                    } else {
                      setSelectedMainCategory(cat);
                    }
                  }}
                  className="glass-card aspect-[4/3] relative rounded-[32px] border border-white/10 overflow-hidden cursor-pointer group shadow-[0_15px_30px_rgba(0,0,0,0.3)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(177,243,16,0.15)] flex flex-col justify-end p-8"
                >
                  {/* Backdrop shading gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5 group-hover:via-black/10 transition-colors duration-500 z-10" />
                  
                  {/* High quality template or media placeholder */}
                  <Image
                    src={imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 z-0 opacity-80"
                  />

                  {/* Glassmorphic border glow highlights */}
                  <div className="absolute inset-0 border border-white/5 rounded-[32px] z-20 pointer-events-none group-hover:border-brand-green/30 transition-colors duration-500" />

                  {/* Card Title Content */}
                  <div className="relative z-20 space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-heading font-black text-2xl uppercase tracking-widest text-white group-hover:text-brand-green transition-colors">
                      {formatCategoryName(cat.name)}
                    </h3>
                    {cat.description && (
                      <p className="text-[10px] text-gray-400 font-sans tracking-wide uppercase line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                    <span className="text-[9px] font-mono text-brand-green font-bold block pt-1 uppercase tracking-widest">
                      {cat.count > 0 ? `${cat.count} collections` : "Browse Lineup"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : currentLevel === "subcategories" ? (
          
          /* Level 2: Subcategory Cards Grid */
          <motion.div
            key="sub-level"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {subcategories.length === 0 ? (
              <div className="col-span-full text-center py-16 text-sm text-gray-500 italic uppercase tracking-wider font-mono">
                No collections available in this lineup.
              </div>
            ) : (
              subcategories.map((sub) => {
                const imageUrl = getCategoryImageUrl(sub.name, sub.slug, sub.image?.src);
                return (
                  <motion.div
                    key={sub.id}
                    variants={itemVariants}
                    onClick={() => setSelectedSubcategory(sub)}
                    className="glass-card aspect-[4/3] relative rounded-[32px] border border-white/10 overflow-hidden cursor-pointer group shadow-[0_15px_30px_rgba(0,0,0,0.3)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(177,243,16,0.15)] flex flex-col justify-end p-8"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent group-hover:via-black/15 transition-colors duration-500 z-10" />
                    
                    <Image
                      src={imageUrl}
                      alt={sub.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 z-0 opacity-70"
                    />

                    <div className="absolute inset-0 border border-white/5 rounded-[32px] z-20 pointer-events-none group-hover:border-brand-green/30 transition-colors duration-500" />

                    <div className="relative z-20 space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="font-heading font-black text-xl uppercase tracking-widest text-white group-hover:text-brand-green transition-colors">
                        {formatCategoryName(sub.name)}
                      </h3>
                      {sub.description && (
                        <p className="text-[10px] text-gray-400 font-sans tracking-wide uppercase">
                          {sub.description}
                        </p>
                      )}
                      <span className="text-[9px] font-mono text-brand-green font-bold block pt-1 uppercase tracking-widest">
                        Browse items
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        ) : (
          
          /* Level 3: Products Grid display */
          <motion.div
            key="products-level"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.length === 0 ? (
              <div className="col-span-full text-center py-20 text-sm text-gray-500 italic uppercase tracking-wider font-mono">
                No items found in this collection.
              </div>
            ) : (
              products.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  className="glass-card p-4 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(177,243,16,0.15)] group relative flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Media with overlays */}
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

                    {/* Meta info */}
                    <div className="px-2">
                      <Link href={`/product/${product.id}`} className="block">
                        <h3 className="font-bold text-lg hover:text-brand-green transition-colors uppercase font-heading truncate">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="mt-2 text-brand-green font-bold tracking-widest">
                        ${product.price}.00
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
