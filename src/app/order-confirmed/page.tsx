import Link from 'next/link';
import { CheckCircle, Search } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { siteConfig } from '@/config/site';

export default async function OrderConfirmedPage(props: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const searchParams = await props.searchParams;
  const ref = searchParams?.ref || 'MTN-XXXXXXXX';

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-success" />
      </div>

      <h1 className="font-heading text-3xl font-bold text-ink mb-2">Order Placed!</h1>
      <p className="text-ink-muted mb-6">
        Your order reference is{' '}
        <span className="font-mono font-bold text-brand bg-brand/5 px-2 py-1 rounded">{ref}</span>
      </p>

      <p className="text-ink-muted text-sm mb-8">
        Please complete your order confirmation on WhatsApp. If the WhatsApp window didn&apos;t open automatically, tap the button below.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={`https://wa.me/${siteConfig.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-full font-semibold transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5 text-white" /> Open WhatsApp
        </a>
        <Link
          href="/track"
          className="inline-flex items-center justify-center gap-2 bg-surface-muted hover:bg-brand/10 text-ink px-6 py-3 rounded-full font-semibold transition-colors"
        >
          <Search className="w-5 h-5" /> Track Order
        </Link>
      </div>

      <Link href="/shop" className="inline-block mt-8 text-brand hover:text-brand-dark font-medium underline">
        Continue Shopping
      </Link>
    </div>
  );
}
