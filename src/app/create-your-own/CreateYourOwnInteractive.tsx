"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, ShoppingBag, RotateCcw, 
  Sliders, Check, Info, Palette, Shirt, 
  ArrowLeft, ChevronRight, Loader2, Type
} from "lucide-react";

// Garment Color presets
const GARMENT_COLORS = [
  { name: "Void Black", hex: "#080808" },
  { name: "Arctic White", hex: "#f3f4f6" },
  { name: "Cyber Green", hex: "#B1F310" },
  { name: "Acid Purple", hex: "#7c3aed" },
  { name: "Crimson Red", hex: "#dc2626" }
];

// Fallback items if API endpoints are offline
const FALLBACK_CATEGORIES = [
  { id: 201, name: "Clothing", slug: "custom-clothing", description: "Custom Hoodies, Tees, and Jackets" },
  { id: 202, name: "Accessories", slug: "custom-accessories", description: "Custom Caps, Beanies, and Chains" },
  { id: 203, name: "Home & Living", slug: "custom-home-living", description: "Custom Cushions, Mugs, and Living items" },
  { id: 204, name: "Phone Accessories", slug: "custom-phone-accessories", description: "Custom iPhone, Samsung, and Pixel Cases" },
  { id: 205, name: "Wall Art", slug: "custom-wall-art", description: "Custom Posters and Wall Canvas" },
  { id: 206, name: "Bags", slug: "custom-bags", description: "Custom Backpacks and Tote Bags" }
];

const FALLBACK_SUBCATEGORIES: Record<number, any[]> = {
  201: [
    { id: 2011, name: "T-Shirts", slug: "custom-clothing-tshirts" },
    { id: 2012, name: "Oversized T-Shirts", slug: "custom-clothing-oversized-tshirts" },
    { id: 2013, name: "Hoodies", slug: "custom-clothing-hoodies" },
    { id: 2014, name: "Sweatshirts", slug: "custom-clothing-sweatshirts" },
    { id: 2015, name: "Jackets", slug: "custom-clothing-jackets" }
  ],
  202: [
    { id: 2021, name: "Caps", slug: "custom-accessories-caps" },
    { id: 2022, name: "Beanies", slug: "custom-accessories-beanies" },
    { id: 2023, name: "Sunglasses", slug: "custom-accessories-sunglasses" },
    { id: 2024, name: "Chains", slug: "custom-accessories-chains" }
  ],
  203: [
    { id: 2031, name: "Posters", slug: "custom-home-posters" },
    { id: 2032, name: "Wall Art", slug: "custom-home-wallart" },
    { id: 2033, name: "Cushions", slug: "custom-home-cushions" },
    { id: 2034, name: "Mugs", slug: "custom-home-mugs" }
  ],
  204: [
    { id: 2041, name: "iPhone Cases", slug: "custom-phone-iphone" },
    { id: 2042, name: "Samsung Cases", slug: "custom-phone-samsung" },
    { id: 2043, name: "Google Pixel Cases", slug: "custom-phone-pixel" }
  ],
  205: [
    { id: 2051, name: "Posters", slug: "custom-wallart-posters" },
    { id: 2052, name: "Wall Art", slug: "custom-wallart-canvas" }
  ],
  206: [
    { id: 2061, name: "Backpacks", slug: "custom-bags-backpacks" },
    { id: 2062, name: "Tote Bags", slug: "custom-bags-totes" }
  ]
};

const FALLBACK_PRODUCTS: Record<number, any[]> = {
  2011: [
    { id: "cust-tee-1", name: "Blank Designer Tee", price: 40, image: "/prod-tee.png" },
    { id: "cust-tee-2", name: "Blank Custom Classic Tee", price: 35, image: "/prod-tee.png" }
  ],
  2012: [
    { id: "cust-otee-1", name: "Blank Oversized Tee", price: 45, image: "/prod-tee.png" },
    { id: "cust-otee-2", name: "Blank Heavyweight Oversized Tee", price: 50, image: "/prod-tee.png" }
  ],
  2013: [
    { id: "cust-hood-1", name: "Blank Heavy Hoodie", price: 75, image: "/prod-hoodie.png" },
    { id: "cust-hood-2", name: "Blank Zip Hoodie", price: 80, image: "/prod-hoodie.png" }
  ],
  2014: [
    { id: "cust-sweat-1", name: "Blank Crewneck Sweatshirt", price: 65, image: "/prod-hoodie.png" }
  ],
  2015: [
    { id: "cust-jack-1", name: "Blank Windbreaker Jacket", price: 95, image: "/prod-jacket.png" },
    { id: "cust-jack-2", name: "Blank Coach Jacket", price: 90, image: "/prod-jacket.png" }
  ],
  2041: [{ id: "cust-phone-1", name: "Blank Premium iPhone Case", price: 25, image: "/prod-phone-case.png" }],
  2042: [{ id: "cust-phone-2", name: "Blank Premium Samsung Case", price: 25, image: "/prod-phone-case.png" }],
  2043: [{ id: "cust-phone-3", name: "Blank Premium Pixel Case", price: 25, image: "/prod-phone-case.png" }],
  2031: [{ id: "cust-home-1", name: "Blank Custom Poster", price: 15, image: "/create-your-own.png" }],
  2032: [{ id: "cust-home-2", name: "Blank Custom Canvas Wall Art", price: 80, image: "/cat-home.png" }],
  2033: [{ id: "cust-home-3", name: "Blank Custom Designer Cushion", price: 35, image: "/cat-home.png" }],
  2034: [{ id: "cust-home-4", name: "Blank Custom Ceramic Mug", price: 20, image: "/cat-accessories.png" }],
  2021: [{ id: "cust-acc-1", name: "Blank Premium Cap", price: 30, image: "/prod-cap.png" }],
  2022: [{ id: "cust-acc-2", name: "Blank Knit Beanie", price: 25, image: "/prod-hoodie.png" }],
  2023: [{ id: "cust-acc-3", name: "Blank Retro Sunglasses", price: 40, image: "/prod-sunglasses.png" }],
  2024: [{ id: "cust-acc-4", name: "Blank Cuban Link Chain", price: 45, image: "/prod-tee.png" }],
  2051: [{ id: "cust-art-1", name: "Blank Custom Poster", price: 20, image: "/create-your-own.png" }],
  2052: [{ id: "cust-art-2", name: "Blank Custom Framed Wall Art", price: 95, image: "/cat-home.png" }],
  2061: [{ id: "cust-bag-1", name: "Blank Utility Backpack", price: 85, image: "/cat-kids.png" }],
  2062: [{ id: "cust-bag-2", name: "Blank Heavy Tote Bag", price: 35, image: "/cat-accessories.png" }]
};

export default function CreateYourOwnInteractive() {
  const { addToCart } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const subcategoriesRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  // Selections
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Loading flags
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Customizer Editor settings
  const [selectedColor, setSelectedColor] = useState(GARMENT_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  
  // Customization elements
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [uploadedArtwork, setUploadedArtwork] = useState<string | null>(null);
  const [activeGraphicType, setActiveGraphicType] = useState<"artwork" | "logo" | "image">("image");
  
  const [customText, setCustomText] = useState("");
  const [customTextColor, setCustomTextColor] = useState(GARMENT_COLORS[1]); // Default white
  const [customTextFont, setCustomTextFont] = useState("font-sans");
  const [customTextSize, setCustomTextSize] = useState(16);
  const [textYPos, setTextYPos] = useState(60); // % from top
  const [textXPos, setTextXPos] = useState(50); // % from left

  // Sliders for artwork layer
  const [graphicScale, setGraphicScale] = useState(100);
  const [graphicYPos, setGraphicYPos] = useState(40); // % from top
  const [graphicXPos, setGraphicXPos] = useState(50); // % from left

  // Toggles
  const [designPosition, setDesignPosition] = useState<"front" | "back">("front");
  const [editorTab, setEditorTab] = useState<"graphics" | "text" | "specs">("graphics");
  const [previewMode, setPreviewMode] = useState<"photo" | "vector">("photo");
  
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync color & size selection when product changes
  useEffect(() => {
    if (selectedProduct) {
      const colorsAttr = selectedProduct.attributes?.find(
        (a: any) => a.name.toLowerCase() === "color" || a.name.toLowerCase() === "colors"
      );
      if (colorsAttr?.options?.length > 0) {
        setSelectedColor({ name: colorsAttr.options[0], hex: getHexForColorName(colorsAttr.options[0]) });
      } else {
        setSelectedColor(GARMENT_COLORS[0]);
      }

      const sizesAttr = selectedProduct.attributes?.find(
        (a: any) => a.name.toLowerCase() === "size" || a.name.toLowerCase() === "sizes"
      );
      if (sizesAttr?.options?.length > 0) {
        setSelectedSize(sizesAttr.options[0]);
      } else {
        setSelectedSize("M");
      }
    }
  }, [selectedProduct]);

  // Fetch Level 1 Categories
  useEffect(() => {
    async function loadRootCategories() {
      setLoadingCategories(true);
      try {
        const res = await fetch("/api/shop/categories?parent=200");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setCategories(data);
          } else {
            setCategories(FALLBACK_CATEGORIES);
          }
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch (err) {
        console.error("Categories fetch failed, fallback applied:", err);
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadRootCategories();
  }, []);

  const fetchProductsForCategory = async (catId: number) => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`/api/shop/products?category=${catId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(FALLBACK_PRODUCTS[catId] || []);
        }
      } else {
        setProducts(FALLBACK_PRODUCTS[catId] || []);
      }
    } catch (err) {
      console.error("Products fetch failed, fallback applied:", err);
      setProducts(FALLBACK_PRODUCTS[catId] || []);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch Level 2 Subcategories & Scroll
  const handleSelectCategory = async (cat: any) => {
    if (selectedCategory?.id === cat.id) {
      // Toggle off if clicked again
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedProduct(null);
      setSubcategories([]);
      setProducts([]);
      return;
    }

    setSelectedCategory(cat);
    setSelectedSubcategory(null);
    setSelectedProduct(null);
    setSubcategories([]);
    setProducts([]);
    setLoadingSubcategories(true);

    try {
      const res = await fetch(`/api/shop/categories?parent=${cat.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setSubcategories(data);
        } else {
          const fallbacks = FALLBACK_SUBCATEGORIES[cat.id] || [];
          if (fallbacks.length > 0) {
            setSubcategories(fallbacks);
          } else {
            // Leaf category, fetch products directly
            setSubcategories([]);
            setSelectedSubcategory({ id: cat.id, name: cat.name, isVirtual: true });
            await fetchProductsForCategory(cat.id);
          }
        }
      } else {
        const fallbacks = FALLBACK_SUBCATEGORIES[cat.id] || [];
        if (fallbacks.length > 0) {
          setSubcategories(fallbacks);
        } else {
          setSubcategories([]);
          setSelectedSubcategory({ id: cat.id, name: cat.name, isVirtual: true });
          await fetchProductsForCategory(cat.id);
        }
      }
    } catch (err) {
      console.error("Subcategories fetch failed, fallback applied:", err);
      const fallbacks = FALLBACK_SUBCATEGORIES[cat.id] || [];
      if (fallbacks.length > 0) {
        setSubcategories(fallbacks);
      } else {
        setSubcategories([]);
        setSelectedSubcategory({ id: cat.id, name: cat.name, isVirtual: true });
        await fetchProductsForCategory(cat.id);
      }
    } finally {
      setLoadingSubcategories(false);
      setTimeout(() => {
        subcategoriesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  // Fetch Level 3 Products & Scroll
  const handleSelectSubcategory = async (sub: any) => {
    if (selectedSubcategory?.id === sub.id) {
      setSelectedSubcategory(null);
      setSelectedProduct(null);
      setProducts([]);
      return;
    }

    setSelectedSubcategory(sub);
    setSelectedProduct(null);
    setProducts([]);
    setLoadingProducts(true);

    try {
      const res = await fetch(`/api/shop/products?category=${sub.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(FALLBACK_PRODUCTS[sub.id] || []);
        }
      } else {
        setProducts(FALLBACK_PRODUCTS[sub.id] || []);
      }
    } catch (err) {
      console.error("Products fetch failed, fallback applied:", err);
      setProducts(FALLBACK_PRODUCTS[sub.id] || []);
    } finally {
      setLoadingProducts(false);
      setTimeout(() => {
        productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  // Select Product
  const handleSelectProduct = (prod: any) => {
    setSelectedProduct(prod);
  };

  // Handle Custom Graphic Uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const src = uploadEvent.target?.result as string;
        if (activeGraphicType === "image") setUploadedImage(src);
        if (activeGraphicType === "logo") setUploadedLogo(src);
        if (activeGraphicType === "artwork") setUploadedArtwork(src);
      };
      reader.readAsDataURL(file);
    }
  };

  const getHexForColorName = (name: string): string => {
    const clean = name.toLowerCase().trim();
    if (clean.includes("black")) return "#080808";
    if (clean.includes("white")) return "#f3f4f6";
    if (clean.includes("green")) return "#B1F310";
    if (clean.includes("purple")) return "#7c3aed";
    if (clean.includes("red")) return "#dc2626";
    if (clean.includes("blue")) return "#2563eb";
    if (clean.includes("yellow")) return "#eab308";
    return "#555";
  };

  const getCategoryThumbnail = (slug: string) => {
    const clean = slug.toLowerCase();
    if (clean.includes("clothing")) return "/cat-mens.png";
    if (clean.includes("phone")) return "/prod-phone-case.png";
    if (clean.includes("home")) return "/cat-home.png";
    if (clean.includes("wall") || clean.includes("art")) return "/create-your-own.png";
    if (clean.includes("bag")) return "/cat-kids.png";
    return "/cat-accessories.png";
  };

  // Reset editor
  const handleReset = () => {
    setUploadedImage(null);
    setUploadedLogo(null);
    setUploadedArtwork(null);
    setCustomText("");
    setGraphicScale(100);
    setGraphicYPos(40);
    setGraphicXPos(50);
    setTextXPos(50);
    setTextYPos(60);
    setCustomTextSize(16);
  };

  // Add customized item payload to bag
  const handleAddToBag = () => {
    if (!selectedProduct) return;
    setIsAdding(true);
    
    const activeOverlay = uploadedImage || uploadedLogo || uploadedArtwork || "";
    const configName = `CUSTOM: ${selectedProduct.name} (${selectedColor.name})`;
    
    const itemPayload = {
      id: selectedProduct.id,
      name: configName,
      price: selectedProduct.price,
      size: selectedSize,
      image: selectedProduct.image || "/prod-tee.png",
      customImage: activeOverlay,
      customText: customText || ""
    };

    setTimeout(() => {
      addToCart(itemPayload, 1);
      setIsAdding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  // Determine active product layout template
  const getProductTypeKey = (name: string): string => {
    const cleanName = name.toLowerCase();
    if (cleanName.includes("hoodie")) return "hoodie";
    if (cleanName.includes("jacket")) return "jacket";
    if (cleanName.includes("tee") || cleanName.includes("t-shirt") || cleanName.includes("shirt")) return "tshirt";
    if (cleanName.includes("case")) return "phone-case";
    if (cleanName.includes("cap") || cleanName.includes("hat")) return "cap";
    if (cleanName.includes("sunglass")) return "sunglasses";
    if (cleanName.includes("sticker")) return "stickers";
    if (cleanName.includes("backpack")) return "backpack";
    return "tshirt";
  };

  const activeTypeKey = selectedProduct ? getProductTypeKey(selectedProduct.name) : "tshirt";

  const templatePhoto = 
    activeTypeKey === "hoodie" ? "/prod-hoodie.png" :
    activeTypeKey === "jacket" ? "/prod-jacket.png" :
    activeTypeKey === "phone-case" ? "/prod-phone-case.png" :
    activeTypeKey === "cap" ? "/prod-cap.png" :
    activeTypeKey === "sunglasses" ? "/prod-sunglasses.png" :
    activeTypeKey === "stickers" ? "/prod-stickers.png" :
    activeTypeKey === "backpack" ? "/cat-kids.png" :
    "/prod-tee.png";

  // Breadcrumbs step reset click
  const handleBreadcrumbClick = (stepToGo: 1 | 2 | 3 | 4) => {
    if (stepToGo === 1) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSelectedProduct(null);
      setSubcategories([]);
      setProducts([]);
    } else if (stepToGo === 2) {
      setSelectedSubcategory(null);
      setSelectedProduct(null);
      setProducts([]);
    } else if (stepToGo === 3) {
      setSelectedProduct(null);
    }
  };

  // Choose visual layer overlay in Step 4
  const activeGraphicOverlay = 
    activeGraphicType === "image" ? uploadedImage : 
    activeGraphicType === "logo" ? uploadedLogo : 
    uploadedArtwork;

  return (
    <div className="w-full space-y-8">
      {/* 1. Elegant Breadcrumbs and Step Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-4 gap-4">
        {/* Clickable Breadcrumbs */}
        <nav className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-gray-500">
          <button 
            onClick={() => handleBreadcrumbClick(1)}
            className={`hover:text-brand-green transition-colors cursor-pointer font-medium ${!selectedCategory ? "text-white" : ""}`}
          >
            Create Your Design
          </button>
          
          {selectedCategory && (
            <>
              <span className="text-gray-700">›</span>
              <button 
                onClick={() => handleBreadcrumbClick(2)}
                className={`hover:text-brand-green transition-colors cursor-pointer font-medium ${selectedCategory && (!selectedSubcategory || selectedSubcategory.isVirtual) ? "text-white" : ""}`}
              >
                {selectedCategory.name}
              </button>
            </>
          )}

          {selectedSubcategory && !selectedSubcategory.isVirtual && (
            <>
              <span className="text-gray-700">›</span>
              <button 
                onClick={() => handleBreadcrumbClick(3)}
                className={`hover:text-brand-green transition-colors cursor-pointer font-medium ${selectedSubcategory && !selectedProduct ? "text-white" : ""}`}
              >
                {selectedSubcategory.name}
              </button>
            </>
          )}

          {selectedProduct && (
            <>
              <span className="text-gray-700">›</span>
              <span className="text-brand-green font-bold">
                {selectedProduct.name}
              </span>
            </>
          )}
        </nav>

        {/* Dynamic Progress Stepper Bar */}
        <div className="flex items-center space-x-4 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[9px] font-mono tracking-widest font-bold">
          <div className="flex items-center space-x-1.5">
            <span className={`${selectedCategory ? "text-brand-green" : "text-white"}`}>{selectedCategory ? "✓" : "01"}</span>
            <span className={`${!selectedCategory ? "text-white" : "text-gray-500"}`}>CATEGORY</span>
          </div>
          
          {!selectedSubcategory?.isVirtual && (
            <>
              <span className="text-gray-700">|</span>
              <div className="flex items-center space-x-1.5">
                <span className={`${selectedSubcategory ? "text-brand-green" : selectedCategory ? "text-white" : "text-gray-600"}`}>{selectedSubcategory ? "✓" : "02"}</span>
                <span className={`${selectedCategory && !selectedSubcategory ? "text-white" : "text-gray-500"}`}>TYPE</span>
              </div>
            </>
          )}

          <span className="text-gray-700">|</span>
          <div className="flex items-center space-x-1.5">
            <span className={`${selectedProduct ? "text-brand-green" : selectedSubcategory ? "text-white" : "text-gray-600"}`}>{selectedProduct ? "✓" : selectedSubcategory?.isVirtual ? "02" : "03"}</span>
            <span className={`${selectedSubcategory && !selectedProduct ? "text-white" : "text-gray-500"}`}>PRODUCT</span>
          </div>
          
          <span className="text-gray-700">|</span>
          <div className="flex items-center space-x-1.5">
            <span className={`${selectedProduct ? "text-brand-green animate-pulse" : "text-gray-600"}`}>{selectedSubcategory?.isVirtual ? "03" : "04"}</span>
            <span className={`${selectedProduct ? "text-white font-bold" : "text-gray-500"}`}>CUSTOMIZE</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Selection Flow OR Customizer Focus */}
      {!selectedProduct ? (
        <div className="space-y-12">
          {/* CATEGORIES SELECTION GRID */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xs font-mono uppercase tracking-widest text-brand-green">Step 1: Choose Product Category</h2>
              <p className="text-gray-400 text-xs">Select your product.</p>
            </div>

            {loadingCategories ? (
              <CategorySkeleton />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => {
                  const isSelected = selectedCategory?.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat)}
                      className={`aspect-[4/3] w-full rounded-[24px] overflow-hidden border bg-white/[0.01] backdrop-blur-md transition-all duration-300 hover:border-brand-green hover:shadow-[0_0_25px_rgba(177,243,16,0.08)] group flex flex-col justify-between p-6 relative cursor-pointer text-left ${
                        isSelected ? "border-brand-green shadow-[0_0_25px_rgba(177,243,16,0.15)] bg-white/5" : "border-white/10"
                      }`}
                    >
                      {/* Visual Asset Background */}
                      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-10 group-hover:opacity-20 group-hover:scale-105 transition-all duration-500"
                           style={{ backgroundImage: `url(${getCategoryThumbnail(cat.slug)})` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0" />

                      <div className="z-10 flex w-full justify-between items-start">
                        <span className={`w-1.5 h-1.5 rounded-full bg-brand-green transition-opacity ${
                          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`} />
                        <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase font-bold">Studio Canvas</span>
                      </div>

                      <div className="z-10 text-left space-y-1.5">
                        <h3 className={`text-xl font-heading font-black uppercase tracking-widest transition-colors ${
                          isSelected ? "text-brand-green" : "text-white group-hover:text-brand-green"
                        }`}>
                          {cat.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-sans tracking-wide leading-relaxed line-clamp-2">
                          {cat.description || "Premium templates ready for personalization"}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* SUBCATEGORIES EXPANSION */}
          <div ref={subcategoriesRef}>
            <AnimatePresence mode="wait">
              {selectedCategory && !selectedSubcategory?.isVirtual && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-white/5 pt-12 space-y-6 overflow-hidden"
                >
                  <div className="space-y-1">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-brand-green">Step 2: Choose Product Type</h2>
                    <p className="text-gray-400 text-xs">Explore subcategory profiles under {selectedCategory.name}.</p>
                  </div>

                  {loadingSubcategories ? (
                    <SubcategorySkeleton />
                  ) : subcategories.length === 0 ? (
                    <div className="text-center py-8 text-xs text-gray-500 italic">
                      No subcategories found under this category.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {subcategories.map((sub) => {
                        const isSubSelected = selectedSubcategory?.id === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSelectSubcategory(sub)}
                            className={`aspect-[4/5] rounded-[20px] bg-white/[0.01] backdrop-blur-md border p-5 flex flex-col justify-between hover:border-brand-green hover:bg-white/[0.03] transition-all duration-300 group cursor-pointer text-left ${
                              isSubSelected ? "border-brand-green shadow-[0_0_15px_rgba(177,243,16,0.15)] bg-white/5" : "border-white/10"
                            }`}
                          >
                            <span className="text-[8px] font-mono tracking-widest text-gray-500 uppercase font-bold">Category Class</span>
                            
                            <div className="space-y-2">
                              <h4 className={`text-sm sm:text-base font-heading font-black uppercase tracking-wider transition-colors ${
                                isSubSelected ? "text-brand-green" : "text-white group-hover:text-brand-green"
                              }`}>
                                {sub.name}
                              </h4>
                              <div className="flex items-center text-[8px] font-mono tracking-widest text-brand-green font-bold">
                                {isSubSelected ? "ACTIVE" : "EXPLORE"} <ChevronRight size={10} className="ml-0.5 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PRODUCTS EXPANSION */}
          <div ref={productsRef}>
            <AnimatePresence mode="wait">
              {selectedSubcategory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-white/5 pt-12 space-y-6 overflow-hidden"
                >
                  <div className="space-y-1">
                    <h2 className="text-xs font-mono uppercase tracking-widest text-brand-green">
                      {selectedSubcategory?.isVirtual ? "Step 2: Choose Product" : "Step 3: Choose Product"}
                    </h2>
                    <p className="text-gray-400 text-xs">Select your blank customize canvas under {selectedSubcategory.name}.</p>
                  </div>

                  {loadingProducts ? (
                    <ProductSkeleton />
                  ) : products.length === 0 ? (
                    <div className="text-center py-8 text-xs text-gray-500 italic">
                      No products available in this subcategory.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {products.map((prod) => (
                        <button
                          key={prod.id}
                          onClick={() => handleSelectProduct(prod)}
                          className="bg-white/[0.01] backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:border-brand-green hover:bg-white/[0.03] group cursor-pointer text-left flex flex-col justify-between"
                        >
                          <div className="aspect-square w-full rounded-xl bg-white/5 overflow-hidden mb-4 relative flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={prod.image || "/prod-tee.png"}
                              alt={prod.name}
                              className="object-contain w-full h-full max-h-[140px] group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <span className="absolute bottom-2.5 right-2.5 bg-brand-green text-brand-black text-[7px] font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded">
                              Customizable
                            </span>
                          </div>

                          <div className="space-y-1 mt-auto">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white line-clamp-1">
                              {prod.name}
                            </h4>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono text-brand-green font-bold">
                                ${prod.price}.00
                              </span>
                              <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                                CHOOSE BLANK
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* STEP 4: CUSTOMIZE DESIGN EXPERIENCE (Canvas Studio Focus) */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
        >
          {/* Left Column: Live Customizer Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center w-full">
            <div className="w-full h-[360px] sm:h-[450px] lg:h-[500px] bg-white/[0.01] border border-white/10 rounded-[32px] relative flex items-center justify-center overflow-hidden p-8 shadow-[inset_0_0_80px_rgba(255,255,255,0.02)]">
              
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

              {/* View/Silhouette toggle */}
              <div className="absolute top-4 right-4 z-20 flex bg-black/60 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[9px] font-mono tracking-wider">
                <button
                  onClick={() => setPreviewMode("photo")}
                  className={`px-3 py-1.5 rounded-full transition-all uppercase cursor-pointer ${
                    previewMode === "photo" ? "bg-brand-green text-brand-black font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Photo Template
                </button>
                <button
                  onClick={() => setPreviewMode("vector")}
                  className={`px-3 py-1.5 rounded-full transition-all uppercase cursor-pointer ${
                    previewMode === "vector" ? "bg-brand-green text-brand-black font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Vector Silhouette
                </button>
              </div>

              {/* Graphic Canvas Output */}
              <div className="w-full max-w-[260px] sm:max-w-[340px] aspect-square relative flex items-center justify-center">
                
                {previewMode === "photo" ? (
                  <div className="w-full h-full relative flex items-center justify-center rounded-2xl overflow-hidden">
                    {/* Base color block */}
                    <div 
                      style={{ backgroundColor: selectedColor.hex }}
                      className="absolute inset-0 transition-colors duration-500 rounded-2xl"
                    />
                    
                    {/* Photo overlay */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={templatePhoto}
                      alt="Product canvas layout template"
                      className="w-full h-full object-contain absolute inset-0 mix-blend-multiply opacity-90 pointer-events-none select-none"
                    />
                  </div>
                ) : (
                  /* Minimalist Vector SVG Outline views */
                  activeTypeKey === "tshirt" ? (
                    <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                      <path
                        d="M80,50 L110,40 C115,55 135,55 140,40 L170,50 L220,70 L200,110 L175,100 L175,260 C175,265 170,270 165,270 L85,270 C80,270 75,265 75,260 L75,100 L50,110 L30,70 Z"
                        fill={selectedColor.hex}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="2"
                        className="transition-colors duration-500"
                      />
                      <path d="M75,100 L95,115 M175,100 L155,115 M80,260 C110,263 140,263 170,260" stroke="rgba(0,0,0,0.3)" strokeWidth="2.5" fill="none" />
                      <path d="M120,45 C125,50 135,50 140,45" stroke="rgba(0,0,0,0.4)" strokeWidth="2" fill="none" />
                    </svg>
                  ) : activeTypeKey === "hoodie" ? (
                    <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                      <path
                        d="M70,80 L110,70 L190,70 L230,80 L255,150 L225,160 L200,135 L200,260 C200,265 195,270 190,270 L110,270 C105,270 100,265 100,260 L100,135 L75,160 L45,150 Z"
                        fill={selectedColor.hex}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="2"
                        className="transition-colors duration-500"
                      />
                      <path d="M115,190 L185,190 C187,190 190,193 192,197 L198,230 C199,235 195,240 190,240 L110,240 C105,240 101,235 102,230 L108,197 C110,193 113,190 115,190 Z" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
                      <path d="M105,70 C105,15 195,15 195,70" fill={selectedColor.hex} stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                      <path d="M130,70 C130,45 170,45 170,70" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" />
                      <path d="M100,260 L200,260 M100,265 L200,265 M100,270 L200,270" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
                    </svg>
                  ) : activeTypeKey === "phone-case" ? (
                    <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                      <rect x="90" y="40" width="120" height="220" rx="20" ry="20" fill={selectedColor.hex} stroke="rgba(255,255,255,0.15)" strokeWidth="2" className="transition-colors duration-500" />
                      <rect x="105" y="55" width="30" height="55" rx="8" ry="8" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2.5" />
                    </svg>
                  ) : activeTypeKey === "cap" ? (
                    <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                      <path d="M70,160 C70,100 110,80 150,80 C190,80 230,100 230,160 C230,170 220,175 200,175 L100,175 C80,175 70,170 70,160 Z" fill={selectedColor.hex} stroke="rgba(255,255,255,0.15)" strokeWidth="2" className="transition-colors duration-500" />
                      <path d="M90,175 C60,175 40,195 50,210 C60,225 150,225 150,225 C150,225 240,225 250,210 C260,195 240,175 210,175" fill={selectedColor.hex} stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                      <rect x="80" y="80" width="140" height="140" rx="10" ry="10" fill={selectedColor.hex} stroke="rgba(255,255,255,0.15)" strokeWidth="2" className="transition-colors duration-500" />
                    </svg>
                  )
                )}

                {/* LIVE DESIGN OVERLAY ELEMENTS */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-[110px] h-[140px] sm:w-[130px] sm:h-[160px] relative mt-[-20px]">
                    
                    {/* 1. Uploaded Graphic Layer */}
                    {activeGraphicOverlay && (
                      <div
                        style={{
                          top: `${graphicYPos}%`,
                          left: `${graphicXPos}%`,
                          transform: `translate(-50%, -50%) scale(${graphicScale / 100})`,
                          width: "65px",
                          height: "65px",
                        }}
                        className="absolute pointer-events-none select-none transition-all duration-75"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={activeGraphicOverlay} 
                          alt="Custom design print layout" 
                          className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                        />
                      </div>
                    )}

                    {/* 2. Custom Text Layer */}
                    {customText && (
                      <div
                        style={{
                          top: `${textYPos}%`,
                          left: `${textXPos}%`,
                          transform: `translate(-50%, -50%)`,
                          color: customTextColor.hex,
                          fontSize: `${customTextSize}px`,
                          fontWeight: "bold",
                          letterSpacing: "0.08em"
                        }}
                        className={`absolute pointer-events-none select-none uppercase text-center whitespace-nowrap leading-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] ${customTextFont}`}
                      >
                        {customText}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Live indicators */}
              <div className="absolute bottom-4 left-4 text-[8px] font-mono tracking-widest text-gray-500 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
                Live Preview Studio
              </div>

              {designPosition && (
                <div className="absolute bottom-4 right-4 text-[8px] font-mono tracking-widest text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded font-bold uppercase">
                  {designPosition} View
                </div>
              )}
            </div>

            {/* Position selector toggle */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setDesignPosition("front")}
                className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  designPosition === "front" ? "bg-brand-green text-brand-black font-bold" : "bg-white/5 text-gray-400 hover:text-white border border-white/5"
                }`}
              >
                Front Print
              </button>
              <button
                onClick={() => setDesignPosition("back")}
                className={`px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  designPosition === "back" ? "bg-brand-green text-brand-black font-bold" : "bg-white/5 text-gray-400 hover:text-white border border-white/5"
                }`}
              >
                Back Print
              </button>
            </div>
          </div>

          {/* Right Column: Customization Controls Panel */}
          <div className="lg:col-span-5 space-y-6 w-full">
            
            {/* Back & Title */}
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-xl font-heading font-black uppercase tracking-wider text-white line-clamp-1">{selectedProduct.name}</h3>
                <p className="text-brand-green font-mono text-xs font-bold tracking-wider">${selectedProduct.price}.00 base price</p>
              </div>
              <button 
                onClick={() => handleBreadcrumbClick(3)}
                className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-gray-400 hover:text-white transition-colors cursor-pointer border border-white/10 px-4 py-1.5 rounded-full bg-white/5"
              >
                <ArrowLeft size={10} /> Change Blank
              </button>
            </div>

            {/* Editor Section Panel */}
            <div className="glass-card p-5 sm:p-6 rounded-[24px] border border-white/10 bg-white/[0.01] space-y-6">
              
              {/* Editor Tabs Navigation */}
              <div className="grid grid-cols-3 gap-1 bg-white/5 border border-white/5 p-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold">
                <button
                  onClick={() => setEditorTab("graphics")}
                  className={`py-2 rounded-full cursor-pointer transition-all ${
                    editorTab === "graphics" ? "bg-brand-green text-brand-black" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Graphics
                </button>
                <button
                  onClick={() => setEditorTab("text")}
                  className={`py-2 rounded-full cursor-pointer transition-all ${
                    editorTab === "text" ? "bg-brand-green text-brand-black" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Typography
                </button>
                <button
                  onClick={() => setEditorTab("specs")}
                  className={`py-2 rounded-full cursor-pointer transition-all ${
                    editorTab === "specs" ? "bg-brand-green text-brand-black" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Specs
                </button>
              </div>

              {/* Editor Panels content */}
              <AnimatePresence mode="wait">
                {/* TAB 1: GRAPHICS/ARTWORK UPLOAD */}
                {editorTab === "graphics" && (
                  <motion.div
                    key="graphics-tab"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-5"
                  >
                    {/* Graphic Sub-Type select pills */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono tracking-widest text-gray-500 uppercase font-bold">Layer Type</label>
                      <div className="flex gap-1.5 border-b border-white/5 pb-2 overflow-x-auto">
                        {(["image", "logo", "artwork"] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setActiveGraphicType(type);
                            }}
                            className={`px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold border transition-all cursor-pointer ${
                              activeGraphicType === type 
                                ? "bg-white/10 text-brand-green border-brand-green/30" 
                                : "bg-transparent text-gray-500 border-transparent hover:text-white"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dropzone File Input */}
                    <div className="space-y-3">
                      {!activeGraphicOverlay ? (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-8 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-green/50 hover:bg-white/[0.02] bg-white/[0.01] transition-all text-gray-400 hover:text-white"
                        >
                          <Upload size={20} className="text-brand-green animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Upload PNG {activeGraphicType}</span>
                          <span className="text-[8px] text-gray-500 font-mono">Transparent HD PNG recommended</span>
                        </button>
                      ) : (
                        <div className="p-4 bg-white/5 border border-brand-green/20 rounded-xl space-y-3">
                          <div className="flex justify-between items-center text-[9px] font-mono font-bold text-brand-green">
                            <span>✓ Layer Active</span>
                            <button 
                              onClick={() => fileInputRef.current?.click()}
                              className="text-white hover:text-brand-green underline cursor-pointer"
                            >
                              Replace File
                            </button>
                          </div>
                          <p className="text-[9px] text-gray-400 leading-normal">
                            PNG overlay active on the model view canvas. Use the spacing layout sliders below to scale and align.
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>

                    {/* Sliders overlay positioning */}
                    {activeGraphicOverlay && (
                      <div className="space-y-4 border-t border-white/5 pt-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-green font-mono flex items-center gap-1.5">
                          <Sliders size={12} />
                          Align Graphic Layer
                        </h4>
                        
                        {/* Scale */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-mono text-gray-400">
                            <span>Graphic Size (Scale)</span>
                            <span>{graphicScale}%</span>
                          </div>
                          <input
                            type="range" min="30" max="180" value={graphicScale}
                            onChange={(e) => setGraphicScale(Number(e.target.value))}
                            className="w-full accent-brand-green cursor-pointer"
                          />
                        </div>

                        {/* Y Pos */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-mono text-gray-400">
                            <span>Vertical Position (Y)</span>
                            <span>{graphicYPos}%</span>
                          </div>
                          <input
                            type="range" min="10" max="80" value={graphicYPos}
                            onChange={(e) => setGraphicYPos(Number(e.target.value))}
                            className="w-full accent-brand-green cursor-pointer"
                          />
                        </div>

                        {/* X Pos */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-mono text-gray-400">
                            <span>Horizontal Position (X)</span>
                            <span>{graphicXPos}%</span>
                          </div>
                          <input
                            type="range" min="20" max="80" value={graphicXPos}
                            onChange={(e) => setGraphicXPos(Number(e.target.value))}
                            className="w-full accent-brand-green cursor-pointer"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* TAB 2: TYPOGRAPHY LAYERS */}
                {editorTab === "text" && (
                  <motion.div
                    key="text-tab"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-5"
                  >
                    {/* Custom Text input */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono tracking-widest text-gray-500 uppercase font-bold">Custom Statement Text</label>
                      <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Type custom text..."
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs focus:border-brand-green/50 outline-none text-white font-mono placeholder-gray-600 uppercase"
                      />
                    </div>

                    {customText && (
                      <>
                        {/* Font Styles selector */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-mono tracking-widest text-gray-500 uppercase font-bold">Select Font Typography</label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { name: "Technical", style: "font-mono" },
                              { name: "Geometric", style: "font-sans" },
                              { name: "Classic", style: "font-serif" }
                            ].map((f) => (
                              <button
                                key={f.style}
                                onClick={() => setCustomTextFont(f.style)}
                                className={`py-1.5 text-[9px] font-mono uppercase tracking-wider border rounded-lg transition-all cursor-pointer ${
                                  customTextFont === f.style 
                                    ? "border-brand-green text-brand-green bg-white/5" 
                                    : "border-white/10 text-gray-400 hover:text-white"
                                }`}
                              >
                                {f.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Font Colors selector */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-mono tracking-widest text-gray-500 uppercase font-bold">Text Print Color</label>
                          <div className="flex gap-2">
                            {GARMENT_COLORS.map((color) => (
                              <button
                                key={color.name}
                                onClick={() => setCustomTextColor(color)}
                                style={{ backgroundColor: color.hex }}
                                className={`w-6 h-6 rounded-full border transition-all cursor-pointer relative ${
                                  customTextColor.name === color.name 
                                    ? "border-brand-green scale-110 shadow-[0_0_10px_rgba(177,243,16,0.3)]" 
                                    : "border-white/20 hover:scale-105"
                                }`}
                              >
                                {customTextColor.name === color.name && (
                                  <Check size={10} className={`absolute inset-0 m-auto ${color.hex === "#f3f4f6" ? "text-black" : "text-[#B1F310]"}`} />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Typography align sliders */}
                        <div className="space-y-4 border-t border-white/5 pt-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-green font-mono flex items-center gap-1.5">
                            <Type size={12} /> Align Typography
                          </h4>

                          {/* Size */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] font-mono text-gray-400">
                              <span>Font Size</span>
                              <span>{customTextSize}px</span>
                            </div>
                            <input
                              type="range" min="8" max="32" value={customTextSize}
                              onChange={(e) => setCustomTextSize(Number(e.target.value))}
                              className="w-full accent-brand-green cursor-pointer"
                            />
                          </div>

                          {/* Y Pos */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] font-mono text-gray-400">
                              <span>Vertical Position (Y)</span>
                              <span>{textYPos}%</span>
                            </div>
                            <input
                              type="range" min="10" max="90" value={textYPos}
                              onChange={(e) => setTextYPos(Number(e.target.value))}
                              className="w-full accent-brand-green cursor-pointer"
                            />
                          </div>

                          {/* X Pos */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] font-mono text-gray-400">
                              <span>Horizontal Position (X)</span>
                              <span>{textXPos}%</span>
                            </div>
                            <input
                              type="range" min="10" max="90" value={textXPos}
                              onChange={(e) => setTextXPos(Number(e.target.value))}
                              className="w-full accent-brand-green cursor-pointer"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* TAB 3: SPECIFICATIONS */}
                {editorTab === "specs" && (
                  <motion.div
                    key="specs-tab"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-5"
                  >
                    {/* Product Base color presets */}
                    <div className="space-y-2.5">
                      <label className="text-[9px] font-mono tracking-widest text-gray-500 uppercase font-bold">Base Canvas Color: <span className="text-white ml-1">{selectedColor.name}</span></label>
                      <div className="flex flex-wrap gap-2.5">
                        {GARMENT_COLORS.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedColor(color)}
                            style={{ backgroundColor: color.hex }}
                            className={`w-8 h-8 rounded-full border transition-all cursor-pointer relative ${
                              selectedColor.name === color.name 
                                ? "border-brand-green scale-110 shadow-[0_0_12px_rgba(177,243,16,0.4)]" 
                                : "border-white/20 hover:scale-105"
                            }`}
                          >
                            {selectedColor.name === color.name && (
                              <Check size={14} className={`absolute inset-0 m-auto ${color.hex === "#f3f4f6" ? "text-black" : "text-[#B1F310]"}`} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Size selectors */}
                    <div className="space-y-2.5">
                      <label className="text-[9px] font-mono tracking-widest text-gray-500 uppercase font-bold">Select Size Spec</label>
                      <div className="flex gap-2">
                        {["S", "M", "L", "XL", "XXL"].map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-9 h-9 rounded-xl border text-[10px] font-bold font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center ${
                              selectedSize === size
                                ? "border-brand-green bg-brand-green text-brand-black shadow-[0_0_10px_rgba(177,243,16,0.2)]"
                                : "border-white/10 text-white hover:bg-white/5"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-white/5 border border-white/5 rounded-xl p-3 text-[10px] text-gray-400 font-sans leading-relaxed">
                      <Info size={14} className="text-brand-green shrink-0 mt-0.5" />
                      <span>Mock sizes reflect dynamic fit structures. Garment fits are unisex oversized specs, built for standard streetwear proportions.</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Action Operations panel */}
            <div className="glass-card p-5 sm:p-6 rounded-[24px] border border-white/10 bg-white/[0.01] space-y-3">
              <button
                onClick={handleAddToBag}
                disabled={isAdding}
                className="w-full py-4 bg-brand-green text-brand-black font-heading font-black uppercase tracking-widest text-xs rounded-full hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isAdding ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-brand-black" />
                    <span>Generating Custom Layer...</span>
                  </div>
                ) : (
                  <>
                    <ShoppingBag size={14} />
                    <span>ADD PRODUCT TO BAG</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="w-full py-2 bg-transparent text-gray-500 hover:text-white text-[9px] font-mono uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={12} />
                Reset Configuration
              </button>
            </div>

          </div>
        </motion.div>
      )}

      {/* 3. Global Success Banner Dialog Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#0d0d0d] border border-brand-green/30 text-brand-green px-6 py-4 rounded-full font-mono text-xs uppercase tracking-widest flex items-center gap-3 shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-50 whitespace-nowrap"
          >
            <Check size={16} className="text-brand-green border border-brand-green/20 rounded-full p-0.5" />
            <span>Product added to shopping bag successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Skeleton loaders
const CategorySkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="aspect-[4/3] rounded-[24px] bg-white/[0.02] border border-white/5 animate-pulse flex flex-col justify-end p-6 space-y-3">
        <div className="h-6 w-1/3 bg-white/10 rounded" />
        <div className="h-4 w-2/3 bg-white/5 rounded" />
      </div>
    ))}
  </div>
);

const SubcategorySkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="aspect-[4/5] rounded-[20px] bg-white/[0.02] border border-white/5 animate-pulse flex flex-col justify-end p-5 space-y-2">
        <div className="h-4 w-1/2 bg-white/10 rounded" />
        <div className="h-3 w-1/3 bg-white/5 rounded" />
      </div>
    ))}
  </div>
);

const ProductSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 animate-pulse space-y-4">
        <div className="aspect-square w-full bg-white/5 rounded-xl" />
        <div className="h-4 w-3/4 bg-white/10 rounded" />
        <div className="h-3 w-1/4 bg-white/5 rounded" />
      </div>
    ))}
  </div>
);
