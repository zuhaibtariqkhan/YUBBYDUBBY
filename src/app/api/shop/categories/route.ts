import { NextResponse } from 'next/server';
import { getProductCategories, isWooCommerceConfigured } from '@/lib/woocommerce';

// Mock category database matching Yubby Dubby's premium catalog hierarchy
const MOCK_CATEGORIES = [
  // Level 1: Main Categories
  { id: 11, name: "Mens", slug: "mens", parent: 0, description: "Men's Streetwear Collection", count: 12 },
  { id: 22, name: "Womens", slug: "womens", parent: 0, description: "Women's Streetwear Collection", count: 8 },
  { id: 33, name: "Kids", slug: "kids", parent: 0, description: "Streetwear for Kids", count: 6 },
  { id: 44, name: "Home & Living", slug: "home-living", parent: 0, description: "Yubby Dubby Lifestyle & Home Decor", count: 10 },

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
  { id: 446, name: "Decor", slug: "home-decor", parent: 44, description: "Lifestyle lights and display toys", count: 1 }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parentStr = searchParams.get('parent');
  const parentId = parentStr !== null ? parseInt(parentStr, 10) : 0;

  if (isNaN(parentId)) {
    return NextResponse.json({ error: 'Invalid parent ID' }, { status: 400 });
  }

  // If WooCommerce is configured, query live WordPress subcategories
  if (isWooCommerceConfigured()) {
    try {
      const categories = await getProductCategories({ parent: parentId });
      
      // Exclude admin categories or internal ones from Level 1
      let filtered = categories;
      if (parentId === 0) {
        const excludeSlugs = ['uncategorized', 'shop', 'create-your-own', 'adidas', 'collab'];
        filtered = categories.filter(c => !excludeSlugs.includes(c.slug.toLowerCase()));
      }
      
      return NextResponse.json(filtered);
    } catch (error) {
      console.error('WooCommerce categories fetch failed, using fallback:', error);
    }
  }

  // Fallback to local structured mock categories database
  const fallbackCategories = MOCK_CATEGORIES.filter(c => c.parent === parentId);
  return NextResponse.json(fallbackCategories);
}
