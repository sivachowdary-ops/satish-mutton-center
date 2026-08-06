import { supabase } from '@/lib/supabase';

// Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  weight_label: string;
  price: number;
  compare_at_price?: number;
  stock_qty: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  cooking_tips?: string;
  image_urls: string[];
  is_active: boolean;
  is_featured: boolean;
  low_stock_threshold: number;
  variants: ProductVariant[];
}

export interface Testimonial {
  id: string;
  customer_name: string;
  quote: string;
  rating: number;
  is_active: boolean;
  sort_order: number;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface OrderItem {
  product_id: string;
  variant_id: string;
  name: string;
  weight_label: string;
  price: number;
  quantity: number;
  line_total: number;
}

export type OrderStatus = 'pending_confirmation' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled';

// ── Fallback Categories ──
export const categories: Category[] = [
  { id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c', name: 'Mutton Cuts', slug: 'mutton-cuts', sort_order: 0, is_active: true },
  { id: 'b2c3d4e5-f6a7-4f8a-9b0c-1d2e3f4a5b6c', name: 'Specialty Cuts', slug: 'specialty-cuts', sort_order: 1, is_active: true },
];

// ── Fallback Products with Variants ──
export const products: Product[] = [
  {
    id: '1a1a1a1a-1111-2222-3333-444444444444',
    category_id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    name: 'Mutton (Curry Cut)',
    slug: 'mutton-curry-cut',
    description: 'Perfectly sized pieces of fresh goat meat, ideal for traditional curries, biryanis, and gravies. Bone-in cuts deliver rich flavour and tender texture when slow-cooked.',
    cooking_tips: 'Marinate for at least 30 minutes. Slow-cook on low flame for tender, fall-off-the-bone results. Pairs well with rice or roti.',
    image_urls: ['/images/products/mutton-curry-cut.webp'],
    is_active: true,
    is_featured: true,
    low_stock_threshold: 5,
    variants: [
      { id: 'p1-v1', product_id: '1a1a1a1a-1111-2222-3333-444444444444', weight_label: '500g', price: 500, stock_qty: 25, is_active: true },
      { id: 'p1-v2', product_id: '1a1a1a1a-1111-2222-3333-444444444444', weight_label: '1kg', price: 1000, stock_qty: 15, is_active: true },
    ],
  },
  {
    id: '2a2a2a2a-2222-3333-4444-555555555555',
    category_id: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    name: 'Boneless Mutton',
    slug: 'boneless-mutton',
    description: 'Premium boneless goat meat, cleaned and ready to cook. Perfect for kebabs, keema, curries, and stir-fry recipes where convenience matters.',
    cooking_tips: 'Cut into even-sized pieces for uniform cooking. Great for pressure-cooker curries — cooks in 15-20 minutes.',
    image_urls: ['/images/products/boneless-mutton.webp'],
    is_active: true,
    is_featured: true,
    low_stock_threshold: 5,
    variants: [
      { id: 'p2-v1', product_id: '2a2a2a2a-2222-3333-4444-555555555555', weight_label: '500g', price: 600, stock_qty: 20, is_active: true },
      { id: 'p2-v2', product_id: '2a2a2a2a-2222-3333-4444-555555555555', weight_label: '1kg', price: 1200, stock_qty: 10, is_active: true },
    ],
  },
  {
    id: '3a3a3a3a-3333-4444-5555-666666666666',
    category_id: 'b2c3d4e5-f6a7-4f8a-9b0c-1d2e3f4a5b6c',
    name: 'Kalu Thalakai (Leg & Head)',
    slug: 'kalu-thalakai',
    description: 'Traditional pack of goat legs and head — a delicacy prized across Andhra Pradesh. Slow-cooked to perfection, it yields a gelatinous, deeply flavourful broth.',
    cooking_tips: 'Clean thoroughly and boil with turmeric before cooking. Best slow-cooked for 2-3 hours for maximum flavour.',
    image_urls: ['/images/products/kalu-thalakai.webp'],
    is_active: true,
    is_featured: true,
    low_stock_threshold: 3,
    variants: [
      { id: 'p3-v1', product_id: '3a3a3a3a-3333-4444-5555-666666666666', weight_label: 'Pack of 4', price: 800, stock_qty: 8, is_active: true },
    ],
  },
  {
    id: '4a4a4a4a-4444-5555-6666-777777777777',
    category_id: 'b2c3d4e5-f6a7-4f8a-9b0c-1d2e3f4a5b6c',
    name: 'Botti Set (Cleaned Tripe Set)',
    slug: 'botti-set',
    description: 'Thoroughly cleaned and processed tripe set, ready for cooking. A staple in Andhra-style botti curries and fry preparations.',
    cooking_tips: 'Pressure-cook for 10-15 minutes until tender. Fry with spices for a crispy botti fry or simmer in gravy.',
    image_urls: ['/images/products/botti-set.webp'],
    is_active: true,
    is_featured: false,
    low_stock_threshold: 5,
    variants: [
      { id: 'p4-v1', product_id: '4a4a4a4a-4444-5555-6666-777777777777', weight_label: '1 Set', price: 300, stock_qty: 12, is_active: true },
    ],
  },
  {
    id: '5a5a5a5a-5555-6666-7777-888888888888',
    category_id: 'b2c3d4e5-f6a7-4f8a-9b0c-1d2e3f4a5b6c',
    name: 'Meaka Salthilu',
    slug: 'meaka-salthilu',
    description: 'A traditional specialty — carefully prepared goat parts, cleaned and ready for authentic Andhra recipes.',
    cooking_tips: 'Best prepared with traditional spice blends. Slow-cook for rich, deep flavours.',
    image_urls: ['/images/products/meaka-salthilu.webp'],
    is_active: true,
    is_featured: false,
    low_stock_threshold: 3,
    variants: [
      { id: 'p5-v1', product_id: '5a5a5a5a-5555-6666-7777-888888888888', weight_label: 'TBD — confirm unit with Satish', price: 1000, stock_qty: 6, is_active: true },
    ],
  },
  {
    id: '6a6a6a6a-6666-7777-8888-999999999999',
    category_id: 'b2c3d4e5-f6a7-4f8a-9b0c-1d2e3f4a5b6c',
    name: 'Tilli (Spleen)',
    slug: 'tilli-spleen',
    description: 'Fresh goat spleen, cleaned and ready to cook. A nutritious delicacy perfect for fry and curry preparations.',
    cooking_tips: 'Pan-fry with onions and spices for a quick, flavourful dish. Do not overcook — it toughens quickly.',
    image_urls: ['/images/products/tilli-spleen.webp'],
    is_active: true,
    is_featured: false,
    low_stock_threshold: 5,
    variants: [
      { id: 'p6-v1', product_id: '6a6a6a6a-6666-7777-8888-999999999999', weight_label: 'TBD — confirm unit with Satish', price: 100, stock_qty: 15, is_active: true },
    ],
  },
];

// ── Fallback Testimonials ──
export const testimonials: Testimonial[] = [
  {
    id: 't1',
    customer_name: 'Ramesh Kumar',
    quote: 'The freshest mutton I\'ve ever had delivered. You can tell it\'s cut the same day. My family loves the curry cut!',
    rating: 5,
    is_active: true,
    sort_order: 0,
  },
  {
    id: 't2',
    customer_name: 'Lakshmi Devi',
    quote: 'Satish Mutton has been our go-to for months. The boneless mutton is perfectly cleaned and the price is very fair.',
    rating: 5,
    is_active: true,
    sort_order: 1,
  },
  {
    id: 't3',
    customer_name: 'Venkat Rao',
    quote: 'Ordered Kalu Thalakai for a family gathering. Everyone asked where I got such quality meat. Highly recommended!',
    rating: 5,
    is_active: true,
    sort_order: 2,
  },
];

// ── Fetchers supporting live database content & mock fallback ──

export async function getDbProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        category_id,
        name,
        slug,
        description,
        cooking_tips,
        image_urls,
        is_active,
        is_featured,
        low_stock_threshold,
        product_variants (
          id,
          weight_label,
          price,
          stock_qty,
          is_active
        )
      `)
      .eq('is_active', true);

    if (error || !data || data.length === 0) return products;

    return data.map((p: any) => ({
      id: p.id,
      category_id: p.category_id,
      name: p.name,
      slug: p.slug,
      description: p.description || '',
      cooking_tips: p.cooking_tips || '',
      image_urls: p.image_urls || [],
      is_active: p.is_active,
      is_featured: p.is_featured,
      low_stock_threshold: p.low_stock_threshold || 5,
      variants: (p.product_variants || []).map((v: any) => ({
        id: v.id,
        product_id: p.id,
        weight_label: v.weight_label,
        price: Number(v.price),
        stock_qty: v.stock_qty,
        is_active: v.is_active,
      })),
    }));
  } catch {
    return products;
  }
}

export async function getDbCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error || !data || data.length === 0) return categories;
    return data;
  } catch {
    return categories;
  }
}

export async function getDbProductBySlug(slug: string): Promise<Product | undefined> {
  const dbProducts = await getDbProducts();
  return dbProducts.find(p => p.slug === slug);
}

export async function getDbTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error || !data || data.length === 0) return testimonials;
    return data;
  } catch {
    return testimonials;
  }
}

// ── Legacy Synchronous Fetchers for backward compatibility & static checks ──
export function getProducts(): Product[] {
  return products.filter(p => p.is_active);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug && p.is_active);
}

export function getCategories(): Category[] {
  return categories.filter(c => c.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.is_active && p.is_featured);
}

export function getTestimonials(): Testimonial[] {
  return testimonials.filter(t => t.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const category = categories.find(c => c.slug === categorySlug);
  if (!category) return [];
  return products.filter(p => p.category_id === category.id && p.is_active);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(p => p.category_id === product.category_id && p.id !== product.id && p.is_active)
    .slice(0, limit);
}

export function getLowestPrice(product: Product): number {
  const activePrices = product.variants.filter(v => v.is_active).map(v => v.price);
  return Math.min(...activePrices);
}

export function getCategoryName(categoryId: string): string {
  return categories.find(c => c.id === categoryId)?.name || 'Unknown';
}
