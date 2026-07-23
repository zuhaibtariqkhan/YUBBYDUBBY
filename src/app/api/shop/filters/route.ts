import { NextResponse } from 'next/server';
import { fetchWooCommerce, isWooCommerceConfigured } from '@/lib/woocommerce';

// Fallback rich mock filters metadata for sandbox mode
const MOCK_FILTERS = {
  categories: [
    { id: 11, name: "Mens", slug: "mens", parent: 0, count: 12 },
    { id: 22, name: "Womens", slug: "womens", parent: 0, count: 8 },
    { id: 33, name: "Kids", slug: "kids", parent: 0, count: 6 },
    { id: 44, name: "Home & Living", slug: "home-living", parent: 0, count: 10 },
    { id: 55, name: "Accessories", slug: "accessories", parent: 0, count: 7 },
    // Subcategories
    { id: 111, name: "T-Shirts", slug: "mens-t-shirts", parent: 11, count: 4 },
    { id: 112, name: "Hoodies", slug: "mens-hoodies", parent: 11, count: 3 },
    { id: 113, name: "Jackets", slug: "mens-jackets", parent: 11, count: 2 },
    { id: 114, name: "Sweatshirts", slug: "mens-sweatshirts", parent: 11, count: 1 },
    { id: 115, name: "Tracksuits", slug: "mens-tracksuits", parent: 11, count: 1 },
    { id: 116, name: "Accessories", slug: "mens-accessories", parent: 11, count: 1 },
    { id: 221, name: "T-Shirts", slug: "womens-t-shirts", parent: 22, count: 3 },
    { id: 222, name: "Dresses", slug: "womens-dresses", parent: 22, count: 2 },
    { id: 223, name: "Hoodies", slug: "womens-hoodies", parent: 22, count: 1 },
    { id: 441, name: "Wall Art", slug: "home-wall-art", parent: 44, count: 2 },
    { id: 442, name: "Posters", slug: "home-posters", parent: 44, count: 2 },
    { id: 443, name: "Mugs", slug: "home-mugs", parent: 44, count: 2 },
    { id: 551, name: "Tech Cases", slug: "accessories-tech-cases", parent: 55, count: 2 },
    { id: 552, name: "Headwear", slug: "accessories-headwear", parent: 55, count: 2 },
  ],
  tags: [
    { id: 1, name: "New", slug: "new" },
    { id: 2, name: "Hot", slug: "hot" },
    { id: 3, name: "Sale", slug: "sale" },
    { id: 4, name: "Limited", slug: "limited" },
    { id: 5, name: "Collab", slug: "collab" }
  ],
  attributes: {
    colors: ["Black", "French Navy", "Stone", "White", "Grey", "Navy", "Red", "Blue", "Green"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    materials: ["Cotton", "Polyester", "Canvas", "Silicone", "Glass"],
    brands: ["Yubby Dubby", "Adidas", "Collab"]
  },
  priceRange: {
    min: 0,
    max: 3000
  }
const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  mens: "/cat-mens.png",
  womens: "/cat-womens.png",
  kids: "/cat-kids.png",
  "home-living": "/cat-home.png",
  accessories: "/cat-accessories.png",

  "mens-t-shirts": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
  menstshirts: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
  "mens-hoodies": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
  "mens-jackets": "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80",
  mensjackets: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80",
  "mens-sweatshirts": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
  "mens-sweaters": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
  sweatshirts: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
  sweaters: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80",
  "mens-tracksuits": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
  "mens-accessories": "/cat-accessories.png",

  "womens-t-shirts": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
  "womens-tshirts": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
  "womens-dresses": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
  "womens-hoodies": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
  "women-hoodie": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
  "womens-tops": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
  "womens-accessories": "/cat-accessories.png",

  "kids-boys-clothing": "/cat-kids.png",
  "kids-girls-clothing": "/cat-kids.png",
  "kids-school-essentials": "/cat-kids.png",
  "kids-accessories": "/cat-accessories.png",
  "kids-hoodies": "/cat-kids.png",
  "kids-tshirts": "/cat-kids.png",

  "home-wall-art": "/cat-home.png",
  "home-posters": "/cat-home.png",
  "home-mugs": "/cat-home.png",
  "home-cushions": "/cat-home.png",
  "home-bedding": "/cat-home.png",
  "home-decor": "/cat-home.png",

  "accessories-tech-cases": "/cat-accessories.png",
  "accessories-headwear": "/cat-accessories.png",
  "accessories-misc": "/cat-accessories.png",
};

export async function GET() {
  if (!isWooCommerceConfigured()) {
    return NextResponse.json(MOCK_FILTERS);
  }

  try {
    // 1. Fetch Categories & Products from WordPress to map live product photos to categories
    const [categories, products]: [any, any] = await Promise.all([
      fetchWooCommerce('products/categories?per_page=100'),
      fetchWooCommerce('products?per_page=100')
    ]);

    const catImgMap: Record<number, string> = {};
    if (Array.isArray(products)) {
      products.forEach((p: any) => {
        if (p.images && p.images.length > 0 && p.images[0]?.src) {
          (p.categories || []).forEach((c: any) => {
            if (!catImgMap[c.id]) {
              catImgMap[c.id] = p.images[0].src;
            }
          });
        }
      });
    }

    const filteredCategories = (Array.isArray(categories) ? categories : []).filter((c: any) => {
      const slug = c.slug ? c.slug.toLowerCase() : '';
      const name = c.name ? c.name.toLowerCase() : '';
      return !['uncategorized', 'shop'].includes(slug) && 
             !slug.includes('adidas') && 
             !slug.includes('create') && 
             !slug.includes('collab') &&
             !slug.includes('featured') &&
             !name.includes('featured');
    }).map((c: any) => {
      const slug = c.slug ? c.slug.toLowerCase() : '';
      const imageSrc = c.image?.src || catImgMap[c.id] || FALLBACK_CATEGORY_IMAGES[slug] || (
        c.parent === 24 ? "/cat-mens.png" :
        c.parent === 25 ? "/cat-womens.png" :
        c.parent === 26 ? "/cat-kids.png" :
        c.parent === 27 ? "/cat-home.png" : "/cat-accessories.png"
      );
      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        parent: c.parent,
        count: c.count,
        image: {
          src: imageSrc,
          alt: c.name || 'Category'
        }
      };
    });

    // 2. Fetch Tags
    const tags: any = await fetchWooCommerce('products/tags?per_page=100');
    const mappedTags = tags.map((t: any) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      count: t.count
    }));

    // 3. Fetch Attributes and their terms
    const attributesList: any = await fetchWooCommerce('products/attributes');
    
    let colors: string[] = [];
    let sizes: string[] = [];
    let materials: string[] = [];
    let brands: string[] = [];

    for (const attr of attributesList) {
      const attrName = attr.name.toLowerCase();
      const terms: any = await fetchWooCommerce(`products/attributes/${attr.id}/terms?per_page=100`);
      const options = terms.map((t: any) => t.name);

      if (attrName === 'color' || attrName === 'colour') {
        colors = options;
      } else if (attrName === 'size') {
        // Standard sort order for sizes if possible
        const sizeOrder = ["xs", "s", "m", "l", "xl", "xxl", "2xl", "3xl", "4xl"];
        sizes = options.sort((a: string, b: string) => {
          const indexA = sizeOrder.indexOf(a.toLowerCase());
          const indexB = sizeOrder.indexOf(b.toLowerCase());
          if (indexA === -1 && indexB === -1) return a.localeCompare(b);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
      } else if (attrName === 'material') {
        materials = options;
      } else if (attrName === 'brand') {
        brands = options;
      }
    }

    // Default fallbacks if empty from WooCommerce
    if (colors.length === 0) colors = ["Black", "French Navy", "Stone"];
    if (sizes.length === 0) sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    if (materials.length === 0) materials = ["Cotton", "Polyester", "Canvas", "Silicone", "Glass"];
    if (brands.length === 0) brands = ["Yubby Dubby", "Adidas"];

    // 4. Determine Price Range dynamically (fetch min and max prices from active products)
    let minPrice = 0;
    let maxPrice = 3000;

    const minPriceProduct: any = await fetchWooCommerce('products?orderby=price&order=asc&per_page=1');
    const maxPriceProduct: any = await fetchWooCommerce('products?orderby=price&order=desc&per_page=1');

    if (minPriceProduct && minPriceProduct.length > 0) {
      minPrice = Math.floor(parseFloat(minPriceProduct[0].price) || 0);
    }
    if (maxPriceProduct && maxPriceProduct.length > 0) {
      maxPrice = Math.ceil(parseFloat(maxPriceProduct[0].price) || 3000);
    }

    // Safety check for pricing bounds
    if (minPrice > maxPrice) {
      const temp = minPrice;
      minPrice = maxPrice;
      maxPrice = temp;
    }
    if (minPrice === maxPrice) {
      minPrice = 0; // ensure range is valid
    }

    return NextResponse.json({
      categories: filteredCategories,
      tags: mappedTags,
      attributes: {
        colors,
        sizes,
        materials,
        brands
      },
      priceRange: {
        min: minPrice,
        max: maxPrice
      }
    });

  } catch (error) {
    console.error('Failed to fetch filters metadata from WooCommerce, using fallbacks:', error);
    return NextResponse.json(MOCK_FILTERS);
  }
}
