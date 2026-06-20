export interface WooCommerceImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WooCommerceCategoryDetail {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  image?: {
    id: number;
    src: string;
    name: string;
    alt: string;
  } | null;
  count: number;
}

export interface WooCommerceTag {
  id: number;
  name: string;
  slug: string;
}

export interface WooCommerceAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: string;
  average_rating: string;
  rating_count: number;
  categories: WooCommerceCategory[];
  tags: WooCommerceTag[];
  images: WooCommerceImage[];
  attributes: WooCommerceAttribute[];
  related_ids: number[];
}

const WOOCOMMERCE_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || 'https://shop.yubbydubby.com';
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

// Base64 encode the credentials for Basic Auth (standard for WooCommerce REST API over HTTPS)
const authHeader =
  CONSUMER_KEY && CONSUMER_SECRET
    ? `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')}`
    : '';

/**
 * Checks if WooCommerce credentials are fully configured.
 */
export function isWooCommerceConfigured(): boolean {
  return !!(CONSUMER_KEY && CONSUMER_SECRET);
}

/**
 * Helper to make authenticated requests to WooCommerce REST API.
 */
export async function fetchWooCommerce<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!isWooCommerceConfigured()) {
    console.warn('WooCommerce API credentials are not configured. Returning empty/mock data.');
    throw new Error('WOOCOMMERCE_NOT_CONFIGURED');
  }

  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Authorization: authHeader,
        ...options.headers,
      },
      // Cache WooCommerce requests for 10 minutes by default
      next: { revalidate: 600, ...options.next },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('WooCommerce API error response:', errorData);
      const friendlyMsg = errorData.message || `WooCommerce API HTTP error ${res.status}: ${res.statusText}`;
      throw new Error(friendlyMsg);
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(`Error fetching WooCommerce endpoint "${endpoint}":`, error);
    throw error;
  }
}

/**
 * Fetch products list with optional category/tag filters
 */
export async function getProducts(params: {
  category?: string;
  categoryId?: number;
  tag?: string;
  limit?: number;
  featured?: boolean;
  status?: string;
} = {}): Promise<WooCommerceProduct[]> {
  if (!isWooCommerceConfigured()) {
    return [];
  }

  const queryParams = new URLSearchParams();
  queryParams.append('status', params.status || 'publish');
  if (params.limit) queryParams.append('per_page', params.limit.toString());
  if (params.featured !== undefined) queryParams.append('featured', params.featured ? 'true' : 'false');
  
  // Note: WooCommerce API uses category and tag IDs, but we can search for categories/tags by slug first if needed
  if (params.categoryId !== undefined) {
    queryParams.append('category', params.categoryId.toString());
  } else if (params.category) {
    const categories = await getCategoriesBySlug(params.category);
    if (categories && categories.length > 0) {
      queryParams.append('category', categories[0].id.toString());
    } else {
      // If category slug is not found, return empty array to prevent showing wrong products
      return [];
    }
  }

  if (params.tag) {
    const tags = await getTagsBySlug(params.tag);
    if (tags && tags.length > 0) {
      queryParams.append('tag', tags[0].id.toString());
    } else {
      return [];
    }
  }

  try {
    return await fetchWooCommerce<WooCommerceProduct[]>(`products?${queryParams.toString()}`);
  } catch (error) {
    console.error('Failed to get products from WooCommerce, returning empty list.', error);
    return [];
  }
}

/**
 * Fetch a single product by ID
 */
/**
 * Fetch product categories from WooCommerce (e.g. parent or all)
 */
export async function getProductCategories(params: {
  parent?: number;
  per_page?: number;
} = {}): Promise<WooCommerceCategoryDetail[]> {
  if (!isWooCommerceConfigured()) {
    return [];
  }

  const queryParams = new URLSearchParams();
  if (params.parent !== undefined) {
    queryParams.append('parent', params.parent.toString());
  }
  queryParams.append('per_page', (params.per_page || 100).toString());

  try {
    return await fetchWooCommerce<WooCommerceCategoryDetail[]>(`products/categories?${queryParams.toString()}`);
  } catch (error) {
    console.error('Failed to get product categories from WooCommerce, returning empty list.', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<WooCommerceProduct | null> {
  if (!isWooCommerceConfigured()) {
    return null;
  }

  try {
    return await fetchWooCommerce<WooCommerceProduct>(`products/${id}`);
  } catch (error) {
    console.error(`Failed to get product ${id} from WooCommerce.`, error);
    return null;
  }
}

/**
 * Fetch categories by slug
 */
async function getCategoriesBySlug(slug: string): Promise<WooCommerceCategory[]> {
  try {
    return await fetchWooCommerce<WooCommerceCategory[]>(`products/categories?slug=${encodeURIComponent(slug)}`);
  } catch (error) {
    console.error(`Failed to fetch category by slug: ${slug}`, error);
    return [];
  }
}

/**
 * Fetch tags by slug
 */
async function getTagsBySlug(slug: string): Promise<WooCommerceTag[]> {
  try {
    return await fetchWooCommerce<WooCommerceTag[]>(`products/tags?slug=${encodeURIComponent(slug)}`);
  } catch (error) {
    console.error(`Failed to fetch tag by slug: ${slug}`, error);
    return [];
  }
}
