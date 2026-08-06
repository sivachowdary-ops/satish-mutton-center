'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, ShoppingCart, ChevronDown, Check } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/formatCurrency';
import { getWhatsAppLink } from '@/lib/whatsapp';
import type { Product } from '@/lib/mockData';
import { toast } from 'sonner';

export function ProductDetail({ product, categoryName }: { product: Product; categoryName: string }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCartStore();

  const variant = product.variants[selectedVariantIndex];
  const isOutOfStock = variant.stock_qty <= 0;
  const isLowStock = variant.stock_qty > 0 && variant.stock_qty <= product.low_stock_threshold;
  const lineTotal = variant.price * quantity;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, variant, quantity);
    setIsAdded(true);
    toast.success(`${product.name} (${variant.weight_label}) x${quantity} added to cart!`);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleNotifyWhatsApp = () => {
    const msg = `Hi, I'd like to be notified when ${product.name} (${variant.weight_label}) is back in stock.`;
    window.open(getWhatsAppLink(msg), '_blank');
  };

  const accordionItems = [
    { key: 'description', title: 'Description', content: product.description },
    { key: 'cooking', title: 'Storage & Cooking Tips', content: product.cooking_tips || 'No tips available.' },
    { key: 'delivery', title: 'Delivery Info', content: 'Orders are delivered fresh same-day or next-day within our service area around Rajahmundry. Delivery charges confirmed on WhatsApp.' },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start bg-surface-card rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(122,31,31,0.05)] border border-brand/5">
      {/* Product Image Section */}
      <div className="aspect-square bg-surface-muted rounded-2xl overflow-hidden relative border border-brand/5 shadow-inner">
        {product.image_urls && product.image_urls[0] ? (
          <Image
            src={product.image_urls[0]}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-surface-muted to-surface">
            <span className="text-8xl">🥩</span>
            <p className="text-ink-muted text-sm mt-4 font-semibold">{product.name}</p>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-black tracking-widest text-accent uppercase bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
            {categoryName}
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-ink mt-3">{product.name}</h1>
        </div>

        {/* Stock Badge */}
        <div>
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-danger/10 text-danger text-xs font-bold border border-danger/20">
              ● Sold Out
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-xs font-bold border border-warning/20">
              ● Low Stock — Only a few left!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-bold border border-success/20">
              ● Freshly Stocked
            </span>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pb-4 border-b border-surface-muted">
          <span className="text-3xl font-black text-brand">{formatPrice(variant.price)}</span>
          {variant.compare_at_price && (
            <span className="text-lg text-ink-muted line-through font-semibold">{formatPrice(variant.compare_at_price)}</span>
          )}
        </div>

        {/* Weight Selector */}
        {product.variants.length > 1 && (
          <div>
            <p className="text-xs font-black text-ink uppercase tracking-wider mb-2.5">Select Portion Weight</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVariantIndex(idx);
                    setQuantity(1);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                    idx === selectedVariantIndex
                      ? 'bg-brand text-white border-brand shadow-md'
                      : 'bg-surface hover:bg-brand/5 border-surface-muted text-ink-muted hover:text-ink'
                  } ${v.stock_qty <= 0 ? 'opacity-50 line-through cursor-not-allowed' : ''}`}
                  disabled={v.stock_qty <= 0}
                >
                  {v.weight_label} · {formatPrice(v.price)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selection */}
        {!isOutOfStock && (
          <div>
            <p className="text-xs font-black text-ink uppercase tracking-wider mb-2.5">Select Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl bg-surface-muted hover:bg-brand hover:text-white flex items-center justify-center transition-colors border border-brand/5"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-black w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-10 h-10 rounded-xl bg-surface-muted hover:bg-brand hover:text-white flex items-center justify-center transition-colors border border-brand/5"
                disabled={quantity >= 10}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Add to Cart CTA */}
        <div className="pt-2">
          {isOutOfStock ? (
            <button
              onClick={handleNotifyWhatsApp}
              className="w-full bg-whatsapp hover:bg-[#20bd5a] text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <WhatsAppIcon className="w-5 h-5 text-white" /> Notify Me on WhatsApp
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                isAdded
                  ? 'bg-success text-white'
                  : 'bg-brand hover:bg-brand-dark text-white hover:shadow-lg'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" /> Add to Cart — {formatPrice(lineTotal)}
                </>
              )}
            </button>
          )}
        </div>

        {/* Accordions */}
        <div className="mt-8 border-t border-surface-muted pt-2">
          {accordionItems.map(item => (
            <div key={item.key} className="border-b border-surface-muted">
              <button
                onClick={() => setOpenAccordion(openAccordion === item.key ? null : item.key)}
                className="w-full flex items-center justify-between py-4 text-left group"
              >
                <span className="font-heading font-extrabold text-ink group-hover:text-brand transition-colors">
                  {item.title}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-ink-muted transition-transform duration-300 ${
                    openAccordion === item.key ? 'rotate-180 text-brand' : ''
                  }`}
                />
              </button>
              {openAccordion === item.key && (
                <div className="pb-4 text-ink-muted text-sm leading-relaxed font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                  {item.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Mobile Bar */}
      {!isOutOfStock && (
        <div className="fixed bottom-0 left-0 right-0 bg-surface-card border-t border-surface-muted/60 p-4 md:hidden z-30 shadow-[0_-4px_25px_rgba(122,31,31,0.08)]">
          <button
            onClick={handleAddToCart}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm ${
              isAdded ? 'bg-success text-white' : 'bg-brand hover:bg-brand-dark text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" /> Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add to Cart — {formatPrice(lineTotal)}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
