import { NextResponse } from 'next/server';
import { getProducts, isWooCommerceConfigured, fetchWooCommerce, getCategoriesBySlug } from '@/lib/woocommerce';

// Fallback mock products array (empty - products fetched from WooCommerce API)
const MOCK_PRODUCTS: any[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Read filters
  const categoriesParam = searchParams.get('categories'); // e.g. "11,22,52"
  const categorySlugParam = searchParams.get('category'); // e.g. "mens", "womens", "home-living"
  const minPriceParam = searchParams.get('min_price');
  const maxPriceParam = searchParams.get('max_price');
  const colorsParam = searchParams.get('colors'); // e.g. "Black,Stone"
  const sizesParam = searchParams.get('sizes'); // e.g. "S,M,XL"
  const materialsParam = searchParams.get('materials');
  const brandsParam = searchParams.get('brands');
  const tagsParam = searchParams.get('tags');
  const ratingParam = searchParams.get('rating'); // e.g. "4" -> 4★ & above
  const discountParam = searchParams.get('discount'); // e.g. "20" -> 20%+
  const availabilityParam = searchParams.get('availability'); // e.g. "instock,outofstock"
  const sortBy = searchParams.get('sort_by') || 'featured';
  const searchStr = searchParams.get('search');
  const limitParam = searchParams.get('limit') || '100';

  let productsList: any[] = [];
  let totalCount = 0;

  if (isWooCommerceConfigured()) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('per_page', limitParam);
      queryParams.append('status', 'publish');

      // Native WooCommerce filter queries where applicable
      if (searchStr) queryParams.append('search', searchStr);
      if (minPriceParam) queryParams.append('min_price', minPriceParam);
      if (maxPriceParam) queryParams.append('max_price', maxPriceParam);

      // Resolve category IDs from categoriesParam or categorySlugParam
      const targetCategoryIds: number[] = [];
      if (categoriesParam) {
        categoriesParam.split(',').forEach(id => {
          const parsed = parseInt(id, 10);
          if (!isNaN(parsed)) targetCategoryIds.push(parsed);
        });
      }
      if (categorySlugParam && categorySlugParam !== 'all') {
        const foundCats = await getCategoriesBySlug(categorySlugParam);
        if (foundCats && foundCats.length > 0) {
          foundCats.forEach(c => {
            if (!targetCategoryIds.includes(c.id)) targetCategoryIds.push(c.id);
          });
        }
      }

      if (targetCategoryIds.length > 0) {
        queryParams.append('category', targetCategoryIds.join(','));
      }

      // Map Sort By directly to WooCommerce API orderby where applicable
      if (sortBy === 'price_asc') {
        queryParams.append('orderby', 'price');
        queryParams.append('order', 'asc');
      } else if (sortBy === 'price_desc') {
        queryParams.append('orderby', 'price');
        queryParams.append('order', 'desc');
      } else if (sortBy === 'newest') {
        queryParams.append('orderby', 'date');
        queryParams.append('order', 'desc');
      } else if (sortBy === 'title_asc') {
        queryParams.append('orderby', 'title');
        queryParams.append('order', 'asc');
      } else if (sortBy === 'title_desc') {
        queryParams.append('orderby', 'title');
        queryParams.append('order', 'desc');
      } else if (sortBy === 'rating_desc') {
        queryParams.append('orderby', 'rating');
        queryParams.append('order', 'desc');
      } else if (sortBy === 'popularity_desc') {
        queryParams.append('orderby', 'popularity');
        queryParams.append('order', 'desc');
      }

      let wcProducts: any[] = [];
      if (!categorySlugParam && !categoriesParam && !searchStr) {
        const [p1, p2]: [any, any] = await Promise.all([
          fetchWooCommerce(`products?${queryParams.toString()}&page=1`).catch(() => []),
          fetchWooCommerce(`products?${queryParams.toString()}&page=2`).catch(() => [])
        ]);
        const p1Arr = Array.isArray(p1) ? p1 : [];
        const p2Arr = Array.isArray(p2) ? p2 : [];
        wcProducts = [...p1Arr, ...p2Arr];
      } else {
        const res: any = await fetchWooCommerce(`products?${queryParams.toString()}`);
        wcProducts = Array.isArray(res) ? res : [];
      }
      
      productsList = wcProducts.map((p: any) => {
        let image = p.images[0]?.src;
        if (!image) {
          image = "/prod-hoodie.png";
          const lowerName = p.name.toLowerCase();
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
        }

        const regularPriceVal = parseFloat(p.regular_price) || parseFloat(p.price) || 0;
        const priceVal = parseFloat(p.price) || 0;
        const discountPct = regularPriceVal > priceVal 
          ? Math.round(((regularPriceVal - priceVal) / regularPriceVal) * 100) 
          : 0;

        return {
          id: p.id.toString(),
          name: p.name.toUpperCase(),
          price: priceVal,
          regularPrice: regularPriceVal > priceVal ? regularPriceVal : undefined,
          image,
          tag: p.on_sale ? "SALE" : p.tags.some((t: any) => t.slug.includes("new")) ? "NEW" : "",
          categories: p.categories.map((c: any) => c.id),
          colors: p.attributes.find((a: any) => a.name.toLowerCase() === 'color' || a.name.toLowerCase() === 'colour')?.options || [],
          sizes: p.attributes.find((a: any) => a.name.toLowerCase() === 'size')?.options || [],
          materials: p.attributes.find((a: any) => a.name.toLowerCase() === 'material')?.options || [],
          brands: p.attributes.find((a: any) => a.name.toLowerCase() === 'brand')?.options || [],
          tags: p.tags.map((t: any) => t.name.toLowerCase()),
          rating: parseFloat(p.average_rating) || 5.0,
          onSale: p.on_sale,
          availability: p.stock_status, // "instock", "outofstock", "onbackorder"
          discount: discountPct
        };
      });

    } catch (error) {
      console.error("WooCommerce products query failed, using fallbacks:", error);
    }
  }

  // Fallback to mock catalog
  if (productsList.length === 0) {
    productsList = MOCK_PRODUCTS.map(p => ({
      ...p,
      categories: [p.categoryId],
      colors: p.color ? [p.color] : [],
      sizes: p.size ? [p.size] : [],
      materials: p.material ? [p.material] : [],
      brands: p.brand ? [p.brand] : [],
      tags: p.tag ? [p.tag.toLowerCase()] : []
    }));
  }

  // ----------------------------------------------------
  // Apply In-Memory Filters (Supports complex combinations)
  // ----------------------------------------------------

  let filtered = productsList;

  // 1. Multi-Select Categories
  const categoryIds = categoriesParam ? categoriesParam.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id)) : [];
  if (categoryIds.length > 0) {
    filtered = filtered.filter(p => p.categories.some((cid: number) => categoryIds.includes(cid)));
  }

  // 2. Price Range (Slider fallback bounds check)
  if (minPriceParam) {
    const minP = parseFloat(minPriceParam);
    filtered = filtered.filter(p => p.price >= minP);
  }
  if (maxPriceParam) {
    const maxP = parseFloat(maxPriceParam);
    filtered = filtered.filter(p => p.price <= maxP);
  }

  // 3. Multi-Select Color Swatches
  if (colorsParam) {
    const colors = colorsParam.split(',').map(c => c.toLowerCase());
    filtered = filtered.filter(p => p.colors.some((c: string) => colors.includes(c.toLowerCase())));
  }

  // 4. Multi-Select Sizes
  if (sizesParam) {
    const sizes = sizesParam.split(',').map(s => s.toLowerCase());
    filtered = filtered.filter(p => p.sizes.some((s: string) => sizes.includes(s.toLowerCase())));
  }

  // 5. Multi-Select Materials
  if (materialsParam) {
    const materials = materialsParam.split(',').map(m => m.toLowerCase());
    filtered = filtered.filter(p => p.materials.some((m: string) => materials.includes(m.toLowerCase())));
  }

  // 6. Multi-Select Brands
  if (brandsParam) {
    const brands = brandsParam.split(',').map(b => b.toLowerCase());
    filtered = filtered.filter(p => p.brands.some((b: string) => brands.includes(b.toLowerCase())));
  }

  // 7. Multi-Select Tags
  if (tagsParam) {
    const tags = tagsParam.split(',').map(t => t.toLowerCase());
    filtered = filtered.filter(p => p.tags.some((t: string) => tags.includes(t.toLowerCase())));
  }

  // 8. Rating Threshold (e.g. 4★ and above)
  if (ratingParam) {
    const ratingVal = parseFloat(ratingParam);
    filtered = filtered.filter(p => p.rating >= ratingVal);
  }

  // 9. Discount Threshold (e.g. 20% and above)
  if (discountParam) {
    const discountVal = parseInt(discountParam, 10);
    filtered = filtered.filter(p => p.discount >= discountVal);
  }

  // 10. Availability Filter
  if (availabilityParam) {
    const availList = availabilityParam.split(',').map(a => a.toLowerCase());
    filtered = filtered.filter(p => availList.includes(p.availability));
  }

  // 11. Custom Sorting (If not already sorted by WooCommerce)
  if (sortBy === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating_desc') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'popularity_desc') {
    // Custom sort order based on rating count or id if count is missing
    filtered.sort((a, b) => (b.ratingCount || b.id) - (a.ratingCount || a.id));
  } else if (sortBy === 'title_asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'title_desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy === 'discount_desc') {
    filtered.sort((a, b) => b.discount - a.discount);
  } else if (sortBy === 'availability') {
    // Show in-stock items first
    const statusWeight = (status: string) => status === 'instock' ? 0 : status === 'onbackorder' ? 1 : 2;
    filtered.sort((a, b) => statusWeight(a.availability) - statusWeight(b.availability));
  }

  totalCount = filtered.length;

  return NextResponse.json({
    products: filtered,
    totalCount
  });
}
