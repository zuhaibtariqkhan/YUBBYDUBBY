"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, ShoppingBag, RotateCcw, 
  Sliders, Check, Info, Palette, Shirt
} from "lucide-react";

const FALLBACK_COLORS = [
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

  // Fallback products if none are fetched from WooCommerce
  const products = initialProducts.length > 0 ? initialProducts : [
    { id: "mock-tee", name: "Blank Designer Tee", price: 3000, type: "tshirt", image: "/prod-tee.png", attributes: [] },
    { id: "mock-hoodie", name: "Blank Heavy Hoodie", price: 4500, type: "hoodie", image: "/prod-hoodie.png", attributes: [] }
  ];

  // Customizer States
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedColor, setSelectedColor] = useState(FALLBACK_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  
  // Customization Layers (Upload only)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Transform Sliders (Scales & Positions)
  const [graphicScale, setGraphicScale] = useState(100);
  const [graphicYPos, setGraphicYPos] = useState(40); // % from top
  const [graphicXPos, setGraphicXPos] = useState(50); // % from left
  
  // UI state
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"product" | "design">("product");

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
    return FALLBACK_COLORS;
  };

  const currentSizes = getProductSizes(selectedProduct);
  const currentColors = getProductColors(selectedProduct);

  // Sync size & color states when selected product changes
  useEffect(() => {
    const sizes = getProductSizes(selectedProduct);
    setSelectedSize(sizes[0] || "M");
    
    const colors = getProductColors(selectedProduct);
    setSelectedColor(colors[0] || FALLBACK_COLORS[0]);
  }, [selectedProduct]);

  // Pricing fetched directly from active WooCommerce product list
  const totalPrice = selectedProduct.price;

  // Detect whether selected product acts like a hoodie or tshirt for SVG representation
  const productType = selectedProduct.name.toLowerCase().includes("hoodie") || selectedProduct.type === "hoodie" ? "hoodie" : "tshirt";

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      {/* Left Side: Live Interactive Product Canvas */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full aspect-[4/5] sm:aspect-square bg-white/[0.01] border border-white/10 rounded-[32px] relative flex items-center justify-center overflow-hidden p-8 shadow-[inset_0_0_80px_rgba(255,255,255,0.02)]">
          
          {/* Grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* Live Render Area */}
          <div className="w-full max-w-[320px] sm:max-w-[420px] aspect-square relative flex items-center justify-center">
            
            {/* SVG Product Silhouette Layer */}
            {productType === "tshirt" ? (
              <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
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
            ) : (
              <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
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
            )}

            {/* Graphic Canvas Placement Layer */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[120px] h-[150px] relative mt-[-20px]">
                
                {/* Render Uploaded Graphic */}
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
          <div className="absolute bottom-6 left-6 text-[8px] font-mono tracking-widest text-gray-500 uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping" />
            Live Render Output (Front View)
          </div>
        </div>

        {/* Quick Helper Banner */}
        <div className="mt-4 flex items-start gap-2 bg-white/5 border border-white/5 rounded-xl p-3 w-full text-[11px] text-gray-400 font-sans leading-relaxed">
          <Info size={14} className="text-brand-green shrink-0 mt-0.5" />
          <span>Upload your design and align it on the product layout. Custom print pricing will match the base product listing costs.</span>
        </div>
      </div>

      {/* Right Side: Options and Sliders Dashboard */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-card p-6 rounded-[24px] border border-white/10 bg-white/[0.01] space-y-6">
          
          {/* Pricing & Cart Status Summary */}
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xs font-mono uppercase text-gray-500 tracking-wider">Product Price</h3>
              <div className="text-3xl font-heading font-black text-brand-green mt-1 tracking-wider">
                ₹{totalPrice.toLocaleString("en-IN")}.00
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono bg-white/5 px-2.5 py-1 rounded text-gray-400 border border-white/5 uppercase font-bold tracking-widest">
                BASE PRICE
              </span>
            </div>
          </div>

          {/* Category tabs (Garment text replaced with Product) */}
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
                className="space-y-6"
              >
                {/* Product Option Selector (Fetched dynamically from WooCommerce - Price removed from option text) */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono flex items-center gap-1">
                    <Shirt size={12} className="text-brand-green" />
                    Select Product Blank *
                  </label>
                  <select
                    value={selectedProduct.id}
                    onChange={(e) => {
                      const found = products.find(p => p.id === e.target.value);
                      if (found) setSelectedProduct(found);
                    }}
                    className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-[var(--radius-dropdown)] text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-brand-green text-white cursor-pointer"
                  >
                    {products.map((prod) => (
                      <option key={prod.id} value={prod.id} className="bg-[#090909] text-white">
                        {prod.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color Swatch Selector (Fetched dynamically from WooCommerce attributes) */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono flex items-center gap-1.5">
                    <Palette size={12} className="text-brand-green" />
                    Product Color: <span className="text-white ml-1">{selectedColor.name}</span>
                  </label>
                  <div className="flex gap-3">
                    {currentColors.map((color: any) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: color.hex }}
                        className={`w-9 h-9 rounded-full cursor-pointer relative border transition-all ${
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

                {/* Size Selector (Fetched dynamically from WooCommerce attributes) */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono">Select Size</label>
                  <div className="flex gap-2">
                    {currentSizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 rounded-xl border text-xs font-bold font-mono tracking-wide transition-all cursor-pointer ${
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
                className="space-y-6"
              >
                {/* Upload-only graphic configuration (none and preset segments removed) */}
                <div className="space-y-4">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono block">Upload Design Layer</label>
                  
                  {!uploadedImage ? (
                    <button
                      onClick={() => {
                        if (fileInputRef.current) fileInputRef.current.click();
                      }}
                      className="w-full py-8 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-brand-green/50 bg-white/5 transition-all text-gray-400 hover:text-white"
                    >
                      <Upload size={24} className="text-brand-green animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider">Upload PNG Image File</span>
                      <span className="text-[9px] text-gray-500 font-mono">HD files supported</span>
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
                        className="w-full accent-brand-green"
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
                        className="w-full accent-brand-green"
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
                        className="w-full accent-brand-green"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Action Buttons Panel */}
        <div className="glass-card p-6 rounded-[24px] border border-white/10 bg-white/[0.01] space-y-3">
          <button
            onClick={handleAddToBag}
            disabled={isAdding}
            className="w-full py-4 bg-brand-green text-brand-black font-heading font-black uppercase tracking-widest text-xs rounded-full hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <span>GENERATING CUSTOM ORDER...</span>
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
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#0d0d0d] border border-brand-green/30 text-brand-green px-6 py-4 rounded-full font-mono text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_15px_40px_rgba(0,0,0,0.5)] z-50"
          >
            <Check size={16} className="text-brand-green border border-brand-green/20 rounded-full p-0.5" />
            <span>Custom design added to shopping bag successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
