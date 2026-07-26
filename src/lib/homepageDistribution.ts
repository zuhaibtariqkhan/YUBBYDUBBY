import { WooCommerceProduct } from "./woocommerce";

export interface FormattedProduct {
    id: string;
    name: string;
    price: number;
    regularPrice?: number;
    image: string;
    tag: string;
    category: string;
    categorySlugs: string[];
    dateCreated?: string;
    raw?: any;
}

export interface CategoryTreeItem {
    id: number;
    name: string;
    slug: string;
    parent: number;
}

export interface SectionDistributionResult {
    newArrivals: FormattedProduct[];
    categoryProducts: Record<string, FormattedProduct[]>;
    featuredProducts: FormattedProduct[];
}

/**
 * Fast Mulberry32 Pseudo-Random Number Generator for deterministic seeded randomness.
 */
export function mulberry32(seed: number) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Seeded array shuffle using Fisher-Yates and PRNG
 */
export function seededShuffle<T>(array: T[], seed: number): T[] {
    const copy = [...array];
    const random = mulberry32(seed);
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

/**
 * Category ID to Slug & Name mapping helper for fallback or API products
 */
const CATEGORY_ID_MAP: Record<number, { slug: string; name: string; parentSlug?: string }> = {
    11: { slug: "mens", name: "Mens" },
    111: { slug: "mens-t-shirts", name: "T-Shirts", parentSlug: "mens" },
    112: { slug: "mens-hoodies", name: "Hoodies", parentSlug: "mens" },
    113: { slug: "mens-jackets", name: "Jackets", parentSlug: "mens" },
    114: { slug: "mens-sweatshirts", name: "Sweatshirts", parentSlug: "mens" },
    115: { slug: "mens-tracksuits", name: "Tracksuits", parentSlug: "mens" },
    116: { slug: "mens-accessories", name: "Accessories", parentSlug: "mens" },

    22: { slug: "womens", name: "Womens" },
    221: { slug: "womens-t-shirts", name: "T-Shirts", parentSlug: "womens" },
    222: { slug: "womens-dresses", name: "Dresses", parentSlug: "womens" },
    223: { slug: "womens-hoodies", name: "Hoodies", parentSlug: "womens" },
    224: { slug: "womens-tops", name: "Tops", parentSlug: "womens" },
    225: { slug: "womens-accessories", name: "Accessories", parentSlug: "womens" },

    33: { slug: "kids", name: "Kids" },
    331: { slug: "kids-boys-clothing", name: "Boys Clothing", parentSlug: "kids" },
    332: { slug: "kids-girls-clothing", name: "Girls Clothing", parentSlug: "kids" },
    333: { slug: "kids-school-essentials", name: "School Essentials", parentSlug: "kids" },
    334: { slug: "kids-accessories", name: "Accessories", parentSlug: "kids" },

    44: { slug: "home-living", name: "Home & Living" },
    441: { slug: "home-wall-art", name: "Wall Art", parentSlug: "home-living" },
    442: { slug: "home-posters", name: "Posters", parentSlug: "home-living" },
    443: { slug: "home-mugs", name: "Mugs", parentSlug: "home-living" },
    444: { slug: "home-cushions", name: "Cushions", parentSlug: "home-living" },
    445: { slug: "home-bedding", name: "Bedding", parentSlug: "home-living" },
    446: { slug: "home-decor", name: "Decor", parentSlug: "home-living" },

    55: { slug: "accessories", name: "Accessories" },
    551: { slug: "accessories-tech-cases", name: "Tech Cases", parentSlug: "accessories" },
    552: { slug: "accessories-headwear", name: "Headwear", parentSlug: "accessories" },
    553: { slug: "accessories-misc", name: "Miscellaneous", parentSlug: "accessories" },
};

/**
 * Helper to normalize and format raw WooCommerce or API product objects
 */
export function formatProduct(prod: any): FormattedProduct {
    let image = prod.image || (prod.images && prod.images.length > 0 && prod.images[0]?.src ? prod.images[0].src : "");
    if (!image) {
        image = "/prod-hoodie.png";
        const title = (prod.name || "").toLowerCase();
        if (title.includes("iphone") || title.includes("phone") || title.includes("case")) {
            image = "/prod-phone-case.png";
        } else if (title.includes("airpod")) {
            image = "/prod-airpods-cover.png";
        } else if (title.includes("cap") || title.includes("hat")) {
            image = "/prod-cap.png";
        } else if (title.includes("sunglass") || title.includes("glasses")) {
            image = "/prod-sunglasses.png";
        } else if (title.includes("sticker")) {
            image = "/prod-stickers.png";
        }
    }

    let tag = prod.tag || "";
    if (!tag) {
        if (prod.on_sale || prod.onSale) {
            tag = "SALE";
        } else if (prod.tags?.some((t: any) => (typeof t === "string" ? t : t.slug).includes("new"))) {
            tag = "NEW";
        } else if (prod.tags?.some((t: any) => (typeof t === "string" ? t : t.slug).includes("best-seller") || (typeof t === "string" ? t : t.slug).includes("featured"))) {
            tag = "BEST SELLER";
        } else if (prod.tags?.some((t: any) => (typeof t === "string" ? t : t.slug).includes("limited"))) {
            tag = "LIMITED";
        } else {
            tag = "EXCLUSIVE";
        }
    }

    let categoryName = "Accessories";
    const categorySlugs: string[] = [];

    // Check categoryId mapping if provided
    if (prod.categoryId && CATEGORY_ID_MAP[prod.categoryId]) {
        const catInfo = CATEGORY_ID_MAP[prod.categoryId];
        categorySlugs.push(catInfo.slug);
        if (catInfo.parentSlug) categorySlugs.push(catInfo.parentSlug);
        categoryName = catInfo.name;
    }

    if (typeof prod.category === "string" && prod.category) {
        categoryName = prod.category;
        categorySlugs.push(prod.category.toLowerCase().replace(/\s+/g, "-"));
    }
    
    if (prod.categories && Array.isArray(prod.categories) && prod.categories.length > 0) {
        categoryName = typeof prod.categories[0] === "string" ? prod.categories[0] : prod.categories[0].name || "Accessories";
        prod.categories.forEach((cat: any) => {
            const slug = typeof cat === "string" ? cat.toLowerCase() : (cat.slug || cat.name || "").toLowerCase();
            if (slug) categorySlugs.push(slug);
        });
    }

    return {
        id: prod.id.toString(),
        name: (prod.name || "").toUpperCase(),
        price: typeof prod.price === "number" ? prod.price : parseFloat(prod.price) || 0,
        regularPrice: prod.regularPrice || (prod.regular_price ? parseFloat(prod.regular_price) : undefined),
        image,
        tag,
        category: categoryName,
        categorySlugs,
        dateCreated: prod.date_created || prod.dateCreated,
        raw: prod
    };
}

/**
 * Fallback subcategory mappings if dynamic category tree is loading
 */
const DEFAULT_SUBCATEGORY_MAP: Record<string, string[]> = {
    mens: ["mens-t-shirts", "mens-hoodies", "mens-jackets", "mens-sweatshirts", "mens-tracksuits", "mens-accessories", "mens-fashion", "men-fashion", "mens", "men"],
    womens: ["womens-t-shirts", "womens-dresses", "womens-hoodies", "womens-tops", "womens-accessories", "womens-fashion", "women-fashion", "womens", "women"],
    kids: ["kids-boys-clothing", "kids-girls-clothing", "kids-school-essentials", "kids-accessories", "kids-fashion", "kids"],
    "home-living": ["home-wall-art", "home-posters", "home-mugs", "home-cushions", "home-bedding", "home-decor", "home-living"],
    accessories: ["accessories-tech-cases", "accessories-headwear", "accessories-misc", "accessories"]
};

/**
 * Checks if a product belongs to a specific subcategory slug or keywords
 */
function productMatchesSubcategory(prod: FormattedProduct, subcatSlug: string): boolean {
    const slugs = prod.categorySlugs.map(s => s.toLowerCase());
    const catName = prod.category.toLowerCase();
    const prodName = prod.name.toLowerCase();
    const sub = subcatSlug.toLowerCase();

    const isWomen = slugs.some(s => s.includes("women") || s.includes("female") || s.includes("lady")) || catName.includes("women");
    const isKids = slugs.some(s => s.includes("kid") || s.includes("youth") || s.includes("child")) || catName.includes("kid");
    const isMen = (slugs.some(s => s === "mens" || s.startsWith("mens-") || s === "men" || s.startsWith("men-")) || (catName.includes("men") && !catName.includes("women"))) && !isWomen;

    // 1. If checking a Men's subcategory, reject Women's, Kids, or general Accessories products
    if (sub.startsWith("mens-") || sub === "mens" || sub === "men") {
        if (isWomen || isKids) return false;
        if (sub.includes("accessories") && !isMen && !slugs.some(s => s.includes("men"))) {
            return false;
        }
    }

    // 2. Direct or exact slug match
    if (slugs.some(s => s === sub)) return true;
    if (slugs.some(s => s.includes(sub) || sub.includes(s))) {
        if (sub.includes("accessories") && !isMen && (sub.startsWith("mens") || sub.startsWith("men"))) return false;
        return true;
    }

    // 3. Clean category name match (avoid matching generic "accessories" for gendered subcategories)
    const cleanSub = sub.replace(/^(home|mens|womens|kids|accessories)-/, "").replace(/-/g, " ");
    if (cleanSub !== "accessories" && cleanSub.length > 2) {
        if (catName.includes(cleanSub) || catName.includes(sub.replace(/-/g, " "))) {
            return true;
        }
    }

    // 4. Keyword heuristics
    if (sub.includes("t-shirt") || sub.includes("tshirt") || sub.includes("tee")) {
        return prodName.includes("tee") || prodName.includes("t-shirt") || prodName.includes("shirt");
    }
    if (sub.includes("hoodie")) return prodName.includes("hoodie");
    if (sub.includes("jacket") || sub.includes("coat")) return prodName.includes("jacket") || prodName.includes("overcoat") || prodName.includes("vest");
    if (sub.includes("dress")) return prodName.includes("dress") || prodName.includes("skirt");
    if (sub.includes("cargo") || sub.includes("pant") || sub.includes("jogger") || sub.includes("tracksuit")) {
        return prodName.includes("cargo") || prodName.includes("pant") || prodName.includes("jogger") || prodName.includes("track");
    }
    if (sub.includes("case") || sub.includes("cover")) {
        if (sub.startsWith("mens") && !isMen) return false;
        return prodName.includes("case") || prodName.includes("cover");
    }
    if (sub.includes("headwear") || sub.includes("beanie") || (sub.includes("cap") && !sub.includes("recap"))) {
        return prodName.includes("cap") || prodName.includes("beanie") || prodName.includes("hat");
    }

    // Home & Living subcategories keyword heuristics
    if (sub.includes("wall-art") || sub.includes("art")) {
        return prodName.includes("art") || prodName.includes("canvas") || prodName.includes("wall");
    }
    if (sub.includes("poster")) {
        return prodName.includes("poster") || prodName.includes("print");
    }
    if (sub.includes("mug")) {
        return prodName.includes("mug") || prodName.includes("cup");
    }
    if (sub.includes("cushion")) {
        return prodName.includes("cushion") || prodName.includes("pillow") || prodName.includes("throw");
    }
    if (sub.includes("bedding")) {
        return prodName.includes("bedding") || prodName.includes("duvet") || prodName.includes("bed");
    }
    if (sub.includes("decor")) {
        return prodName.includes("decor") || prodName.includes("lamp") || prodName.includes("light") || prodName.includes("rug") || prodName.includes("mat");
    }

    return false;
}

/**
 * Checks if a product matches a parent category
 */
function productMatchesParentCategory(prod: FormattedProduct, tabSlug: string): boolean {
    if (tabSlug === "all") return true;

    const slugs = prod.categorySlugs.map(s => s.toLowerCase());
    const catName = prod.category.toLowerCase();
    const prodName = prod.name.toLowerCase();

    switch (tabSlug) {
        case "mens": {
            // Strictly exclude Women's, Kids, or general Accessories products
            const isWomen = slugs.some(s => s.includes("women") || s.includes("female") || s.includes("lady")) || catName.includes("women");
            const isKids = slugs.some(s => s.includes("kid") || s.includes("youth") || s.includes("child")) || catName.includes("kid") || prodName.includes("youth") || prodName.includes("kid");
            if (isWomen || isKids) return false;

            // Exclude general tech cases, stickers, rugs, posters, mugs unless explicitly tagged for Men
            const isGeneralAccessory = (slugs.some(s => s === "accessories" || s.includes("tech") || s.includes("misc") || s.includes("decor") || s.includes("home")) || catName.includes("accessories") || catName.includes("home")) && !slugs.some(s => s.includes("men")) && !catName.includes("men");
            if (isGeneralAccessory && !prodName.includes("men")) return false;

            const isMenSlug = slugs.some(s => 
                s === "mens" || s.startsWith("mens") || 
                s === "men" || s.startsWith("men-") || s.startsWith("man") ||
                s.includes("mens-fashion") || s.includes("men-fashion") || s.includes("menswear") || s.includes("men-s-fashion")
            );
            const isMenCat = catName.includes("men") && !catName.includes("women");
            const isMenProd = prodName.includes("men ") || prodName.includes("mens ") || prodName.includes("men's") || prodName.includes("man ") || prodName.includes("men's fashion");
            const isMenApparel = prodName.includes("cargo") || prodName.includes("overcoat") || prodName.includes("jacket") || prodName.includes("vest") || prodName.includes("hoodie") || prodName.includes("tee") || prodName.includes("shirt") || prodName.includes("pant") || prodName.includes("suit");

            return isMenSlug || isMenCat || isMenProd || isMenApparel;
        }
        case "womens": {
            const isWomenSlug = slugs.some(s => s.includes("women") || s.includes("female") || s.includes("lady"));
            const isWomenCat = catName.includes("women");
            const isWomenProd = prodName.includes("women") || prodName.includes("women's") || prodName.includes("skirt") || prodName.includes("dress") || prodName.includes("nebula");
            return isWomenSlug || isWomenCat || isWomenProd;
        }
        case "kids": {
            const isKidsSlug = slugs.some(s => s.includes("kid") || s.includes("youth") || s.includes("child"));
            const isKidsCat = catName.includes("kid");
            const isKidsProd = prodName.includes("youth") || prodName.includes("kid") || prodName.includes("child");
            return isKidsSlug || isKidsCat || isKidsProd;
        }
        case "home-living": {
            const isHomeSlug = slugs.some(s => 
                s.includes("home") || s.includes("living") || s.includes("decor") || 
                s.includes("rug") || s.includes("mat") || s.includes("art") || 
                s.includes("poster") || s.includes("mug") || s.includes("cushion") || 
                s.includes("bedding") || s.includes("lamp")
            );
            const isHomeCat = catName.includes("home") || catName.includes("living");
            const isHomeProd = 
                prodName.includes("home") || prodName.includes("rug") || prodName.includes("mat") || 
                prodName.includes("poster") || prodName.includes("mug") || prodName.includes("cushion") || 
                prodName.includes("lamp") || prodName.includes("art") || prodName.includes("decor") || 
                prodName.includes("bedding") || prodName.includes("duvet") || prodName.includes("print");
            return isHomeSlug || isHomeCat || isHomeProd;
        }
        case "accessories": {
            const isAccSlug = slugs.some(s => s.includes("accessori") || s.includes("gadget") || s.includes("tech"));
            const isAccCat = catName.includes("accessori");
            const isAccProd = prodName.includes("case") || prodName.includes("cover") || prodName.includes("cap") || prodName.includes("sunglass") || prodName.includes("sticker") || prodName.includes("beanie") || prodName.includes("chain");
            return isAccSlug || isAccCat || isAccProd;
        }
        default:
            return slugs.some(s => s.includes(tabSlug)) || catName.includes(tabSlug);
    }
}

const CATEGORY_TAB_SLUGS = ["all", "mens", "womens", "kids", "home-living", "accessories"];

/**
 * Core distribution engine with subcategory round-robin interleaving
 */
export function distributeHomepageProducts(
    rawProducts: any[],
    seed: number = 42,
    categoriesList: CategoryTreeItem[] = []
): SectionDistributionResult {
    const formatted = rawProducts.map(formatProduct);
    const seenProductIds = new Set<string>();

    // Step 1: New Arrivals (4 items)
    const newArrivalPool = [...formatted].slice(0, Math.min(10, formatted.length));
    const shuffledNew = seededShuffle(newArrivalPool, seed);
    const newArrivals = shuffledNew.slice(0, 4);
    newArrivals.forEach(p => seenProductIds.add(p.id));

    // Step 2: Resolve subcategory mapping per parent tab dynamically from backend or fallback
    const parentSubcatsMap: Record<string, string[]> = {};
    for (const tabSlug of CATEGORY_TAB_SLUGS) {
        if (tabSlug === "all") continue;

        // Try matching dynamic backend category tree first
        const parentObj = categoriesList.find(c => {
            const s = (c.slug || "").toLowerCase();
            const n = (c.name || "").toLowerCase();
            if (tabSlug === "mens") {
                return (
                    n === "men's fashion" || n === "mens fashion" || n === "men fashion" ||
                    s === "mens-fashion" || s === "men-fashion" || s === "menswear" ||
                    ((s.includes("men") || n.includes("men")) && !s.includes("women") && !n.includes("women"))
                );
            }
            if (tabSlug === "womens") {
                return (
                    n === "women's fashion" || n === "womens fashion" || n === "women fashion" ||
                    s === "womens-fashion" || s === "women-fashion" || s === "womenswear" ||
                    s.includes("women") || n.includes("women")
                );
            }
            if (tabSlug === "kids") {
                return s.includes("kid") || n.includes("kid") || s.includes("child") || n.includes("child");
            }
            if (tabSlug === "home-living") {
                return s.includes("home") || n.includes("home") || s.includes("living") || n.includes("living");
            }
            if (tabSlug === "accessories") {
                return s.includes("accessori") || n.includes("accessori");
            }
            return s === tabSlug || s.includes(tabSlug);
        });
        let childSlugs: string[] = [];

        if (parentObj) {
            childSlugs = categoriesList
                .filter(c => c.parent === parentObj.id)
                .map(c => c.slug);
        }

        if (childSlugs.length === 0) {
            childSlugs = DEFAULT_SUBCATEGORY_MAP[tabSlug] || [];
        }

        parentSubcatsMap[tabSlug] = childSlugs;
    }

    // Step 3: Shop By Category Tabs (8 items per tab with Round-Robin Subcategory Interleaving)
    const categoryProducts: Record<string, FormattedProduct[]> = {};

    for (const tabSlug of CATEGORY_TAB_SLUGS) {
        const targetCount = 8;
        const allParentMatching = formatted.filter(p => productMatchesParentCategory(p, tabSlug));

        if (tabSlug === "all") {
            const unseen = allParentMatching.filter(p => !seenProductIds.has(p.id));
            const seen = allParentMatching.filter(p => seenProductIds.has(p.id));
            const shuffledUnseen = seededShuffle(unseen, seed + 1);
            const selected = shuffledUnseen.slice(0, targetCount);
            selected.forEach(p => seenProductIds.add(p.id));

            if (selected.length < targetCount) {
                const needed = targetCount - selected.length;
                const shuffledSeen = seededShuffle(seen, seed + 10);
                categoryProducts["all"] = [...selected, ...shuffledSeen.slice(0, needed)];
            } else {
                categoryProducts["all"] = selected;
            }
            continue;
        }

        const childSlugs = parentSubcatsMap[tabSlug] || [];

        // Build buckets per subcategory containing unseen products
        const subcatBuckets: FormattedProduct[][] = [];
        const subcatSeenProductIds = new Set<string>();

        if (childSlugs.length > 0) {
            childSlugs.forEach((subSlug, idx) => {
                const subMatching = allParentMatching.filter(p => productMatchesSubcategory(p, subSlug));
                const unseenSub = subMatching.filter(p => !seenProductIds.has(p.id) && !subcatSeenProductIds.has(p.id));
                const shuffledSub = seededShuffle(unseenSub, seed + tabSlug.length + idx);
                if (shuffledSub.length > 0) {
                    subcatBuckets.push(shuffledSub);
                }
            });
        }

        // Round-Robin Interleaving across subcategory buckets
        const interleavedSelected: FormattedProduct[] = [];
        let bucketIndex = 0;
        let activeBucketsCount = subcatBuckets.length;

        while (interleavedSelected.length < targetCount && activeBucketsCount > 0) {
            const currentBucket = subcatBuckets[bucketIndex % subcatBuckets.length];
            if (currentBucket && currentBucket.length > 0) {
                const nextProd = currentBucket.shift()!;
                if (!interleavedSelected.some(p => p.id === nextProd.id)) {
                    interleavedSelected.push(nextProd);
                    subcatSeenProductIds.add(nextProd.id);
                    seenProductIds.add(nextProd.id);
                }
            }

            // Check how many non-empty buckets remain
            activeBucketsCount = subcatBuckets.filter(b => b.length > 0).length;
            bucketIndex++;
        }

        // If subcategory interleaving yielded fewer than targetCount, fill remaining slots from unseen parent matches
        if (interleavedSelected.length < targetCount) {
            const remainingUnseen = allParentMatching.filter(p => !seenProductIds.has(p.id) && !interleavedSelected.some(sp => sp.id === p.id));
            const shuffledRemaining = seededShuffle(remainingUnseen, seed + 50);
            for (const p of shuffledRemaining) {
                if (interleavedSelected.length >= targetCount) break;
                interleavedSelected.push(p);
                seenProductIds.add(p.id);
            }
        }

        // Final Fallback: If still under targetCount due to inventory size, backfill from seen parent matches
        if (interleavedSelected.length < targetCount) {
            const remainingSeen = allParentMatching.filter(p => !interleavedSelected.some(sp => sp.id === p.id));
            const shuffledSeen = seededShuffle(remainingSeen, seed + 100);
            for (const p of shuffledSeen) {
                if (interleavedSelected.length >= targetCount) break;
                interleavedSelected.push(p);
            }
        }

        categoryProducts[tabSlug] = interleavedSelected;
    }

    // Step 4: Featured Products (12 items)
    const unusedForFeatured = formatted.filter(p => !seenProductIds.has(p.id));
    const shuffledFeaturedUnused = seededShuffle(unusedForFeatured, seed + 999);
    let featuredProducts = shuffledFeaturedUnused.slice(0, 12);

    if (featuredProducts.length < 12) {
        const remainingNeeded = 12 - featuredProducts.length;
        const featuredIds = new Set(featuredProducts.map(p => p.id));
        const fallbackPool = formatted.filter(p => !featuredIds.has(p.id));
        const shuffledFallback = seededShuffle(fallbackPool, seed + 888);
        featuredProducts = [...featuredProducts, ...shuffledFallback.slice(0, remainingNeeded)];
    }

    return {
        newArrivals,
        categoryProducts,
        featuredProducts
    };
}
