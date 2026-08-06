'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { useCartStore, getCartSubtotal } from '@/store/cartStore';
import { formatPrice } from '@/lib/formatCurrency';
import { buildWhatsAppOrderMessage, getWhatsAppLink } from '@/lib/whatsapp';
import { checkoutFormSchema, type CheckoutFormData } from '@/lib/validations';
import { siteConfig } from '@/config/site';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import type { OrderItem } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, hasHydrated } = useCartStore();
  const subtotal = getCartSubtotal(items);

  // All hooks must be declared before any early returns (Rules of Hooks)
  const [form, setForm] = useState<CheckoutFormData>({
    name: '',
    phone: '',
    address: '',
    deliveryDate: '',
    deliverySlot: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  // Wait for Zustand to rehydrate from localStorage before rendering
  // This prevents the blank flash and perceived slowness on first load
  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="animate-spin w-10 h-10 border-4 border-brand border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const result = checkoutFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderRef = `MTN-${nanoid(8).toUpperCase()}`;

      const orderItems: OrderItem[] = items.map(item => ({
        product_id: item.product.id,
        variant_id: item.variant.id,
        name: item.product.name,
        weight_label: item.variant.weight_label,
        price: item.variant.price,
        quantity: item.quantity,
        line_total: item.variant.price * item.quantity,
      }));

      // ── 1. Save order to Supabase ──────────────────────────────
      const { error: insertError } = await supabase.from('orders').insert({
        order_ref: orderRef,
        customer_name: form.name,
        customer_phone: form.phone,
        delivery_address: form.address,
        delivery_date: form.deliveryDate,
        delivery_slot: form.deliverySlot,
        notes: form.notes || null,
        items: orderItems,
        subtotal: subtotal,
        total_amount: subtotal,
        status: 'pending_confirmation',
      });

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        toast.error(`Failed to save order: ${insertError.message}`);
        return;
      }

      // ── 2. Open WhatsApp with order details ──────────────────────
      const orderData = {
        orderRef,
        name: form.name,
        phone: form.phone,
        address: form.address,
        deliveryDate: form.deliveryDate,
        deliverySlot: form.deliverySlot,
        items: orderItems,
        total: subtotal,
        notes: form.notes,
      };

      const message = buildWhatsAppOrderMessage(orderData);
      const url = getWhatsAppLink(message);
      setWhatsappUrl(url);
      window.open(url, '_blank');

      // ── 3. Clear cart and redirect ──────────────────────────────
      clearCart();
      toast.success('Order saved & WhatsApp opened!');
      router.push(`/order-confirmed?ref=${orderRef}`);
    } catch (err: any) {
      console.error('Order submission error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !whatsappUrl) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-20 h-20 text-ink-muted/20 mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-bold text-ink mb-2">Your cart is empty</h1>
        <p className="text-ink-muted mb-6">Add some fresh mutton cuts to get started!</p>
        <Link
          href="/shop"
          className="inline-block bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-full font-semibold transition-colors"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-heading text-3xl font-bold text-ink mb-8">Cart & Checkout</h1>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-3 space-y-4">
          {items.map(item => (
            <div key={item.variant.id} className="bg-surface-card rounded-2xl p-4 shadow-sm flex items-start gap-4">
              <div className="w-16 h-16 bg-surface-muted rounded-xl relative overflow-hidden shrink-0 border border-brand/5">
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
                    <span className="text-3xl">🥩</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ink">{item.product.name}</h3>
                <p className="text-sm text-ink-muted">{item.variant.weight_label} · {formatPrice(item.variant.price)} each</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-surface-muted hover:bg-brand hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-surface-muted hover:bg-brand hover:text-white flex items-center justify-center transition-colors"
                    disabled={item.quantity >= 10}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-brand">{formatPrice(item.variant.price * item.quantity)}</p>
                <button
                  onClick={() => removeItem(item.variant.id)}
                  className="mt-2 p-1 text-ink-muted hover:text-danger transition-colors"
                  aria-label="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Subtotal */}
          <div className="bg-surface-card rounded-2xl p-4 shadow-sm flex justify-between items-center">
            <span className="font-medium text-ink">Subtotal</span>
            <span className="text-2xl font-bold text-brand">{formatPrice(subtotal)}</span>
          </div>
          <p className="text-sm text-ink-muted italic">
            💬 Delivery charges will be confirmed on WhatsApp
          </p>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-surface-card rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="font-heading text-xl font-bold text-ink mb-4">Delivery Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-muted bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Your full name"
                />
                {errors.name && <p className="text-danger text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Phone *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-muted bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="10-digit mobile number"
                />
                {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Delivery Address *</label>
                <textarea
                  value={form.address}
                  onChange={e => handleChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-muted bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  placeholder="Full address with landmark"
                />
                {errors.address && <p className="text-danger text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Delivery Date *</label>
                <input
                  type="date"
                  value={form.deliveryDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => handleChange('deliveryDate', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-muted bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {errors.deliveryDate && <p className="text-danger text-xs mt-1">{errors.deliveryDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Delivery Slot *</label>
                <select
                  value={form.deliverySlot}
                  onChange={e => handleChange('deliverySlot', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-muted bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select a slot</option>
                  {siteConfig.deliverySlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                {errors.deliverySlot && <p className="text-danger text-xs mt-1">{errors.deliverySlot}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Notes (optional)</label>
                <input
                  type="text"
                  value={form.notes || ''}
                  onChange={e => handleChange('notes', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-muted bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Any special requests"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand hover:bg-brand-dark text-white py-3.5 rounded-full font-semibold text-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <>
                    <WhatsAppIcon className="w-5 h-5 text-white" /> Place Order via WhatsApp
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
