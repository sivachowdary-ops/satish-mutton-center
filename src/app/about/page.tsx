import { ShieldCheck, Thermometer, Leaf, Heart } from 'lucide-react';
import { siteConfig } from '@/config/site';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${siteConfig.name} — our story, sourcing practices, and commitment to delivering the freshest mutton in Rajahmundry.`,
};

const values = [
  { icon: ShieldCheck, title: 'Hygienic Processing', desc: 'Every piece is processed in clean, hygienic conditions following strict quality standards.' },
  { icon: Thermometer, title: 'Cold Chain Maintained', desc: 'From farm to your doorstep, the cold chain is never broken — ensuring maximum freshness.' },
  { icon: Leaf, title: 'Farm Sourced', desc: 'We source from trusted local farms around Rajahmundry, supporting local farmers and ensuring quality.' },
  { icon: Heart, title: 'Cut Fresh Daily', desc: 'No frozen stock. Every order is cut and packed the same day for unmatched freshness.' },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading text-4xl font-bold text-ink text-center mb-4">About {siteConfig.name}</h1>
      <p className="text-ink-muted text-center text-lg mb-12 max-w-2xl mx-auto">
        Serving fresh, farm-sourced mutton to families in and around Rajahmundry, Andhra Pradesh.
      </p>

      {/* Story */}
      <section className="mb-16">
        <div className="bg-surface-card rounded-2xl p-8 shadow-sm">
          <h2 className="font-heading text-2xl font-bold text-ink mb-4">Our Story</h2>
          <p className="text-ink-muted leading-relaxed mb-4">
            {siteConfig.name} was born from a simple belief — every family deserves access to fresh, quality mutton without the hassle of visiting crowded markets. Based in Rajahmundry, we work directly with local goat farmers across the Godavari region to bring you the freshest cuts possible.
          </p>
          <p className="text-ink-muted leading-relaxed">
            What started as a small neighbourhood delivery service has grown into a trusted name for premium mutton in the region. We take pride in our hygienic processing, transparent pricing, and same-day delivery promise.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mb-16">
        <h2 className="font-heading text-2xl font-bold text-ink text-center mb-8">Our Quality Promise</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <div key={i} className="bg-surface-card rounded-2xl p-6 shadow-sm flex gap-4">
              <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center shrink-0">
                <v.icon className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-ink mb-1">{v.title}</h3>
                <p className="text-ink-muted text-sm">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="font-heading text-2xl font-bold text-ink mb-4">Ready to Try?</h2>
        <p className="text-ink-muted mb-6">Order fresh mutton delivered to your doorstep today.</p>
        <Link
          href="/shop"
          className="inline-block bg-brand hover:bg-brand-dark text-white px-8 py-3 rounded-full font-semibold transition-colors"
        >
          Browse Our Shop
        </Link>
      </section>
    </div>
  );
}
