'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Phone, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore, getCartItemCount } from '@/store/cartStore';
import { siteConfig } from '@/config/site';

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { items, toggleCart } = useCartStore();
  const itemCount = getCartItemCount(items);

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/shop', label: 'Browse Cuts' },
    { href: '/about', label: 'Our Story' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-surface/90 backdrop-blur-md border-b border-brand/5 shadow-[0_4px_30px_rgba(122,31,31,0.06)] py-3'
          : 'bg-surface-card border-b border-surface-muted py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shadow-[0_4px_12px_rgba(122,31,31,0.2)] group-hover:scale-105 transition-transform duration-300">
              <span className="text-white text-xl font-heading font-black">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-heading font-black tracking-tight text-ink group-hover:text-brand transition-colors leading-none">
                {siteConfig.name}
              </span>
              <span className="text-[10px] font-body font-semibold text-accent uppercase tracking-widest mt-0.5">
                Premium Cuts
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ink-muted hover:text-brand font-semibold text-sm tracking-wide transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-brand to-accent group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Phone */}
            <a
              href={`tel:${siteConfig.phone}`}
              className="hidden lg:flex items-center gap-2 text-xs font-bold text-ink-muted hover:text-brand transition-colors bg-surface-muted hover:bg-brand/5 px-4 py-2 rounded-full border border-brand/5"
            >
              <Phone className="w-3.5 h-3.5 text-accent" />
              {siteConfig.phone}
            </a>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 bg-surface-muted hover:bg-brand/10 text-ink hover:text-brand transition-all duration-300 rounded-xl border border-brand/5 shadow-sm group hover:-translate-y-0.5"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-115 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(201,162,39,0.4)] animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 bg-surface-muted hover:bg-brand/10 text-ink rounded-xl border border-brand/5"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-4 right-4 top-20 bg-surface-card/95 backdrop-blur-md rounded-2xl shadow-xl border border-brand/10 p-4 mt-1 animate-in fade-in slide-in-from-top-4 duration-300">
            <nav className="flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-ink-muted hover:text-brand hover:bg-brand/5 transition-all font-bold text-sm flex items-center justify-between"
                >
                  {link.label}
                  <ArrowRight className="w-4 h-4 opacity-50" />
                </Link>
              ))}
              <div className="border-t border-surface-muted mt-2 pt-2">
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="px-4 py-3 rounded-xl text-ink hover:text-brand font-bold text-sm flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-accent" /> {siteConfig.phone}
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
