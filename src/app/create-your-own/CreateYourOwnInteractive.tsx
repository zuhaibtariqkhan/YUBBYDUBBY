"use client";

import React, { useState, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, ShoppingBag, RotateCcw, 
  Sliders, Check, Info, Palette, Shirt, Type
} from "lucide-react";

const GARMENT_COLORS = [
  { name: "Void Black", hex: "#080808" },
  { name: "Arctic White", hex: "#f3f4f6" },
  { name: "Cyber Green", hex: "#B1F310" },
  { name: "Acid Purple", hex: "#7c3aed" },
  { name: "Crimson Red", hex: "#dc2626" }
];

// Expanded list of premium designer fonts
const DESIGNER_FONTS = [
  { name: "Oswald (Futuristic Bold)", value: "font-heading", inlineStyle: {} },
  { name: "Montserrat (Clean Minimalist)", value: "font-sans", inlineStyle: {} },
  { name: "Impact (Streetwear Heavy)", value: "font-impact", inlineStyle: { fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" } },
  { name: "Tech Monospace (Cyber Retro)", value: "font-mono", inlineStyle: { fontFamily: "'Courier New', Courier, monospace" } },
  { name: "Playfair Display (Luxury Serif)", value: "font-serif", inlineStyle: { fontFamily: "'Playfair Display', Georgia, serif" } },
  { name: "Georgia (Elegant)", value: "font-georgia", inlineStyle: { fontFamily: "Georgia, serif" } }
];

// Expanded text color choices
const TEXT_COLORS = [
  { name: "Ghost White", hex: "#ffffff" },
  { name: "Pitch Black", hex: "#000000" },
  { name: "Cyber Green", hex: "#B1F310" },
  { name: "Electric Cyan", hex: "#22d3ee" },
  { name: "Vibrant Purple", hex: "#a78bfa" },
  { name: "Hot Pink", hex: "#f472b6" },
  { name: "Inferno Red", hex: "#f87171" },
  { name: "Sunset Orange", hex: "#fb923c" },
  { name: "Aura Gold", hex: "#facc15" }
];

interface CreateYourOwnInteractiveProps {
  initialProducts: any[];
}

export default function CreateYourOwnInteractive({ initialProducts }: CreateYourOwnInteractiveProps) {
  const { addToCart } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fallback products if none are fetched from WooCommerce
  const products = initialProducts.length > 0 ? initialProducts : [
    { id: "mock-tee", name: "Blank Designer Tee", price: 3000, type: "tshirt", image: "/prod-tee.png" },
    { id: "mock-hoodie", name: "Blank Heavy Hoodie", price: 4500, type: "hoodie", image: "/prod-hoodie.png" }
  ];

  // Customizer States
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedColor, setSelectedColor] = useState(GARMENT_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  
  // Customization Layers (Presets removed as requested, keeping only user upload option)
  const [decalType, setDecalType] = useState<"none" | "upload">("none");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Custom Text Layer
  const [hasCustomText, setHasCustomText] = useState(false);
  const [customText, setCustomText] = useState("CYBERSPACE");
  const [selectedTextColor, setSelectedTextColor] = useState(TEXT_COLORS[2]); // Default brand green
  const [selectedFont, setSelectedFont] = useState(DESIGNER_FONTS[0]);
  
  // Transform Sliders (Scales & Positions)
  const [graphicScale, setGraphicScale] = useState(100);
  const [graphicYPos, setGraphicYPos] = useState(40); // % from top
  const [graphicXPos, setGraphicXPos] = useState(50); // % from left
  
  const [textYPos, setTextYPos] = useState(60); // % from top
  const [textXPos, setTextXPos] = useState(50); // % from left
  const [textSize, setTextSize] = useState(18); // px

  // UI state
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"garment" | "design" | "text">("garment");

  // Stick with WooCommerce POD product price as requested (no additional fees)
  const totalPrice = selectedProduct.price;

  // Detect whether selected product acts like a hoodie or tshirt for SVG representation
  const productType = selectedProduct.name.toLowerCase().includes("hoodie") || selectedProduct.type === "hoodie" ? "hoodie" : "tshirt";

  // Handle custom image uploads (Support high quality/HD PNG images)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setUploadedImage(uploadEvent.target?.result as string);
        setDecalType("upload");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setDecalType("none");
    setUploadedImage(null);
    setHasCustomText(false);
    setGraphicScale(100);
    setGraphicYPos(40);
    setGraphicXPos(50);
    setTextYPos(60);
    setTextXPos(50);
    setTextSize(18);
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
      // Custom print-on-demand metadata fields
      customImage: decalType === "upload" ? uploadedImage : "",
      customText: hasCustomText ? customText : ""
    };

    setTimeout(() => {
      // Use helper to add to cart
      addToCart(itemPayload, 1);
      setIsAdding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      {/* Left Side: Live Interactive Garment Canvas */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full aspect-[4/5] sm:aspect-square bg-white/[0.01] border border-white/10 rounded-[32px] relative flex items-center justify-center overflow-hidden p-8 shadow-[inset_0_0_80px_rgba(255,255,255,0.02)]">
          
          {/* Grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* Live Render Area */}
          <div className="w-full max-w-[320px] sm:max-w-[420px] aspect-square relative flex items-center justify-center">
            
            {/* SVG Garment Silhouette Layer */}
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
                {decalType === "upload" && uploadedImage && (
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

                {/* Render Custom Text Overlay */}
                {hasCustomText && customText.trim() !== "" && (
                  <div
                    style={{
                      top: `${textYPos}%`,
                      left: `${textXPos}%`,
                      transform: `translate(-50%, -50%)`,
                      color: selectedTextColor.hex,
                      fontSize: `${textSize}px`,
                      ...selectedFont.inlineStyle
                    }}
                    className={`absolute font-black tracking-wider uppercase select-none text-center ${selectedFont.value}`}
                  >
                    {customText}
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
              <div className="text-3xl font-heading font-black text-brand-green mt-1 tracking-wider">₹{totalPrice.toLocaleString("en-IN")}.00</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono bg-white/5 px-2.5 py-1 rounded text-gray-400 border border-white/5 uppercase font-bold tracking-widest">
                BASE PRICE
              </span>
            </div>
          </div>

          {/* Category tabs */}
          <div className="grid grid-cols-3 gap-1 bg-white/5 border border-white/5 p-1 rounded-full text-xs font-mono">
            <button
              onClick={() => setActiveTab("garment")}
              className={`py-2 rounded-full cursor-pointer transition-all uppercase tracking-wider font-bold ${
                activeTab === "garment" ? "bg-brand-green text-brand-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Garment
            </button>
            <button
              onClick={() => setActiveTab("design")}
              className={`py-2 rounded-full cursor-pointer transition-all uppercase tracking-wider font-bold ${
                activeTab === "design" ? "bg-brand-green text-brand-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Graphic
            </button>
            <button
              onClick={() => setActiveTab("text")}
              className={`py-2 rounded-full cursor-pointer transition-all uppercase tracking-wider font-bold ${
                activeTab === "text" ? "bg-brand-green text-brand-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Text
            </button>
          </div>

          {/* Sub-panels */}
          <AnimatePresence mode="wait">
            {activeTab === "garment" && (
              <motion.div
                key="garment-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Product Option Selector (Fetched dynamically from WooCommerce) */}
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
                        {prod.name.toUpperCase()} (₹{prod.price.toLocaleString("en-IN")})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color Swatch Selector */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono flex items-center gap-1.5">
                    <Palette size={12} className="text-brand-green" />
                    Garment Color: <span className="text-white ml-1">{selectedColor.name}</span>
                  </label>
                  <div className="flex gap-3">
                    {GARMENT_COLORS.map((color) => (
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
                          <Check size={14} className={`absolute inset-0 m-auto ${color.name === "Arctic White" ? "text-black" : "text-[#B1F310]"}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono">Select Size</label>
                  <div className="flex gap-2">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
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
                {/* Upload-only graphic configuration */}
                <div className="space-y-4">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono block">Upload Design Layer</label>
                  
                  {decalType === "none" ? (
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
                {decalType === "upload" && (
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

            {activeTab === "text" && (
              <motion.div
                key="text-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Toggle Text Layer */}
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono">Custom Text Layer</label>
                  <button
                    onClick={() => setHasCustomText(!hasCustomText)}
                    className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                      hasCustomText ? "bg-brand-green" : "bg-white/10"
                    }`}
                  >
                    <div className={`w-4 h-4 bg-black rounded-full transition-transform ${hasCustomText ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>

                {hasCustomText && (
                  <div className="space-y-4 border-t border-white/5 pt-4">
                    {/* Text Input */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 font-mono">Input Custom Text</label>
                      <input
                        type="text"
                        maxLength={24}
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-mono uppercase tracking-widest focus:outline-none focus:border-brand-green text-white"
                      />
                    </div>

                    {/* Expanded Font Selector */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-1">
                        <Type size={11} className="text-brand-green" />
                        Select Font Face
                      </label>
                      <select
                        value={selectedFont.value}
                        onChange={(e) => {
                          const found = DESIGNER_FONTS.find(f => f.value === e.target.value);
                          if (found) setSelectedFont(found);
                        }}
                        className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-mono tracking-wider focus:outline-none focus:border-brand-green text-white cursor-pointer"
                      >
                        {DESIGNER_FONTS.map((font) => (
                          <option key={font.value} value={font.value} className="bg-[#090909] text-white">
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Expanded Color Selector */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 font-mono">Text Color</label>
                      <div className="grid grid-cols-5 gap-2.5">
                        {TEXT_COLORS.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setSelectedTextColor(color)}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                            className={`w-7 h-7 rounded-full border transition-all cursor-pointer relative ${
                              selectedTextColor.name === color.name ? "border-brand-green scale-110 shadow-[0_0_8px_rgba(177,243,16,0.5)]" : "border-white/20"
                            }`}
                          >
                            {selectedTextColor.name === color.name && (
                              <Check size={12} className={`absolute inset-0 m-auto ${color.hex === "#ffffff" ? "text-black" : "text-white"}`} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Expanded Text Position Sliders */}
                    <div className="space-y-3 pt-2">
                      {/* Size */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-gray-400">
                          <span>Font Size (Scale)</span>
                          <span>{textSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="8"
                          max="48"
                          value={textSize}
                          onChange={(e) => setTextSize(Number(e.target.value))}
                          className="w-full accent-brand-green"
                        />
                      </div>

                      {/* Y-Position */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-gray-400">
                          <span>Vertical Offset (Y)</span>
                          <span>{textYPos}%</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="80"
                          value={textYPos}
                          onChange={(e) => setTextYPos(Number(e.target.value))}
                          className="w-full accent-brand-green"
                        />
                      </div>

                      {/* X-Position */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-gray-400">
                          <span>Horizontal Offset (X)</span>
                          <span>{textXPos}%</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="80"
                          value={textXPos}
                          onChange={(e) => setTextXPos(Number(e.target.value))}
                          className="w-full accent-brand-green"
                        />
                      </div>
                    </div>
                  </div>
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
                    <span>ADD CUSTOM DESIGN TO BAG</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="w-full py-2 bg-transparent text-gray-500 hover:text-white text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={12} />
                Reset customizations
              </button>
            </div>
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
