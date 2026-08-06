'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import type { OrderStatus } from '@/lib/mockData';

const statusSteps: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: 'pending_confirmation', label: 'Pending', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: Package },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function TrackPage() {
  const [phone, setPhone] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-heading text-3xl font-bold text-ink text-center mb-2">Track Your Order</h1>
      <p className="text-ink-muted text-center mb-8">Enter your phone number and order reference to check status</p>

      <form onSubmit={handleSearch} className="bg-surface-card rounded-2xl p-6 shadow-sm space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="w-full px-4 py-2.5 rounded-xl border border-surface-muted bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="10-digit mobile number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Order Reference</label>
          <input
            type="text"
            value={orderRef}
            onChange={e => setOrderRef(e.target.value.toUpperCase())}
            className="w-full px-4 py-2.5 rounded-xl border border-surface-muted bg-surface text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="e.g. MTN-ABCD1234"
          />
        </div>
        <button
          type="submit"
          disabled={phone.length !== 10 || !orderRef}
          className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <Search className="w-5 h-5" /> Track Order
        </button>
      </form>

      {searched && (
        <div className="bg-surface-card rounded-2xl p-6 shadow-sm text-center">
          <p className="text-ink-muted mb-6">
            Order tracking requires Supabase configuration. Once connected, your order status will appear here.
          </p>

          {/* Status stepper preview */}
          <div className="flex items-center justify-between max-w-md mx-auto">
            {statusSteps.map((step, i) => (
              <div key={step.key} className="flex flex-col items-center relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  i === 0 ? 'bg-brand text-white' : 'bg-surface-muted text-ink-muted'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-ink-muted mt-2 text-center">{step.label}</span>
                {i < statusSteps.length - 1 && (
                  <div className={`absolute top-5 left-full w-full h-0.5 ${
                    i === 0 ? 'bg-brand' : 'bg-surface-muted'
                  }`} style={{ width: '100%', left: '50%' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
