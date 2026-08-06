'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
}

export default function AdminCategoriesPage() {
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCategories() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setCategoriesList(data || []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All products in it will also be deleted.')) return;
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategoriesList(prev => prev.filter(c => c.id !== id));
      toast.success('Category deleted successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="animate-spin w-8 h-8 border-4 border-brand border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-sm text-ink-muted">Manage product groupings and ordering</h2>
        <button
          onClick={() => toast.info('Manage categories through the Supabase Dashboard')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-full text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {categoriesList.length === 0 ? (
        <p className="text-sm text-ink-muted py-6 italic text-center">No categories found in database.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesList.map(cat => (
            <div
              key={cat.id}
              className="bg-surface-card rounded-2xl p-6 shadow-sm border border-surface-muted flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading font-bold text-lg text-ink">{cat.name}</h3>
                  <span className="text-[10px] bg-brand/10 text-brand px-2 py-0.5 rounded-full font-bold">
                    Order: {cat.sort_order}
                  </span>
                </div>
                <p className="text-xs text-ink-muted font-mono mb-4">Slug: {cat.slug}</p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-surface-muted/50 mt-4">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                  cat.is_active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                }`}>
                  {cat.is_active ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toast.info('Manage edits directly inside Supabase Dashboard')}
                    className="p-1.5 text-ink-muted hover:text-brand hover:bg-surface rounded-lg transition-colors"
                    aria-label="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 text-ink-muted hover:text-danger hover:bg-surface rounded-lg transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
