'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Plus, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/formatCurrency';
import type { Product } from '@/lib/mockData';
import { getLowestPrice } from '@/lib/mockData';
import { toast } from 'sonner';

export function ProductCard({ product }: { product: Product }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const { addItem } = useCartStore();
  const lowestPrice = getLowestPrice(product);
  const hasMultipleVariants = product.variants.length > 1;
  const [showVariants, setShowVariants] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const selectedVariant = product.variants[selectedVariantIndex];
  const isOutOfStock = selectedVariant.stock_qty <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasMultipleVariants && !showVariants) {
      setShowVariants(true);
      return;
    }
    if (isOutOfStock) return;
    addItem(product, selectedVariant, 1);
    setIsAdded(true);
    toast.success(`${product.name} (${selectedVariant.weight_label}) added to cart!`);
    setTimeout(() => setIsAdded(false), 1500);
    setShowVariants(false);
  };

  return (
    <div className="bg-surface-card rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(122,31,31,0.04)] hover:shadow-[0_12px_35px_rgba(122,31,31,0.12)] border border-brand/5 transition-all duration-500 flex flex-col group h-full">
      {/* Product Image Container */}
      <div className="aspect-square bg-surface-muted relative overflow-hidden shrink-0">
        {product.image_urls && product.image_urls[0] ? (
          <Image
            src={product.image_urls[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-muted to-surface">
            <span className="text-4xl">🥩</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status badges */}
        {product.is_featured && (
          <span className="absolute top-2 left-2 bg-accent text-brand-dark text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            Bestseller
          </span>
        )}
        {isOutOfStock && (
          <span className="absolute top-2 right-2 bg-danger text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            Sold Out
          </span>
        )}
      </div>

      {/* Info Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <h3 className="font-heading font-extrabold text-ink text-[14px] sm:text-base leading-tight line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Pricing display */}
        <div className="mt-2 flex items-baseline justify-between gap-1 flex-wrap">
          <span className="text-brand font-black text-sm sm:text-base">
            {formatPrice(selectedVariant.price)}
          </span>
          {hasMultipleVariants && (
            <span className="text-[10px] font-semibold text-ink-muted bg-surface-muted px-2 py-0.5 rounded">
              {selectedVariant.weight_label}
            </span>
          )}
        </div>

        {/* Variant Pills inside card */}
        {showVariants && hasMultipleVariants && (
          <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-surface-muted">
            {product.variants.map((variant, idx) => (
              <button
                key={variant.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVariantIndex(idx);
                }}
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all border ${
                  idx === selectedVariantIndex
                    ? 'bg-brand text-white border-brand shadow-sm'
                    : 'bg-surface-card text-ink-muted border-surface-muted hover:bg-brand/5'
                }`}
              >
                {variant.weight_label}
              </button>
            ))}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock && showVariants}
          className={`mt-4 w-full py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            isOutOfStock
              ? 'bg-surface-muted text-ink-muted cursor-not-allowed border border-surface-muted'
              : isAdded
              ? 'bg-success text-white'
              : 'bg-brand hover:bg-brand-dark text-white hover:shadow-md'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" /> Added!
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {isOutOfStock ? 'Sold Out' : showVariants ? 'Confirm Add' : hasMultipleVariants ? 'Select Options' : 'Add to Cart'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
