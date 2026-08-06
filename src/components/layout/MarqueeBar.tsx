'use client';

import { siteConfig } from '@/config/site';
import { usePathname } from 'next/navigation';

export function MarqueeBar() {
  const pathname = usePathname();
  const items = siteConfig.marqueeItems;
  // Duplicate items for seamless loop
  const repeatedItems = [...items, ...items, ...items, ...items];

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <div className="bg-brand overflow-hidden whitespace-nowrap h-9 flex items-center group">
      <div className="animate-marquee group-hover:[animation-play-state:paused] flex items-center gap-0 min-w-max">
        {repeatedItems.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="text-surface text-sm font-medium px-4">{item}</span>
            <span className="text-accent-light text-lg">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
