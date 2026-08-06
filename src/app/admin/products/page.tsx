'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Check, Download } from 'lucide-react';
import { formatPrice } from '@/lib/formatCurrency';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface Variant {
  id: string;
  weight_label: string;
  price: number;
  stock_qty: number;
  is_active: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  low_stock_threshold: number;
  is_active: boolean;
  variants: Variant[];
}

export default function AdminProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>('');

  async function loadProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          description,
          low_stock_threshold,
          is_active,
          product_variants (
            id,
            weight_label,
            price,
            stock_qty,
            is_active
          )
        `)
        .order('name');

      if (error) throw error;

      const formatted: Product[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description || '',
        low_stock_threshold: p.low_stock_threshold || 5,
        is_active: p.is_active,
        variants: (p.product_variants || []).map((v: any) => ({
          id: v.id,
          weight_label: v.weight_label,
          price: Number(v.price),
          stock_qty: v.stock_qty,
          is_active: v.is_active,
        })),
      }));

      setProductsList(formatted);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load products from database');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEditPrice = (variantId: string, currentPrice: number) => {
    setEditingVariantId(variantId);
    setEditingPrice(currentPrice.toString());
  };

  const handleSavePrice = async (productId: string, variantId: string) => {
    const priceNum = parseFloat(editingPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      const { error } = await supabase
        .from('product_variants')
        .update({ price: priceNum })
        .eq('id', variantId);

      if (error) throw error;

      setProductsList(prev =>
        prev.map(p => {
          if (p.id === productId) {
            return {
              ...p,
              variants: p.variants.map(v =>
                v.id === variantId ? { ...v, price: priceNum } : v
              ),
            };
          }
          return p;
        })
      );

      setEditingVariantId(null);
      toast.success('Price updated successfully in database!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save price');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Product Name', 'Variant Weight', 'Price', 'Stock Qty'];
    const rows = productsList.flatMap(p =>
      p.variants.map(v => [p.name, v.weight_label, v.price.toString(), v.stock_qty.toString()])
    );

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'satish_mutton_products.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Products exported to CSV!');
  };

  const filteredProducts = productsList.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-ink-muted/50" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-muted bg-surface-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-card hover:bg-surface-muted text-ink border border-surface-muted rounded-full text-sm font-semibold transition-colors flex-1 sm:flex-none"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => toast.info('Manage products through the Supabase Dashboard')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-full text-sm font-semibold transition-colors flex-1 sm:flex-none"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-surface-card rounded-2xl shadow-sm border border-surface-muted overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-surface-muted bg-surface/50 text-ink-muted">
                <th className="py-3.5 px-6 font-semibold">Product Name</th>
                <th className="py-3.5 px-6 font-semibold">Variants / Price Grid</th>
                <th className="py-3.5 px-6 font-semibold">Low Stock Threshold</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-ink-muted italic">
                    No products found in the database.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="border-b border-surface-muted hover:bg-surface/10 transition-colors">
                    <td className="py-4 px-6">
                      <h3 className="font-semibold text-ink text-sm">{product.name}</h3>
                      <p className="text-xs text-ink-muted mt-1 line-clamp-1 max-w-[240px]">
                        {product.description}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-2.5 min-w-[280px]">
                        {product.variants.map(variant => (
                          <div key={variant.id} className="flex items-center justify-between gap-4 p-2 bg-surface rounded-lg">
                            <div>
                              <span className="text-xs font-semibold text-ink">{variant.weight_label}</span>
                              <span className="text-[10px] text-ink-muted ml-2">({variant.stock_qty} in stock)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {editingVariantId === variant.id ? (
                                <>
                                  <input
                                    type="number"
                                    value={editingPrice}
                                    onChange={e => setEditingPrice(e.target.value)}
                                    className="w-20 px-2 py-1 border border-brand/50 rounded bg-white text-ink text-xs font-bold focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleSavePrice(product.id, variant.id)}
                                    className="p-1 bg-success text-white rounded hover:bg-success/90"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span className="text-xs font-bold text-brand">{formatPrice(variant.price)}</span>
                                  <button
                                    onClick={() => handleEditPrice(variant.id, variant.price)}
                                    className="p-1 text-ink-muted hover:text-brand hover:bg-surface-card rounded transition-colors"
                                    aria-label="Edit price"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-ink">{product.low_stock_threshold} units</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                        product.is_active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
