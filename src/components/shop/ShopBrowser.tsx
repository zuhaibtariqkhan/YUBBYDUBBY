"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, ChevronDown, ChevronUp, X, SlidersHorizontal, 
  Check, Search, Star, Loader2, RefreshCw, ShoppingBag 
} from "lucide-react";
import ProductCard from "../ui/ProductCard";
import { CURRENCY_SYMBOL } from "@/lib/utils";

// Map names/slugs to color hex codes for circular swatches
const COLOR_HEX_MAP: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  "french navy": "#1D2A44",
  navy: "#0A1830",
  stone: "#C2B7A1",
  grey: "#808080",
  gray: "#808080",
  red: "#DC2626",
  blue: "#2563EB",
  green: "#16A34A",
  yellow: "#FACC15",
  orange: "#EA580C",
  pink: "#DB2777",
  purple: "#9333EA",
  charcoal: "#36454F",
  beige: "#F5F5DC",
  khaki: "#F0E68C",
  olive: "#808000"
};

// Interface definitions matching the dynamic API schemas
interface CategoryFilterItem {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
}

interface TagFilterItem {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface FilterMetadata {
  categories: CategoryFilterItem[];
  tags: TagFilterItem[];
  attributes: {
    colors: string[];
    sizes: string[];
    materials: string[];
    brands: string[];
  };
  priceRange: {
    min: number;
    max: number;
  };
}

interface ProductDetailItem {
  id: string;
  name: string;
  price: number;
  regularPrice?: number;
  image: string;
  tag: string;
  rating: number;
  availability: string;
  discount: number;
  colors: string[];
  sizes: string[];
  materials: string[];
  brands: string[];
  tags: string[];
}

interface ShopBrowserProps {
  initialMainCategories?: any[];
}

export default function ShopBrowser({ initialMainCategories }: ShopBrowserProps = {}) {
  // --- Core State Management ---
  const [metaLoading, setMetaLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter options returned from WooCommerce metadata
  const [metadata, setMetadata] = useState<FilterMetadata>({
    categories: [],
    tags: [],
    attributes: { colors: [], sizes: [], materials: [], brands: [] },
    priceRange: { min: 0, max: 3000 }
  });

  const [products, setProducts] = useState<ProductDetailItem[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);

  // --- Active Filter Selections ---
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<[number, number]>([0, 3000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<number | null>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // UI States
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    price: true,
    colors: true,
    sizes: true,
    brands: false,
    materials: false,
    rating: false,
    discount: false,
    availability: false,
    tags: false
  });
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Debouncing handlers for price range and text search inputs
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 400);
    return () => clearTimeout(handler);
  }, [priceRange]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Expandable subcategories toggle tracker
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

  const toggleCategoryExpand = (catId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // --- Fetch Filter Metadata from WooCommerce on mount ---
  useEffect(() => {
    fetch('/api/shop/filters')
      .then(res => {
        if (!res.ok) throw new Error("Failed to load filter metadata");
        return res.json();
      })
      .then((data: FilterMetadata) => {
        setMetadata(data);
        
        // Parse URL search params to initial states
        const params = new URLSearchParams(window.location.search);
        const categories = params.get('categories');
        const minP = params.get('min_price');
        const maxP = params.get('max_price');
        const colors = params.get('colors');
        const sizes = params.get('sizes');
        const materials = params.get('materials');
        const brands = params.get('brands');
        const tags = params.get('tags');
        const rating = params.get('rating');
        const discount = params.get('discount');
        const availability = params.get('availability');
        const sort = params.get('sort_by');
        const searchQ = params.get('search');

        // Set state values with fallbacks matching metadata price ranges
        if (categories) setSelectedCategories(categories.split(',').map(Number));
        if (colors) setSelectedColors(colors.split(','));
        if (sizes) setSelectedSizes(sizes.split(','));
        if (materials) setSelectedMaterials(materials.split(','));
        if (brands) setSelectedBrands(brands.split(','));
        if (tags) setSelectedTags(tags.split(','));
        if (rating) setSelectedRating(Number(rating));
        if (discount) setSelectedDiscount(Number(discount));
        if (availability) setSelectedAvailability(availability.split(','));
        if (sort) setSortBy(sort);
        if (searchQ) setSearchQuery(searchQ);

        const initialMin = minP ? Number(minP) : data.priceRange.min;
        const initialMax = maxP ? Number(maxP) : data.priceRange.max;
        setPriceRange([initialMin, initialMax]);
        setDebouncedPriceRange([initialMin, initialMax]);
        
        setIsMounted(true);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load filter options. Sandbox mode active.");
      })
      .finally(() => {
        setMetaLoading(false);
      });
  }, []);

  // --- Fetch products dynamically whenever filters or sorting parameters change ---
  useEffect(() => {
    if (!isMounted) return;

    setProductsLoading(true);
    const params = new URLSearchParams();

    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    
    // Only set price limits if they deviate from absolute metadata boundaries
    if (debouncedPriceRange[0] !== metadata.priceRange.min) params.set('min_price', debouncedPriceRange[0].toString());
    if (debouncedPriceRange[1] !== metadata.priceRange.max) params.set('max_price', debouncedPriceRange[1].toString());
    
    if (selectedColors.length > 0) params.set('colors', selectedColors.join(','));
    if (selectedSizes.length > 0) params.set('sizes', selectedSizes.join(','));
    if (selectedMaterials.length > 0) params.set('materials', selectedMaterials.join(','));
    if (selectedBrands.length > 0) params.set('brands', selectedBrands.join(','));
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    if (selectedRating !== null) params.set('rating', selectedRating.toString());
    if (selectedDiscount !== null) params.set('discount', selectedDiscount.toString());
    if (selectedAvailability.length > 0) params.set('availability', selectedAvailability.join(','));
    if (sortBy !== 'featured') params.set('sort_by', sortBy);
    if (debouncedSearchQuery) params.set('search', debouncedSearchQuery);

    // Sync state values directly into URL without full page reload
    const currentParamsString = params.toString();
    const newUrl = `${window.location.pathname}${currentParamsString ? '?' + currentParamsString : ''}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    fetch(`/api/shop/products?${currentParamsString}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load products list");
        return res.json();
      })
      .then(data => {
        setProducts(data.products || []);
        setTotalProducts(data.totalCount || 0);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        setProductsLoading(false);
      });
  }, [
    selectedCategories, debouncedPriceRange, selectedColors, selectedSizes, 
    selectedMaterials, selectedBrands, selectedTags, selectedRating, 
    selectedDiscount, selectedAvailability, sortBy, debouncedSearchQuery, 
    isMounted, metadata.priceRange
  ]);

  // --- Accordion Section Toggle helper ---
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // --- Toggle Multi-select values ---
  const toggleFilter = (list: any[], setList: Function, value: any) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  // --- Remove Single Active Filter Chip ---
  const removeFilter = (id: string, type: string, value?: any) => {
    switch (type) {
      case 'category':
        setSelectedCategories(selectedCategories.filter(c => c !== value));
        break;
      case 'price':
        setPriceRange([metadata.priceRange.min, metadata.priceRange.max]);
        break;
      case 'color':
        setSelectedColors(selectedColors.filter(c => c !== value));
        break;
      case 'size':
        setSelectedSizes(selectedSizes.filter(s => s !== value));
        break;
      case 'material':
        setSelectedMaterials(selectedMaterials.filter(m => m !== value));
        break;
      case 'brand':
        setSelectedBrands(selectedBrands.filter(b => b !== value));
        break;
      case 'tag':
        setSelectedTags(selectedTags.filter(t => t !== value));
        break;
      case 'rating':
        setSelectedRating(null);
        break;
      case 'discount':
        setSelectedDiscount(null);
        break;
      case 'availability':
        setSelectedAvailability(selectedAvailability.filter(a => a !== value));
        break;
      case 'search':
        setSearchQuery("");
        break;
    }
  };

  // --- Clear All Filters Reset ---
  const handleClearAll = () => {
    setSelectedCategories([]);
    setPriceRange([metadata.priceRange.min, metadata.priceRange.max]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedMaterials([]);
    setSelectedBrands([]);
    setSelectedTags([]);
    setSelectedRating(null);
    setSelectedDiscount(null);
    setSelectedAvailability([]);
    setSearchQuery("");
  };

  // --- Build List of Active Filter Chips ---
  const getActiveFiltersList = () => {
    const list: Array<{ id: string; label: string; type: string; value?: any }> = [];
    
    if (searchQuery) {
      list.push({ id: 'search', label: `Search: "${searchQuery}"`, type: 'search' });
    }

    selectedCategories.forEach(cid => {
      const cat = metadata.categories.find(c => c.id === cid);
      if (cat) list.push({ id: `cat-${cid}`, label: cat.name, type: 'category', value: cid });
    });

    if (priceRange[0] !== metadata.priceRange.min || priceRange[1] !== metadata.priceRange.max) {
      list.push({ 
        id: 'price', 
        label: `${CURRENCY_SYMBOL}${priceRange[0]} - ${CURRENCY_SYMBOL}${priceRange[1]}`, 
        type: 'price' 
      });
    }

    selectedColors.forEach(col => {
      list.push({ id: `col-${col}`, label: col, type: 'color', value: col });
    });

    selectedSizes.forEach(sz => {
      list.push({ id: `sz-${sz}`, label: `Size: ${sz}`, type: 'size', value: sz });
    });

    selectedMaterials.forEach(m => {
      list.push({ id: `mat-${m}`, label: m, type: 'material', value: m });
    });

    selectedBrands.forEach(b => {
      list.push({ id: `brand-${b}`, label: b, type: 'brand', value: b });
    });

    selectedTags.forEach(t => {
      list.push({ id: `tag-${t}`, label: t, type: 'tag', value: t });
    });

    if (selectedRating !== null) {
      list.push({ id: 'rating', label: `${selectedRating}★ & Above`, type: 'rating' });
    }

    if (selectedDiscount !== null) {
      list.push({ id: 'discount', label: `${selectedDiscount}%+ Off`, type: 'discount' });
    }

    selectedAvailability.forEach(av => {
      const label = av === 'instock' ? 'In Stock' : av === 'outofstock' ? 'Out of Stock' : 'Pre-order';
      list.push({ id: `avail-${av}`, label, type: 'availability', value: av });
    });

    return list;
  };

  const activeFilters = getActiveFiltersList();

  // Helper to check if a category is parent
  const parentCategories = metadata.categories.filter(c => c.parent === 0);
  const getSubcategories = (parentId: number) => metadata.categories.filter(c => c.parent === parentId);

  // Search filter for brands list if long
  const filteredBrands = metadata.attributes.brands.filter(b => 
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  // --- Render Accordion Header ---
  const renderAccordionHeader = (title: string, section: string, isEmpty = false) => {
    if (isEmpty) return null;
    const isExpanded = expandedSections[section];
    return (
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between py-3.5 border-b border-white/5 text-[10px] font-mono font-bold uppercase tracking-widest text-gray-300 hover:text-brand-green transition-colors select-none text-left"
      >
        <span>{title}</span>
        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
    );
  };

  // --- Main Sidebar Filters Content ---
  const renderFiltersContent = () => (
    <div className="space-y-4">
      {/* 1. Category Tree Filter */}
      <div className="border-b border-white/5 pb-2">
        {renderAccordionHeader("Categories", "categories", parentCategories.length === 0)}
        <AnimatePresence initial={false}>
          {expandedSections.categories && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-3 space-y-2 text-sm font-sans"
            >
              {parentCategories.map(parent => {
                const subs = getSubcategories(parent.id);
                const isSelected = selectedCategories.includes(parent.id);
                const isExpanded = !!expandedCategories[parent.id];
                
                return (
                  <div key={parent.id} className="space-y-1">
                    <div 
                      onClick={() => toggleFilter(selectedCategories, setSelectedCategories, parent.id)}
                      className="flex items-center justify-between group cursor-pointer py-1 px-1.5 rounded hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded border border-white/20 flex items-center justify-center transition-all ${
                          isSelected ? 'bg-brand-green border-brand-green text-brand-black' : 'group-hover:border-white/40'
                        }`}>
                          {isSelected && <Check size={10} strokeWidth={3} />}
                        </div>
                        <span className={`text-xs uppercase font-medium tracking-wide ${isSelected ? 'text-brand-green font-semibold' : 'text-gray-300'}`}>
                          {parent.name}
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono">({parent.count || 0})</span>
                      </div>
                      {subs.length > 0 && (
                        <button
                          onClick={(e) => toggleCategoryExpand(parent.id, e)}
                          className="p-1 hover:bg-white/10 rounded transition-colors text-gray-500 hover:text-white"
                        >
                          <ChevronRight size={10} className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Render Expandable Subcategories */}
                    <AnimatePresence>
                      {isExpanded && subs.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-5 space-y-1 pt-0.5 border-l border-white/5 ml-3"
                        >
                          {subs.map(sub => {
                            const isSubSelected = selectedCategories.includes(sub.id);
                            return (
                              <div
                                key={sub.id}
                                onClick={() => toggleFilter(selectedCategories, setSelectedCategories, sub.id)}
                                className="flex items-center gap-2 py-0.5 cursor-pointer group hover:text-white transition-colors"
                              >
                                <div className={`w-3 h-3 rounded-[3px] border border-white/20 flex items-center justify-center transition-all ${
                                  isSubSelected ? 'bg-brand-green border-brand-green text-brand-black' : 'group-hover:border-white/40'
                                }`}>
                                  {isSubSelected && <Check size={8} strokeWidth={3} />}
                                </div>
                                <span className={`text-[11px] ${isSubSelected ? 'text-brand-green font-semibold' : 'text-gray-400 group-hover:text-white'}`}>
                                  {sub.name}
                                </span>
                                <span className="text-[8px] text-gray-600 font-mono">({sub.count || 0})</span>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Interactive Price Range Filter */}
      <div className="border-b border-white/5 pb-4">
        {renderAccordionHeader("Price Range", "price")}
        <AnimatePresence initial={false}>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-4 space-y-4"
            >
              {/* Dual Range Native Slider Overlay */}
              <div className="relative w-full h-1 bg-white/10 rounded-full my-4">
                <div 
                  className="absolute h-full bg-brand-green rounded-full"
                  style={{
                    left: `${((priceRange[0] - metadata.priceRange.min) / (metadata.priceRange.max - metadata.priceRange.min)) * 100}%`,
                    right: `${100 - ((priceRange[1] - metadata.priceRange.min) / (metadata.priceRange.max - metadata.priceRange.min)) * 100}%`
                  }}
                />
                <input
                  type="range"
                  min={metadata.priceRange.min}
                  max={metadata.priceRange.max}
                  value={priceRange[0]}
                  onChange={(e) => {
                    const val = Math.min(Number(e.target.value), priceRange[1] - 10);
                    setPriceRange([val, priceRange[1]]);
                  }}
                  className="range-slider-input absolute pointer-events-none appearance-none z-20 w-full h-1 bg-transparent top-0 left-0"
                />
                <input
                  type="range"
                  min={metadata.priceRange.min}
                  max={metadata.priceRange.max}
                  value={priceRange[1]}
                  onChange={(e) => {
                    const val = Math.max(Number(e.target.value), priceRange[0] + 10);
                    setPriceRange([priceRange[0], val]);
                  }}
                  className="range-slider-input absolute pointer-events-none appearance-none z-20 w-full h-1 bg-transparent top-0 left-0"
                />
              </div>

              {/* Number Inputs */}
              <div className="flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex-1 space-y-1">
                  <span className="text-[8px] text-gray-500 uppercase tracking-wider block">Min Price</span>
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-gray-500">{CURRENCY_SYMBOL}</span>
                    <input
                      type="number"
                      min={metadata.priceRange.min}
                      max={metadata.priceRange.max}
                      value={priceRange[0]}
                      onChange={(e) => {
                        const val = Math.min(Math.max(Number(e.target.value), metadata.priceRange.min), priceRange[1] - 1);
                        setPriceRange([val, priceRange[1]]);
                      }}
                      className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white font-semibold focus:outline-none focus:border-brand-green/30"
                    />
                  </div>
                </div>
                <div className="h-4 w-2 border-b border-white/20 mt-4" />
                <div className="flex-1 space-y-1">
                  <span className="text-[8px] text-gray-500 uppercase tracking-wider block">Max Price</span>
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-gray-500">{CURRENCY_SYMBOL}</span>
                    <input
                      type="number"
                      min={metadata.priceRange.min}
                      max={metadata.priceRange.max}
                      value={priceRange[1]}
                      onChange={(e) => {
                        const val = Math.max(Math.min(Number(e.target.value), metadata.priceRange.max), priceRange[0] + 1);
                        setPriceRange([priceRange[0], val]);
                      }}
                      className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white font-semibold focus:outline-none focus:border-brand-green/30"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Circular Color Swatches */}
      <div className="border-b border-white/5 pb-2">
        {renderAccordionHeader("Colors", "colors", metadata.attributes.colors.length === 0)}
        <AnimatePresence initial={false}>
          {expandedSections.colors && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-3 pb-2"
            >
              <div className="grid grid-cols-5 gap-2.5">
                {metadata.attributes.colors.map(color => {
                  const isSelected = selectedColors.includes(color);
                  const hex = COLOR_HEX_MAP[color.toLowerCase()] || "#4b5563";
                  const isWhite = color.toLowerCase() === 'white';
                  
                  return (
                    <button
                      key={color}
                      onClick={() => toggleFilter(selectedColors, setSelectedColors, color)}
                      className={`group relative aspect-square rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-110 cursor-pointer ${
                        isSelected 
                          ? 'border-brand-green scale-105 shadow-[0_0_10px_rgba(177,243,16,0.3)]' 
                          : 'border-white/10 hover:border-white/30'
                      }`}
                      title={color}
                    >
                      <span 
                        className="w-[80%] h-[80%] rounded-full block border"
                        style={{ 
                          backgroundColor: hex, 
                          borderColor: isWhite ? 'rgba(0,0,0,0.1)' : 'transparent' 
                        }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check 
                            size={10} 
                            className={isWhite ? 'text-black' : 'text-white'} 
                            strokeWidth={4} 
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Sizes Button Grid */}
      <div className="border-b border-white/5 pb-2">
        {renderAccordionHeader("Sizes", "sizes", metadata.attributes.sizes.length === 0)}
        <AnimatePresence initial={false}>
          {expandedSections.sizes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-3 pb-2"
            >
              <div className="grid grid-cols-4 gap-2">
                {metadata.attributes.sizes.map(size => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleFilter(selectedSizes, setSelectedSizes, size)}
                      className={`h-9 border rounded-xl font-heading text-xs font-bold flex items-center justify-center uppercase transition-all tracking-wider cursor-pointer ${
                        isSelected 
                          ? 'bg-brand-green text-brand-black border-brand-green shadow-[0_0_10px_rgba(177,243,16,0.2)] font-black' 
                          : 'border-white/10 text-gray-300 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Brand Filter with search option */}
      <div className="border-b border-white/5 pb-2">
        {renderAccordionHeader("Brands", "brands", metadata.attributes.brands.length === 0)}
        <AnimatePresence initial={false}>
          {expandedSections.brands && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-3 space-y-3 pb-2"
            >
              {/* Optional Search bar inside brands */}
              {metadata.attributes.brands.length > 5 && (
                <div className="relative flex items-center">
                  <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search brand..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="w-full pl-7 pr-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] focus:outline-none focus:border-brand-green/30"
                  />
                </div>
              )}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {filteredBrands.map(brand => {
                  const isSelected = selectedBrands.includes(brand);
                  return (
                    <div
                      key={brand}
                      onClick={() => toggleFilter(selectedBrands, setSelectedBrands, brand)}
                      className="flex items-center gap-2 cursor-pointer group hover:text-white transition-colors"
                    >
                      <div className={`w-3.5 h-3.5 rounded border border-white/20 flex items-center justify-center transition-all ${
                        isSelected ? 'bg-brand-green border-brand-green text-brand-black' : 'group-hover:border-white/40'
                      }`}>
                        {isSelected && <Check size={10} strokeWidth={3} />}
                      </div>
                      <span className={`text-xs ${isSelected ? 'text-brand-green font-semibold' : 'text-gray-400 group-hover:text-white'}`}>
                        {brand}
                      </span>
                    </div>
                  );
                })}
                {filteredBrands.length === 0 && (
                  <div className="text-[10px] text-gray-600 font-mono">No matching brands.</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 6. Material Filter */}
      <div className="border-b border-white/5 pb-2">
        {renderAccordionHeader("Material", "materials", metadata.attributes.materials.length === 0)}
        <AnimatePresence initial={false}>
          {expandedSections.materials && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-3 space-y-2 pb-2"
            >
              {metadata.attributes.materials.map(mat => {
                const isSelected = selectedMaterials.includes(mat);
                return (
                  <div
                    key={mat}
                    onClick={() => toggleFilter(selectedMaterials, setSelectedMaterials, mat)}
                    className="flex items-center gap-2 cursor-pointer group hover:text-white transition-colors"
                  >
                    <div className={`w-3.5 h-3.5 rounded border border-white/20 flex items-center justify-center transition-all ${
                      isSelected ? 'bg-brand-green border-brand-green text-brand-black' : 'group-hover:border-white/40'
                    }`}>
                      {isSelected && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span className={`text-xs ${isSelected ? 'text-brand-green font-semibold' : 'text-gray-400 group-hover:text-white'}`}>
                      {mat}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 7. Star Ratings Filter */}
      <div className="border-b border-white/5 pb-2">
        {renderAccordionHeader("Customer Rating", "rating")}
        <AnimatePresence initial={false}>
          {expandedSections.rating && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-3 space-y-2 pb-2"
            >
              {[5, 4, 3].map(stars => {
                const isSelected = selectedRating === stars;
                return (
                  <button
                    key={stars}
                    onClick={() => setSelectedRating(isSelected ? null : stars)}
                    className={`w-full flex items-center justify-between text-left group cursor-pointer py-1 px-1.5 rounded hover:bg-white/5 transition-colors`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5 text-brand-green">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={11} 
                            className={i < stars ? "fill-brand-green text-brand-green" : "text-white/10"} 
                          />
                        ))}
                      </div>
                      <span className={`text-xs font-mono ${isSelected ? 'text-brand-green font-bold' : 'text-gray-400 group-hover:text-white'}`}>
                        {stars === 5 ? "Only 5★" : `${stars}★ & above`}
                      </span>
                    </div>
                    {isSelected && <Check size={11} className="text-brand-green" strokeWidth={3} />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 8. Discounts Filter */}
      <div className="border-b border-white/5 pb-2">
        {renderAccordionHeader("Discounts", "discount")}
        <AnimatePresence initial={false}>
          {expandedSections.discount && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-3 space-y-2 pb-2"
            >
              {[50, 30, 20, 10].map(pct => {
                const isSelected = selectedDiscount === pct;
                return (
                  <div
                    key={pct}
                    onClick={() => setSelectedDiscount(isSelected ? null : pct)}
                    className="flex items-center gap-2 cursor-pointer group hover:text-white transition-colors py-0.5"
                  >
                    <div className={`w-3.5 h-3.5 rounded border border-white/20 flex items-center justify-center transition-all ${
                      isSelected ? 'bg-brand-green border-brand-green text-brand-black' : 'group-hover:border-white/40'
                    }`}>
                      {isSelected && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span className={`text-xs font-mono ${isSelected ? 'text-brand-green font-semibold' : 'text-gray-400 group-hover:text-white'}`}>
                      {pct}% Off or More
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 9. Availability Filter */}
      <div className="border-b border-white/5 pb-2">
        {renderAccordionHeader("Availability", "availability")}
        <AnimatePresence initial={false}>
          {expandedSections.availability && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-3 space-y-2 pb-2"
            >
              {[
                { key: 'instock', label: 'In Stock' },
                { key: 'outofstock', label: 'Out of Stock' },
                { key: 'onbackorder', label: 'Pre-order' }
              ].map(avail => {
                const isSelected = selectedAvailability.includes(avail.key);
                return (
                  <div
                    key={avail.key}
                    onClick={() => toggleFilter(selectedAvailability, setSelectedAvailability, avail.key)}
                    className="flex items-center gap-2 cursor-pointer group hover:text-white transition-colors"
                  >
                    <div className={`w-3.5 h-3.5 rounded border border-white/20 flex items-center justify-center transition-all ${
                      isSelected ? 'bg-brand-green border-brand-green text-brand-black' : 'group-hover:border-white/40'
                    }`}>
                      {isSelected && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span className={`text-xs ${isSelected ? 'text-brand-green font-semibold' : 'text-gray-400 group-hover:text-white'}`}>
                      {avail.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 10. Tags Filter */}
      {metadata.tags.length > 0 && (
        <div className="border-b border-white/5 pb-2">
          {renderAccordionHeader("Product Tags", "tags")}
          <AnimatePresence initial={false}>
            {expandedSections.tags && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-3 pb-2"
              >
                <div className="flex flex-wrap gap-1.5">
                  {metadata.tags.map(tag => {
                    const isSelected = selectedTags.includes(tag.name);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => toggleFilter(selectedTags, setSelectedTags, tag.name)}
                        className={`px-3 py-1 border rounded-lg text-[9px] uppercase font-mono tracking-widest cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-brand-green text-brand-black border-brand-green font-semibold'
                            : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {tag.name}
                        <span className="text-[8px] text-gray-500 ml-1">({tag.count || 0})</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );

  // Loading filter state skeleton
  if (metaLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
        <span className="text-xs uppercase font-mono tracking-widest text-gray-400">Loading catalog filters...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Header Control Bar (Search, Breadcrumbs, Mobile trigger) */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-[var(--radius-card)] backdrop-blur-md">
        {/* Search Bar Input */}
        <div className="relative flex-1 max-w-md flex items-center">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="SEARCH PRODUCTS OR CATEGORIES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-[var(--radius-dropdown)] border border-white/10 bg-white/5 text-xs font-mono uppercase tracking-wider text-white placeholder-gray-500 focus:outline-none focus:border-brand-green/30 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort By Dropdown selection */}
        <div className="flex items-center justify-between md:justify-end gap-3 font-mono text-[10px] uppercase tracking-widest text-gray-400 font-bold">
          {/* Mobile Filter Trigger Button */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 px-4.5 py-2.5 rounded-[var(--radius-dropdown)] border border-white/10 hover:border-brand-green bg-white/5 text-gray-200 hover:text-brand-green transition-all cursor-pointer shadow-[0_5px_15px_rgba(0,0,0,0.15)]"
          >
            <SlidersHorizontal size={12} />
            <span>Filters {activeFilters.length > 0 && `(${activeFilters.length})`}</span>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <span>Sort By</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 pl-4 pr-9 py-2.5 rounded-[var(--radius-dropdown)] text-white font-semibold focus:outline-none focus:border-brand-green/30 cursor-pointer shadow-md select-none pr-8 text-[10px] font-mono tracking-widest uppercase"
              >
                <option value="featured">Featured</option>
                <option value="best_selling">Best Selling</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Customer Rating</option>
                <option value="popularity_desc">Most Popular</option>
                <option value="title_asc">Alphabetically: A-Z</option>
                <option value="title_desc">Alphabetically: Z-A</option>
                <option value="discount_desc">Discount: High to Low</option>
                <option value="availability">Availability</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronDown size={10} strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Active Filter Chips Row */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2.5 bg-white/[0.005] border border-white/[0.02] p-3 rounded-2xl">
          <span className="text-[8px] font-mono font-bold text-gray-500 uppercase tracking-widest mr-1">Active Filters:</span>
          {activeFilters.map(f => (
            <button
              key={f.id}
              onClick={() => removeFilter(f.id, f.type, f.value)}
              className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:border-brand-green hover:text-brand-green px-3 py-1 rounded-full text-[9px] uppercase font-mono tracking-widest text-gray-300 transition-all cursor-pointer group shadow-sm"
            >
              <span>{f.label}</span>
              <X size={10} className="text-gray-500 group-hover:text-brand-green transition-colors" />
            </button>
          ))}
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1 text-[9px] uppercase font-mono font-bold tracking-widest text-brand-green hover:text-white transition-colors cursor-pointer border border-brand-green/20 hover:border-white/20 bg-brand-green/5 hover:bg-white/5 px-3 py-1 rounded-full ml-auto"
          >
            <RefreshCw size={10} />
            <span>Clear All</span>
          </button>
        </div>
      )}

      {/* 3. Main Grid layout: Sidebar (Desktop) + Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Left Sidebar: Collapsible accordion filters */}
        <aside className="hidden md:block col-span-1 bg-white/[0.01] border border-white/5 p-6 rounded-[var(--radius-card)] backdrop-blur-md space-y-6 sticky top-24 max-h-[85vh] overflow-y-auto shadow-xl pr-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <SlidersHorizontal size={12} className="text-brand-green" />
              Filters
            </span>
            {activeFilters.length > 0 && (
              <button 
                onClick={handleClearAll} 
                className="text-[9px] font-mono uppercase tracking-wider text-brand-green hover:underline cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
          {renderFiltersContent()}
        </aside>

        {/* Mobile Filter Slide-in Drawer Container */}
        <AnimatePresence>
          {isMobileFiltersOpen && (
            <>
              {/* Drawer Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileFiltersOpen(false)}
                className="fixed inset-0 bg-black z-40 md:hidden"
              />
              
              {/* Slide-in panel drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-[#0d0d0d] border-l border-white/10 z-50 md:hidden flex flex-col shadow-2xl"
              >
                {/* Header */}
                <div className="p-5 border-b border-white/10 flex justify-between items-center shrink-0">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-white flex items-center gap-2">
                    <SlidersHorizontal size={12} className="text-brand-green" />
                    Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
                  </span>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Filter content wrapper (scrollable body) */}
                <div className="flex-1 overflow-y-auto p-5 pb-24 scrollbar-hide">
                  {renderFiltersContent()}
                </div>

                {/* Sticky Drawer Footer actions */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/5 flex gap-3 shrink-0">
                  <button
                    onClick={handleClearAll}
                    disabled={activeFilters.length === 0}
                    className="flex-1 py-3 text-center rounded-[var(--radius-btn)] border border-white/10 hover:border-brand-green text-[10px] font-heading font-bold uppercase tracking-wider text-gray-300 hover:text-brand-green transition-all cursor-pointer bg-white/5 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="flex-1 py-3 text-center rounded-[var(--radius-btn)] bg-brand-green text-brand-black text-[10px] font-heading font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(177,243,16,0.3)]"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 4. Products Feed Display */}
        <div className="col-span-1 md:col-span-3 space-y-6">
          {/* Feed stats top header bar */}
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">
              Showing {products.length} of {totalProducts} Products
            </span>
          </div>

          <AnimatePresence mode="wait">
            {productsLoading ? (
              /* Loading Skeleton Grid */
              <motion.div
                key="skeleton-feed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {Array.from({ length: 6 }).map((_, idx) => (
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
            ) : products.length === 0 ? (
              /* Premium Empty State Illustration Layout */
              <motion.div
                key="empty-feed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white/[0.01] border border-white/5 rounded-[var(--radius-card)] backdrop-blur-sm max-w-xl mx-auto gap-5 shadow-2xl"
              >
                <div className="relative w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 hover:text-brand-green transition-colors duration-300">
                  <ShoppingBag size={36} strokeWidth={1} />
                  <div className="absolute inset-0 border border-brand-green/20 rounded-full scale-105 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-black text-lg uppercase tracking-wider text-white">
                    No products match your filters
                  </h3>
                  <p className="text-gray-500 font-sans text-xs max-w-sm leading-normal">
                    Try adjusting your price bounds, color swatches, size selections, or clean up terms to browse the full lineup.
                  </p>
                </div>
                <button
                  onClick={handleClearAll}
                  className="py-3 px-8 uppercase tracking-widest font-heading font-black text-[10px] rounded-[var(--radius-btn)] bg-brand-green hover:bg-brand-white text-brand-black hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(177,243,16,0.25)] hover:shadow-none cursor-pointer"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              /* Product Display Grid */
              <motion.div
                key="products-feed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      regularPrice={product.regularPrice}
                      image={product.image}
                      tag={product.tag}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
