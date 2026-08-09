import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, MapPin, Truck, Beef, Star, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon';
import { getDbProducts, getDbTestimonials } from '@/lib/mockData';
import { ProductCard } from '@/components/product/ProductCard';
import { siteConfig } from '@/config/site';
import { DeliveryChecker } from '@/components/shared/DeliveryChecker';
import { getWhatsAppInquiryLink } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const trustItems = [
  { icon: Beef, label: 'Fresh Cut Daily', desc: '100% fresh meat processed under sanitised conditions daily' },
  { icon: ShieldCheck, label: 'Hygienically Packed', desc: 'Vacuum-sealed double layer packaging for zero leakage' },
  { icon: MapPin, label: 'Farm Sourced', desc: 'Ethically raised, pasture-fed premium quality goats' },
  { icon: Truck, label: 'Doorstep Delivery', desc: `Express temperature-controlled shipping in Rajahmundry` },
];

const steps = [
  { num: '01', title: 'Select Premium Cuts', desc: 'Browse our selection of fresh curry pieces, boneless cubes, or local specialties.' },
  { num: '02', title: 'Instant WhatsApp Checkout', desc: 'Review your cart, complete the checkout form, and open WhatsApp in one click.' },
  { num: '03', title: 'Hygienic Home Delivery', desc: 'Receive fresh, farm-sourced meat at your doorstep in your preferred delivery slot.' },
];

export default async function HomePage() {
  const allProducts = await getDbProducts();
  const testimonials = await getDbTestimonials();

  return (
    <div className="bg-surface overflow-x-hidden text-left w-full">
      {/* Premium Hero Section */}
      <section className="relative min-h-[480px] md:min-h-[580px] flex items-center justify-start bg-brand-dark text-white text-left w-full">
        {/* Background Image with Rich Gradients */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Image
            src="/images/hero_banner.webp"
            alt="Delicious Mutton Curry Banner"
            fill
            priority
            className="object-cover object-center brightness-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-brand-dark/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left w-full">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent-light text-xs font-bold tracking-widest uppercase mb-6 animate-pulse text-left">
            👑 Premium Quality Mutton
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black leading-tight max-w-3xl drop-shadow-md text-left w-full">
            The Freshness of Farm <br />
            Meet the Taste of <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-light">Tradition</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg lg:text-xl text-surface/85 max-w-xl leading-relaxed font-medium text-left w-full">
            Sourced daily from premium local pastures. Hygienically cut, double-packed, and delivered fresh to your door in Rajahmundry.
          </p>
          <div className="flex flex-row flex-wrap gap-4 mt-8 text-left justify-start items-center">
            <Link
              href="/shop"
              className="bg-accent hover:bg-accent-light text-brand-dark px-8 py-3.5 rounded-full font-bold text-base transition-all duration-300 shadow-[0_6px_20px_rgba(201,162,39,0.3)] hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 group"
            >
              Order Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={getWhatsAppInquiryLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-whatsapp hover:bg-[#20bd5a] text-white px-8 py-3.5 rounded-full font-bold text-base transition-all duration-300 shadow-[0_6px_20px_rgba(37,211,102,0.3)] hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
            >
              <WhatsAppIcon className="w-5 h-5 text-white" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Trust Strip - Placed below hero (no overlap) */}
      <section className="relative z-20 bg-surface-card py-12 border-b border-surface-muted w-full text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full text-left">
            {trustItems.map((item, i) => (
              <div key={i} className="flex gap-4 items-start text-left justify-start w-full">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand/10 to-brand/5 border border-brand/5 flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-brand" />
                </div>
                <div className="text-left">
                  <h3 className="font-heading font-bold text-ink text-sm sm:text-base mb-1 text-left">{item.label}</h3>
                  <p className="text-ink-muted text-xs leading-relaxed text-left">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left w-full">
        <div className="max-w-xl mb-12 sm:mb-16 text-left w-full">
          <span className="text-xs font-black tracking-widest text-brand uppercase bg-brand/5 px-3 py-1 rounded-full text-left">
            Our Fresh Selection
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink mt-3 text-left w-full">Our Selection of Fresh Cuts</h2>
          <p className="text-ink-muted text-sm sm:text-base mt-2 text-left w-full">
            The finest select choices, prepared daily under strict hygiene protocols.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full text-left">
          {allProducts.map(product => (
            <div key={product.id} className="text-left w-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className="mt-12 text-left w-full">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand to-brand-dark text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 group text-left"
          >
            Go to Shop Page <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* How it Works - Left-aligned steps */}
      <section className="bg-surface-card border-y border-surface-muted py-16 sm:py-24 text-left w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
          <div className="max-w-xl mb-16 text-left w-full">
            <span className="text-xs font-black tracking-widest text-accent uppercase bg-accent/10 px-3 py-1 rounded-full text-left">
              Ordering Process
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink mt-3 text-left w-full">Freshness In 3 Easy Steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative w-full text-left">
            {/* Step Line decoration */}
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-brand/20 via-accent/30 to-brand/20 z-0" />

            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-start text-left relative z-10 group w-full">
                <div className="w-16 h-16 bg-surface-card border-2 border-brand text-brand font-heading font-black text-xl rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(122,31,31,0.06)] group-hover:bg-brand group-hover:text-white transition-all duration-300 mb-6">
                  {step.num}
                </div>
                <h3 className="font-heading font-bold text-lg text-ink mb-2 text-left w-full">{step.title}</h3>
                <p className="text-ink-muted text-sm leading-relaxed max-w-xs text-left w-full">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-end Testimonials Grid - Left-aligned header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-left w-full">
        <div className="max-w-xl mb-12 sm:mb-16 text-left w-full">
          <span className="text-xs font-black tracking-widest text-brand uppercase bg-brand/5 px-3 py-1 rounded-full text-left">
            Reviews
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink mt-3 text-left w-full">Loved By Local Foodies</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left">
          {testimonials.map(t => (
            <div
              key={t.id}
              className="bg-surface-card p-6 sm:p-8 rounded-3xl shadow-[0_4px_20px_rgba(122,31,31,0.03)] hover:shadow-[0_8px_30px_rgba(122,31,31,0.08)] border border-surface-muted transition-all duration-300 flex flex-col justify-between text-left"
            >
              <div className="text-left">
                <div className="flex gap-1 mb-4 justify-start">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-ink-muted text-sm leading-relaxed mb-6 font-medium italic text-left w-full">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-surface-muted/50 justify-start w-full">
                <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center font-bold text-brand text-xs">
                  {t.customer_name[0]}
                </div>
                <p className="font-bold text-ink text-sm text-left">{t.customer_name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery Checker & Pincodes card - Left-aligned text */}
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white py-16 sm:py-24 text-left w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 w-full text-left">
          <span className="inline-block text-xs font-black tracking-widest text-accent-light uppercase bg-white/10 px-3.5 py-1.5 rounded-full border border-white/5 text-left">
            Local Delivery Network
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-left w-full">Check Service in Your Locality</h2>
          <p className="text-surface/85 max-w-xl leading-relaxed text-left w-full">
            Enter your 6-digit Rajahmundry pincode below to verify instant door-step delivery options.
          </p>

          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl max-w-md shadow-inner backdrop-blur-sm text-left">
            <DeliveryChecker />
          </div>

          <div className="pt-4 text-left w-full">
            <p className="text-xs text-surface/60 font-semibold uppercase tracking-wider mb-3 text-left">Serviceable areas include</p>
            <div className="flex flex-wrap gap-2 max-w-xl text-left justify-start">
              {siteConfig.serviceablePincodes.map(pin => (
                <span
                  key={pin}
                  className="bg-white/10 text-white border border-white/5 px-3 py-1.5 rounded-xl text-xs font-bold"
                >
                  {pin}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
