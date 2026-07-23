import { NextResponse } from 'next/server';
import { getProductCategories, getCategoriesBySlug, isWooCommerceConfigured, fetchWooCommerce } from '@/lib/woocommerce';

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

// Mock category database matching Yubby Dubby's premium catalog hierarchy
const MOCK_CATEGORIES = [
  // Level 1: Main Categories
  { id: 11, name: "Mens", slug: "mens", parent: 0, description: "Men's Streetwear Collection", count: 12 },
  { id: 22, name: "Womens", slug: "womens", parent: 0, description: "Women's Streetwear Collection", count: 8 },
  { id: 33, name: "Kids", slug: "kids", parent: 0, description: "Streetwear for Kids", count: 6 },
  { id: 44, name: "Home & Living", slug: "home-living", parent: 0, description: "Yubby Dubby Lifestyle & Home Decor", count: 10 },
  { id: 55, name: "Accessories", slug: "accessories", parent: 0, description: "Tech cases, caps, bags, and lifestyle items", count: 7 },

  // Level 2: Mens Subcategories
  { id: 111, name: "T-Shirts", slug: "mens-t-shirts", parent: 11, description: "Street tees and graphics", count: 4 },
  { id: 112, name: "Hoodies", slug: "mens-hoodies", parent: 11, description: "Heavyweight premium hoodies", count: 3 },
  { id: 113, name: "Jackets", slug: "mens-jackets", parent: 11, description: "Technical weather jackets", count: 2 },
  { id: 114, name: "Sweatshirts", slug: "mens-sweatshirts", parent: 11, description: "Minimalist crewnecks", count: 1 },
  { id: 115, name: "Tracksuits", slug: "mens-tracksuits", parent: 11, description: "Full track coord sets", count: 1 },
  { id: 116, name: "Accessories", slug: "mens-accessories", parent: 11, description: "Caps, beanies, and belts", count: 1 },

  // Level 2: Womens Subcategories
  { id: 221, name: "T-Shirts", slug: "womens-t-shirts", parent: 22, description: "Oversized crop and regular tees", count: 3 },
  { id: 222, name: "Dresses", slug: "womens-dresses", parent: 22, description: "Tech-wear and street dresses", count: 2 },
  { id: 223, name: "Hoodies", slug: "womens-hoodies", parent: 22, description: "Cozy loose fit hoodies", count: 1 },
  { id: 224, name: "Tops", slug: "womens-tops", parent: 22, description: "Corsets, tanks, and blouses", count: 1 },
  { id: 225, name: "Accessories", slug: "womens-accessories", parent: 22, description: "Street accessories and bags", count: 1 },

  // Level 2: Kids Subcategories
  { id: 331, name: "Boys Clothing", slug: "kids-boys-clothing", parent: 33, description: "Streetwear for boys", count: 2 },
  { id: 332, name: "Girls Clothing", slug: "kids-girls-clothing", parent: 33, description: "Streetwear for girls", count: 2 },
  { id: 333, name: "School Essentials", slug: "kids-school-essentials", parent: 33, description: "Premium backpacks and cases", count: 1 },
  { id: 334, name: "Accessories", slug: "kids-accessories", parent: 33, description: "Caps and beanies for kids", count: 1 },

  // Level 2: Home & Living Subcategories
  { id: 441, name: "Wall Art", slug: "home-wall-art", parent: 44, description: "Canvas wall art decor", count: 2 },
  { id: 442, name: "Posters", slug: "home-posters", parent: 44, description: "High-gloss street art prints", count: 2 },
  { id: 443, name: "Mugs", slug: "home-mugs", parent: 44, description: "Ceramic signature mugs", count: 2 },
  { id: 444, name: "Cushions", slug: "home-cushions", parent: 44, description: "Designer throw cushions", count: 2 },
  { id: 445, name: "Bedding", slug: "home-bedding", parent: 44, description: "Duvet covers and pillow slips", count: 1 },
  { id: 446, name: "Decor", slug: "home-decor", parent: 44, description: "Lifestyle lights and display toys", count: 1 },

  // Level 2: Accessories Subcategories
  { id: 551, name: "Tech Cases", slug: "accessories-tech-cases", parent: 55, description: "Phone cases and AirPods covers", count: 2 },
  { id: 552, name: "Headwear", slug: "accessories-headwear", parent: 55, description: "Caps and beanies", count: 2 },
  { id: 553, name: "Miscellaneous", slug: "accessories-misc", parent: 55, description: "Sunglasses, stickers, and chains", count: 3 },

];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parentStr = searchParams.get('parent');
  const parentId = parentStr !== null ? parseInt(parentStr, 10) : 0;

  if (isNaN(parentId)) {
    return NextResponse.json({ error: 'Invalid parent ID' }, { status: 400 });
  }

  // Helper to attach image object if missing
  const enrichCategory = (c: any) => {
    const slug = c.slug ? c.slug.toLowerCase() : '';
    const imageSrc = c.image?.src || FALLBACK_CATEGORY_IMAGES[slug] || '/cat-accessories.png';
    return {
      ...c,
      image: {
        src: imageSrc,
        alt: c.name || 'Category'
      }
    };
  };

  // If WooCommerce is configured, query live WordPress subcategories
  if (isWooCommerceConfigured()) {
    try {
      let queryParentId = parentId;

      const [categories, products]: [any, any] = await Promise.all([
        getProductCategories({ parent: queryParentId }),
        fetchWooCommerce('products?per_page=100')
      ]);

      const catImgMap: Record<number, string> = {};
      if (Array.isArray(products)) {
        products.forEach((p: any) => {
          if (p.images && p.images.length > 0 && p.images[0]?.src) {
            (p.categories || []).forEach((c: any) => {
              const catId = typeof c === 'object' ? c.id : c;
              if (catId && !catImgMap[catId]) {
                catImgMap[catId] = p.images[0].src;
              }
            });
          }
        });
      }

      // Exclude admin categories or internal ones from Level 1
      let filtered = categories;
      if (queryParentId === 0) {
        filtered = categories.filter(c => {
          const slug = c.slug ? c.slug.toLowerCase() : '';
          const name = c.name ? c.name.toLowerCase() : '';
          return !['uncategorized', 'shop'].includes(slug) && 
                 !slug.includes('adidas') && 
                 !slug.includes('create') && 
                 !slug.includes('collab') &&
                 !slug.includes('featured') &&
                 !name.includes('featured');
        });
      }

      const enrichWithWpProduct = (c: any) => {
        const slug = c.slug ? c.slug.toLowerCase() : '';
        const imageSrc = c.image?.src || catImgMap[c.id] || FALLBACK_CATEGORY_IMAGES[slug] || (
          c.parent === 24 ? "/cat-mens.png" :
          c.parent === 25 ? "/cat-womens.png" :
          c.parent === 26 ? "/cat-kids.png" :
          c.parent === 27 ? "/cat-home.png" : "/cat-accessories.png"
        );
        return {
          ...c,
          image: {
            src: imageSrc,
            alt: c.name || 'Category'
          }
        };
      };
      
      return NextResponse.json((filtered || []).map(enrichWithWpProduct));
    } catch (error) {
      console.error('WooCommerce categories fetch failed, using fallback:', error);
    }
  }

  // Fallback to local structured mock categories database
  const fallbackCategories = MOCK_CATEGORIES.filter(c => c.parent === parentId).map(enrichCategory);
  return NextResponse.json(fallbackCategories);
}
