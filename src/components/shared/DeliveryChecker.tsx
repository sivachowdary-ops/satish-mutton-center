'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function DeliveryChecker() {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<'available' | 'unavailable' | null>(null);

  const handleCheck = () => {
    if (pincode.length !== 6) return;
    setResult(
      siteConfig.serviceablePincodes.includes(pincode) ? 'available' : 'unavailable'
    );
  };

  return (
    <div className="max-w-sm text-left">
      <div className="flex gap-2">
        <input
          type="text"
          value={pincode}
          onChange={e => {
            setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
            setResult(null);
          }}
          placeholder="Enter your pincode"
          className="flex-1 px-4 py-2.5 rounded-full border border-surface-muted bg-surface-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          onClick={handleCheck}
          disabled={pincode.length !== 6}
          className="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-colors disabled:opacity-50"
        >
          Check
        </button>
      </div>
      {result === 'available' && (
        <p className="mt-3 text-success text-sm flex items-center justify-start gap-1">
          <CheckCircle className="w-4 h-4" /> We deliver to your area!
        </p>
      )}
      {result === 'unavailable' && (
        <p className="mt-3 text-danger text-sm flex items-center justify-start gap-1">
          <XCircle className="w-4 h-4" /> Sorry, we don&apos;t deliver here yet. Contact us on WhatsApp!
        </p>
      )}
    </div>
  );
}
