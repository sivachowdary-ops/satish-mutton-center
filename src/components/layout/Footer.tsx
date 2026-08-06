'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { siteConfig } from '@/config/site';
import { getWhatsAppInquiryLink } from '@/lib/whatsapp';

export function Footer() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-brand-dark text-surface/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-xl font-bold text-white mb-3">{siteConfig.name}</h3>
            <p className="text-surface/70 text-sm leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-3">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              {[
                { href: '/shop', label: 'Shop' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/track', label: 'Track Order' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-surface/70 hover:text-accent-light transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-3">Contact Us</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 text-surface/70 hover:text-accent-light transition-colors">
                <Phone className="w-4 h-4 shrink-0" /> {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-surface/70 hover:text-accent-light transition-colors">
                <Mail className="w-4 h-4 shrink-0" /> {siteConfig.email}
              </a>
              <div className="flex items-start gap-2 text-surface/70">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state} - {siteConfig.address.pincode}</span>
              </div>
            </div>
          </div>

          {/* Hours + WhatsApp */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-3">Hours</h4>
            <div className="flex items-center gap-2 text-surface/70 text-sm mb-4">
              <Clock className="w-4 h-4 shrink-0" /> {siteConfig.openingHours}
            </div>
            <a
              href={getWhatsAppInquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-surface/50 text-sm">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
