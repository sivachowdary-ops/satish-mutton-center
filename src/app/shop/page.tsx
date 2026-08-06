'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { getDbProducts, getDbCategories, getLowestPrice, type Product, type Category } from '@/lib/mockData';
import { ProductCard } from '@/components/product/ProductCard';

type SortOption = 'default' | 'price-asc' | 'price-desc';

function ShopContent() {
  const searchParams = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showFilters, setShowFilters] = useState(false);

  // Live data from Supabase
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [products, cats] = await Promise.all([
          getDbProducts(),
          getDbCategories(),
        ]);
        setAllProducts(products);
        setCategories(cats);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category_id));
    }

    if (inStockOnly) {
      result = result.filter(p => p.variants.some(v => v.stock_qty > 0));
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
        break;
      case 'price-desc':
        result.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
        break;
    }

    return result;
  }, [allProducts, selectedCategories, inStockOnly, sortBy]);

  const toggleCategory = (catId: string) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-heading font-semibold text-ink mb-3">Categories</h3>
        {categories.map(cat => (
          <label key={cat.id} className="flex items-center gap-2 py-1.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat.id)}
              onChange={() => toggleCategory(cat.id)}
              className="w-4 h-4 rounded border-surface-muted text-brand focus:ring-accent accent-brand"
            />
            <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">
              {cat.name}
            </span>
          </label>
        ))}
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setInStockOnly(!inStockOnly)}
            className="w-4 h-4 rounded border-surface-muted text-brand focus:ring-accent accent-brand"
          />
          <span className="text-sm text-ink-muted group-hover:text-ink transition-colors font-medium">
            In Stock Only
          </span>
        </label>
      </div>

      {/* Clear */}
      {(selectedCategories.length > 0 || inStockOnly) && (
        <button
          onClick={() => { setSelectedCategories([]); setInStockOnly(false); }}
          className="text-sm text-brand hover:text-brand-dark font-medium"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 bg-surface-muted rounded w-48 mb-8 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="aspect-square bg-surface-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-heading text-3xl font-bold text-ink mb-8">Shop Fresh Mutton</h1>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 bg-surface-card rounded-2xl p-5 shadow-sm">
            <FilterPanel />
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-surface-card rounded-lg border border-surface-muted text-sm font-medium text-ink"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-ink-muted">{filteredProducts.length} products</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="bg-surface-card border border-surface-muted rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="default">Sort by</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="font-heading text-xl font-semibold text-ink mb-2">No products found</h3>
              <p className="text-ink-muted">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-surface-card rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-lg text-ink">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setShowFilters(false)}
              className="mt-6 w-full bg-brand text-white py-3 rounded-full font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          <div className="h-8 bg-surface-muted rounded w-48 mb-8" />
          <div className="flex gap-8">
            <div className="hidden lg:block w-56 h-64 bg-surface-muted rounded-2xl" />
            <div className="flex-1 space-y-4">
              <div className="h-10 bg-surface-muted rounded-lg" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="aspect-square bg-surface-muted rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
