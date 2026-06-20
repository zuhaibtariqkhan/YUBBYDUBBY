"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, ShoppingBag, RotateCcw, 
  Sliders, Check, Info, Palette, Shirt, Eye, EyeOff
} from "lucide-react";

const GARMENT_COLORS = [
  { name: "Void Black", hex: "#080808" },
  { name: "Arctic White", hex: "#f3f4f6" },
  { name: "Cyber Green", hex: "#B1F310" },
  { name: "Acid Purple", hex: "#7c3aed" },
  { name: "Crimson Red", hex: "#dc2626" }
];

interface CreateYourOwnInteractiveProps {
  initialProducts: any[];
}

export default function CreateYourOwnInteractive({ initialProducts }: CreateYourOwnInteractiveProps) {
  const { addToCart } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper mapping to group blank products dynamically
  const mapProductCategory = (name: string, type: string) => {
    const lowerName = name.toLowerCase();
    
    if (
      lowerName.includes("hoodie") || 
      lowerName.includes("jacket") || 
      lowerName.includes("outerwear") || 
      lowerName.includes("zip") ||
      type === "hoodie"
    ) {
      return { parentCategory: "Clothing", subcategory: "Hoodies & Outerwear" };
    }
    if (
      lowerName.includes("pants") || 
      lowerName.includes("cargo") || 
      lowerName.includes("jogger") || 
      lowerName.includes("trouser") || 
      lowerName.includes("shorts") || 
      type === "pants"
    ) {
      return { parentCategory: "Clothing", subcategory: "Pants" };
    }
    if (
      lowerName.includes("tee") || 
      lowerName.includes("t-shirt") || 
      lowerName.includes("shirt") || 
      lowerName.includes("top") || 
      lowerName.includes("tank") || 
      type === "tshirt"
    ) {
      return { parentCategory: "Clothing", subcategory: "Tops" };
    }
    if (
      lowerName.includes("phone") || 
      lowerName.includes("case") || 
      lowerName.includes("airpods") || 
      lowerName.includes("cover") || 
      lowerName.includes("sleeve") || 
      type === "case"
    ) {
      return { parentCategory: "Accessories", subcategory: "Tech Cases" };
    }
    if (
      lowerName.includes("cap") || 
      lowerName.includes("hat") || 
      lowerName.includes("beanie") || 
      lowerName.includes("visor") || 
      type === "hat"
    ) {
      return { parentCategory: "Accessories", subcategory: "Headwear" };
    }
    
    return { parentCategory: "Accessories", subcategory: "Miscellaneous" };
  };

  // Fallback products if none are fetched from WooCommerce
  const products = (initialProducts.length > 0 ? initialProducts : [
    { id: "mock-tee", name: "Blank Designer Tee", price: 40, type: "tshirt", image: "/prod-tee.png", attributes: [] },
    { id: "mock-oversized-tee", name: "Blank Oversized Tee", price: 45, type: "tshirt", image: "/prod-tee.png", attributes: [] },
    { id: "mock-hoodie", name: "Blank Heavy Hoodie", price: 75, type: "hoodie", image: "/prod-hoodie.png", attributes: [] },
    { id: "mock-zip-hoodie", name: "Blank Zip Hoodie", price: 80, type: "hoodie", image: "/prod-hoodie.png", attributes: [] },
    { id: "mock-cargo", name: "Blank Cargo Pants", price: 90, type: "pants", image: "/prod-cargo.png", attributes: [] },
    { id: "mock-phone-case", name: "Blank Phone Case", price: 25, type: "case", image: "/prod-phone-case.png", attributes: [] },
    { id: "mock-airpods", name: "Blank AirPods Cover", price: 20, type: "case", image: "/prod-airpods-cover.png", attributes: [] },
    { id: "mock-cap", name: "Blank Cap", price: 30, type: "hat", image: "/prod-cap.png", attributes: [] },
    { id: "mock-sunglasses", name: "Blank Sunglasses", price: 35, type: "accessory", image: "/prod-sunglasses.png", attributes: [] },
    { id: "mock-stickers", name: "Blank Stickers Pack", price: 10, type: "accessory", image: "/prod-stickers.png", attributes: [] }
  ]).map((p) => {
    const { parentCategory, subcategory } = mapProductCategory(p.name, p.type || "");
    return {
      ...p,
      parentCategory,
      subcategory,
    };
  });

  // Customizer Category States
  const parentCategories = ["Clothing", "Accessories"];
  const [activeParent, setActiveParent] = useState("Clothing");
  
  const subcategoriesForParent: Record<string, string[]> = {
    Clothing: ["Tops", "Hoodies & Outerwear", "Pants"],
    Accessories: ["Tech Cases", "Headwear", "Miscellaneous"]
  };
  
  const currentSubcategories = subcategoriesForParent[activeParent] || [];
  const [activeSub, setActiveSub] = useState(currentSubcategories[0] || "");

  // Sync subcategory selection when parent changes
  useEffect(() => {
    if (subcategoriesForParent[activeParent]?.length > 0) {
      setActiveSub(subcategoriesForParent[activeParent][0]);
    }
  }, [activeParent]);

  // Customizer States
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedColor, setSelectedColor] = useState(GARMENT_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  
  // Customization Layers (Upload only)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Transform Sliders (Scales & Positions)
  const [graphicScale, setGraphicScale] = useState(100);
  const [graphicYPos, setGraphicYPos] = useState(40); // % from top
  const [graphicXPos, setGraphicXPos] = useState(50); // % from left
  
  // UI states
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"product" | "design">("product");
  const [previewMode, setPreviewMode] = useState<"photo" | "vector">("photo"); // Dual preview support

  // Helper functions to parse WooCommerce attributes dynamically
  const getProductSizes = (product: any) => {
    const sizeAttr = product.attributes?.find(
      (attr: any) => attr.name.toLowerCase() === "size" || attr.name.toLowerCase() === "sizes"
    );
    return sizeAttr && sizeAttr.options?.length > 0 ? sizeAttr.options : ["S", "M", "L", "XL", "XXL"];
  };

  const getProductColors = (product: any) => {
    const colorAttr = product.attributes?.find(
      (attr: any) => attr.name.toLowerCase() === "color" || attr.name.toLowerCase() === "colors"
    );
    if (colorAttr && colorAttr.options?.length > 0) {
      return colorAttr.options.map((opt: string) => {
        const clean = opt.toLowerCase().trim();
        let hex = "#555";
        if (clean.includes("black")) hex = "#080808";
        else if (clean.includes("white")) hex = "#f3f4f6";
        else if (clean.includes("green")) hex = "#B1F310";
        else if (clean.includes("purple")) hex = "#7c3aed";
        else if (clean.includes("red")) hex = "#dc2626";
        else if (clean.includes("blue")) hex = "#2563eb";
        else if (clean.includes("yellow")) hex = "#eab308";
        else if (clean.includes("grey") || clean.includes("gray")) hex = "#6b7280";
        return { name: opt, hex };
      });
    }
    return GARMENT_COLORS;
  };

  const currentSizes = getProductSizes(selectedProduct);
  const currentColors = getProductColors(selectedProduct);

  // Sync size & color states when selected product changes
  useEffect(() => {
    const sizes = getProductSizes(selectedProduct);
    setSelectedSize(sizes[0] || "M");
    
    const colors = getProductColors(selectedProduct);
    setSelectedColor(colors[0] || GARMENT_COLORS[0]);
  }, [selectedProduct]);

  // Pricing fetched directly from active WooCommerce product list
  const totalPrice = selectedProduct.price;

  // Determine product type key for image templates and vector silhouettes
  const getProductTypeKey = (product: any) => {
    const name = product.name.toLowerCase();
    if (name.includes("hoodie") || product.type === "hoodie") return "hoodie";
    if (name.includes("tee") || name.includes("t-shirt") || product.type === "tshirt") return "tshirt";
    if (name.includes("cargo") || name.includes("pants") || name.includes("jogger") || product.type === "pants") return "pants";
    if (name.includes("phone") || name.includes("case") || product.type === "case") return "phone-case";
    if (name.includes("airpods") || product.type === "airpods") return "airpods-cover";
    if (name.includes("cap") || name.includes("hat") || product.type === "hat") return "cap";
    if (name.includes("sunglass") || product.type === "accessory") return "sunglasses";
    if (name.includes("sticker") || product.type === "sticker") return "stickers";
    return "tshirt"; // Default fallback
  };

  const activeTypeKey = getProductTypeKey(selectedProduct);

  // Flat-lay PNG template matching the active type key
  const templatePhoto = 
    activeTypeKey === "hoodie" ? "/prod-hoodie.png" :
    activeTypeKey === "pants" ? "/prod-cargo.png" :
    activeTypeKey === "phone-case" ? "/prod-phone-case.png" :
    activeTypeKey === "airpods-cover" ? "/prod-airpods-cover.png" :
    activeTypeKey === "cap" ? "/prod-cap.png" :
    activeTypeKey === "sunglasses" ? "/prod-sunglasses.png" :
    activeTypeKey === "stickers" ? "/prod-stickers.png" :
    "/prod-tee.png";

  // Filter products by selected categories
  const filteredProducts = products.filter(
    (p) => p.parentCategory === activeParent && p.subcategory === activeSub
  );

  // Handle custom image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setUploadedImage(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setGraphicScale(100);
    setGraphicYPos(40);
    setGraphicXPos(50);
  };

  const handleAddToBag = () => {
    setIsAdding(true);
    
    // Create detailed customizable product details
    const customConfigName = `CUSTOM: ${selectedProduct.name} (${selectedColor.name})`;
    
    // Attach customization metadata to the item so checkout route can read it
    const itemPayload = {
      id: selectedProduct.id,
      name: customConfigName,
      price: totalPrice,
      size: selectedSize,
      image: selectedProduct.image || "/prod-tee.png",
      customImage: uploadedImage || "",
      customText: ""
    };

    setTimeout(() => {
      // Add to cart
      addToCart(itemPayload, 1);
      setIsAdding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
      
      {/* Left Side: Live Interactive Product Canvas - Mobile Optimized Aspect Heights */}
      <div className="lg:col-span-7 flex flex-col items-center w-full">
        <div className="w-full h-[320px] sm:h-[400px] lg:h-[460px] bg-white/[0.01] border border-white/10 rounded-[24px] sm:rounded-[32px] relative flex items-center justify-center overflow-hidden p-6 sm:p-8 shadow-[inset_0_0_80px_rgba(255,255,255,0.02)]">
          
          {/* Grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Preview Toggle Buttons (Photo vs Vector) */}
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
              Vector View
            </button>
          </div>

          {/* Live Render Area */}
          <div className="w-full max-w-[240px] sm:max-w-[340px] aspect-square relative flex items-center justify-center">
            
            {previewMode === "photo" ? (
              /* Premium Photo Template View (Uses flat-lays dynamically blended with colors) */
              <div className="w-full h-full relative flex items-center justify-center rounded-xl overflow-hidden">
                {/* Dynamic Base Color block */}
                <div 
                  style={{ backgroundColor: selectedColor.hex }}
                  className="absolute inset-0 transition-colors duration-500 rounded-xl"
                />
                
                {/* Flatlay shading template image overlay */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={templatePhoto}
                  alt={`${activeTypeKey} flatlay shadow template`}
                  className="w-full h-full object-contain absolute inset-0 mix-blend-multiply opacity-90 pointer-events-none select-none"
                />
              </div>
            ) : (
              /* Minimalist SVG Silhouette View */
              activeTypeKey === "tshirt" ? (
                <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                  <path
                    d="M80,50 L110,40 C115,55 135,55 140,40 L170,50 L220,70 L200,110 L175,100 L175,260 C175,265 170,270 165,270 L85,270 C80,270 75,265 75,260 L75,100 L50,110 L30,70 Z"
                    fill={selectedColor.hex}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="2"
                    className="transition-colors duration-500"
                  />
                  <path
                    d="M75,100 L95,115 M175,100 L155,115 M80,260 C110,263 140,263 170,260"
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  <path
                    d="M120,45 C125,50 135,50 140,45"
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="2"
                    fill="none"
                  />
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
                  <path
                    d="M115,190 L185,190 C187,190 190,193 192,197 L198,230 C199,235 195,240 190,240 L110,240 C105,240 101,235 102,230 L108,197 C110,193 113,190 115,190 Z"
                    fill="none"
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth="2"
                  />
                  <path
                    d="M105,70 C105,15 195,15 195,70"
                    fill={selectedColor.hex}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="2"
                  />
                  <path
                    d="M130,70 C130,45 170,45 170,70"
                    fill="none"
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="2"
                  />
                  <path
                    d="M100,260 L200,260 M100,265 L200,265 M100,270 L200,270"
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="1.5"
                  />
                </svg>
              ) : activeTypeKey === "pants" ? (
                <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                  <path
                    d="M90,50 L210,50 C215,50 220,55 220,60 L195,260 C195,265 190,270 185,270 L155,270 L155,140 L145,140 L145,270 L115,270 C110,270 105,265 105,260 L80,60 C80,55 85,50 90,50 Z"
                    fill={selectedColor.hex}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="2"
                    className="transition-colors duration-500"
                  />
                </svg>
              ) : activeTypeKey === "phone-case" ? (
                <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                  <rect
                    x="90" y="40" width="120" height="220" rx="20" ry="20"
                    fill={selectedColor.hex}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="2"
                    className="transition-colors duration-500"
                  />
                  <rect
                    x="105" y="55" width="30" height="55" rx="8" ry="8"
                    fill="none"
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="2.5"
                  />
                </svg>
              ) : activeTypeKey === "airpods-cover" ? (
                <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                  <rect
                    x="90" y="70" width="120" height="160" rx="35" ry="35"
                    fill={selectedColor.hex}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="2"
                    className="transition-colors duration-500"
                  />
                </svg>
              ) : activeTypeKey === "cap" ? (
                <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                  <path
                    d="M70,160 C70,100 110,80 150,80 C190,80 230,100 230,160 C230,170 220,175 200,175 L100,175 C80,175 70,170 70,160 Z"
                    fill={selectedColor.hex}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="2"
                    className="transition-colors duration-500"
                  />
                  <path
                    d="M90,175 C60,175 40,195 50,210 C60,225 150,225 150,225 C150,225 240,225 250,210 C260,195 240,175 210,175"
                    fill={selectedColor.hex}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                /* Generic Box/Accessory outline */
                <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                  <rect
                    x="80" y="80" width="140" height="140" rx="10" ry="10"
                    fill={selectedColor.hex}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="2"
                    className="transition-colors duration-500"
                  />
                </svg>
              )
            )}

            {/* Graphic Canvas Placement Layer (Responsive positioning based on screen coordinates) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[100px] h-[130px] sm:w-[120px] sm:h-[150px] relative mt-[-20px]">
                {uploadedImage && (
                  <div
                    style={{
                      top: `${graphicYPos}%`,
                      left: `${graphicXPos}%`,
                      transform: `translate(-50%, -50%) scale(${graphicScale / 100})`,
                      width: "60px",
                      height: "60px",
                    }}
                    className="absolute select-none pointer-events-none"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={uploadedImage} 
                      alt="custom design overlay" 
                      className="w-full h-full object-contain filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Status Indicator */}
          <div className="absolute bottom-4 left-4 text-[8px] font-mono tracking-widest text-gray-500 uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
            Live Render Output
          </div>
        </div>

        {/* Quick Helper Banner */}
        <div className="mt-3 flex items-start gap-2 bg-white/5 border border-white/5 rounded-xl p-3 w-full text-[10px] sm:text-[11px] text-gray-400 font-sans leading-relaxed">
          <Info size={14} className="text-brand-green shrink-0 mt-0.5" />
          <span>Upload your design and align it on the product layout. Custom print pricing will match the base product listing costs.</span>
        </div>
      </div>

      {/* Right Side: Options and Sliders Dashboard - Mobile Optimized Paddings */}
      <div className="lg:col-span-5 space-y-4 sm:space-y-6 w-full">
        <div className="glass-card p-5 sm:p-6 rounded-[20px] sm:rounded-[24px] border border-white/10 bg-white/[0.01] space-y-5 sm:space-y-6">
          
          {/* Pricing & Cart Status Summary */}
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xs font-mono uppercase text-gray-500 tracking-wider">Product Price</h3>
              <div className="text-2xl sm:text-3xl font-heading font-black text-brand-green mt-1 tracking-wider">
                ${totalPrice}.00
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono bg-white/5 px-2.5 py-1 rounded text-gray-400 border border-white/5 uppercase font-bold tracking-widest">
                BASE PRICE
              </span>
            </div>
          </div>

          {/* Category tabs */}
          <div className="grid grid-cols-2 gap-1 bg-white/5 border border-white/5 p-1 rounded-full text-xs font-mono">
            <button
              onClick={() => setActiveTab("product")}
              className={`py-2 rounded-full cursor-pointer transition-all uppercase tracking-wider font-bold ${
                activeTab === "product" ? "bg-brand-green text-brand-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Product
            </button>
            <button
              onClick={() => setActiveTab("design")}
              className={`py-2 rounded-full cursor-pointer transition-all uppercase tracking-wider font-bold ${
                activeTab === "design" ? "bg-brand-green text-brand-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Graphic
            </button>
          </div>

          {/* Sub-panels */}
          <AnimatePresence mode="wait">
            {activeTab === "product" && (
              <motion.div
                key="product-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* Product Option Selector */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-1.5">
                    <Shirt size={12} className="text-brand-green" />
                    Base Blank Product
                  </label>

                  {/* Parent Category Pills */}
                  <div className="flex gap-2 border-b border-white/5 pb-2 overflow-x-auto scrollbar-none">
                    {parentCategories.map((pCat) => (
                      <button
                        key={pCat}
                        type="button"
                        onClick={() => setActiveParent(pCat)}
                        className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer ${
                          activeParent === pCat
                            ? "bg-brand-green text-brand-black shadow-[0_0_10px_rgba(177,243,16,0.2)]"
                            : "bg-white/5 text-gray-400 hover:text-white border border-white/5"
                        }`}
                      >
                        {pCat}
                      </button>
                    ))}
                  </div>

                  {/* Subcategory Pills Expansion */}
                  <motion.div
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex flex-wrap gap-1.5 overflow-hidden"
                  >
                    {currentSubcategories.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setActiveSub(sub)}
                        className={`px-3 py-1 rounded-full text-[9px] uppercase font-semibold tracking-wider transition-all cursor-pointer ${
                          activeSub === sub
                            ? "bg-white/10 text-brand-green border border-brand-green/30"
                            : "bg-transparent text-gray-500 hover:text-gray-300 border border-white/5"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </motion.div>

                  {/* Horizontal Scroll of product cards */}
                  <div className="relative w-full">
                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-6 text-xs text-gray-500 italic">
                        No blank products available in this subcategory.
                      </div>
                    ) : (
                      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {filteredProducts.map((prod) => {
                          const isSelected = selectedProduct.id === prod.id;
                          return (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => setSelectedProduct(prod)}
                              className={`flex-none w-[110px] bg-white/[0.02] border rounded-xl p-2.5 transition-all text-left group relative ${
                                isSelected
                                  ? "border-brand-green shadow-[0_0_12px_rgba(177,243,16,0.15)] bg-white/5"
                                  : "border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                              }`}
                            >
                              {/* Selected Check Indicator */}
                              {isSelected && (
                                <div className="absolute top-1.5 right-1.5 bg-brand-green text-brand-black p-0.5 rounded-full z-10">
                                  <Check size={8} strokeWidth={4} />
                                </div>
                              )}
                              
                              {/* Thumbnail image container */}
                              <div className="aspect-square w-full rounded-lg bg-white/5 overflow-hidden mb-2 relative flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={prod.image || "/prod-tee.png"}
                                  alt={prod.name}
                                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>

                              {/* Title and pricing */}
                              <div className="space-y-0.5">
                                <h4 className="text-[9px] font-bold uppercase tracking-wide text-white font-sans truncate">
                                  {prod.name.replace("Blank ", "")}
                                </h4>
                                <p className="text-[9px] font-mono text-brand-green font-bold">
                                  ${prod.price}.00
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Color Swatch Selector */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono flex items-center gap-1.5">
                    <Palette size={12} className="text-brand-green" />
                    Product Color: <span className="text-white ml-1">{selectedColor.name}</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {currentColors.map((color: any) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: color.hex }}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full cursor-pointer relative border transition-all ${
                          selectedColor.name === color.name 
                            ? "border-brand-green scale-110 shadow-[0_0_15px_rgba(177,243,16,0.5)]" 
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

                {/* Size Selector */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono">Select Size</label>
                  <div className="flex flex-wrap gap-2">
                    {currentSizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border text-xs font-bold font-mono tracking-wide transition-all cursor-pointer ${
                          selectedSize === size
                            ? "border-brand-green bg-brand-green text-brand-black shadow-[0_0_10px_rgba(177,243,16,0.3)]"
                            : "border-white/10 hover:border-white/20 text-white hover:bg-white/5"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "design" && (
              <motion.div
                key="design-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                {/* Upload-only graphic configuration (clean layout without tabs or selection) */}
                <div className="space-y-3.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono block">Upload Design Layer</label>
                  
                  {!uploadedImage ? (
                    <button
                      onClick={() => {
                        if (fileInputRef.current) fileInputRef.current.click();
                      }}
                      className="w-full py-8 sm:py-10 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-brand-green/50 bg-white/5 transition-all text-gray-400 hover:text-white"
                    >
                      <Upload size={24} className="text-brand-green animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider">Upload PNG Image File</span>
                      <span className="text-[9px] text-gray-500 font-mono">HD transparent files supported</span>
                    </button>
                  ) : (
                    <div className="p-4 bg-white/5 border border-brand-green/20 rounded-xl space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-mono font-bold text-brand-green">
                        <span>✓ High Quality PNG Active</span>
                        <button 
                          onClick={() => { if (fileInputRef.current) fileInputRef.current.click(); }}
                          className="text-white hover:text-brand-green underline cursor-pointer"
                        >
                          Replace File
                        </button>
                      </div>
                      <p className="text-[9px] text-gray-400 leading-normal">
                        Verify design details on the preview pane. You can align, position, or scale your graphics below.
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

                {/* Graphic Alignment Sliders Control */}
                {uploadedImage && (
                  <div className="space-y-4 border-t border-white/5 pt-4 animate-fade-in">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-green font-mono flex items-center gap-1">
                      <Sliders size={12} />
                      Align Graphics On Product
                    </h4>
                    
                    {/* Scale Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-gray-400">
                        <span>Graphic Size (Scale)</span>
                        <span>{graphicScale}%</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="180"
                        value={graphicScale}
                        onChange={(e) => setGraphicScale(Number(e.target.value))}
                        className="w-full accent-brand-green cursor-pointer"
                      />
                    </div>

                    {/* Y-Position Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-gray-400">
                        <span>Vertical Position (Y)</span>
                        <span>{graphicYPos}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="70"
                        value={graphicYPos}
                        onChange={(e) => setGraphicYPos(Number(e.target.value))}
                        className="w-full accent-brand-green cursor-pointer"
                      />
                    </div>

                    {/* X-Position Slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-gray-400">
                        <span>Horizontal Position (X)</span>
                        <span>{graphicXPos}%</span>
                      </div>
                      <input
                        type="range"
                        min="35"
                        max="65"
                        value={graphicXPos}
                        onChange={(e) => setGraphicXPos(Number(e.target.value))}
                        className="w-full accent-brand-green cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Action Buttons Panel */}
        <div className="glass-card p-5 sm:p-6 rounded-[20px] sm:rounded-[24px] border border-white/10 bg-white/[0.01] space-y-3">
          <button
            onClick={handleAddToBag}
            disabled={isAdding}
            className="w-full py-3.5 sm:py-4 bg-brand-green text-brand-black font-heading font-black uppercase tracking-widest text-xs rounded-full hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <span>GENERATING PRODUCT...</span>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>ADD PRODUCT TO BAG</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="w-full py-2 bg-transparent text-gray-500 hover:text-white text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcw size={12} />
            Reset configurations
          </button>
        </div>
      </div>

      {/* Success Alert Banner Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#0d0d0d] border border-brand-green/30 text-brand-green px-5 py-3.5 rounded-full font-mono text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_15px_40px_rgba(0,0,0,0.5)] z-50 whitespace-nowrap"
          >
            <Check size={16} className="text-brand-green border border-brand-green/20 rounded-full p-0.5" />
            <span>Product added to shopping bag successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
