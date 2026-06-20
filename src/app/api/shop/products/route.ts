import { NextResponse } from 'next/server';
import { getProducts, isWooCommerceConfigured } from '@/lib/woocommerce';

// Fallback mock products categorized by subcategory IDs for robust offline sandbox browsing
const MOCK_PRODUCTS = [
  // Mens T-Shirts (111)
  { id: "p20", name: "CYBERSTREET GRAPHIC TEE", price: 55, image: "/prod-tee.png", tag: "NEW", categoryId: 111 },
  { id: "p21", name: "TOKYO OVERSIZED TEE", price: 60, image: "/prod-tee.png", tag: "BEST SELLER", categoryId: 111 },

  // Mens Hoodies (112)
  { id: "p1", name: "0-GRAVITY HOODIE", price: 120, image: "/prod-hoodie.png", tag: "NEW", categoryId: 112 },
  { id: "p22", name: "HEAVY BRUSHED HOODIE", price: 110, image: "/prod-hoodie.png", tag: "", categoryId: 112 },

  // Mens Jackets (113)
  { id: "p4", name: "STRUCTURAL JACKET", price: 210, image: "/prod-jacket.png", tag: "LIMITED", categoryId: 113 },

  // Mens Sweatshirts (114)
  { id: "p8", name: "CYBERPUNK VEST", price: 180, image: "/prod-jacket.png", tag: "LIMITED", categoryId: 114 },

  // Mens Tracksuits (115)
  { id: "p2", name: "VOID CARGO PANTS", price: 145, image: "/prod-cargo.png", tag: "", categoryId: 115 },

  // Mens Accessories (116)
  { id: "p5", name: "SYNTHETIC BEANIE", price: 35, image: "/prod-hoodie.png", tag: "", categoryId: 116 },

  // Womens T-Shirts (221)
  { id: "p3", name: "NEBULA OVERSIZED TEE", price: 65, image: "/prod-tee.png", tag: "BEST SELLER", categoryId: 221 },

  // Womens Dresses (222)
  { id: "p6", name: "TECH-WEAR SKIRT", price: 95, image: "/prod-cargo.png", tag: "NEW", categoryId: 222 },

  // Kids Boys Clothing (331)
  { id: "p9", name: "FUTURE YOUTH HOODIE", price: 75, image: "/prod-hoodie.png", tag: "NEW", categoryId: 331 },

  // Kids Girls Clothing (332)
  { id: "p10", name: "NEO-CARGO SHORTS", price: 60, image: "/prod-cargo.png", tag: "", categoryId: 332 },

  // Kids School Essentials (333)
  { id: "p13", name: "CYBERPUNK IPHONE CASE", price: 40, image: "/prod-phone-case.png", tag: "NEW", categoryId: 333 },

  // Home & Living Wall Art (441)
  { id: "p11", name: "MINIMALIST RUG", price: 250, image: "/cat-home.png", tag: "BEST SELLER", categoryId: 441 },

  // Home & Living Posters (442)
  { id: "p23", name: "AESTHETIC POSTER PRINT", price: 30, image: "/create-your-own.png", tag: "NEW", categoryId: 442 },

  // Home & Living Mugs (443)
  { id: "p24", name: "MATTE BLACK SIGNATURE MUG", price: 25, image: "/cat-accessories.png", tag: "POPULAR", categoryId: 443 },

  // Home & Living Cushions (444)
  { id: "p25", name: "NEON STREET THROW CUSHION", price: 45, image: "/cat-home.png", tag: "NEW", categoryId: 444 },

  // Default fallback accessories
  { id: "p7", name: "HEAVY METAL CHAIN", price: 55, image: "/prod-tee.png", tag: "", categoryId: 0 },

  // Accessories Tech Cases (551)
  { id: "p13", name: "CYBERPUNK IPHONE CASE", price: 40, image: "/prod-phone-case.png", tag: "NEW", categoryId: 551 },
  { id: "p14", name: "CYBERPUNK AIRPODS COVER", price: 30, image: "/prod-airpods-cover.png", tag: "NEW", categoryId: 551 },

  // Accessories Headwear (552)
  { id: "p5", name: "SYNTHETIC BEANIE", price: 35, image: "/prod-hoodie.png", tag: "", categoryId: 552 },
  { id: "p15", name: "STREETWEAR SNAPBACK CAP", price: 45, image: "/prod-cap.png", tag: "POPULAR", categoryId: 552 },

  // Accessories Miscellaneous (553)
  { id: "p7-acc", name: "HEAVY METAL CHAIN", price: 55, image: "/prod-tee.png", tag: "", categoryId: 553 },
  { id: "p16", name: "TECHWEAR SUNGLASSES", price: 60, image: "/prod-sunglasses.png", tag: "LIMITED", categoryId: 553 },
  { id: "p17", name: "AESTHETIC STICKER PACK", price: 15, image: "/prod-stickers.png", tag: "BUDGET", categoryId: 553 },

  // Adidas Mens T-Shirts (1011)
  { id: "adidas-p1", name: "ADIDAS NEBULA COLLAB TEE", price: 80, image: "/prod-tee.png", tag: "LIMITED", categoryId: 1011 },
  // Adidas Mens Hoodies (1012)
  { id: "adidas-p2", name: "ADIDAS ZERO-G HOODIE GREEN", price: 160, image: "/prod-hoodie.png", tag: "NEW", categoryId: 1012 },
  // Adidas Mens Jackets (1013)
  { id: "adidas-p3", name: "ADIDAS VOID TRACK PANTS", price: 140, image: "/prod-cargo.png", tag: "", categoryId: 1013 },

  // Adidas Womens T-Shirts (1021)
  { id: "adidas-p4", name: "ADIDAS NEBULA COLLAB TEE", price: 80, image: "/prod-tee.png", tag: "LIMITED", categoryId: 1021 },

  // Adidas Footwear Lifestyle (1032)
  { id: "adidas-p5", name: "YUBBY DUBBY x ADIDAS ULTRA-BOOST CYBER", price: 220, image: "/prod-cargo.png", tag: "COLLAB", categoryId: 1032 },

  // Customizer - Clothing subcategories
  { id: "cust-tee-1", name: "Blank Designer Tee", price: 40, image: "/prod-tee.png", tag: "CUSTOMIZABLE", categoryId: 2011 },
  { id: "cust-tee-2", name: "Blank Custom Classic Tee", price: 35, image: "/prod-tee.png", tag: "CUSTOMIZABLE", categoryId: 2011 },
  { id: "cust-otee-1", name: "Blank Oversized Tee", price: 45, image: "/prod-tee.png", tag: "CUSTOMIZABLE", categoryId: 2012 },
  { id: "cust-otee-2", name: "Blank Heavyweight Oversized Tee", price: 50, image: "/prod-tee.png", tag: "CUSTOMIZABLE", categoryId: 2012 },
  { id: "cust-hood-1", name: "Blank Heavy Hoodie", price: 75, image: "/prod-hoodie.png", tag: "CUSTOMIZABLE", categoryId: 2013 },
  { id: "cust-hood-2", name: "Blank Zip Hoodie", price: 80, image: "/prod-hoodie.png", tag: "CUSTOMIZABLE", categoryId: 2013 },
  { id: "cust-sweat-1", name: "Blank Crewneck Sweatshirt", price: 65, image: "/prod-hoodie.png", tag: "CUSTOMIZABLE", categoryId: 2014 },
  { id: "cust-jack-1", name: "Blank Windbreaker Jacket", price: 95, image: "/prod-jacket.png", tag: "CUSTOMIZABLE", categoryId: 2015 },
  { id: "cust-jack-2", name: "Blank Coach Jacket", price: 90, image: "/prod-jacket.png", tag: "CUSTOMIZABLE", categoryId: 2015 },

  // Customizer - Phone Accessories subcategories
  { id: "cust-phone-1", name: "Blank Premium iPhone Case", price: 25, image: "/prod-phone-case.png", tag: "CUSTOMIZABLE", categoryId: 2041 },
  { id: "cust-phone-2", name: "Blank Premium Samsung Case", price: 25, image: "/prod-phone-case.png", tag: "CUSTOMIZABLE", categoryId: 2042 },
  { id: "cust-phone-3", name: "Blank Premium Pixel Case", price: 25, image: "/prod-phone-case.png", tag: "CUSTOMIZABLE", categoryId: 2043 },

  // Customizer - Home & Living subcategories
  { id: "cust-home-1", name: "Blank Custom Poster", price: 15, image: "/create-your-own.png", tag: "CUSTOMIZABLE", categoryId: 2031 },
  { id: "cust-home-2", name: "Blank Custom Canvas Wall Art", price: 80, image: "/cat-home.png", tag: "CUSTOMIZABLE", categoryId: 2032 },
  { id: "cust-home-3", name: "Blank Custom Designer Cushion", price: 35, image: "/cat-home.png", tag: "CUSTOMIZABLE", categoryId: 2033 },
  { id: "cust-home-4", name: "Blank Custom Ceramic Mug", price: 20, image: "/cat-accessories.png", tag: "CUSTOMIZABLE", categoryId: 2034 },

  // Customizer - Accessories subcategories
  { id: "cust-acc-1", name: "Blank Premium Cap", price: 30, image: "/prod-cap.png", tag: "CUSTOMIZABLE", categoryId: 2021 },
  { id: "cust-acc-2", name: "Blank Knit Beanie", price: 25, image: "/prod-hoodie.png", tag: "CUSTOMIZABLE", categoryId: 2022 },
  { id: "cust-acc-3", name: "Blank Retro Sunglasses", price: 40, image: "/prod-sunglasses.png", tag: "CUSTOMIZABLE", categoryId: 2023 },
  { id: "cust-acc-4", name: "Blank Cuban Link Chain", price: 45, image: "/prod-tee.png", tag: "CUSTOMIZABLE", categoryId: 2024 },

  // Customizer - Wall Art subcategories
  { id: "cust-art-1", name: "Blank Custom Poster", price: 20, image: "/create-your-own.png", tag: "CUSTOMIZABLE", categoryId: 2051 },
  { id: "cust-art-2", name: "Blank Custom Framed Wall Art", price: 95, image: "/cat-home.png", tag: "CUSTOMIZABLE", categoryId: 2052 },

  // Customizer - Bags subcategories
  { id: "cust-bag-1", name: "Blank Utility Backpack", price: 85, image: "/cat-kids.png", tag: "CUSTOMIZABLE", categoryId: 2061 },
  { id: "cust-bag-2", name: "Blank Heavy Tote Bag", price: 35, image: "/cat-accessories.png", tag: "CUSTOMIZABLE", categoryId: 2062 }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryStr = searchParams.get('category');
  
  if (!categoryStr) {
    return NextResponse.json({ error: 'Category ID parameter is required' }, { status: 400 });
  }

  const categoryId = parseInt(categoryStr, 10);
  if (isNaN(categoryId)) {
    return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 });
  }

  // If WooCommerce is configured, load products live under the requested category
  if (isWooCommerceConfigured()) {
    try {
      const wcProducts = await getProducts({ categoryId, limit: 20 });
      
      if (wcProducts && wcProducts.length > 0) {
        const displayProducts = wcProducts.map(p => {
          let image = p.images[0]?.src || "/prod-hoodie.png";
          const lowerName = p.name.toLowerCase();
          
          // Dynamically apply visual fallbacks for empty WooCommerce image fields
          if (lowerName.includes("iphone") || lowerName.includes("phone") || lowerName.includes("case")) {
            image = "/prod-phone-case.png";
          } else if (lowerName.includes("airpod")) {
            image = "/prod-airpods-cover.png";
          } else if (lowerName.includes("cap") || lowerName.includes("hat")) {
            image = "/prod-cap.png";
          } else if (lowerName.includes("sunglass") || lowerName.includes("glasses")) {
            image = "/prod-sunglasses.png";
          } else if (lowerName.includes("sticker")) {
            image = "/prod-stickers.png";
          }

          return {
            id: p.id.toString(),
            name: p.name,
            price: parseFloat(p.price) || 0,
            image,
            tag: p.on_sale ? "SALE" : p.tags.some(t => t.slug.includes("new")) ? "NEW" : "",
            subcategory: p.categories.find(c => c.id === categoryId)?.name || ""
          };
        });

        return NextResponse.json(displayProducts);
      }
    } catch (error) {
      console.error(`Failed to load WooCommerce products for category ${categoryId}, using fallback:`, error);
    }
  }

  // Fallback to local structured mock products
  let filteredFallback = MOCK_PRODUCTS.filter(p => p.categoryId === categoryId);
  
  // If subcategory has no mapped fallback items, return a default selection
  if (filteredFallback.length === 0) {
    filteredFallback = MOCK_PRODUCTS.slice(0, 4);
  }

  return NextResponse.json(filteredFallback);
}
