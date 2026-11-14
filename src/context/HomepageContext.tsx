"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
    FormattedProduct,
    distributeHomepageProducts,
    SectionDistributionResult,
    CategoryTreeItem
} from "@/lib/homepageDistribution";

const MOCK_MASTER_PRODUCTS: any[] = [];

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
    const [seed] = useState<number>(42);
    const [categories, setCategories] = useState<CategoryTreeItem[]>([]);
    const [isClientReady, setIsClientReady] = useState(false);

    useEffect(() => {
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
