import { NextResponse } from 'next/server';
import { getProductCategories, getCategoriesBySlug, isWooCommerceConfigured } from '@/lib/woocommerce';

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

  // Level 1: Adidas main categories (parent: 100)
  { id: 101, name: "Mens", slug: "adidas-mens", parent: 100, description: "Adidas Men's Streetwear", count: 5 },
  { id: 102, name: "Womens", slug: "adidas-womens", parent: 100, description: "Adidas Women's Streetwear", count: 5 },
  { id: 103, name: "Footwear", slug: "adidas-footwear", parent: 100, description: "Adidas Collab Footwear", count: 4 },
  { id: 104, name: "Accessories", slug: "adidas-accessories", parent: 100, description: "Adidas Collab Accessories", count: 4 },

  // Level 2: Adidas Mens subcategories
  { id: 1011, name: "T-Shirts", slug: "adidas-mens-t-shirts", parent: 101, description: "Adidas street graphic tees", count: 1 },
  { id: 1012, name: "Hoodies", slug: "adidas-mens-hoodies", parent: 101, description: "Adidas heavy hoodies", count: 1 },
  { id: 1013, name: "Jackets", slug: "adidas-mens-jackets", parent: 101, description: "Adidas collab jackets", count: 1 },
  { id: 1014, name: "Tracksuits", slug: "adidas-mens-tracksuits", parent: 101, description: "Adidas dynamic tracksuits", count: 1 },
  { id: 1015, name: "Shorts", slug: "adidas-mens-shorts", parent: 101, description: "Adidas sports shorts", count: 1 },

  // Level 2: Adidas Womens subcategories
  { id: 1021, name: "T-Shirts", slug: "adidas-womens-t-shirts", parent: 102, description: "Adidas crop tees", count: 1 },
  { id: 1022, name: "Leggings", slug: "adidas-womens-leggings", parent: 102, description: "Adidas technical leggings", count: 1 },
  { id: 1023, name: "Hoodies", slug: "adidas-womens-hoodies", parent: 102, description: "Adidas crop hoodies", count: 1 },
  { id: 1024, name: "Jackets", slug: "adidas-womens-jackets", parent: 102, description: "Adidas windbreakers", count: 1 },
  { id: 1025, name: "Sports Bras", slug: "adidas-womens-sports-bras", parent: 102, description: "Adidas compression support", count: 1 },

  // Level 2: Adidas Footwear subcategories
  { id: 1031, name: "Running Shoes", slug: "adidas-footwear-running", parent: 103, description: "Adidas performance running", count: 1 },
  { id: 1032, name: "Lifestyle Shoes", slug: "adidas-footwear-lifestyle", parent: 103, description: "Adidas street lifestyle footwear", count: 1 },
  { id: 1033, name: "Training Shoes", slug: "adidas-footwear-training", parent: 103, description: "Adidas gym training shoes", count: 1 },
  { id: 1034, name: "Slides", slug: "adidas-footwear-slides", parent: 103, description: "Adidas classic comfort slides", count: 1 },

  // Level 2: Adidas Accessories subcategories
  { id: 1041, name: "Caps", slug: "adidas-accessories-caps", parent: 104, description: "Adidas snapbacks and beanies", count: 1 },
  { id: 1042, name: "Bags", slug: "adidas-accessories-bags", parent: 104, description: "Adidas utility backpacks", count: 1 },
  { id: 1043, name: "Socks", slug: "adidas-accessories-socks", parent: 104, description: "Adidas performance socks pack", count: 1 },
  { id: 1044, name: "Water Bottles", slug: "adidas-accessories-bottles", parent: 104, description: "Adidas steel water bottles", count: 1 },

  // Level 1: Customizer Root categories (parent: 200)
  { id: 201, name: "Clothing", slug: "custom-clothing", parent: 200, description: "Custom Hoodies, Tees, and Jackets", count: 5 },
  { id: 202, name: "Accessories", slug: "custom-accessories", parent: 200, description: "Custom Caps, Beanies, and Chains", count: 4 },
  { id: 203, name: "Home & Living", slug: "custom-home-living", parent: 200, description: "Custom Cushions, Mugs, and Living items", count: 4 },
  { id: 204, name: "Phone Accessories", slug: "custom-phone-accessories", parent: 200, description: "Custom iPhone, Samsung, and Pixel Cases", count: 3 },
  { id: 205, name: "Wall Art", slug: "custom-wall-art", parent: 200, description: "Custom Posters and Wall Canvas", count: 2 },
  { id: 206, name: "Bags", slug: "custom-bags", parent: 200, description: "Custom Backpacks and Tote Bags", count: 2 },

  // Level 2: Customizer Clothing Subcategories (parent: 201)
  { id: 2011, name: "T-Shirts", slug: "custom-clothing-tshirts", parent: 201, description: "Custom blanks", count: 2 },
  { id: 2012, name: "Oversized T-Shirts", slug: "custom-clothing-oversized-tshirts", parent: 201, description: "Custom oversized blanks", count: 2 },
  { id: 2013, name: "Hoodies", slug: "custom-clothing-hoodies", parent: 201, description: "Custom heavy hoodies", count: 2 },
  { id: 2014, name: "Sweatshirts", slug: "custom-clothing-sweatshirts", parent: 201, description: "Custom crewneck blanks", count: 1 },
  { id: 2015, name: "Jackets", slug: "custom-clothing-jackets", parent: 201, description: "Custom jackets", count: 2 },

  // Level 2: Customizer Accessories Subcategories (parent: 202)
  { id: 2021, name: "Caps", slug: "custom-accessories-caps", parent: 202, description: "Custom snapbacks", count: 1 },
  { id: 2022, name: "Beanies", slug: "custom-accessories-beanies", parent: 202, description: "Custom knit beanies", count: 1 },
  { id: 2023, name: "Sunglasses", slug: "custom-accessories-sunglasses", parent: 202, description: "Custom streetwear shades", count: 1 },
  { id: 2024, name: "Chains", slug: "custom-accessories-chains", parent: 202, description: "Custom steel chains", count: 1 },

  // Level 2: Customizer Home & Living Subcategories (parent: 203)
  { id: 2031, name: "Posters", slug: "custom-home-posters", parent: 203, description: "Custom posters", count: 1 },
  { id: 2032, name: "Wall Art", slug: "custom-home-wallart", parent: 203, description: "Custom canvas art", count: 1 },
  { id: 2033, name: "Cushions", slug: "custom-home-cushions", parent: 203, description: "Custom cushions", count: 1 },
  { id: 2034, name: "Mugs", slug: "custom-home-mugs", parent: 203, description: "Custom mugs", count: 1 },

  // Level 2: Customizer Phone Accessories Subcategories (parent: 204)
  { id: 2041, name: "iPhone Cases", slug: "custom-phone-iphone", parent: 204, description: "Custom iPhone cases", count: 1 },
  { id: 2042, name: "Samsung Cases", slug: "custom-phone-samsung", parent: 204, description: "Custom Samsung cases", count: 1 },
  { id: 2043, name: "Google Pixel Cases", slug: "custom-phone-pixel", parent: 204, description: "Custom Pixel cases", count: 1 },

  // Level 2: Customizer Wall Art Subcategories (parent: 205)
  { id: 2051, name: "Posters", slug: "custom-wallart-posters", parent: 205, description: "Custom prints", count: 1 },
  { id: 2052, name: "Wall Art", slug: "custom-wallart-canvas", parent: 205, description: "Custom framed canvas", count: 1 },

  // Level 2: Customizer Bags Subcategories (parent: 206)
  { id: 2061, name: "Backpacks", slug: "custom-bags-backpacks", parent: 206, description: "Custom backpacks", count: 1 },
  { id: 2062, name: "Tote Bags", slug: "custom-bags-totes", parent: 206, description: "Custom tote bags", count: 1 }
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
      let queryParentId = parentId;
      
      // If we are looking for the customizer root, resolve the slug first
      if (parentId === 200) {
        const rootCats = await getCategoriesBySlug('create-your-own');
        if (rootCats && rootCats.length > 0) {
          queryParentId = rootCats[0].id;
        } else {
          // If the slug is not found, fallback immediately to local parent: 200 categories
          const fallbackCategories = MOCK_CATEGORIES.filter(c => c.parent === 200);
          return NextResponse.json(fallbackCategories);
        }
      }

      const categories = await getProductCategories({ parent: queryParentId });
      
      // Exclude admin categories or internal ones from Level 1
      let filtered = categories;
      if (queryParentId === 0) {
        const excludeSlugs = ['uncategorized', 'shop', 'create-your-own', 'adidas', 'collab'];
        filtered = categories.filter(c => !excludeSlugs.includes(c.slug.toLowerCase()));
      }
      
      if (filtered && filtered.length > 0) {
        return NextResponse.json(filtered);
      }
    } catch (error) {
      console.error('WooCommerce categories fetch failed, using fallback:', error);
    }
  }

  // Fallback to local structured mock categories database
  const fallbackCategories = MOCK_CATEGORIES.filter(c => c.parent === parentId);
  return NextResponse.json(fallbackCategories);
}
