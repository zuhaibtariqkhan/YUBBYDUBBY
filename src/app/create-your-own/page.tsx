"use client";

import React, { useState, useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/HomeSections";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, Sparkles, ShoppingBag, RotateCcw, 
  Move, Type, Sliders, Check, Info, Palette 
} from "lucide-react";

// Pre-made premium cyber-punk theme decals
const PRESET_DECALS = [
  { id: "cyber-logo", name: "Cyber Logo", text: "YUBBY DUBBY", style: "font-black tracking-[0.25em] text-[#B1F310]" },
  { id: "gravity-icon", name: "0-Gravity", text: "0-GRAVITY", style: "font-mono font-bold tracking-widest text-white border border-white/20 px-2 py-0.5" },
  { id: "void-emblem", name: "Void Concept", text: "VOID CONCEPT", style: "font-serif italic text-purple-400" },
  { id: "nebula-flame", name: "Nebula Flame", text: "🔥 NEBULA", style: "font-bold text-red-500 animate-pulse" }
];

const GARMENT_COLORS = [
  { name: "Void Black", hex: "#080808" },
  { name: "Arctic White", hex: "#f3f4f6" },
  { name: "Cyber Green", hex: "#B1F310" },
  { name: "Acid Purple", hex: "#7c3aed" },
  { name: "Crimson Red", hex: "#dc2626" }
];

export default function CreateYourOwnPage() {
  const { addToCart } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Customizer States
  const [productType, setProductType] = useState<"tshirt" | "hoodie">("tshirt");
  const [selectedColor, setSelectedColor] = useState(GARMENT_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  
  // Customization Layers
  const [decalType, setDecalType] = useState<"none" | "preset" | "upload">("none");
  const [selectedDecal, setSelectedDecal] = useState(PRESET_DECALS[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Custom Text Layer
  const [hasCustomText, setHasCustomText] = useState(false);
  const [customText, setCustomText] = useState("CYBERSPACE");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textFont, setTextFont] = useState("font-heading"); // font-heading is Oswald, font-sans is Montserrat
  
  // Transform Sliders (Scales & Positions)
  const [graphicScale, setGraphicScale] = useState(100);
  const [graphicYPos, setGraphicYPos] = useState(40); // % from top
  const [graphicXPos, setGraphicXPos] = useState(50); // % from left
  
  const [textYPos, setTextYPos] = useState(60); // % from top
  const [textXPos, setTextXPos] = useState(50); // % from left
  const [textSize, setTextSize] = useState(16); // px

  // UI state
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"garment" | "design" | "text">("garment");

  // Calculate customized price
  const basePrice = productType === "tshirt" ? 50 : 85;
  const graphicFee = decalType !== "none" ? 15 : 0;
  const textFee = hasCustomText ? 10 : 0;
  const totalPrice = basePrice + graphicFee + textFee;

  // Handle custom image uploads
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
    setTextSize(16);
  };

  const handleAddToBag = () => {
    setIsAdding(true);
    
    // Create detailed customizable product details
    const customConfigName = `CUSTOM ${productType.toUpperCase()} (${selectedColor.name})`;
    const customId = `custom-${productType}-${Date.now()}`;
    
    // Select placeholder image representation based on type and color
    const itemImage = productType === "tshirt" ? "/prod-tee.png" : "/prod-hoodie.png";

    setTimeout(() => {
      addToCart({
        id: customId,
        name: customConfigName,
        price: totalPrice,
        size: selectedSize,
        image: itemImage
      }, 1);
      
      setIsAdding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030303] text-white flex flex-col justify-between overflow-x-hidden font-sans z-10 selection:bg-brand-green selection:text-brand-black">
      <Navbar />

      {/* Futuristic Blur Glow Background */}
      <div className="absolute top-[15%] left-[-10%] w-[500px] h-[500px] bg-radial from-[#B1F310]/5 via-transparent to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-radial from-[#B1F310]/4 via-transparent to-transparent blur-[140px] pointer-events-none z-0" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 z-10 relative flex-1">
        {/* Header Title */}
        <header className="mb-10 text-center space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-green font-bold block">
            Custom Design Studio
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black uppercase tracking-widest text-white">
            DESIGN YOUR OWN
          </h1>
          <p className="text-gray-400 text-xs font-sans max-w-xl mx-auto">
            Design premium high-fidelity cyber wear. Select base blanks, place design decals, or upload your custom graphics instantly.
          </p>
        </header>

        {/* Customizer Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Side: Live Interactive Garment Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full aspect-[4/5] sm:aspect-square bg-white/[0.01] border border-white/10 rounded-[32px] relative flex items-center justify-center overflow-hidden p-8 shadow-[inset_0_0_80px_rgba(255,255,255,0.02)]">
              
              {/* Subtle grid pattern background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

              {/* Live Render Area */}
              <div className="w-full max-w-[320px] sm:max-w-[420px] aspect-square relative flex items-center justify-center">
                
                {/* SVG Garment Silhouette Layer */}
                {productType === "tshirt" ? (
                  <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] filter">
                    <path
                      d="M80,50 L110,40 C115,55 135,55 140,40 L170,50 L220,70 L200,110 L175,100 L175,260 C175,265 170,270 165,270 L85,270 C80,270 75,265 75,260 L75,100 L50,110 L30,70 Z"
                      fill={selectedColor.hex}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="2"
                      className="transition-colors duration-500"
                    />
                    {/* Realism fold overlay lines */}
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
                    {/* Sleeves & Main Body */}
                    <path
                      d="M70,80 L110,70 L190,70 L230,80 L255,150 L225,160 L200,135 L200,260 C200,265 195,270 190,270 L110,270 C105,270 100,265 100,260 L100,135 L75,160 L45,150 Z"
                      fill={selectedColor.hex}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="2"
                      className="transition-colors duration-500"
                    />
                    {/* Kangaroo Pocket */}
                    <path
                      d="M115,190 L185,190 C187,190 190,193 192,197 L198,230 C199,235 195,240 190,240 L110,240 C105,240 101,235 102,230 L108,197 C110,193 113,190 115,190 Z"
                      fill="none"
                      stroke="rgba(0,0,0,0.25)"
                      strokeWidth="2"
                    />
                    {/* Hood Overlay */}
                    <path
                      d="M105,70 C105,15 195,15 195,70"
                      fill={selectedColor.hex}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="2"
                    />
                    {/* Hood internal folds */}
                    <path
                      d="M130,70 C130,45 170,45 170,70"
                      fill="none"
                      stroke="rgba(0,0,0,0.3)"
                      strokeWidth="2"
                    />
                    {/* Ribbed bottom cuff */}
                    <path
                      d="M100,260 L200,260 M100,265 L200,265 M100,270 L200,270"
                      stroke="rgba(0,0,0,0.3)"
                      strokeWidth="1.5"
                    />
                  </svg>
                )}

                {/* Graphic Canvas Placement Layer (Absolute overlay container aligned relative to the chest) */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-[120px] h-[150px] relative mt-[-20px]">
                    
                    {/* Render Selected Decal / Graphic */}
                    {decalType === "preset" && (
                      <div 
                        style={{
                          top: `${graphicYPos}%`,
                          left: `${graphicXPos}%`,
                          transform: `translate(-50%, -50%) scale(${graphicScale / 100})`,
                          maxWidth: "100%",
                        }}
                        className={`absolute text-center select-none font-sans text-[10px] ${selectedDecal.style}`}
                      >
                        {selectedDecal.text}
                      </div>
                    )}

                    {decalType === "upload" && uploadedImage && (
                      <div
                        style={{
                          top: `${graphicYPos}%`,
                          left: `${graphicXPos}%`,
                          transform: `translate(-50%, -50%) scale(${graphicScale / 100})`,
                          width: "50px",
                          height: "50px",
                        }}
                        className="absolute select-none pointer-events-none"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={uploadedImage} 
                          alt="custom graphic overlay" 
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
                          color: textColor,
                          fontSize: `${textSize}px`,
                        }}
                        className={`absolute font-black tracking-wider uppercase select-none text-center ${textFont}`}
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
              <span>Use the adjustment controls in the sidebar panel to scale, position, and customize your decals or graphics exactly to your liking.</span>
            </div>
          </div>

          {/* Right Side: Options and Sliders Dashboard */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 rounded-[24px] border border-white/10 bg-white/[0.01] space-y-6">
              
              {/* Pricing & Cart Status Summary */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xs font-mono uppercase text-gray-500 tracking-wider">Estimated Total</h3>
                  <div className="text-3xl font-heading font-black text-brand-green mt-1 tracking-wider">${totalPrice}.00</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono bg-white/5 px-2.5 py-1 rounded text-gray-400 border border-white/5">
                    {productType.toUpperCase()} + {graphicFee > 0 ? "GRAPHIC" : "NO DECAL"}
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
                    {/* Garment Selector */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono">Select Base Blank</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setProductType("tshirt")}
                          className={`p-4 border rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-all ${
                            productType === "tshirt" ? "border-brand-green bg-brand-green/10" : "border-white/10 hover:border-white/20 bg-white/5"
                          }`}
                        >
                          <span className="text-xs font-bold uppercase tracking-wider">Premium Tee</span>
                          <span className="text-[10px] text-gray-500 font-mono font-bold">$50.00</span>
                        </button>
                        <button
                          onClick={() => setProductType("hoodie")}
                          className={`p-4 border rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-all ${
                            productType === "hoodie" ? "border-brand-green bg-brand-green/10" : "border-white/10 hover:border-white/20 bg-white/5"
                          }`}
                        >
                          <span className="text-xs font-bold uppercase tracking-wider">Heavy Hoodie</span>
                          <span className="text-[10px] text-gray-500 font-mono font-bold">$85.00</span>
                        </button>
                      </div>
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
                    {/* Decal Option Selector */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono">Graphic Source</label>
                      <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                        <button
                          onClick={() => setDecalType("none")}
                          className={`py-2.5 border rounded-xl cursor-pointer ${
                            decalType === "none" ? "border-brand-green bg-brand-green/10 text-white" : "border-white/10 text-gray-400 hover:text-white"
                          }`}
                        >
                          None
                        </button>
                        <button
                          onClick={() => setDecalType("preset")}
                          className={`py-2.5 border rounded-xl cursor-pointer ${
                            decalType === "preset" ? "border-brand-green bg-brand-green/10 text-white" : "border-white/10 text-gray-400 hover:text-white"
                          }`}
                        >
                          Presets (+ $15)
                        </button>
                        <button
                          onClick={() => {
                            if (fileInputRef.current) fileInputRef.current.click();
                          }}
                          className={`py-2.5 border rounded-xl cursor-pointer flex items-center justify-center gap-1.5 ${
                            decalType === "upload" ? "border-brand-green bg-brand-green/10 text-white" : "border-white/10 text-gray-400 hover:text-white"
                          }`}
                        >
                          <Upload size={10} />
                          Upload (+ $15)
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Preset decal selection */}
                    {decalType === "preset" && (
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono">Select Preset decal</label>
                        <div className="grid grid-cols-2 gap-2">
                          {PRESET_DECALS.map((preset) => (
                            <button
                              key={preset.id}
                              onClick={() => setSelectedDecal(preset)}
                              className={`p-3 border rounded-xl text-left cursor-pointer transition-all ${
                                selectedDecal.id === preset.id ? "border-brand-green bg-brand-green/10 text-brand-green" : "border-white/10 hover:bg-white/5"
                              }`}
                            >
                              <span className="text-[10px] font-mono tracking-widest font-black uppercase">{preset.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Graphic Sliders Control */}
                    {decalType !== "none" && (
                      <div className="space-y-4 border-t border-white/5 pt-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-green font-mono flex items-center gap-1">
                          <Sliders size={12} />
                          Adjust Decal Layout
                        </h4>
                        
                        {/* Scale Slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-mono text-gray-400">
                            <span>Decal Scale</span>
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
                            <span>Vertical Align (Y)</span>
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
                            <span>Horizontal Align (X)</span>
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
                      <label className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-mono">Custom Text Layer (+ $10)</label>
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
                        {/* Text Field Input */}
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 font-mono">Input Custom Text</label>
                          <input
                            type="text"
                            maxLength={16}
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                            className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-mono uppercase tracking-widest focus:outline-none focus:border-brand-green text-white"
                          />
                        </div>

                        {/* Font Selector */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 font-mono">Futuristic Font Style</label>
                          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                            <button
                              onClick={() => setTextFont("font-heading")}
                              className={`py-2 border rounded-xl cursor-pointer ${
                                textFont === "font-heading" ? "border-brand-green bg-brand-green/10" : "border-white/10 text-gray-400 hover:text-white"
                              }`}
                            >
                              Oswald
                            </button>
                            <button
                              onClick={() => setTextFont("font-sans")}
                              className={`py-2 border rounded-xl cursor-pointer ${
                                textFont === "font-sans" ? "border-brand-green bg-brand-green/10" : "border-white/10 text-gray-400 hover:text-white"
                              }`}
                            >
                              Montserrat
                            </button>
                          </div>
                        </div>

                        {/* Color Selector */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 font-mono">Text Color</label>
                          <div className="flex gap-2">
                            {["#ffffff", "#B1F310", "#a78bfa", "#f87171"].map((color) => (
                              <button
                                key={color}
                                onClick={() => setTextColor(color)}
                                style={{ backgroundColor: color }}
                                className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                                  textColor === color ? "border-brand-green scale-110" : "border-white/20"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Text Position Sliders */}
                        <div className="space-y-3 pt-2">
                          {/* Size */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] font-mono text-gray-400">
                              <span>Font Size</span>
                              <span>{textSize}px</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="24"
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
                              min="35"
                              max="65"
                              value={textXPos}
                              onChange={(e) => setTextXPos(Number(e.target.value))}
                              className="w-full accent-brand-green"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Actions Panel */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <button
                  onClick={handleAddToBag}
                  disabled={isAdding}
                  className="w-full py-4 bg-brand-green text-brand-black font-heading font-black uppercase tracking-widest text-xs rounded-full hover:bg-white hover:shadow-[0_0_20px_rgba(177,243,16,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isAdding ? (
                    <span>PACKAGING CUSTOM ORDER...</span>
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

      </main>
      <Footer />
    </div>
  );
}
