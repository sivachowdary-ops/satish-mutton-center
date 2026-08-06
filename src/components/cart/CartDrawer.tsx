'use client';

import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore, getCartSubtotal } from '@/store/cartStore';
import { formatPrice } from '@/lib/formatCurrency';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const { items, isCartOpen, setCartOpen, updateQuantity, removeItem } = useCartStore();
  const subtotal = getCartSubtotal(items);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-surface-card z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-surface-muted">
              <h2 className="font-heading text-lg font-bold text-ink flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Your Cart
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-surface-muted rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-ink-muted/30 mb-4" />
                  <p className="text-ink-muted font-medium mb-2">Your cart is empty</p>
                  <Link
                    href="/shop"
                    onClick={() => setCartOpen(false)}
                    className="text-brand hover:text-brand-dark font-semibold underline transition-colors"
                  >
                    Start Shopping →
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map(item => (
                    <div
                      key={item.variant.id}
                      className="flex items-start gap-3 p-3 bg-surface rounded-xl"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-surface-muted rounded-lg shrink-0 overflow-hidden relative border border-brand/5 shadow-sm">
                        {item.product.image_urls && item.product.image_urls[0] ? (
                          <Image
                            src={item.product.image_urls[0].replace('.jpg', '.webp')}
                            alt={item.product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-surface-muted">
                            <span className="text-xl">🥩</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-ink truncate">{item.product.name}</h3>
                        <p className="text-xs text-ink-muted">{item.variant.weight_label}</p>
                        <p className="text-sm font-bold text-brand mt-1">
                          {formatPrice(item.variant.price * item.quantity)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full bg-surface-muted hover:bg-brand hover:text-white flex items-center justify-center transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full bg-surface-muted hover:bg-brand hover:text-white flex items-center justify-center transition-colors"
                            aria-label="Increase quantity"
                            disabled={item.quantity >= 10}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.variant.id)}
                        className="p-1.5 text-ink-muted hover:text-danger transition-colors"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-surface-muted space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-ink-muted font-medium">Subtotal</span>
                  <span className="text-xl font-bold text-ink">{formatPrice(subtotal)}</span>
                </div>
                <Link
                  href="/cart"
                  onClick={() => setCartOpen(false)}
                  className="block w-full bg-brand hover:bg-brand-dark text-white text-center py-3 rounded-full font-semibold transition-colors"
                >
                  View Cart & Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
