"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
    FormattedProduct,
    distributeHomepageProducts,
    SectionDistributionResult,
    CategoryTreeItem
} from "@/lib/homepageDistribution";

const MOCK_MASTER_PRODUCTS = [
    { id: "p1", name: "0-GRAVITY HOODIE", price: 120, image: "/prod-hoodie.png", tag: "HOT", category: "Mens", categories: [{ slug: "mens", name: "Mens" }, { slug: "mens-hoodies", name: "Hoodies" }] },
    { id: "p2", name: "VOID CARGO PANTS", price: 145, image: "/prod-cargo.png", tag: "ESSENTIAL", category: "Mens", categories: [{ slug: "mens", name: "Mens" }, { slug: "mens-pants", name: "Pants" }] },
    { id: "p3", name: "NEBULA OVERSIZED TEE", price: 65, image: "/prod-tee.png", tag: "BEST SELLER", category: "Womens", categories: [{ slug: "womens", name: "Womens" }, { slug: "womens-t-shirts", name: "T-Shirts" }] },
    { id: "p4", name: "STRUCTURAL JACKET", price: 210, image: "/prod-jacket.png", tag: "EXCLUSIVE", category: "Mens", categories: [{ slug: "mens", name: "Mens" }, { slug: "mens-jackets", name: "Jackets" }] },
    { id: "p5", name: "CYBERPUNK BEANIE", price: 35, image: "/prod-cap.png", tag: "LIMITED", category: "Accessories", categories: [{ slug: "accessories", name: "Accessories" }, { slug: "accessories-headwear", name: "Headwear" }] },
    { id: "p6", name: "TECH-WEAR SKIRT", price: 95, image: "/prod-cargo.png", tag: "NEW", category: "Womens", categories: [{ slug: "womens", name: "Womens" }, { slug: "womens-dresses", name: "Dresses" }] },
    { id: "p7", name: "ASTRID MINI DRESS", price: 110, image: "/prod-tee.png", tag: "POPULAR", category: "Womens", categories: [{ slug: "womens", name: "Womens" }, { slug: "womens-dresses", name: "Dresses" }] },
    { id: "p8", name: "CHRONO KIDS TEE", price: 45, image: "/prod-tee.png", tag: "BEST SELLER", category: "Kids", categories: [{ slug: "kids", name: "Kids" }, { slug: "kids-boys-clothing", name: "Boys Clothing" }] },
    { id: "p9", name: "FUTURE YOUTH HOODIE", price: 75, image: "/prod-hoodie.png", tag: "NEW", category: "Kids", categories: [{ slug: "kids", name: "Kids" }, { slug: "kids-girls-clothing", name: "Girls Clothing" }] },
    { id: "p10", name: "KIDS CARGO JOGGERS", price: 60, image: "/prod-cargo.png", tag: "ESSENTIAL", category: "Kids", categories: [{ slug: "kids", name: "Kids" }, { slug: "kids-boys-clothing", name: "Boys Clothing" }] },
    { id: "p11", name: "NEON HOME RUG", price: 180, image: "/prod-stickers.png", tag: "LIMITED", category: "Home & Living", categories: [{ slug: "home-living", name: "Home & Living" }, { slug: "home-decor", name: "Decor" }] },
    { id: "p12", name: "AESTHETIC DESK MAT", price: 50, image: "/prod-stickers.png", tag: "POPULAR", category: "Home & Living", categories: [{ slug: "home-living", name: "Home & Living" }, { slug: "home-mugs", name: "Mugs" }] },
    { id: "p13", name: "CYBERPUNK IPHONE CASE", price: 40, image: "/prod-phone-case.png", tag: "NEW", category: "Accessories", categories: [{ slug: "accessories", name: "Accessories" }, { slug: "accessories-tech-cases", name: "Tech Cases" }] },
    { id: "p14", name: "CYBERPUNK AIRPODS COVER", price: 30, image: "/prod-airpods-cover.png", tag: "NEW", category: "Accessories", categories: [{ slug: "accessories", name: "Accessories" }, { slug: "accessories-tech-cases", name: "Tech Cases" }] },
    { id: "p15", name: "STREETWEAR SNAPBACK CAP", price: 45, image: "/prod-cap.png", tag: "POPULAR", category: "Accessories", categories: [{ slug: "accessories", name: "Accessories" }, { slug: "accessories-headwear", name: "Headwear" }] },
    { id: "p16", name: "TECHWEAR SUNGLASSES", price: 60, image: "/prod-sunglasses.png", tag: "LIMITED", category: "Accessories", categories: [{ slug: "accessories", name: "Accessories" }, { slug: "accessories-misc", name: "Miscellaneous" }] },
    { id: "p17", name: "AESTHETIC STICKER PACK", price: 15, image: "/prod-stickers.png", tag: "BUDGET", category: "Accessories", categories: [{ slug: "accessories", name: "Accessories" }, { slug: "accessories-misc", name: "Miscellaneous" }] },
    { id: "p18", name: "METROPOLIS OVERCOAT", price: 280, image: "/prod-jacket.png", tag: "NEW", category: "Mens", categories: [{ slug: "mens", name: "Mens" }, { slug: "mens-jackets", name: "Jackets" }] },
    { id: "p19", name: "MODULAR UTILITY VEST", price: 160, image: "/prod-jacket.png", tag: "HOT", category: "Mens", categories: [{ slug: "mens", name: "Mens" }, { slug: "mens-jackets", name: "Jackets" }] },
    { id: "p20", name: "ORBITAL CROPPED HOODIE", price: 90, image: "/prod-hoodie.png", tag: "TRENDING", category: "Womens", categories: [{ slug: "womens", name: "Womens" }, { slug: "womens-hoodies", name: "Hoodies" }] }
];

interface HomepageContextType {
    newArrivals: FormattedProduct[];
    categoryProducts: Record<string, FormattedProduct[]>;
    featuredProducts: FormattedProduct[];
    seed: number;
    isLoading: boolean;
}

const HomepageContext = createContext<HomepageContextType | undefined>(undefined);

export function HomepageProvider({
    children,
    initialProducts = []
}: {
    children: React.ReactNode;
    initialProducts?: any[];
}) {
    const [seed, setSeed] = useState<number>(42);
    const [categories, setCategories] = useState<CategoryTreeItem[]>([]);
    const [isClientReady, setIsClientReady] = useState(false);

    useEffect(() => {
        try {
            let sessionSeed = sessionStorage.getItem("yd_homepage_seed");
            if (!sessionSeed) {
                sessionSeed = Math.floor(Math.random() * 1000000).toString();
                sessionStorage.setItem("yd_homepage_seed", sessionSeed);
            }
            setSeed(parseInt(sessionSeed, 10) || 42);
        } catch {
            setSeed(Date.now());
        }

        // Fetch dynamic WooCommerce category hierarchy from API
        fetch("/api/shop/categories")
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            })
            .catch((err) => console.error("Failed to load WooCommerce categories:", err))
            .finally(() => setIsClientReady(true));
    }, []);

    const distribution: SectionDistributionResult = useMemo(() => {
        const sourceProducts =
            initialProducts && initialProducts.length > 0
                ? initialProducts
                : MOCK_MASTER_PRODUCTS;

        return distributeHomepageProducts(sourceProducts, seed, categories);
    }, [initialProducts, seed, categories]);

    return (
        <HomepageContext.Provider
            value={{
                newArrivals: distribution.newArrivals,
                categoryProducts: distribution.categoryProducts,
                featuredProducts: distribution.featuredProducts,
                seed,
                isLoading: !isClientReady
            }}
        >
            {children}
        </HomepageContext.Provider>
    );
}

export function useHomepageProducts() {
    const context = useContext(HomepageContext);
    if (!context) {
        throw new Error("useHomepageProducts must be used within a HomepageProvider");
    }
    return context;
}
