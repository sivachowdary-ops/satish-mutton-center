'use client';

import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { usePathname } from 'next/navigation';
import { getWhatsAppInquiryLink } from '@/lib/whatsapp';
import { useCartStore } from '@/store/cartStore';

export function WhatsAppFloatButton() {
  const pathname = usePathname();
  const { isCartOpen } = useCartStore();

  // Hide on admin routes and when cart drawer is open
  if (pathname.startsWith('/admin') || isCartOpen) return null;

  return (
    <a
      href={getWhatsAppInquiryLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      <WhatsAppIcon className="w-7 h-7 text-white relative z-10" />
    </a>
  );
}
