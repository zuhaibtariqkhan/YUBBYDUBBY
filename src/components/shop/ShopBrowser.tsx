"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";

import ProductCard from "../ui/ProductCard";
import CategoryCard from "../ui/CategoryCard";

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

  // Handle hash selection on mount or when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase().replace("#", "");
      if (hash && initialMainCategories.length > 0) {
        const found = initialMainCategories.find((cat) => {
          const slug = cat.slug.toLowerCase();
          const name = cat.name.toLowerCase();
          return (
            slug === hash ||
            hash.startsWith(slug) ||
            slug.startsWith(hash) ||
            name.includes(hash) ||
            hash.includes(name)
          );
        });
        if (found) {
          setSelectedMainCategory(found);
        }
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [initialMainCategories]);

  // Fetch subcategories when a main category is clicked
  useEffect(() => {
    if (!selectedMainCategory) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
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

    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      // Clear URL hash cleanly without forcing reload
      if (typeof window !== "undefined") {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    }
  };

  const resetToShop = () => {
    setSelectedSubcategory(null);
    setSelectedMainCategory(null);
    setCurrentLevel("main-categories");
    // Clear URL hash cleanly without forcing reload
    if (typeof window !== "undefined") {
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  };

  const selectMainCategoryFromBreadcrumb = () => {
    setSelectedSubcategory(null);
    setCurrentLevel("subcategories");
  };

  // Stagger animation container bounds
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants: Variants = {
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
                {selectedMainCategory.name}
              </button>
            </>
          )}

          {selectedSubcategory && (
            <>
              <ChevronRight size={10} className="text-gray-600" />
              <span className="text-brand-green font-bold">
                {selectedSubcategory.name}
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
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full flex flex-col space-y-3.5 animate-pulse"
              >
                <div className="aspect-[4/5] w-full bg-white/5 rounded-[var(--radius-img)]" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
                <div className="h-3 bg-white/5 rounded w-1/3" />
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
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {initialMainCategories.map((cat) => {
              const imageUrl = getCategoryImageUrl(cat.name, cat.slug, cat.image?.src);
              return (
                <motion.div
                  key={cat.id}
                  variants={itemVariants}
                >
                  <CategoryCard
                    name={cat.name}
                    image={imageUrl}
                    href="#"
                    description={cat.description}
                    countText={cat.count > 0 ? `${cat.count} collections` : "Browse Lineup"}
                    onClick={() => {
                      if (cat.customLink) {
                        router.push(cat.customLink);
                      } else {
                        setSelectedMainCategory(cat);
                      }
                    }}
                  />
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
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
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
                  >
                    <CategoryCard
                      name={sub.name}
                      image={imageUrl}
                      href="#"
                      description={sub.description}
                      countText="Browse items"
                      onClick={() => setSelectedSubcategory(sub)}
                    />
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
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
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
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    tag={product.tag}
                  />
                </motion.div>
              ))
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
