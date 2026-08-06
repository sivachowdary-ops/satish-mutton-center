import { getDbProducts, getDbProductBySlug, getRelatedProducts, getCategoryName } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductCard } from '@/components/product/ProductCard';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getDbProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} — Fresh Mutton`,
    description: product.description,
  };
}

export async function generateStaticParams() {
  const products = await getDbProducts();
  return products.map(p => ({ slug: p.slug }));
}

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const product = await getDbProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const categoryName = getCategoryName(product.category_id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-ink-muted mb-6">
        <a href="/shop" className="hover:text-brand transition-colors">Shop</a>
        <span className="mx-2">›</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <ProductDetail product={product} categoryName={categoryName} />

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading text-2xl font-bold text-ink mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
